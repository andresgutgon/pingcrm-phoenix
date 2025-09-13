defmodule Pingcrm.Storage.ProcessUploadJob do
  @moduledoc """
  An Oban job to process a direct upload.
  Get the file by the key and gets the URL from the uploader bucket.
  Then store the file using the uploader and update the entity in the DB.
  This will check validations on the uploader and apply transformations
  if any.

  Error handling is done using the UploaderStatus module to track the state
  Also this module notify the frontend via websockets.

  Oban will try to validate and transform the attachment
  5 times with a 5 minutes delay between each try.

  The job is unique by the combination of entity_id, uploader and key.
  """
  alias Pingcrm.{Repo, Uploaders}
  alias Pingcrm.Storage.DirectUploads.Resolver
  alias Pingcrm.Storage.UploaderStatus
  alias PingcrmWeb.Endpoint

  use Oban.Worker,
    queue: :media,
    max_attempts: 5,
    unique: [
      fields: [:args],
      keys: [:entity_id, :uploader, :key],
      states: [:available, :scheduled, :executing, :retryable],
      period: :infinity
    ]

  @impl Oban.Worker
  def backoff(%Oban.Job{attempt: _attempt}) do
    # 5 minutes, always
    300
  end

  def enqueue(args), do: __MODULE__.new(args) |> Oban.insert()

  @impl true
  def perform(%Oban.Job{
        args: %{
          "uploader" => uploader_str,
          "entity_id" => entity_id,
          "key" => key,
          "old_filename" => old_filename
        }
      }) do
    {:ok, uploader} = Resolver.resolve(uploader_str)
    {:ok, entity} = uploader.load_entity(entity_id)

    # FIXME: Remove this shit. Convert user pk to uuid
    entity = %{entity | uuid: Integer.to_string(entity.id)}

    filename = get_filename_from_key(key)

    url =
      uploader.url({filename, uploader.scope(entity)}, :original, signed: true, expires_in: 60)

    dbg("Entity: #{inspect(entity.uuid)}")
    dbg("Old filename: #{inspect(old_filename)}")
    dbg("New filename: #{inspect(filename)}")
    dbg("Scope: #{inspect(uploader.scope(entity))}")
    dbg("URL: #{inspect(url)}")

    try do
      case uploader.store({url, uploader.scope(entity)}) do
        {:ok, filename} ->
          field = uploader.field()
          now = DateTime.utc_now() |> DateTime.truncate(:second)

          case Repo.transact(fn repo ->
                 with {:ok, _s} <- UploaderStatus.ready(uploader, entity),
                      {:ok, entity_updated} <-
                        repo.update(
                          Ecto.Changeset.change(entity, %{
                            field => %{file_name: filename, updated_at: now}
                          })
                        ) do
                   {:ok, entity_updated}
                 end
               end) do
            {:ok, entity_updated} ->
              if old_filename do
                uploader.delete({old_filename, entity_updated})
              end

              {:ok, entity_updated}

            {:error, reason} ->
              case reason do
                %Ecto.Changeset{} ->
                  # Permanent like the entity was deleted
                  # Or the entity is in bad state and validation fails
                  UploaderStatus.fail(
                    uploader,
                    entity,
                    "DB update failed: #{inspect(reason.errors)}"
                  )

                  :discard

                _ ->
                  # Transient → oban will retry
                  {:error, reason}
              end
          end

        {:error, :waffle_hackney_error = reason} ->
          dbg(reason)
          # Probably transient → let Oban retry
          {:error, :waffle_hackney_error}

        {:error, reason} ->
          # Permanent → notify + discard
          UploaderStatus.fail(uploader, entity, "Upload failed: #{inspect(reason)}")
          :discard
      end
    rescue
      e ->
        reason = Exception.message(e)
        # Propagate the error to Oban for retries
        reraise e, __STACKTRACE__
    end
  end

  defp get_filename_from_key(key) do
    key
    |> URI.parse()
    |> Map.get(:path)
    |> Path.basename()
  end
end
