defmodule Pingcrm.Storage.Models.BlobStatus do
  @moduledoc """
  Ecto schema for tracking the status of storage blobs associated with various entities.

  NOTE: entity_id is a string to accommodate different types of primary keys (integer, UUID, etc.)
  It is less perfomance because the column and the index takes more space, but it is more flexible. because users can have uploaders with PK mixed bigint and UUID.
  """
  use Ecto.Schema
  import Ecto.Changeset

  schema "storage_blob_statuses" do
    field :entity_type, :string
    field :entity_id, :string
    field :status, Ecto.Enum, values: [:ready, :processing, :failed]
    field :message, :string

    timestamps()
  end

  def changeset(status, attrs) do
    status
    |> cast(attrs, [:entity_type, :entity_id, :status, :message])
    |> validate_required([:entity_type, :entity_id, :status])
  end
end
