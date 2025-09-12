defmodule Pingcrm.Storage.ProcessUploadJob do
  use Oban.Worker, queue: :media, unique: [fields: [:args]]

  alias Pingcrm.{Repo, Uploaders}
  alias Pingcrm.Storage.DirectUploads.Resolver
  alias PingcrmWeb.Endpoint

  def enqueue(args), do: __MODULE__.new(args) |> Oban.insert()

  @impl true
  def perform(%Oban.Job{
        args: %{
          "uploader" => uploader_str,
          "entity_id" => entity_id,
          "key" => key,
          "old_file" => old_file
        }
      }) do
    {:ok, uploader} = Resolver.resolve(uploader_str)
    {:ok, entity} = uploader.load_entity(entity_id)

    ## 1. Get old field
    ## 2. Get filename from key
    ## 3. Fetch file from S3 bucket
    ## 4. Validate size and mimetype (load in Elixir memory) (try/catch errors)
    ## 5. Apply transformations (try/catch errors)
    ## 6. Store new file and variants
    ## 7. Update related uploads_state table to "ready"
    ## 8. Delete old file and variants (if any) (try/catch errors?)
    ## 9. Broadcast via websockets

    try do
      {:ok, entity}
    rescue
      e ->
        reason = Exception.message(e)
        # Propagate the error to Oban for retries
        reraise e, __STACKTRACE__
    end
  end
end
