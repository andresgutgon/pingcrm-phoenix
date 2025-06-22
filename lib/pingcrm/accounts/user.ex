defmodule Pingcrm.Accounts.User do
  @moduledoc false

  alias Pingcrm.Accounts.Membership
  alias Pingcrm.Repo

  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    # Basics
    field :email, :string
    field :first_name, :string
    field :last_name, :string

    # Auth
    field :password, :string, virtual: true, redact: true
    field :hashed_password, :string, redact: true
    field :current_password, :string, virtual: true, redact: true
    field :password_confirmation, :string, virtual: true, redact: true
    field :confirmed_at, :utc_datetime
    field :authenticated_at, :utc_datetime, virtual: true

    # Relations
    has_many :memberships, Membership
    has_many :accounts, through: [:memberships, :account]

    timestamps(type: :utc_datetime)
  end

  def registration_changeset(user, attrs, opts \\ []) do
    user
    |> cast(attrs, [:email, :first_name, :last_name, :password, :password_confirmation])
    |> validate_required([:email, :first_name, :last_name, :password])
    |> validate_email(opts)
    |> validate_password(opts)
    |> validate_password_confirmation()
    |> put_password_hash()
  end

  def password_changeset(user, attrs, opts \\ []) do
    user
    |> cast(attrs, [:password])
    |> validate_confirmation(:password, message: "does not match password")
    |> validate_password(opts)
    |> put_password_hash()
  end

  def confirm_changeset(user) do
    now = DateTime.utc_now() |> DateTime.truncate(:second)
    change(user, confirmed_at: now)
  end

  @spec hash_password(String.t()) :: String.t()
  def hash_password(password) do
    Bcrypt.hash_pwd_salt(password)
  end

  def valid_password?(%Pingcrm.Accounts.User{hashed_password: hashed_password}, password)
      when is_binary(hashed_password) and byte_size(password) > 0 do
    Bcrypt.verify_pass(password, hashed_password)
  end

  def valid_password?(_, _) do
    Bcrypt.no_user_verify()
    false
  end

  defp validate_email(changeset, opts) do
    changeset
    |> validate_required([:email])
    |> validate_format(:email, ~r/^[^\s]+@[^\s]+$/, message: "must have the @ sign and no spaces")
    |> validate_length(:email, max: 160)
    |> maybe_validate_unique_email(opts)
  end

  defp maybe_validate_unique_email(changeset, opts) do
    if Keyword.get(opts, :validate_email, true) do
      changeset
      |> unsafe_validate_unique(:email, Repo)
      |> unique_constraint(:email, name: :users_email_index)
    else
      changeset
    end
  end

  defp validate_password(changeset, opts) do
    changeset
    |> validate_required([:password])
    |> validate_length(:password, min: 12, max: 72)
    |> validate_format(:password, ~r/[a-z]/, message: "at least one lower case character")
    |> validate_format(:password, ~r/[A-Z]/, message: "at least one upper case character")
    |> validate_format(:password, ~r/[!?@#$%^&*_0-9]/,
      message: "at least one digit or punctuation character"
    )
    |> maybe_hash_password(opts)
  end

  defp put_password_hash(changeset) do
    if password = get_change(changeset, :password) do
      put_change(changeset, :hashed_password, hash_password(password))
    else
      changeset
    end
  end

  defp validate_password_confirmation(changeset) do
    password = get_change(changeset, :password)
    password_confirmation = get_change(changeset, :password_confirmation)

    cond do
      is_nil(password) && is_nil(password_confirmation) ->
        changeset

      is_nil(password_confirmation) ->
        add_error(changeset, :password_confirmation, "can't be blank")

      password != password_confirmation ->
        add_error(changeset, :password_confirmation, "does not match password")

      true ->
        changeset
    end
  end

  defp maybe_hash_password(changeset, opts) do
    hash_password? = Keyword.get(opts, :validate_password, false)
    password = get_change(changeset, :password)

    if hash_password? && password && changeset.valid? do
      changeset
      # If using Bcrypt, then further validate it is at most 72 bytes long
      |> validate_length(:password, max: 72, count: :bytes)
      # Hashing could be done with `Ecto.Changeset.prepare_changes/2`, but that
      # would keep the database transaction open longer and hurt performance.
      |> put_change(:hashed_password, Bcrypt.hash_pwd_salt(password))
      |> delete_change(:password)
    else
      changeset
    end
  end
end
