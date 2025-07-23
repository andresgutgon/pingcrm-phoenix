defmodule Pingcrm.Repo.Migrations.AddDefaultAccountToUsers do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :default_account_id, references(:accounts, on_delete: :nilify_all)
    end

    create index(:users, [:default_account_id])
  end
end
