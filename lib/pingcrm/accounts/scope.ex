defmodule Pingcrm.Accounts.Scope do
  @moduledoc """
  Defines the scope of the caller to be used throughout the app.

  The `Pingcrm.Accounts.Scope` allows public interfaces to receive
  information about the caller, such as if the call is initiated from an
  end-user, and if so, which user. Additionally, such a scope can carry fields
  such as "super user" or other privileges for use as authorization, or to
  ensure specific code paths can only be access for a given scope.

  It is useful for logging as well as for scoping pubsub subscriptions and
  broadcasts when a caller subscribes to an interface or performs a particular
  action.

  Feel free to extend the fields on this struct to fit the needs of
  growing application requirements.
  """

  alias Pingcrm.Accounts.Presenter, as: UserPresenter
  alias Pingcrm.Accounts.User

  defstruct user: nil, account: nil, role: nil, accounts: []

  def for_user(nil, _account_id), do: nil

  def for_user(%User{} = user, account_id) do
    user =
      if Ecto.assoc_loaded?(user.memberships) do
        user
      else
        Pingcrm.Repo.preload(user, memberships: :account)
      end

    memberships = user.memberships

    current_membership =
      if account_id do
        Enum.find(memberships, fn m -> m.account_id == account_id end)
      else
        if user.default_account_id do
          Enum.find(memberships, fn m -> m.account_id == user.default_account_id end)
        else
          List.first(memberships)
        end
      end

    account = current_membership && current_membership.account
    role = current_membership && current_membership.role

    if account && current_membership.role && role do
      %__MODULE__{
        user: user,
        account: UserPresenter.serialize_account(account, true),
        role: role,
        accounts:
          memberships
          |> Enum.map(fn membership ->
            acc = membership.account
            UserPresenter.serialize_account(acc, acc.id == account.id)
          end)
      }
    else
      nil
    end
  end
end
