defmodule Pingcrm.Repo.Migrations.AddDemoUser do
  use Ecto.Migration

  def up do
    Pingcrm.Seeds.DemoData.create()
  end
end
