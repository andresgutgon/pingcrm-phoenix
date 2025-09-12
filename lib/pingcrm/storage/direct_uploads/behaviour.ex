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

  @callback load_entity(id :: term()) :: {:ok, struct()} | {:error, String.t()}
  @callback authorize(scope :: Scope.t(), entity :: struct()) :: :ok | {:error, String.t()}
  @callback persist(entity :: struct(), key :: String.t()) ::
              {:ok, struct()} | {:error, Ecto.Changeset.t()}
  @callback scope(scope :: Scope.t()) :: map()
end
