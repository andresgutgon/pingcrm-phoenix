defmodule Pingcrm.Storage.DirectUploads.Behaviour do
  @moduledoc """
  Behaviour for uploaders that support direct uploads.

  Each uploader (e.g. Avatar, AccountLogo, Wallpaper) must define:

    * `load_entity/1` - fetch the entity (User, Account, etc.) by ID
    * `authorize/2`   - check if the current scope can modify the entity
    * `persist/2`     - store the uploaded key in the right field
    * `scope/1`       - return a map used to build the storage path
  """

  alias Pingcrm.Accounts.Scope
  alias Pingcrm.Repo

  @callback load_entity(id :: term()) :: {:ok, struct()} | {:error, String.t()}
  @callback authorize(scope :: Scope.t(), entity :: struct()) :: :ok | {:error, String.t()}
  @callback scope(scope :: Scope.t()) :: map()
  @callback field() :: atom()
  @callback get_file(entity :: struct()) :: String.t() | nil

  def persist(uploader, entity, key) do
    # capture old file before overwriting
    old_file = uploader.get_file(entity)

    filename =
      key
      |> URI.parse()
      |> Map.get(:path)
      |> Path.basename()

    now = NaiveDateTime.truncate(NaiveDateTime.utc_now(), :second)
    field = uploader.field()

    {:ok, entity}

    # TODO: Polymorphic uploads_state table
    # Upsert the state to "processing"

    changeset =
      Ecto.Changeset.change(entity, %{
        field => %{file_name: filename, updated_at: now}
      })

    case Repo.update(changeset) do
      {:ok, updated} ->
        # TODO: Websockets baby
        {:ok, {updated, old_file}}

      {:error, cs} ->
        # Return the error to the controller layer
        {:error, cs}
    end
  end
end
