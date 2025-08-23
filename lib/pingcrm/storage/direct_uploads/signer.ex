defmodule Pingcrm.Storage.DirectUploads.Signer do
  alias ExAws.S3
  alias ExAws.Config
  alias Waffle.Storage.S3, as: WaffleS3

  @doc """
  Generate a signed URL for direct upload.

  Required opts:
    * `:filename` - original file name
    * `:scope`    - uploader scope (e.g. %{uuid: ...})

  Example:
      Signer.presign(MyUploader, :original,
        filename: "avatar.png",
        scope: %{uuid: "123"},
        query_params: [{"Content-Type", "image/png"}]
      )
  """
  def presign(uploader, version, opts) when is_list(opts) do
    filename = Keyword.fetch!(opts, :filename)
    scope = Keyword.fetch!(opts, :scope)

    file_and_scope = {%{file_name: filename}, scope}

    config = Config.new(:s3, Application.get_all_env(:ex_aws))
    key = WaffleS3.s3_key(uploader, version, file_and_scope)
    bucket = uploader.bucket(file_and_scope)

    {:ok, url} = S3.presigned_url(config, :put, bucket, key, opts)
    %{url: url, key: key}
  end
end
