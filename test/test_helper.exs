Faker.start()
ExUnit.start()
Ecto.Adapters.SQL.Sandbox.mode(Pingcrm.Repo, :manual)
{:ok, _} = Application.ensure_all_started(:ex_machina)
