defmodule Pingcrm.Repo.Migrations.AddAgeToNominations do
  use Ecto.Migration

  def change do
    alter table(:nominations) do
      add :age, :integer
    end
  end
end
