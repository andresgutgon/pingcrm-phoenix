defmodule Pingcrm.Uploaders.Avatar do
  use Waffle.Definition
  use Waffle.Ecto.Definition

  alias Pingcrm.Repo
  alias Pingcrm.Accounts.{User, Scope}
  alias Pingcrm.Storage.Utils

  use Pingcrm.Storage.DirectUploads.Behaviour
  alias Pingcrm.Uploaders.Avatar

  @impl true
  def scope(%User{uuid: uuid}), do: %{uuid: uuid}

  @impl true
  def field, do: :avatar

  @impl true
  def entity_pk, do: :uuid

  @impl true
  def get_filename(%User{avatar: avatar}), do: avatar.file_name
  def get_filename(_), do: nil

  @impl true
  def load_entity(id) do
    case Repo.get(User, id) do
      nil ->
        {:error, "User not found"}

      user ->
        # FIXME: Remove this shit. Convert user pk to uuid
        user = %{user | uuid: Integer.to_string(user.id)}
        {:ok, user}
    end
  end

  @impl true
  def authorize(%Scope{user: current}, %User{id: user_id}) do
    if current.id == user_id do
      :ok
    else
      {:error, "You can't update another user's avatar"}
    end
  end

  @impl true
  def updated_entity_data(user) do
    %{
      avatar:
        Avatar.url(
          {user.avatar, user},
          :thumb,
          signed: true,
          expires_in: 86_400
        ),
      avatar_medium:
        Avatar.url(
          {user.avatar, user},
          :medium,
          signed: true,
          expires_in: 86_400
        )
    }
  end

  # Waffle configuration
  @versions [:original, :thumb, :medium]

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

  def transform(:medium, _) do
    {:convert, "-strip -thumbnail 200x200^ -gravity center -extent 200x200 -format png", :png}
  end

  def transform(:thumb, _) do
    {:convert, "-strip -thumbnail 50x50^ -gravity center -extent 50x50 -format png", :png}
  end

  def s3_object_headers(_version, {file, _scope}) do
    [
      cache_control: "public, max-age=31536000",
      content_type: MIME.from_path(file.file_name)
    ]
  end
end
