defmodule Pingcrm.Accounts.Presenter do
  @moduledoc false

  alias Pingcrm.Accounts.{Account, User}
  alias Pingcrm.Uploaders.Avatar

  def serialize(%User{} = user) do
    %{
      id: user.id,
      uuid: user.uuid,
      name: full_name(user),
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      # TODO: move these learning to docs/*.md
      # NOTE: This is a signed URL that expires in 24 hours but is not working. I'm sending
      # cache headers ok but the query params change all the time so never is cached in the browser disk.
      # In production with a real domain assets.pingcrm.com in front of R2 it should work.
      # Signing it necessary because the bucket is private.
      # 24 hours
      avatar_thumb: Avatar.url({user.avatar, user}, :thumb, signed: true, expires_in: 86_400),
      avatar_medium: Avatar.url({user.avatar, user}, :medium, signed: true, expires_in: 86_400),
      email_changed: user.email_changed,
      confirmed_at: user.confirmed_at,
      authenticated_at: user.authenticated_at,
      default_account_id: user.default_account_id,
      initials: user_initials(user),
      # TODO: Implement deletabled
      deleted_at: nil
    }
  end

  def serialize_account(%Account{} = account, opts \\ %{}) do
    defaults = %{is_current: false, is_default: false}

    %{id: account.id, name: account.name, initials: account_initials(account)}
    |> Map.merge(defaults)
    |> Map.merge(opts)
  end

  def full_name(%User{first_name: first, last_name: last}), do: "#{first} #{last}"

  def user_initials(%User{first_name: first_name, last_name: last_name}) do
    first_initial = String.slice(first_name || "", 0, 1)
    last_initial = String.slice(last_name || "", 0, 1)
    first_initial <> last_initial
  end

  def account_initials(%Account{name: name}) do
    String.slice(name || "", 0, 2)
  end
end
