defmodule Pingcrm.Storage.DirectUploads.Behaviour do
  @moduledoc """
  Behaviour for uploaders that support direct uploads.

  Each uploader (e.g. Avatar, AccountLogo, Wallpaper) must define:

    * `load_entity/1`  - fetch the entity (User, Account, etc.) by ID
    * `authorize/2`    - check if the current scope can modify the entity
    * `start_upload/2` - initialize the upload process
    * `scope/1`        - return a map used to build the storage path
  """

  alias Pingcrm.Accounts.Scope
  alias Pingcrm.Storage.UploaderStatus
  alias Pingcrm.Storage.DirectUploads.Channel

  # Entity related callbacks
  @callback entity_pk() :: atom()
  @callback field() :: atom()
  @callback load_entity(id :: term()) :: {:ok, struct()} | {:error, String.t()}
  @callback authorize(scope :: Scope.t(), entity :: struct()) :: :ok | {:error, String.t()}
  @callback updated_entity_data(entity :: struct()) :: map()

  # Blob related callbacks
  @callback scope(scope :: struct()) :: map()
  @callback get_filename(entity :: struct()) :: String.t() | nil

  @type t :: module()

  @optional_callbacks entity_pk: 0, updated_entity_data: 1

  defmacro __using__(_) do
    quote do
      @behaviour Pingcrm.Storage.DirectUploads.Behaviour

      @spec broadcast_topic(struct()) :: String.t()
      def broadcast_topic(%{__meta__: %Ecto.Schema.Metadata{}} = entity) do
        name = uploader_name()
        pk = Map.get(entity, pk_field())
        type = entity_type(entity)
        "#{Channel.topic_prefix()}:#{name}:#{type}:#{pk}"
      end

      @spec entity_type(struct()) :: String.t()
      def entity_type(%{__meta__: %Ecto.Schema.Metadata{}} = entity) do
        entity.__struct__
        |> Module.split()
        |> List.last()
        |> Macro.camelize()
        |> to_string()
        |> String.downcase()
      end

      @spec normalize_entity(struct()) :: {String.t(), String.t()}
      def normalize_entity(%{__meta__: %Ecto.Schema.Metadata{}} = entity) do
        entity_type =
          entity.__struct__
          |> Module.split()
          |> List.last()

        entity_id = to_string(Map.fetch!(entity, pk_field()))

        {entity_type, entity_id}
      end

      @spec updated_data(struct()) :: map()
      def updated_data(%{__meta__: %Ecto.Schema.Metadata{}} = entity) do
        if function_exported?(__MODULE__, :updated_entity_data, 1) do
          updated_entity_data(entity)
        else
          %{}
        end
      end

      def pk_field() do
        if function_exported?(__MODULE__, :entity_pk, 0) do
          entity_pk()
        else
          :id
        end
      end

      defp uploader_name() do
        __MODULE__
        |> Module.split()
        |> List.last()
        |> Macro.underscore()
        |> to_string()
        |> String.downcase()
      end
    end
  end

  def start_upload(uploader, entity) do
    old_filename = uploader.get_filename(entity)

    with {:ok, _s} <- UploaderStatus.start(uploader, entity) do
      {:ok, {old_filename}}
    end
  end
end
