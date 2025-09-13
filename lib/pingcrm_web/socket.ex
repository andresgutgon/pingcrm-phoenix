defmodule PingcrmWeb.Socket do
  use Phoenix.Socket

  alias Pingcrm.Repo
  alias Pingcrm.Storage.DirectUploads.Channel, as: UploadsChannel
  alias Pingcrm.Accounts.User
  alias Pingcrm.Accounts.Scope
  alias Phoenix.Token

  @token_salt "user_socket"

  def build_token(conn, user, account_id) do
    Token.sign(conn, @token_salt, %{user_id: user.id, account_id: account_id})
  end

  channel UploadsChannel.all_topics(), UploadsChannel

  def connect(%{"token" => token}, socket, _connect_info) do
    case Token.verify(socket, @token_salt, token, max_age: 86400) do
      {:ok, %{user_id: user_id, account_id: account_id}} ->
        case Repo.get(User, user_id) do
          nil ->
            :error

          user ->
            current_scope = Scope.for_user(user, account_id)
            {:ok, assign(socket, :current_scope, current_scope)}
        end

      {:error, _} ->
        :error
    end
  end

  def id(_socket), do: nil
end
