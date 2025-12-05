defmodule Pingcrm.Accounts.Account do
  @moduledoc false
  
  use Ash.Resource,
    otp_app: :pingcrm,
    domain: Pingcrm.Accounts,
    data_layer: AshPostgres.DataLayer

  alias Pingcrm.Accounts.{Membership, User}

  postgres do
    table "accounts"
    repo Pingcrm.Repo
  end

  attributes do
    uuid_primary_key :id
    attribute :name, :string, allow_nil?: false

    timestamps()
  end

  relationships do
    has_many :memberships, Membership
    many_to_many :members, User do
      through Membership
      source_attribute_on_join_resource :account_id
      destination_attribute_on_join_resource :user_id
    end
  end

  actions do
    defaults [:read, :destroy]
    
    create :create do
      accept [:name]
      validate present([:name])
      validate string_length(:name, min: 2)
    end

    update :update do
      accept [:name]
      validate present([:name])
      validate string_length(:name, min: 2)
    end
  end
end
