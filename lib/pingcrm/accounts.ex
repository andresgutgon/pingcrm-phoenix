defmodule Pingcrm.Accounts do
  @moduledoc false

  import Ecto.Query, warn: false
  alias Pingcrm.Repo

  alias Pingcrm.Accounts.{Membership, User, UserToken}

  def update_profile(%User{} = user, params) do
    user
    |> User.profile_changed_changeset(params)
    |> Repo.update()
  end

  def set_default_account(%User{} = user, account_id) do
    user
    |> User.default_account_changeset(%{default_account_id: account_id})
    |> Repo.update()
  end

  def has_account?(%User{id: user_id}, account_id)
      when is_binary(account_id) or is_integer(account_id) do
    query =
      from m in Membership,
        where: m.user_id == ^user_id and m.account_id == ^account_id,
        select: 1,
        limit: 1

    Repo.exists?(query)
  end

  def get_user_by_email(email) when is_binary(email) do
    Repo.get_by(User, email: email)
  end

  def get_user_by_email_and_password(email, password)
      when is_binary(email) and is_binary(password) do
    user = Repo.get_by(User, email: email)
    if User.valid_password?(user, password), do: user
  end

  def get_user!(id), do: Repo.get!(User, id)

  def get_user_by_reset_password_token(token) do
    with {:ok, query} <- UserToken.verify_email_token_query(token, "reset_password"),
         %User{} = user <- Repo.one(query) do
      user
    else
      _ -> nil
    end
  end

  ## Settings

  @doc """
  Checks whether the user is in sudo mode.

  The user is in sudo mode when the last authentication was done no further
  than 20 minutes ago. The limit can be given as second argument in minutes.
  """
  def sudo_mode?(user, minutes \\ -20)

  def sudo_mode?(%{authenticated_at: ts}, minutes) when is_struct(ts, DateTime) do
    DateTime.after?(ts, DateTime.utc_now() |> DateTime.add(minutes, :minute))
  end

  def sudo_mode?(_user, _minutes), do: false

  def get_user_by_session_token(token) do
    {:ok, query} = UserToken.verify_session_token_query(token)
    Repo.one(query)
  end

  def delete_user_session_token(token) do
    Repo.delete_all(UserToken.by_token_and_context_query(token, "session"))
    :ok
  end
end
