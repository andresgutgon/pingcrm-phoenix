defmodule Pingcrm.UserFactory do
  defmacro __using__(_opts) do
    quote do
      alias Pingcrm.Accounts.{Account, Membership, User}

      def valid_user_password, do: "Secret_Password1234!@#"
      def unique_user_email, do: "user#{System.unique_integer()}@example.com"

      def valid_user_attributes(attrs \\ %{}) do
        defaults = %{
          "account" => %{"name" => "Acme Corporation"},
          "user" => %{
            "first_name" => "John",
            "last_name" => "Doe",
            "email" => unique_user_email(),
            "password" => valid_user_password(),
            "password_confirmation" => valid_user_password()
          }
        }

        attrs = stringify_keys(attrs)
        account = Map.merge(defaults["account"], Map.get(attrs, "account", %{}))
        user = Map.merge(defaults["user"], Map.get(attrs, "user", %{}))
        %{"account" => account, "user" => user}
      end

      def extract_user_token(fun) do
        {:ok, captured_email} = fun.(&"[TOKEN]#{&1}[TOKEN]")
        [_, token | _] = String.split(captured_email.text_body, "[TOKEN]")
        token
      end

      def user_factory do
        %User{
          first_name: Faker.Person.first_name(),
          last_name: Faker.Person.last_name(),
          email: sequence(:email, &"user#{&1}@pingcrm.com"),
          hashed_password: User.hash_password(valid_user_password()),
          confirmed_at: DateTime.utc_now(),
          authenticated_at: nil
        }
      end

      def user_with_account(attrs \\ []), do: insert_user_with_account("member", attrs)
      def account_owner(attrs \\ []), do: insert_user_with_account("admin", attrs)

      defp insert_user_with_account(role, attrs) do
        attrs =
          case attrs do
            %{} -> Map.to_list(attrs)
            list when is_list(list) -> list
          end

        account = Keyword.get(attrs, :account) || insert(:account)

        user_attrs = Keyword.drop(attrs, [:account])
        user = insert(:user, user_attrs)

        member_factory =
          case role do
            "admin" -> :admin_membership
            "member" -> :member_membership
            _ -> :membership
          end

        membership = insert(member_factory, %{user: user, account: account})

        %{user: user, account: account, role: membership.role}
      end

      defp stringify_keys(map) when is_map(map) do
        map
        |> Enum.map(fn
          {k, v} when is_atom(k) -> {Atom.to_string(k), stringify_keys(v)}
          {k, v} -> {k, stringify_keys(v)}
        end)
        |> Enum.into(%{})
      end

      defp stringify_keys(other), do: other
    end
  end
end
