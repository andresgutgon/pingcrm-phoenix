defmodule PingcrmWeb.DirectUploadsController do
  use PingcrmWeb, :controller
  alias Pingcrm.Storage.DirectUploads.{Signer, Resolver}

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
         {:ok, entity} <- uploader.persist(entity, key) do
      # enqueue a job for async variant generation
      # %{id: entity.id}
      # |> Map.put("uploader", uploader_str)
      # |> Map.put("key", key)
      # |> GenerateVariants.new()
      # |> Oban.insert!()

      json(conn, %{ok: true})
    else
      {:error, msg} ->
        conn |> put_status(:forbidden) |> json(%{error: msg})
    end
  end
end
