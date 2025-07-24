defmodule PingcrmWeb.Auth.ConfirmationsController do
  use PingcrmWeb, :controller
  alias Pingcrm.Accounts
  alias Pingcrm.Accounts.Auth
  alias PingcrmWeb.UserAuth

  def confirmation_sent(conn, _params) do
    email = conn.params["email"]

    conn
    |> assign_prop(:email, email)
    |> render_inertia("Auth/ConfirmationSentPage")
  end

  def new(conn, _params) do
    render_inertia(conn, "Auth/NewConfirmationPage")
  end

  def create(conn, %{"email" => email}) do
    if user = Accounts.get_user_by_email(email) do
      Auth.send_confirmation(
        user,
        &url(~p"/confirm/#{&1}")
      )
    end

    conn
    |> put_flash(
      :info,
      "If your email is in our system and it has not been confirmed yet, " <>
        "you will receive an email with instructions shortly."
    )
    |> redirect(to: ~p"/login")
  end

  def edit(conn, %{"token" => token}) do
    conn
    |> assign_prop(:token, token)
    |> render_inertia("Auth/ConfirmationPage")
  end

  def confirm_user(conn, %{"token" => token}) do
    case Auth.confirm_user(token) do
      {:ok, user} ->
        conn
        |> put_flash(:info, "User confirmed successfully.")
        |> UserAuth.log_in_user(user, %{"remember_me" => "false"})

      :error ->
        # If there is a current user and the account was already confirmed,
        # then odds are that the confirmation link was already visited, either
        # by some automation or by the user themselves, so we redirect without
        # a warning message.
        case conn.assigns do
          %{current_scope: %{user: %{confirmed_at: confirmed_at}}}
          when not is_nil(confirmed_at) ->
            redirect(conn, to: ~p"/")

          %{} ->
            conn
            |> put_flash(:error, "User confirmation link is invalid or it has expired.")
            |> redirect(to: ~p"/")
        end
    end
  end
end
