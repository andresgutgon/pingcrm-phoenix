defmodule Pingcrm.Support.AuthTestHelpers do
  import Ecto.Query

  alias Pingcrm.Accounts

  def override_token_authenticated_at(token, authenticated_at) when is_binary(token) do
    Pingcrm.Repo.update_all(
      from(t in Accounts.UserToken,
        where: t.token == ^token
      ),
      set: [authenticated_at: authenticated_at]
    )
  end

  def offset_user_token(token, amount_to_add, unit) do
    dt = DateTime.add(DateTime.utc_now(:second), amount_to_add, unit)

    Pingcrm.Repo.update_all(
      from(ut in Accounts.UserToken, where: ut.token == ^token),
      set: [inserted_at: dt, authenticated_at: dt]
    )
  end
end
