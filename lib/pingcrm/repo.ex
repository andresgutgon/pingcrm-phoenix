defmodule Pingcrm.Repo do
  use Ecto.Repo,
    otp_app: :pingcrm,
    adapter: Ecto.Adapters.Postgres
end
