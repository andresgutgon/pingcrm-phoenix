defmodule Pingcrm.Storage.DirectUploads.Behaviour do
  @moduledoc """
  Behaviour for uploaders that support direct uploads.

  Each uploader (e.g. Avatar, AccountLogo, Wallpaper) must define:

    * `load_entity/1` - fetch the entity (User, Account, etc.) by ID
    * `authorize/2`   - check if the current scope can modify the entity
    * `persist/2`     - store the uploaded key in the right field
    * `scope/1`       - return a map used to build the storage path
  """

  alias Pingcrm.Repo
  alias Pingcrm.Accounts.Scope
  alias Pingcrm.Storage.UploaderStatus

  # Entity related callbacks
  @callback entity_pk() :: atom()
  @callback field() :: atom()
  @callback load_entity(id :: term()) :: {:ok, struct()} | {:error, String.t()}
  @callback authorize(scope :: Scope.t(), entity :: struct()) :: :ok | {:error, String.t()}

  # Blob related callbacks
  @callback scope(scope :: Scope.t()) :: map()
  @callback get_file(entity :: struct()) :: String.t() | nil

  @type t :: module()

  @optional_callbacks entity_pk: 0

  def persist(uploader, entity, key) do
    old_file = uploader.get_file(entity)

    filename =
      key
      |> URI.parse()
      |> Map.get(:path)
      |> Path.basename()

    now = NaiveDateTime.truncate(NaiveDateTime.utc_now(), :second)
    field = uploader.field()

    Repo.transact(fn repo ->
      with {:ok, _s} <- UploaderStatus.start(uploader, entity),
           {:ok, entity_updated} <-
             repo.update(
               Ecto.Changeset.change(entity, %{field => %{file_name: filename, updated_at: now}})
             ) do
        {:ok, {entity_updated, old_file}}
      end
    end)
  end
end
