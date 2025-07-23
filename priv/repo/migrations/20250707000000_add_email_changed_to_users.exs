defmodule Pingcrm.Repo.Migrations.AddEmailChangedToUsers do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :email_changed, :string
    end
  end
end
