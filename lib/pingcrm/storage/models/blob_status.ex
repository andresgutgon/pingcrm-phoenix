defmodule Pingcrm.Storage.Models.BlobStatus do
  @moduledoc """
  Ecto schema for tracking the status of storage blobs associated with various entities.

  NOTE: entity_id is a string to accommodate different types of primary keys (integer, UUID, etc.)
  It is less perfomance because the column and the index takes more space, but it is more flexible. because users can have uploaders with PK mixed bigint and UUID.
  """
  use Ecto.Schema
  import Ecto.Changeset

  @moduledoc """
  Public API for managing blob statuses.

  Provides simple functions to mark uploads as processing, ready, or failed.
  Also broadcasts status changes via websockets.
  """
  schema "storage_blob_statuses" do
    field :entity_type, :string
    field :entity_id, :string
    field :status, Ecto.Enum, values: [:ready, :processing, :failed]
    field :payload, :map
    timestamps()
  end

  def processing_changeset(status, progress) when is_integer(progress) and progress >= 0 do
    status
    |> cast(%{status: :processing, payload: %{progress: progress}}, [:status, :payload])
    |> validate_required([:status, :payload])
  end

  def ready_changeset(status, entity_id, entity_type, field, entity_data) do
    status
    |> cast(
      %{
        status: :ready,
        payload: %{
          entity_id: entity_id,
          entity_type: entity_type,
          field: Atom.to_string(field),
          entity_data: entity_data
        }
      },
      [:status, :payload]
    )
    |> validate_required([:status, :payload])
  end

  def failed_changeset(status, error) when is_binary(error) do
    status
    |> cast(%{status: :failed, payload: %{error: error}}, [:status, :payload])
    |> validate_required([:status, :payload])
  end
end
