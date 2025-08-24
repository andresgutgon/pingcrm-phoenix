defmodule Pingcrm.Uploaders.Configuration do
  @moduledoc """
  Configuration for file uploads in Pingcrm.
  In production, files are stored in an S3 bucket compatible storage.
  In development and test environments, files are stored locally.
  """

  @doc """
  Configures the uploaders based on the environment.
  This function checks the environment and sets the appropriate storage
  configuration for Waffle and ExAws.
  It uses the `prod_mode` and `test_dev_mode` flags to determine the environment.
  It returns a keyword list with the configuration for Waffle and ExAws.
  """
  def configure do
    prod_mode = Application.get_env(:pingcrm, :prod_mode)
    test_dev_mode = Application.get_env(:pingcrm, :test_dev_mode) || false

    scheme = System.get_env("PHX_SCHEME", "http")
    host = System.get_env("PHX_HOST", "localhost")
    port = String.to_integer(System.get_env("PORT", "4004"))
    assets_host = System.get_env("ASSETS_HOST") || "#{scheme}://#{host}:#{port}/uploads"

    IO.puts("Assets host: #{assets_host}")

    cond do
      prod_mode ->
        [
          waffle: [
            storage: Waffle.Storage.S3,
            bucket: System.fetch_env!("S3_BUCKET"),
            asset_host: assets_host
          ],
          ex_aws: [
            access_key_id: System.fetch_env!("S3_ACCESS_KEY_ID"),
            secret_access_key: System.fetch_env!("S3_SECRET_ACCESS_KEY"),
            region: System.get_env("S3_REGION", "us-east-1")
          ]
        ]

      true ->
        [
          waffle: [
            storage: Waffle.Storage.Local,
            asset_host:
              if test_dev_mode and System.get_env("CI") == "true" do
                "http://assets.example.test"
              else
                assets_host
              end
          ]
        ]
    end
  end
end
