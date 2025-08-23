defmodule Pingcrm.Uploaders.Avatar do
  use Waffle.Definition
  use Waffle.Ecto.Definition
  alias Pingcrm.Storage.Utils
  alias Pingcrm.Accounts.Scope

  @behaviour Pingcrm.Storage.DirectUploads.Behaviour
  @versions [:original, :thumb]

  @impl true
  def authorize(%Scope{}), do: :ok

  @impl true
  def scope(%Scope{user: %{uuid: uuid}}), do: %{uuid: uuid}

  def storage_dir(version, {_file, scope}) do
    "users/#{scope.uuid}/avatars/#{version}"
  end

  def validate({file, _}) do
    Utils.validate_image(
      {file,
       options: [
         extensions: ~w(.jpg .jpeg .png .webp),
         min_size: 100_000,
         max_size: 4_000_000
       ]}
    )
  end

  def transform(:thumb, _) do
    {:convert, "-strip -thumbnail 200x200^ -gravity center -extent 200x200 -format png", :png}
  end

  # Not working on development. Maybe with a real assets host in production
  # In development image is never cached because signed url is different each time (time parameter change)
  def s3_object_headers(_version, {file, _scope}) do
    [cache_control: "public, max-age=31536000", content_type: MIME.from_path(file.file_name)]
  end
end
