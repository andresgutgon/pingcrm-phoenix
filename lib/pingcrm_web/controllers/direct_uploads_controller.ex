defmodule PingcrmWeb.DirectUploadsController do
  use PingcrmWeb, :controller
  alias Pingcrm.Storage.DirectUploads.{Signer, Resolver}

  def sign(conn, %{"uploader" => uploader_str, "filename" => filename, "content_type" => type}) do
    scope = conn.assigns.current_scope

    with {:ok, uploader} <- Resolver.resolve(uploader_str),
         :ok <- uploader.authorize(scope) do
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
end
