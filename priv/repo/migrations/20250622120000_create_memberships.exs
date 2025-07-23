defmodule Pingcrm.Repo.Migrations.CreateMemberships do
  use Ecto.Migration

  def up do
    execute("CREATE TYPE membership_role AS ENUM ('member', 'admin')")

    create table(:memberships) do
      add :user_id, references(:users, on_delete: :delete_all), null: false
      add :account_id, references(:accounts, on_delete: :delete_all), null: false
      add :role, :membership_role, default: "member", null: false

      timestamps(type: :utc_datetime)
    end

    create index(:memberships, [:user_id])
    create index(:memberships, [:account_id])
    create unique_index(:memberships, [:user_id, :account_id])
  end

  def down do
    drop table(:memberships)
    execute("DROP TYPE membership_role")
  end
end
