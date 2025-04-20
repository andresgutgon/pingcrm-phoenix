defmodule Pingcrm.Repo.Migrations.AddAccountIdToUsers do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :account_id, references(:accounts, on_delete: :nothing), null: false
    end

    create index(:users, [:account_id])
  end
end
