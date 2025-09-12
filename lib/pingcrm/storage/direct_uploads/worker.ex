defmodule Pingcrm.Storage.Worker do
  use Oban.Worker, queue: :media

  alias Pingcrm.Repo
  alias Pingcrm.Accounts.User
  alias Pingcrm.Uploaders.Avatar

  @impl Oban.Worker
  def perform(%Oban.Job{args: %{"user_id" => user_id}}) do
    user = Repo.get!(User, user_id)

    # Download original file from R2 (using Waffle)
    {:ok, path} = Avatar.download({user.avatar, user})

    # Run ImageMagick directly (no Mogrify needed)
    thumb_path = Path.rootname(path) <> "_thumb.png"

    {_, 0} =
      System.cmd("convert", [
        path,
        "-strip",
        "-thumbnail",
        "200x200^",
        "-gravity",
        "center",
        "-extent",
        "200x200",
        thumb_path
      ])

    # Upload thumb version back to storage (R2)
    {:ok, key} =
      Avatar.store(
        {%Waffle.File{path: thumb_path, file_name: Path.basename(thumb_path)}, user},
        :thumb
      )

    # Update DB (mark as ready, store variant key, etc.)
    Repo.update!(Ecto.Changeset.change(user, thumbnail_uploaded?: true))

    :ok
  end
end
