defmodule Pingcrm.MembershipFactory do
  defmacro __using__(_opts) do
    quote do
      alias Pingcrm.Accounts.Membership

      def membership_factory do
        %Membership{
          user: build(:user),
          account: build(:account),
          role: "member"
        }
      end

      def admin_membership_factory do
        struct(membership_factory(), role: "admin")
      end

      def member_membership_factory do
        struct(membership_factory(), role: "member")
      end
    end
  end
end
