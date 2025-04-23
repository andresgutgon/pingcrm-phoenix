defmodule Pingcrm.AccountFactory do
  defmacro __using__(_opts) do
    quote do
      alias Pingcrm.Accounts.Account

      def account_factory do
        %Account{
          name: Faker.Company.name()
        }
      end
    end
  end
end
