defmodule Pingcrm.Accounts.Membership do
  use Ash.Resource,
    otp_app: :pingcrm,
    domain: Pingcrm.Accounts,
    data_layer: AshPostgres.DataLayer

  alias Pingcrm.Accounts.{Account, User}

  postgres do
    table "memberships"
    repo Pingcrm.Repo
  end

  attributes do
    uuid_primary_key :id
    attribute :role, :string, default: "member", allow_nil?: false

    timestamps()
  end

  relationships do
    belongs_to :user, User, allow_nil?: false
    belongs_to :account, Account, allow_nil?: false
  end

  actions do
    defaults [:read, :destroy]
    
    create :create do
      accept [:user_id, :account_id, :role]
      validate present([:user_id, :account_id, :role])
      validate one_of(:role, ["member", "admin"])
    end

    create :add_admin do
      accept [:user_id, :account_id]
      change set_attribute(:role, "admin")
    end

    create :add_member do
      accept [:user_id, :account_id]
      change set_attribute(:role, "member")
    end

    update :update do
      accept [:role]
      validate one_of(:role, ["member", "admin"])
    end
  end

  identities do
    identity :user_account, [:user_id, :account_id]
  end
end
