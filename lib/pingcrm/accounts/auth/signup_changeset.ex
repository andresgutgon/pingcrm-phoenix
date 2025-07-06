defmodule Pingcrm.Accounts.Auth.SignupChangeset do
  use Ecto.Schema
  import Ecto.Changeset
  alias Pingcrm.Accounts.{Account, User}

  embedded_schema do
    embeds_one :user, Pingcrm.Accounts.User
    embeds_one :account, Pingcrm.Accounts.Account
  end

  def changeset(struct, attrs, opts \\ []) do
    struct
    |> cast(attrs, [])
    |> cast_embed(:account, required: true, with: &Account.changeset/2)
    |> cast_embed(:user,
      required: true,
      with: fn user, user_attrs ->
        User.registration_changeset(user, user_attrs,
          validate_password: Keyword.get(opts, :validate_password, true),
          validate_email: Keyword.get(opts, :validate_email, true)
        )
      end
    )
  end
end
