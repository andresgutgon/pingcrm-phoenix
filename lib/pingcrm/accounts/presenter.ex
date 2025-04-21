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
      owner: user.owner,
      account: serialize_account(user.account),
      confirmed_at: user.confirmed_at,
      authenticated_at: user.authenticated_at,
      deleted_at: nil # TODO: Implement deletabled
    }
  end

  def serialize_account(nil), do: nil

  def serialize_account(%Account{} = account) do
    %{
      id: account.id,
      name: account.name
    }
  end

  def full_name(%User{first_name: first, last_name: last}), do: "#{first} #{last}"
end
