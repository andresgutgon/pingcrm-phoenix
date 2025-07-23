defmodule Pingcrm.Seeds.DemoData do
  alias Pingcrm.Repo
  alias Pingcrm.Accounts.{Account, Auth, Membership, User, UserToken}

  def create do
    ensure_empty!()

    {:ok, {account, user}} =
      Auth.create_account(
        %{
          account: %{name: "Acme Corporation"},
          user: %{
            first_name: "John",
            last_name: "Doe",
            email: "johndoe@example.com",
            password: "secret",
            password_confirmation: "secret"
          }
        },
        validate_password: false
      )

    {encoded_token, user_token} = UserToken.build_email_token(user, "confirm")
    Repo.insert!(user_token)
    Auth.confirm_user(encoded_token)

    Repo.transaction(fn ->
      for i <- 1..5 do
        user =
          %User{}
          |> User.registration_changeset(
            %{
              first_name: "User#{i}",
              last_name: "Example",
              email: "user#{i}@example.com",
              password: "password",
              password_confirmation: "password"
            },
            validate_password: false
          )
          |> Repo.insert!()

        {encoded_token, user_token} = UserToken.build_email_token(user, "confirm")
        Repo.insert!(user_token)
        Auth.confirm_user(encoded_token)
        Membership.add_member(user, account)
      end
    end)
  end

  def ensure_empty! do
    Repo.delete_all(User)
    Repo.delete_all(Account)
  end
end
