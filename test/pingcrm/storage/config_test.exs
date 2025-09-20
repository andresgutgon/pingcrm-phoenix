defmodule Pingcrm.Storage.Config do
  use ExUnit.Case, async: false
  alias Pingcrm.Storage.Config

  describe "configure/1" do
    setup do
      # Save original environment variables
      original_storage_type = System.get_env("STORAGE_TYPE")
      original_s3_bucket = System.get_env("S3_BUCKET")
      original_s3_access_key = System.get_env("S3_ACCESS_KEY_ID")
      original_s3_secret_key = System.get_env("S3_SECRET_ACCESS_KEY")
      original_s3_region = System.get_env("S3_REGION")
      original_assets_host = System.get_env("ASSETS_HOST")

      on_exit(fn ->
        # Restore original environment variables
        restore_env("STORAGE_TYPE", original_storage_type)
        restore_env("S3_BUCKET", original_s3_bucket)
        restore_env("S3_ACCESS_KEY_ID", original_s3_access_key)
        restore_env("S3_SECRET_ACCESS_KEY", original_s3_secret_key)
        restore_env("S3_REGION", original_s3_region)
        restore_env("ASSETS_HOST", original_assets_host)
      end)

      :ok
    end

    test "defaults to disk storage when STORAGE_TYPE is not set" do
      System.delete_env("STORAGE_TYPE")

      config = Config.configure(prod_mode: false)

      assert config[:waffle][:storage] == Waffle.Storage.Local
      assert String.contains?(config[:waffle][:storage_dir_prefix], "uploads")
      assert config[:waffle][:asset_host] =~ "localhost"
      refute Keyword.has_key?(config, :ex_aws)
    end

    test "uses disk storage when STORAGE_TYPE is 'disk'" do
      System.put_env("STORAGE_TYPE", "disk")

      config = Config.configure(prod_mode: false)

      assert config[:waffle][:storage] == Waffle.Storage.Local
      assert String.contains?(config[:waffle][:storage_dir_prefix], "uploads")
      assert config[:waffle][:asset_host] =~ "localhost"
      refute Keyword.has_key?(config, :ex_aws)
    end

    test "uses S3 storage when STORAGE_TYPE is 's3' and all required env vars are present" do
      System.put_env("STORAGE_TYPE", "s3")
      System.put_env("S3_BUCKET", "test-bucket")
      System.put_env("S3_ACCESS_KEY_ID", "test-access-key")
      System.put_env("S3_SECRET_ACCESS_KEY", "test-secret-key")
      System.put_env("S3_REGION", "us-west-2")

      config = Config.configure(prod_mode: false)

      assert config[:waffle][:storage] == Waffle.Storage.S3
      assert config[:waffle][:bucket] == "test-bucket"
      assert config[:waffle][:asset_host] =~ "localhost"

      assert config[:ex_aws][:access_key_id] == "test-access-key"
      assert config[:ex_aws][:secret_access_key] == "test-secret-key"
      assert config[:ex_aws][:region] == "us-west-2"
    end

    test "uses custom S3 region when S3_REGION is set" do
      System.put_env("STORAGE_TYPE", "s3")
      System.put_env("S3_BUCKET", "test-bucket")
      System.put_env("S3_ACCESS_KEY_ID", "test-access-key")
      System.put_env("S3_SECRET_ACCESS_KEY", "test-secret-key")
      System.put_env("S3_REGION", "eu-west-1")

      config = Config.configure(prod_mode: false)

      assert config[:ex_aws][:region] == "eu-west-1"
    end

    test "raises error when STORAGE_TYPE is 's3' but S3_REGION is missing" do
      System.put_env("STORAGE_TYPE", "s3")
      System.put_env("S3_BUCKET", "test-bucket")
      System.put_env("S3_ACCESS_KEY_ID", "test-access-key")
      System.put_env("S3_SECRET_ACCESS_KEY", "test-secret-key")
      System.delete_env("S3_REGION")

      assert_raise RuntimeError, ~r/S3_REGION/, fn ->
        Config.configure(prod_mode: false)
      end
    end

    test "raises error when STORAGE_TYPE is 's3' but S3_BUCKET is missing" do
      System.put_env("STORAGE_TYPE", "s3")
      System.delete_env("S3_BUCKET")
      System.put_env("S3_ACCESS_KEY_ID", "test-access-key")
      System.put_env("S3_SECRET_ACCESS_KEY", "test-secret-key")
      System.put_env("S3_REGION", "us-west-2")

      assert_raise RuntimeError, ~r/S3_BUCKET/, fn ->
        Config.configure(prod_mode: false)
      end
    end

    test "raises error when STORAGE_TYPE is 's3' but S3_ACCESS_KEY_ID is missing" do
      System.put_env("STORAGE_TYPE", "s3")
      System.put_env("S3_BUCKET", "test-bucket")
      System.delete_env("S3_ACCESS_KEY_ID")
      System.put_env("S3_SECRET_ACCESS_KEY", "test-secret-key")
      System.put_env("S3_REGION", "us-west-2")

      assert_raise RuntimeError, ~r/S3_ACCESS_KEY_ID/, fn ->
        Config.configure(prod_mode: false)
      end
    end

    test "raises error when STORAGE_TYPE is 's3' but S3_SECRET_ACCESS_KEY is missing" do
      System.put_env("STORAGE_TYPE", "s3")
      System.put_env("S3_BUCKET", "test-bucket")
      System.put_env("S3_ACCESS_KEY_ID", "test-access-key")
      System.delete_env("S3_SECRET_ACCESS_KEY")
      System.put_env("S3_REGION", "us-west-2")

      assert_raise RuntimeError, ~r/S3_SECRET_ACCESS_KEY/, fn ->
        Config.configure(prod_mode: false)
      end
    end

    test "raises error when STORAGE_TYPE is 's3' but multiple required env vars are missing" do
      System.put_env("STORAGE_TYPE", "s3")
      System.delete_env("S3_BUCKET")
      System.delete_env("S3_ACCESS_KEY_ID")
      System.put_env("S3_SECRET_ACCESS_KEY", "test-secret-key")
      System.put_env("S3_REGION", "us-west-2")

      assert_raise RuntimeError, fn ->
        Config.configure(prod_mode: false)
      end
    end

    test "returns correct S3 configuration with all required environment variables" do
      System.put_env("STORAGE_TYPE", "s3")
      System.put_env("S3_BUCKET", "my-test-bucket")
      System.put_env("S3_ACCESS_KEY_ID", "AKIA123456789")
      System.put_env("S3_SECRET_ACCESS_KEY", "secret123")
      System.put_env("S3_REGION", "eu-central-1")

      config = Config.configure(prod_mode: false)

      # Waffle configuration
      assert config[:waffle][:storage] == Waffle.Storage.S3
      assert config[:waffle][:bucket] == "my-test-bucket"
      assert config[:waffle][:asset_host] =~ "localhost"

      # ExAws configuration
      assert config[:ex_aws][:access_key_id] == "AKIA123456789"
      assert config[:ex_aws][:secret_access_key] == "secret123"
      assert config[:ex_aws][:region] == "eu-central-1"
    end

    test "returns correct disk configuration" do
      System.put_env("STORAGE_TYPE", "disk")

      config = Config.configure(prod_mode: false)

      # Waffle configuration
      assert config[:waffle][:storage] == Waffle.Storage.Local
      assert String.contains?(config[:waffle][:storage_dir_prefix], "uploads")
      assert config[:waffle][:asset_host] =~ "localhost"

      # No ExAws configuration for disk storage
      refute Keyword.has_key?(config, :ex_aws)
    end

    test "returns correct configuration with production mode and custom assets host" do
      System.put_env("STORAGE_TYPE", "s3")
      System.put_env("S3_BUCKET", "prod-bucket")
      System.put_env("S3_ACCESS_KEY_ID", "prod-key")
      System.put_env("S3_SECRET_ACCESS_KEY", "prod-secret")
      System.put_env("S3_REGION", "us-east-1")
      System.put_env("ASSETS_HOST", "https://cdn.myapp.com/uploads")

      config = Config.configure(prod_mode: true)

      # Waffle configuration
      assert config[:waffle][:storage] == Waffle.Storage.S3
      assert config[:waffle][:bucket] == "prod-bucket"
      assert config[:waffle][:asset_host] == "https://cdn.myapp.com/uploads"

      # ExAws configuration
      assert config[:ex_aws][:access_key_id] == "prod-key"
      assert config[:ex_aws][:secret_access_key] == "prod-secret"
      assert config[:ex_aws][:region] == "us-east-1"
    end

    test "raises error for invalid STORAGE_TYPE" do
      System.put_env("STORAGE_TYPE", "invalid")

      assert_raise RuntimeError, ~r/Invalid STORAGE_TYPE: invalid/, fn ->
        Config.configure(prod_mode: false)
      end
    end

    test "handles custom asset host configuration in non-production" do
      System.put_env("STORAGE_TYPE", "disk")
      System.put_env("ASSETS_HOST", "https://cdn.example.com/uploads")

      config = Config.configure(prod_mode: false)

      assert config[:waffle][:asset_host] == "https://cdn.example.com/uploads"
    end

    test "requires ASSETS_HOST in production mode" do
      System.put_env("STORAGE_TYPE", "disk")
      System.delete_env("ASSETS_HOST")

      assert_raise RuntimeError, ~r/ASSETS_HOST/, fn ->
        Config.configure(prod_mode: true)
      end
    end

    test "uses ASSETS_HOST in production mode when provided" do
      System.put_env("STORAGE_TYPE", "disk")
      System.put_env("ASSETS_HOST", "https://cdn.production.com/uploads")

      config = Config.configure(prod_mode: true)

      assert config[:waffle][:asset_host] == "https://cdn.production.com/uploads"
    end

    test "requires ASSETS_HOST in production mode with S3 storage" do
      System.put_env("STORAGE_TYPE", "s3")
      System.put_env("S3_BUCKET", "test-bucket")
      System.put_env("S3_ACCESS_KEY_ID", "test-access-key")
      System.put_env("S3_SECRET_ACCESS_KEY", "test-secret-key")
      System.put_env("S3_REGION", "us-west-2")
      System.delete_env("ASSETS_HOST")

      assert_raise RuntimeError, ~r/ASSETS_HOST/, fn ->
        Config.configure(prod_mode: true)
      end
    end

    test "handles test_dev_mode with CI environment" do
      System.put_env("STORAGE_TYPE", "disk")
      System.put_env("CI", "true")

      config = Config.configure(prod_mode: false, test_dev_mode: true)

      assert config[:waffle][:asset_host] == "http://assets.example.test/uploads"

      System.delete_env("CI")
    end
  end

  describe "storage_path/0" do
    test "returns the uploads path" do
      assert Config.storage_path() == "/uploads"
    end
  end

  describe "storage_root/0" do
    test "returns the uploads directory path" do
      root = Config.storage_root()
      assert String.ends_with?(root, "uploads")
    end
  end

  # Helper function to restore environment variables
  defp restore_env(key, nil), do: System.delete_env(key)
  defp restore_env(key, value), do: System.put_env(key, value)
end
