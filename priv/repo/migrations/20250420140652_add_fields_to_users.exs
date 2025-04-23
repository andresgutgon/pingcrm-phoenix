defmodule Pingcrm.Repo.Migrations.AddFieldsToUsers do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :first_name, :string
      add :last_name, :string
      add :owner, :boolean, default: false, null: false
    end
  end
end
