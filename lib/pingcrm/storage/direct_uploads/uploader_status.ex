defmodule Pingcrm.Storage.UploaderStatus do
  @moduledoc """
  Public API for managing blob statuses.

  Provides simple functions to mark uploads as processing, ready, or failed.
  """

  import Ecto.Query
  alias Pingcrm.Repo
  alias Pingcrm.Storage.Models.BlobStatus
  alias Pingcrm.Storage.DirectUploads.Behavior

  @doc "mark an entity’s blob as processing."
  @spec start(Behavior.t(), struct()) ::
          {:ok, %BlobStatus{}} | {:error, Ecto.Changeset.t()}
  def start(uploader, %{__meta__: %Ecto.Schema.Metadata{}} = entity) do
    {entity_type, entity_id} = normalize_entity(uploader, entity)

    %BlobStatus{}
    |> BlobStatus.changeset(%{
      entity_type: entity_type,
      entity_id: entity_id,
      status: "processing"
    })
    |> Repo.insert(
      on_conflict: [set: [status: "processing", message: nil, updated_at: DateTime.utc_now()]],
      conflict_target: [:entity_type, :entity_id]
    )
  end

  @doc "Mark an entity’s blob as ready."
  @spec ready(Behavior.t(), struct()) ::
          {:ok, %BlobStatus{}} | {:error, Ecto.Changeset.t()}
  def ready(uploader, %{__meta__: %Ecto.Schema.Metadata{}} = entity) do
    status = get(uploader, entity)
    Repo.update(Ecto.Changeset.change(status, %{status: "ready", message: nil}))
  end

  @doc "Mark an entity’s blob as failed with a message."
  @spec fail(Behavior.t(), struct(), String.t()) ::
          {:ok, %BlobStatus{}} | {:error, Ecto.Changeset.t()}
  def fail(uploader, %{__meta__: %Ecto.Schema.Metadata{}} = entity, message) do
    status = get!(uploader, entity)
    Repo.update(Ecto.Changeset.change(status, %{status: "failed", message: message}))
  end

  @doc "Get current status for an entity."
  @spec get!(Behavior.t(), struct()) :: %BlobStatus{}
  def get!(uploader, %{__meta__: %Ecto.Schema.Metadata{}} = entity) do
    {entity_type, entity_id} = normalize_entity(uploader, entity)

    Repo.one!(
      from s in BlobStatus,
        where: s.entity_type == ^entity_type and s.entity_id == ^entity_id
    )
  end

  @doc "Get current status for an entity."
  @spec get(Behavior.t(), struct()) :: %BlobStatus{}
  def get(uploader, %{__meta__: %Ecto.Schema.Metadata{}} = entity) do
    {entity_type, entity_id} = normalize_entity(uploader, entity)

    Repo.one(
      from s in BlobStatus,
        where: s.entity_type == ^entity_type and s.entity_id == ^entity_id
    )
  end

  @spec normalize_entity(Behavior.t(), struct()) :: {String.t(), String.t()}
  defp normalize_entity(uploader, %{__meta__: %Ecto.Schema.Metadata{}} = entity) do
    entity_type =
      entity.__struct__
      |> Module.split()
      |> List.last()

    pk_field = if function_exported?(uploader, :entity_pk, 0), do: uploader.entity_pk(), else: :id
    entity_id = to_string(Map.fetch!(entity, pk_field))
    {entity_type, entity_id}
  end
end
