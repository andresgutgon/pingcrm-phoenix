defmodule Pingcrm.UserTokenFactory do
  defmacro __using__(_opts) do
    quote do
      alias Pingcrm.Accounts.UserToken

      def user_token_factory(attrs \\ %{}) do
        user = Map.get(attrs, :user) || build(:user)
        context = Map.get(attrs, :context, "session")
        sent_to = Map.get(attrs, :sent_to, user.email)

        case context do
          "session" ->
            {raw_token, token_struct} = UserToken.build_session_token(user)
            # You can expose the raw token if needed for tests
            Map.merge(
              token_struct,
              Map.merge(attrs, %{
                user: user,
                context: context,
                authenticated_at: token_struct.authenticated_at,
                raw_token: raw_token
              })
            )

          _ ->
            {encoded_token, token_struct} =
              UserToken.build_email_token(user, context)

            Map.merge(
              token_struct,
              Map.merge(attrs, %{
                user: user,
                context: context,
                sent_to: sent_to,
                encoded_token: encoded_token
              })
            )
        end
      end
    end
  end
end
