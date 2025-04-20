defmodule Pingcrm.Accounts.User do
  use Ecto.Schema
  import Ecto.Changeset
  alias Pingcrm.Accounts.Account

  schema "users" do
    # Basics
    field :email, :string
    field :first_name, :string
    field :last_name, :string
    field :owner, :boolean, default: false

    # Auth
    field :password, :string, virtual: true, redact: true
    field :hashed_password, :string, redact: true
    field :current_password, :string, virtual: true, redact: true
    field :confirmed_at, :utc_datetime
    field :authenticated_at, :utc_datetime, virtual: true

    # Relations
    belongs_to :account, Account

    timestamps(type: :utc_datetime)
  end

  def registration_changeset(user, attrs) do
    user
    |> cast(attrs, [:email, :first_name, :last_name, :password, :owner, :account_id])
    |> validate_required([:email, :first_name, :last_name, :password])
    |> validate_length(:password, min: 6)
    |> put_password_hash()
  end

  defp put_password_hash(changeset) do
    if password = get_change(changeset, :password) do
      put_change(changeset, :hashed_password, Bcrypt.hash_pwd_salt(password))
    else
      changeset
    end
  end

  @doc """
  Verifies the password.

  If there is no user or the user doesn't have a password, we call
  `Bcrypt.no_user_verify/0` to avoid timing attacks.
  """
  def valid_password?(%Pingcrm.Accounts.User{hashed_password: hashed_password}, password)
      when is_binary(hashed_password) and byte_size(password) > 0 do
    Bcrypt.verify_pass(password, hashed_password)
  end

  def valid_password?(_, _) do
    Bcrypt.no_user_verify()
    false
  end
end
