defmodule Pingcrm.Repo.Migrations.AddStorageBlobStatusesTable do
  use Ecto.Migration

  def change do
    create table(:storage_blob_statuses) do
      add :entity_type, :string, null: false
      # always stored as text
      add :entity_id, :string, null: false
      add :status, :string, null: false
      add :message, :text

      timestamps()
    end

    create unique_index(:storage_blob_statuses, [:entity_type, :entity_id])
  end
end
