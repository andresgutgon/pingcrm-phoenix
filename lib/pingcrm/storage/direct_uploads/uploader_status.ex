defmodule Pingcrm.Storage.UploaderStatus do
  @moduledoc """
  Public API for managing blob statuses.

  Provides functions to mark uploads as processing, ready, or failed.
  Also broadcasts status changes via websockets.
  """

  import Ecto.Query
  alias Pingcrm.Repo
  alias Pingcrm.Storage.Models.BlobStatus
  alias Pingcrm.Storage.DirectUploads.Behavior
  alias PingcrmWeb.Endpoint

  @type entity :: struct()
  @type blob_status :: {:ok, BlobStatus.t()} | {:error, Ecto.Changeset.t()}

  @doc "Mark an entity’s blob as processing."
  @spec start(Behavior.t(), struct()) :: blob_status
  def start(uploader, %{__meta__: %Ecto.Schema.Metadata{}} = entity) do
    {entity_type, entity_id} = uploader.normalize_entity(entity)

    %BlobStatus{entity_type: entity_type, entity_id: entity_id}
    |> BlobStatus.processing_changeset(0)
    |> Repo.insert(
      on_conflict: [
        set: [status: :processing, payload: %{progress: 0}, updated_at: DateTime.utc_now()]
      ],
      conflict_target: [:entity_type, :entity_id]
    )
    |> broadcast(uploader, entity)
  end

  @doc "Mark an entity’s blob as ready."
  @spec ready(Behavior.t(), struct()) :: blob_status
  def ready(uploader, %{__meta__: %Ecto.Schema.Metadata{}} = entity) do
    {entity_type, entity_id} = uploader.normalize_entity(entity)

    status =
      Repo.one(
        from s in BlobStatus,
          where: s.entity_type == ^entity_type and s.entity_id == ^entity_id
      )

    status
    |> BlobStatus.ready_changeset(
      entity_id,
      entity_type,
      uploader.field(),
      uploader.updated_data(entity)
    )
    |> Repo.update()
    |> broadcast(uploader, entity)
  end

  @doc "Mark an entity’s blob as failed with a message."
  @spec fail(Behavior.t(), struct(), String.t()) :: blob_status
  def fail(
        uploader,
        %{__meta__: %Ecto.Schema.Metadata{}} = entity,
        error_msg
      ) do
    {entity_type, entity_id} = uploader.normalize_entity(entity)

    status =
      Repo.one(
        from s in BlobStatus,
          where: s.entity_type == ^entity_type and s.entity_id == ^entity_id
      )

    status
    |> BlobStatus.failed_changeset(error_msg)
    |> Repo.update()
    |> broadcast(uploader, entity)
  end

  @doc "Get current status for an entity."
  @spec get!(Behavior.t(), entity) :: BlobStatus.t()
  def get!(uploader, entity) do
    {entity_type, entity_id} = uploader.normalize_entity(entity)

    Repo.one!(
      from s in BlobStatus,
        where: s.entity_type == ^entity_type and s.entity_id == ^entity_id
    )
  end

  @doc "Get current status for an entity (nil if not found)."
  @spec get(Behavior.t(), entity) :: BlobStatus.t() | nil
  def get(uploader, entity) do
    {entity_type, entity_id} = uploader.normalize_entity(entity)

    Repo.one(
      from s in BlobStatus,
        where: s.entity_type == ^entity_type and s.entity_id == ^entity_id
    )
  end

  @spec broadcast(blob_status, Behavior.t(), entity) :: blob_status
  defp broadcast(
         {:ok, blob_status} = result,
         uploader,
         %{__meta__: %Ecto.Schema.Metadata{}} = entity
       ) do
    event_data = broadcast_event_data(blob_status)
    dbg(event_data)

    Endpoint.broadcast(
      uploader.broadcast_topic(entity),
      "uploader_status_changed",
      event_data
    )

    result
  end

  @spec broadcast_event_data(BlobStatus.t()) :: map()
  defp broadcast_event_data(blob_status) do
    %{
      entity_id: blob_status.entity_id,
      entity_type: blob_status.entity_type,
      status: Atom.to_string(blob_status.status),
      payload: blob_status.payload
    }
  end
end
