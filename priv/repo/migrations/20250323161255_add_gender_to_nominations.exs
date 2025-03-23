defmodule Pingcrm.Repo.Migrations.AddGenderToNominations do
  use Ecto.Migration

  def change do
    alter table(:nominations) do
      add :gender, :string
    end
  end
end
