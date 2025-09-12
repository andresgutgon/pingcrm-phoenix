defmodule PingcrmWeb.DirectUploadsController do
  use PingcrmWeb, :controller

  alias Pingcrm.Storage.DirectUploads.{
    Signer,
    Resolver,
    Behaviour,
    ProcessUploadJob
  }

  def sign(conn, %{
        "uploader" => uploader_str,
        "entity_id" => entity_id,
        "filename" => filename,
        "content_type" => type
      }) do
    scope = conn.assigns.current_scope

    with {:ok, uploader} <- Resolver.resolve(uploader_str),
         {:ok, user} <- uploader.load_entity(entity_id),
         :ok <- uploader.authorize(scope, user) do
      result =
        Signer.presign(uploader, :original,
          filename: filename,
          scope: uploader.scope(scope),
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
         {:ok, {entity, old_file}} <- Behaviour.persist(uploader, entity, key) do

      # ProcessUploadJob.enqueue(%{
      #   "uploader" => uploader_str,
      #   "entity_id" => entity.id,
      #   "key" => key,
      #   "old_file" => old_file
      # })

      json(conn, %{ok: true})
    else
      {:error, msg} ->
        conn |> put_status(:forbidden) |> json(%{error: msg})
    end
  end
end
