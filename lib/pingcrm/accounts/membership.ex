defmodule Pingcrm.Accounts.Membership do
  use Ecto.Schema
  import Ecto.Changeset

  alias Pingcrm.Repo
  alias Pingcrm.Accounts.{Account, User}

  schema "memberships" do
    belongs_to :user, User
    belongs_to :account, Account
    field :role, :string, default: "member"

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(membership, attrs) do
    membership
    |> cast(attrs, [:user_id, :account_id, :role])
    |> validate_required([:user_id, :account_id, :role])
    |> validate_inclusion(:role, ["member", "admin"])
    |> unique_constraint([:user_id, :account_id])
  end

  def add_admin(user, account) do
    add_membership(user, account, "admin")
  end

  def add_member(user, account) do
    add_membership(user, account, "member")
  end

  defp add_membership(user, account, role) do
    {:ok, membership} =
      user
      |> Ecto.build_assoc(:memberships, %{account_id: account.id, role: role})
      |> Repo.insert()

    membership
  end
end
