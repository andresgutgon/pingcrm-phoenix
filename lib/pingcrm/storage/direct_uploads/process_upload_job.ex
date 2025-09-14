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

    filename = get_filename_from_key(key)

    # FIXME: This signing URL does not work.
    # Region `auto` fails inside the worker. But works in the browser?
    # Also anyway if this is a HUUUUGE file it will timeout.
    # TODO: Implement with ex_aws or maybe waffle expose `.get`
    url =
      uploader.url(
        {filename, uploader.scope(entity)},
        :original,
        signed: true,
        expires_in: 60
      )

    try do
      case get_file(uploader, filename, entity) do
        {:ok, tmp_path} ->
          dbg("Temp path: #{inspect(tmp_path)}")

          case uploader.store({tmp_path, uploader.scope(entity)}) do
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

                  File.rm(tmp_path)

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

        {:error, reason, tmp_path} ->
          File.rm(tmp_path)
          {:error, reason}
      end
    rescue
      e ->
        reason = Exception.message(e)
        # Propagate the error to Oban for retries
        reraise e, __STACKTRACE__
    end
  end

  defp get_file(uploader, filename, entity) do
    s3_bucket = uploader.bucket()

    destination_dir =
      uploader.storage_dir(
        :original,
        {filename, uploader.scope(entity)}
      )

    s3_key = Path.join(destination_dir, filename)

    tmp_path = Path.join([System.tmp_dir!(), filename])

    # {:ok, %{headers: headers}} =
    #   ExAws.S3.head_object(s3_bucket, s3_key)
    #   |> ExAws.request()
    #
    # meta = headers |> Enum.into(%{})
    #
    # size = String.to_integer(meta["content-length"])
    # mimetype = meta["content-type"]
    #
    # dbg(size, label: "File size (bytes)")
    # dbg(mimetype, label: "MIME type")

    case ExAws.S3.download_file(s3_bucket, s3_key, tmp_path) |> ExAws.request() do
      {:ok, _} -> {:ok, tmp_path}
      {:error, reason} -> {:error, reason, tmp_path}
    end
  end

  defp get_filename_from_key(key) do
    key
    |> URI.parse()
    |> Map.get(:path)
    |> Path.basename()
  end
end
