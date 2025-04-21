defmodule Pingcrm.Factory do
  use ExMachina.Ecto, repo: Pingcrm.Repo

  use Pingcrm.AccountFactory
  use Pingcrm.UserFactory
end
