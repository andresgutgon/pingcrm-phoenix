defmodule Pingcrm.Seeds.DemoData do
  alias Pingcrm.Repo
  alias Pingcrm.Accounts.{Account, Auth, Membership, User}

  def create do
    ensure_empty!()

    {:ok, {account, _}} =
      Auth.create_account(%{
        account: %{name: "Acme Corporation"},
        user: %{
          first_name: "John",
          last_name: "Doe",
          email: "johndoe@example.com",
          password: "secret"
        }
      })

    Repo.transaction(fn ->
      for i <- 1..5 do
        user =
          %User{}
          |> User.registration_changeset(%{
            first_name: "User#{i}",
            last_name: "Example",
            email: "user#{i}@example.com",
            password: "password"
          })
          |> Repo.insert!()

        Membership.add_member(user, account)
      end
    end)
  end

  def ensure_empty! do
    Repo.delete_all(User)
    Repo.delete_all(Account)
  end
end
