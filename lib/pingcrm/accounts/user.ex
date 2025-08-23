defmodule Pingcrm.Accounts.User do
  @moduledoc false

  import Ecto.Query
  import Ecto.Changeset

  use Ecto.Schema
  use Waffle.Ecto.Schema # File storage third party abstraction

  alias Pingcrm.Accounts.{Account, Membership}
  alias Pingcrm.Uploaders.Avatar
  alias Pingcrm.Repo

  schema "users" do
    # Basics
    field :email, :string
    field :email_changed, :string
    field :first_name, :string
    field :last_name, :string
    field :avatar, Avatar.Type

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
    belongs_to :default_account, Account

    timestamps(type: :utc_datetime)
  end

  def registration_changeset(user, attrs, opts \\ []) do
    user
    |> cast(attrs, [
      :email,
      :first_name,
      :last_name,
      :password,
      :password_confirmation,
      :default_account_id
    ])
    |> validate_required([:email, :first_name, :last_name, :password])
    |> validate_password_confirmation(opts)
    |> unique_constraint(:email, name: :users_email_index)
    |> validate_email_field(:email, opts)
    |> validate_password(opts)
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

  def email_changed_changeset(user, attrs, opts \\ []) do
    user
    |> cast(attrs, [:email_changed])
    |> validate_email_field(:email_changed, opts)
  end

  def profile_changed_changeset(user, attrs, _opts \\ []) do
    user
    |> cast(attrs, [:first_name, :last_name])
    |> cast_attachments(attrs, [:avatar])
    |> validate_required([:first_name, :last_name])
  end

  def default_account_changeset(user, attrs) do
    user
    |> cast(attrs, [:default_account_id])
    |> validate_default_account_membership()
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

  defp validate_password(changeset, opts) do
    # Skip password validation if validate_password is false
    if Keyword.get(opts, :validate_password, true) == false do
      changeset
      |> maybe_hash_password(opts)
    else
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
  end

  defp put_password_hash(changeset) do
    if password = get_change(changeset, :password) do
      put_change(changeset, :hashed_password, hash_password(password))
    else
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

  defp validate_email_field(changeset, field, opts) do
    changeset
    |> validate_format(field, ~r/^[^\s]+@[^\s]+$/, message: "must have the @ sign and no spaces")
    |> validate_length(field, max: 160)
    |> validate_email_not_same_as_current(field)
    |> maybe_validate_unique_email_field(field, opts)
  end

  defp maybe_validate_unique_email_field(changeset, field, opts) do
    if Keyword.get(opts, :validate_email, true) do
      email = get_field(changeset, field)
      user_id = get_field(changeset, :id)

      if email && email_taken?(email, user_id) do
        add_error(changeset, field, "has already been taken")
      else
        changeset
      end
    else
      changeset
    end
  end

  defp validate_email_not_same_as_current(changeset, :email_changed) do
    email = get_field(changeset, :email)
    email_changed = get_field(changeset, :email_changed)

    if email && email_changed && email == email_changed do
      add_error(changeset, :email_changed, "must be different from current email")
    else
      changeset
    end
  end

  defp validate_email_not_same_as_current(changeset, _field), do: changeset

  defp validate_password_confirmation(changeset, opts) do
    # Skip password confirmation validation if password validation is disabled
    if Keyword.get(opts, :validate_password, true) == false do
      changeset
    else
      password = get_field(changeset, :password)
      password_confirmation = get_field(changeset, :password_confirmation)

      cond do
        is_nil(password_confirmation) or password_confirmation == "" ->
          add_error(changeset, :password_confirmation, "can't be blank")

        password != password_confirmation ->
          add_error(changeset, :password_confirmation, "does not match password")

        true ->
          changeset
      end
    end
  end

  def email_taken?(email, user_id) do
    query =
      if user_id do
        from u in __MODULE__,
          where:
            (u.email == ^email or u.email_changed == ^email) and
              u.id != ^user_id,
          select: u.id
      else
        from u in __MODULE__,
          where: u.email == ^email or u.email_changed == ^email,
          select: u.id
      end

    Repo.exists?(query)
  end

  defp validate_default_account_membership(changeset) do
    default_account_id = get_field(changeset, :default_account_id)
    user_id = get_field(changeset, :id)

    if default_account_id && user_id do
      membership_exists =
        from(m in Membership,
          where: m.user_id == ^user_id and m.account_id == ^default_account_id
        )
        |> Repo.exists?()

      if membership_exists do
        changeset
      else
        add_error(changeset, :default_account_id, "must be an account you belong to")
      end
    else
      changeset
    end
  end
end
