defmodule Pingcrm.Accounts do
  @moduledoc false

  use Ash.Domain, otp_app: :pingcrm

  alias Pingcrm.Accounts.{Account, Membership, User, UserToken}

  resources do
    resource User
    resource Account
    resource Membership
    resource UserToken
  end

  def update_profile(%User{} = user, params) do
    Ash.update(user, :update, params, domain: __MODULE__)
  end

  def set_default_account(%User{} = user, account_id) do
    Ash.update(user, :set_default_account, %{default_account_id: account_id}, domain: __MODULE__)
  end

  def has_account?(%User{id: user_id}, account_id)
      when is_binary(account_id) or is_integer(account_id) do
    case Membership
         |> Ash.Query.filter(user_id == user_id and account_id == account_id)
         |> Ash.Query.limit(1)
         |> Ash.read(domain: __MODULE__) do
      {:ok, [_]} -> true
      _ -> false
    end
  end

  def get_user_by_email(email) when is_binary(email) do
    case User
         |> Ash.Query.filter(email == email)
         |> Ash.read(domain: __MODULE__) do
      {:ok, [user]} -> user
      _ -> nil
    end
  end

  def get_user_by_email_and_password(email, password)
      when is_binary(email) and is_binary(password) do
    user = get_user_by_email(email)
    if user && User.valid_password?(user, password), do: user
  end

  def get_user!(id) do
    case Ash.get(User, id, domain: __MODULE__) do
      {:ok, user} -> user
      {:error, _} -> raise "User not found"
    end
  end

  def get_user_by_reset_password_token(_token) do
    # This would need custom implementation with Ash
    # For now, return nil
    nil
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

  def get_user_by_session_token(_token) do
    # This would need custom implementation with Ash
    # For now, return nil
    nil
  end

  def delete_user_session_token(_token) do
    # This would need custom implementation with Ash
    :ok
  end
end
