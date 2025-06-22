defmodule Pingcrm.Repo.Migrations.RemoveUserIdFromAccounts do
  use Ecto.Migration

  def change do
    alter table(:accounts) do
      remove :user_id
    end
  end
end
