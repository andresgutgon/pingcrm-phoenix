defmodule Pingcrm.Accounts.Account do
  @moduledoc false
  use Ecto.Schema
  import Ecto.Changeset

  alias Pingcrm.Accounts.Membership

  schema "accounts" do
    field :name, :string

    has_many :memberships, Membership
    has_many :members, through: [:memberships, :user]

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(account, attrs) do
    account
    |> cast(attrs, [:name])
    |> validate_required([:name])
    |> validate_length(:name, min: 2)
  end
end
