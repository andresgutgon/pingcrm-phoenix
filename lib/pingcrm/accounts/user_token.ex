defmodule Pingcrm.Accounts.UserToken do
  @moduledoc false

  use Ash.Resource,
    otp_app: :pingcrm,
    domain: Pingcrm.Accounts,
    data_layer: AshPostgres.DataLayer

  alias Pingcrm.Accounts.User

  @hash_algorithm :sha256
  @rand_size 32
  @session_validity_in_days 14
  @confirm_validity_in_days 7
  @reset_password_validity_in_days 1

  postgres do
    table "users_tokens"
    repo Pingcrm.Repo
  end

  attributes do
    uuid_primary_key :id
    attribute :token, :binary, allow_nil?: false
    attribute :context, :string, allow_nil?: false
    attribute :sent_to, :string
    attribute :authenticated_at, :utc_datetime

    create_timestamp :inserted_at
  end

  relationships do
    belongs_to :user, User, allow_nil?: false
  end

  actions do
    defaults [:read, :destroy]
    
    create :create do
      accept [:token, :context, :sent_to, :user_id, :authenticated_at]
    end

    create :build_session_token do
      accept [:user_id, :authenticated_at]
      change set_attribute(:context, "session")
    end

    create :build_email_token do
      accept [:user_id, :context, :sent_to, :token]
    end
  end

  # Helper functions for token generation/verification
  # These would need to be rewritten to use Ash actions

  def build_session_token(user) do
    token = :crypto.strong_rand_bytes(@rand_size)
    dt = Map.get(user, :authenticated_at) || DateTime.utc_now()

    with {:ok, user_token} <- Ash.create(__MODULE__, :build_session_token, %{
      token: token,
      user_id: Map.get(user, :id),
      authenticated_at: dt
    }, domain: Pingcrm.Accounts) do
      {token, user_token}
    end
  end

  def build_email_token(user, context) do
    token = :crypto.strong_rand_bytes(@rand_size)
    hashed_token = :crypto.hash(@hash_algorithm, token)

    with {:ok, user_token} <- Ash.create(__MODULE__, :build_email_token, %{
      token: hashed_token,
      context: context,
      sent_to: Map.get(user, :email),
      user_id: Map.get(user, :id)
    }, domain: Pingcrm.Accounts) do
      {Base.url_encode64(token, padding: false), user_token}
    end
  end

  defp days_for_context("confirm"), do: @confirm_validity_in_days
  defp days_for_context("confirm_email_change"), do: @confirm_validity_in_days
  defp days_for_context("reset_password"), do: @reset_password_validity_in_days
end
