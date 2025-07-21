defmodule Pingcrm.Accounts.Presenter do
  @moduledoc false

  alias Pingcrm.Accounts.{Account, User}

  def serialize(%User{} = user) do
    %{
      id: user.id,
      name: full_name(user),
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      email_changed: user.email_changed,
      confirmed_at: user.confirmed_at,
      authenticated_at: user.authenticated_at,
      default_account_id: user.default_account_id,
      # TODO: Implement deletabled
      deleted_at: nil
    }
  end

  def serialize_account(%Account{} = account, is_current \\ false) do
    %{
      id: account.id,
      name: account.name,
      is_current: is_current
    }
  end

  def full_name(%User{first_name: first, last_name: last}), do: "#{first} #{last}"
end
