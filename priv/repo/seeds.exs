# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs

alias Pingcrm.Repo
alias Pingcrm.Accounts.{Account, User}

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
