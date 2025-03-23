defmodule Pingcrm.Repo.Migrations.CreateNominations do
  use Ecto.Migration

  def change do
    create table(:nominations) do
      add :name, :string
      add :year, :integer
      add :movie, :string
      add :won, :boolean, default: false, null: false

      timestamps(type: :utc_datetime)
    end
  end
end
