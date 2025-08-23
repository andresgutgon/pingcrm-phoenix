defmodule Pingcrm.Storage.DirectUploads.Behaviour do
  @moduledoc """
  Behaviour for uploaders that support direct uploads.
  """
  alias Pingcrm.Accounts.Scope

  @callback authorize(scope :: Scope.t()) :: :ok | {:error, String.t()}
  @callback scope(scope :: Scope.t()) :: map()
end
