defmodule Pingcrm.UserFactory do
  defmacro __using__(_opts) do
    quote do
      alias Pingcrm.Accounts.{Account, User}

      def valid_user_password, do: "secret"

      def user_factory do
        %User{
          first_name: Faker.Person.first_name(),
          last_name: Faker.Person.last_name(),
          email: sequence(:email, &"user#{&1}@pingcrm.com"),
          hashed_password: User.hash_password(valid_user_password()),
          confirmed_at: DateTime.utc_now(),
          authenticated_at: nil,
          owner: false,
          account: nil
        }
      end

      def user_with_account(attrs \\ []), do: insert_user_with_account(false, attrs)
      def account_owner(attrs \\ []), do: insert_user_with_account(true, attrs)

      defp insert_user_with_account(owner?, attrs) do
        attrs = Keyword.new(attrs)
        account = Keyword.get(attrs, :account) || insert(:account)

        user_attrs =
          Keyword.merge(attrs,
            account_id: account.id,
            owner: owner?
          )

        user = insert(:user, user_attrs)
        %{user | account: account}
      end
    end
  end
end
