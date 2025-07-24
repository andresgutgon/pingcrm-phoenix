defmodule PingcrmWeb.UserAuth do
  @moduledoc false

  use PingcrmWeb, :verified_routes

  import Plug.Conn
  import Phoenix.Controller
  import Inertia.Controller, only: [assign_prop: 3]

  alias Pingcrm.Accounts
  alias Pingcrm.Accounts.Presenter, as: UserPresenter
  alias Pingcrm.Accounts.Scope

  @max_cookie_age_in_days 14
  @remember_me_cookie "_pingcrm_web_user_remember_me"
  @remember_me_options [
    sign: true,
    max_age: @max_cookie_age_in_days * 24 * 60 * 60,
    same_site: "Lax"
  ]

  @session_reissue_age_in_days 7

  # Plug protocol
  def init(opts), do: opts
  def call(conn, {:sudo_mode, opts}), do: require_sudo_mode(conn, opts)
  def call(conn, :sudo_mode), do: require_sudo_mode(conn, [])
  def call(conn, {:require_admin, opts}), do: require_admin(conn, opts)
  def call(conn, :require_admin), do: require_admin(conn, [])

  def log_in_user(conn, user, params \\ %{}) do
    user_return_to = get_session(conn, :user_return_to)

    conn
    |> create_or_extend_session(user, params)
    |> redirect(to: user_return_to || signed_in_path(conn))
  end

  def log_out_user(conn) do
    conn
    |> kill_session()
    |> redirect(to: ~p"/login")
  end

  def fetch_scope(conn, _opts) do
    with {token, conn} <- ensure_user_token(conn),
         {user, token_inserted_at} <- Accounts.get_user_by_session_token(token) do
      account_id = get_session(conn, :account_id)
      scope = Scope.for_user(user, account_id)

      conn
      |> assign(:current_scope, scope)
      |> maybe_put_or_delete_account_session(account_id, scope && scope.account)
      |> maybe_reissue_user_session_token(user, token_inserted_at)
    else
      nil -> assign(conn, :current_scope, Scope.for_user(nil, nil))
    end
  end

  defp ensure_user_token(conn) do
    if token = get_session(conn, :user_token) do
      {token, conn}
    else
      conn = fetch_cookies(conn, signed: [@remember_me_cookie])

      if token = conn.cookies[@remember_me_cookie] do
        {token, conn |> put_token_in_session(token) |> put_session(:user_remember_me, true)}
      else
        nil
      end
    end
  end

  defp maybe_put_or_delete_account_session(conn, account_id, account) do
    cond do
      match?(%{id: _}, account) ->
        put_session(conn, :account_id, account.id)

      not is_nil(account_id) ->
        delete_session(conn, :account_id)

      true ->
        conn
    end
  end

  defp maybe_reissue_user_session_token(conn, user, token_inserted_at) do
    token_age = DateTime.diff(DateTime.utc_now(:second), token_inserted_at, :day)

    if token_age >= @session_reissue_age_in_days do
      create_or_extend_session(conn, user, %{})
    else
      conn
    end
  end

  defp create_or_extend_session(conn, user, params) do
    token = Accounts.Auth.create_session_token(user)
    remember_me = get_session(conn, :user_remember_me) || params["remember_me"]

    conn
    |> renew_session(user)
    |> put_token_in_session(token)
    |> maybe_write_remember_me_cookie(token, params, remember_me)
  end

  # Do not renew session if the user is already logged in
  # to prevent CSRF errors or data being last in tabs that are still open
  defp renew_session(conn, user) when conn.assigns.current_scope.user.id == user.id do
    conn
  end

  defp renew_session(conn, _user) do
    delete_csrf_token()

    conn
    |> configure_session(renew: true)
    |> clear_session()
  end

  defp maybe_write_remember_me_cookie(conn, token, %{"remember_me" => "true"}, _),
    do: write_remember_me_cookie(conn, token)

  defp maybe_write_remember_me_cookie(conn, token, _params, true),
    do: write_remember_me_cookie(conn, token)

  defp maybe_write_remember_me_cookie(conn, _token, _params, _), do: conn

  defp write_remember_me_cookie(conn, token) do
    conn
    |> put_session(:user_remember_me, true)
    |> put_resp_cookie(@remember_me_cookie, token, @remember_me_options)
  end

  defp put_token_in_session(conn, token) do
    put_session(conn, :user_token, token)
  end

  @doc """
  After pass X minute of inactivity, the user will be asked to re-enter their password
  To make this actions
  """
  def require_sudo_mode(conn, opts) do
    if Accounts.sudo_mode?(conn.assigns.current_scope.user, -10) do
      conn
    else
      conn
      |> kill_session()
      |> store_return_to(opts[:return_to])
      |> put_flash(:error, "You must re-authenticate to access this page.")
      |> redirect(to: ~p"/login")
      |> halt()
    end
  end

  @doc """
  Plug for routes that require the user to have admin role.

  ## Options

    * `:redirect_to` - The path to redirect to if user is not admin.
      Defaults to "/dashboard"
    * `:flash_message` - Custom flash error message.
      Defaults to "You must be an admin to access this page."
      Set to `false` or `nil` to skip flash message.

  ## Examples

      plug :require_admin
      plug :require_admin, redirect_to: "/account", flash_message: "Admin access required"
      plug :require_admin, redirect_to: "/account", flash_message: false
  """
  def require_admin(conn, opts \\ []) do
    scope = conn.assigns.current_scope

    if scope && scope.role == "admin" do
      conn
    else
      redirect_path = opts[:redirect_to] || ~p"/dashboard"

      flash_message =
        Keyword.get(opts, :flash_message, "You must be an admin to access this page.")

      conn =
        case flash_message do
          false -> conn
          nil -> conn
          message -> put_flash(conn, :error, message)
        end

      conn
      |> redirect(to: redirect_path)
      |> halt()
    end
  end

  def redirect_if_user_is_authenticated(conn, _opts) do
    if conn.assigns.current_scope do
      conn
      |> redirect(to: signed_in_path(conn))
      |> halt()
    else
      conn
    end
  end

  def signed_in_path(_conn), do: ~p"/dashboard"

  @doc """
  Plug for routes that require the user to be authenticated and confirmed.
  """
  def require_confirmed_user(conn, _opts) do
    scope = conn.assigns.current_scope

    user = if scope && scope.user && scope.account, do: scope.user, else: nil

    cond do
      user && user.confirmed_at ->
        account = conn.assigns.current_scope.account
        accounts = conn.assigns.current_scope.accounts
        role = conn.assigns.current_scope.role

        conn
        |> assign(:user, user)
        |> assign_prop(:auth, %{
          user: UserPresenter.serialize(user),
          account: account,
          role: role,
          accounts: accounts
        })

      user && is_nil(user.confirmed_at) ->
        conn
        |> put_flash(:error, "You must confirm your account to access this page.")
        |> maybe_store_return_to()
        |> redirect(to: ~p"/confirm")
        |> halt()

      true ->
        conn
        |> put_flash(:error, "You must log in to access this page.")
        |> maybe_store_return_to()
        |> redirect(to: ~p"/login")
        |> halt()
    end
  end

  defp maybe_store_return_to(%{method: "GET"} = conn) do
    store_return_to(conn, current_path(conn))
  end

  defp maybe_store_return_to(conn), do: conn

  defp store_return_to(conn, path) when is_binary(path) do
    put_session(conn, :user_return_to, path)
  end

  defp store_return_to(conn, nil), do: conn

  defp kill_session(conn) do
    user_token = get_session(conn, :user_token)
    user_token && Accounts.delete_user_session_token(user_token)

    conn
    |> renew_session(nil)
    |> delete_resp_cookie(@remember_me_cookie)
  end
end
