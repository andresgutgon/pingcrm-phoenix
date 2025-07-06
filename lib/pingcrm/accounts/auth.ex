defmodule Pingcrm.Accounts.Auth do
  @moduledoc false

  alias Pingcrm.Repo
  alias Pingcrm.Accounts.{Account, Membership, User, UserToken}
  alias Pingcrm.Accounts.Auth.SignupChangeset
  alias Pingcrm.Mailer.User.{Confirm, ResetPassword}

  def create_account(attrs, opts \\ []) do
    signup_changeset = SignupChangeset.changeset(%SignupChangeset{}, attrs, opts)

    if signup_changeset.valid? do
      account_changeset = signup_changeset.changes.account
      user_changeset = signup_changeset.changes.user
      account_attrs = account_changeset.changes
      user_attrs = user_changeset.changes

      Repo.transaction(fn ->
        require Logger
        {:ok, account} = Repo.insert(Account.changeset(%Account{}, account_attrs))

        {:ok, user} =
          Repo.insert(
            User.registration_changeset(%User{}, user_attrs,
              validate_password: opts[:validate_password] || false,
              validate_email: opts[:validate_email] || false
            )
          )

        Membership.add_admin(user, account)
        {account, user}
      end)
    else
      {:error, signup_changeset}
    end
  end

  def confirm_user(token) do
    with {:ok, query} <- UserToken.verify_email_token_query(token, "confirm"),
         %User{} = user <- Repo.one(query),
         {:ok, %{user: user}} <- Repo.transaction(confirm_user_multi(user)) do
      {:ok, user}
    else
      _ -> :error
    end
  end

  def reset_password(user, attrs) do
    Ecto.Multi.new()
    |> Ecto.Multi.update(:user, User.password_changeset(user, attrs))
    |> Ecto.Multi.delete_all(:tokens, UserToken.by_user_and_contexts_query(user, :all))
    |> Repo.transaction()
    |> case do
      {:ok, %{user: user}} -> {:ok, user}
      {:error, :user, changeset, _} -> {:error, changeset}
    end
  end

  def update_password(%User{} = user, %{
        "current_password" => current,
        "password" => new_password,
        "password_confirmation" => confirmation
      }) do
    if User.valid_password?(user, current) do
      user
      |> User.password_changeset(%{
        "password" => new_password,
        "password_confirmation" => confirmation
      })
      |> Repo.update()
    else
      changeset =
        user
        |> User.password_changeset(%{})
        |> Ecto.Changeset.add_error(:current_password, "Current password is incorrect")

      {:error, changeset}
    end
  end

  def send_confirmation(%User{} = user, confirmation_url_fun)
      when is_function(confirmation_url_fun, 1) do
    if user.confirmed_at do
      {:error, :already_confirmed}
    else
      {encoded_token, user_token} = UserToken.build_email_token(user, "confirm")
      Repo.insert!(user_token)
      Confirm.send(user, confirmation_url_fun.(encoded_token))
    end
  end

  def send_reset_password(%User{} = user, reset_password_url_fun)
      when is_function(reset_password_url_fun, 1) do
    {encoded_token, user_token} = UserToken.build_email_token(user, "reset_password")
    Repo.insert!(user_token)
    ResetPassword.send(user, reset_password_url_fun.(encoded_token))
  end

  def create_session_token(user) do
    {token, user_token} = UserToken.build_session_token(user)
    Repo.insert!(user_token)
    token
  end

  defp confirm_user_multi(user) do
    Ecto.Multi.new()
    |> Ecto.Multi.update(:user, User.confirm_changeset(user))
    |> Ecto.Multi.delete_all(:tokens, UserToken.by_user_and_contexts_query(user, ["confirm"]))
  end
end
