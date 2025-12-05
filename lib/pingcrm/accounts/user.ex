defmodule Pingcrm.Accounts.User do
  @moduledoc false

  use Ash.Resource,
    otp_app: :pingcrm,
    domain: Pingcrm.Accounts,
    data_layer: AshPostgres.DataLayer

  alias Pingcrm.Accounts.{Account, Membership}

  postgres do
    table "users"
    repo Pingcrm.Repo
  end

  attributes do
    uuid_primary_key :id

    # Basics
    attribute :email, :string, allow_nil?: false
    attribute :email_changed, :string
    attribute :first_name, :string, allow_nil?: false
    attribute :last_name, :string, allow_nil?: false

    # Auth
    attribute :password, :string, sensitive?: true, allow_nil?: true
    attribute :hashed_password, :string, sensitive?: true
    attribute :current_password, :string, sensitive?: true, allow_nil?: true
    attribute :password_confirmation, :string, sensitive?: true, allow_nil?: true
    attribute :confirmed_at, :utc_datetime
    attribute :authenticated_at, :utc_datetime, allow_nil?: true

    # Relations
    attribute :default_account_id, :uuid

    timestamps()
  end

  relationships do
    has_many :memberships, Membership
    many_to_many :accounts, Account do
      through Membership
      source_attribute_on_join_resource :user_id
      destination_attribute_on_join_resource :account_id
    end
    belongs_to :default_account, Account
  end

  actions do
    defaults [:read, :destroy]
    
    create :create do
      accept [:email, :first_name, :last_name, :password, :password_confirmation, :default_account_id]
    end

    update :update do
      accept [:email, :first_name, :last_name, :default_account_id]
    end

    update :update_password do
      accept [:password]
    end

    update :confirm do
      accept []
      change set_attribute(:confirmed_at, &DateTime.utc_now/0)
    end

    update :change_email do
      accept [:email_changed]
    end

    update :set_default_account do
      accept [:default_account_id]
    end
  end

  identities do
    identity :email, [:email]
  end

  # Utility functions that can be used with Ash actions
  @spec hash_password(String.t()) :: String.t()
  def hash_password(password) do
    Bcrypt.hash_pwd_salt(password)
  end

  def valid_password?(user, password)
      when is_map(user) and is_binary(password) and byte_size(password) > 0 do
    case Map.get(user, :hashed_password) do
      hashed_password when is_binary(hashed_password) ->
        Bcrypt.verify_pass(password, hashed_password)
      _ ->
        Bcrypt.no_user_verify()
        false
    end
  end

  def valid_password?(_, _) do
    Bcrypt.no_user_verify()
    false
  end
end
