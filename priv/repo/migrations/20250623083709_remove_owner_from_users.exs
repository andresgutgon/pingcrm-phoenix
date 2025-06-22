defmodule Pingcrm.Repo.Migrations.RemoveOwnerFromUsers do
  use Ecto.Migration

  def up do
    alter table(:users) do
      remove :owner
      remove :account_id
    end
  end

  def down do
    alter table(:users) do
      add :owner, :boolean, default: false, null: false
      add :account_id, references(:accounts, on_delete: :delete_all), null: false
    end
  end
end
