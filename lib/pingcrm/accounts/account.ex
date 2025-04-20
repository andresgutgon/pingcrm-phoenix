defmodule Pingcrm.Accounts.Account do
  use Ecto.Schema
  import Ecto.Changeset

  alias Pingcrm.Accounts.User

  schema "accounts" do
    field :name, :string
    field :user_id, :id

    has_many :users, User

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(account, attrs, user_scope) do
    account
    |> cast(attrs, [:name])
    |> validate_required([:name])
    |> put_change(:user_id, user_scope.user.id)
  end
end
