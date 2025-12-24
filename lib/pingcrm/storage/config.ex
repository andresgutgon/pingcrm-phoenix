defmodule Pingcrm.Storage.Config do
  @moduledoc """
  Configuration for file uploads in Pingcrm.

  Storage type is determined by the STORAGE_TYPE environment variable:

  - "cloudflare_r2": Files are stored in an S3-compatible storage (requires
    CLOUDFLARE_ACCOUNT_ID, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_REGION)
  - "disk": Files are stored locally (default)
  """

  @uploads_dir "uploads"

  @doc """
  Returns the public path for accessing uploaded files.
  Defaults to "/uploads".
  Only used for local disk storage.
  """
  def storage_path do
    "/#{@uploads_dir}"
  end

  @doc """
  Returns the root directory for file storage.
  Defaults to "priv/uploads" within the application directory,
  but can be overridden by the UPLOADS_DIR environment variable.
  Only used for local disk storage.
  """
  def storage_root do
    case System.get_env("UPLOADS_DIR") do
      nil -> Path.join(:code.priv_dir(:pingcrm), @uploads_dir)
      dir -> Path.expand(dir)
    end
  end

  def disk? do
    System.get_env("STORAGE_TYPE", "disk") == "disk"
  end

  @doc """
  Configures the uploaders based on the STORAGE_TYPE environment variable.
  Returns a keyword list with the configuration for Waffle and ExAws.

  STORAGE_TYPE values:
  - "cloudflare_r2": Use R2 (S3-compatible)
  - "disk": Use local disk storage (default)

  In production mode, ASSETS_HOST is mandatory.
  """
  def configure(opts \\ []) do
    storage_type = System.get_env("STORAGE_TYPE", "disk")
    test_dev_mode = Keyword.get(opts, :test_dev_mode, false)
    prod_mode = Keyword.get(opts, :prod_mode, false)
    assets_host = build_assets_host(storage_type, prod_mode)

    case storage_type do
      "cloudflare_r2" ->
        env = get_cloudflare_env()

        [
          waffle: [
            storage: Waffle.Storage.S3,
            bucket: env[:S3_BUCKET],
            asset_host: "https://#{assets_host}"
          ],
          ex_aws: [
            access_key_id: env[:S3_ACCESS_KEY_ID],
            secret_access_key: env[:S3_SECRET_ACCESS_KEY],
            region: "auto",
            s3: [
              scheme: "https://",
              host: assets_host,
              region: "auto",
              path_style: true
            ]
          ]
        ]

      "disk" ->
        [
          waffle: [
            storage: Waffle.Storage.Local,
            storage_dir_prefix: storage_root(),
            asset_host:
              if test_dev_mode and System.get_env("CI") == "true" do
                "http://assets.example.test/#{@uploads_dir}"
              else
                assets_host
              end
          ]
        ]

      _ ->
        raise """
        Invalid STORAGE_TYPE: #{storage_type}
        Valid values are: "cloudflare_r2", "disk"
        """
    end
  end

  defp build_assets_host(storage, prod_mode) do
    cond do
      storage == "disk" and prod_mode ->
        System.get_env("ASSETS_HOST") ||
          raise "ASSETS_HOST is required when storage=disk in production"

      storage == "cloudflare_r2" ->
        case {System.get_env("ASSETS_HOST"), System.get_env("CLOUDFLARE_ACCOUNT_ID")} do
          {host, _} when is_binary(host) and host != "" ->
            host

          {_, account_id} when is_binary(account_id) and account_id != "" ->
            "#{account_id}.r2.cloudflarestorage.com"

          _ ->
            raise """
            Missing asset host configuration.
            Please set ASSETS_HOST (for custom domain)
            or CLOUDFLARE_ACCOUNT_ID (to default to r2.cloudflarestorage.com).
            """
        end

      # disk + dev/test → local fallback
      true ->
        scheme = System.get_env("PHX_SCHEME", "http")
        host = System.get_env("PHX_HOST", "localhost")
        port = System.get_env("PORT", "4004")
        default_assets_host = "#{scheme}://#{host}:#{port}/#{@uploads_dir}"

        System.get_env("ASSETS_HOST") || default_assets_host
    end
  end

  defp get_cloudflare_env do
    required_vars = [
      "CLOUDFLARE_ACCOUNT_ID",
      "S3_BUCKET",
      "S3_ACCESS_KEY_ID",
      "S3_SECRET_ACCESS_KEY",
      "S3_REGION"
    ]

    missing_vars = Enum.filter(required_vars, &is_nil(System.get_env(&1)))

    unless Enum.empty?(missing_vars) do
      required_vars_list =
        Enum.map(required_vars, &"- #{&1}")
        |> Enum.join("\n      ")

      raise """
      STORAGE_TYPE is set to "cloudflare_r2" but the following required
      environment variables are missing:
      #{Enum.join(missing_vars, ", ")}

      Required environment variables:
      #{required_vars_list}
      """
    end

    for var <- required_vars, into: %{} do
      {String.to_atom(var), System.get_env(var)}
    end
  end
end
