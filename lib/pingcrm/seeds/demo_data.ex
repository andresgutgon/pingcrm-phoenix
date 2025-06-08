defmodule Pingcrm.Seeds.DemoData do
  alias Pingcrm.Repo
  alias Pingcrm.Accounts.{Account, User}

  def create do
    ensure_empty!()

    account = Repo.insert!(%Account{name: "Acme Corporation"})

    %User{}
    |> User.registration_changeset(%{
      account_id: account.id,
      first_name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
      password: "secret",
      owner: true
    })
    |> Repo.insert!()

    for i <- 1..5 do
      %User{}
      |> User.registration_changeset(%{
        account_id: account.id,
        first_name: "User#{i}",
        last_name: "Example",
        email: "user#{i}@example.com",
        password: "password",
        owner: false
      })
      |> Repo.insert!()
    end
  end

  def ensure_empty! do
    Repo.delete_all(User)
    Repo.delete_all(Account)
  end
end
