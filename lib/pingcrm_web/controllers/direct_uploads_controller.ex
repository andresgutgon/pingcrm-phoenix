defmodule PingcrmWeb.DirectUploadsController do
  use PingcrmWeb, :controller

  alias Pingcrm.Storage.DirectUploads.{
    Signer,
    Resolver,
    Behaviour
  }

  alias Pingcrm.Storage.ProcessUploadJob

  def sign(conn, %{
        "uploader" => uploader_str,
        "entity_id" => entity_id,
        "filename" => filename,
        "content_type" => type
      }) do
    scope = conn.assigns.current_scope

    with {:ok, uploader} <- Resolver.resolve(uploader_str),
         {:ok, entity} <- uploader.load_entity(entity_id),
         :ok <- uploader.authorize(scope, entity) do
      # FIXME: Remove this shit. Convert user pk to uuid
      entity = %{entity | uuid: Integer.to_string(entity.id)}

      result =
        Signer.presign(uploader, :original,
          filename: filename,
          scope: uploader.scope(entity),
          query_params: [{"Content-Type", type}]
        )

      json(conn, result)
    else
      {:error, msg} ->
        conn |> put_status(:forbidden) |> json(%{error: msg})
    end
  end

  def store(conn, %{
        "uploader" => uploader_str,
        "entity_id" => entity_id,
        "key" => key
      }) do
    scope = conn.assigns.current_scope

    with {:ok, uploader} <- Resolver.resolve(uploader_str),
         {:ok, entity} <- uploader.load_entity(entity_id),
         :ok <- uploader.authorize(scope, entity),
         {:ok, {old_filename}} <- Behaviour.start_upload(uploader, entity) do
      # ProcessUploadJob.enqueue(%{
      #   "uploader" => uploader_str,
      #   "entity_id" => entity.id,
      #   "key" => key,
      #   "old_filename" => old_filename
      # })

      json(conn, %{ok: true})
    else
      {:error, msg} ->
        conn |> put_status(:forbidden) |> json(%{error: msg})
    end
  end
end
