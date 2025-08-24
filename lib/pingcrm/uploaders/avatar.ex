defmodule Pingcrm.Uploaders.Avatar do
  use Waffle.Definition
  use Waffle.Ecto.Definition
  alias Pingcrm.Uploaders.Configuration

  @versions [:original, :thumb]

  @min_file_size 100_000
  @max_file_size 10_000_000
  @allowed_extensions ~w(.jpg .jpeg .png .webp)

  def validate({file, _}) do
    extension = file.file_name |> Path.extname() |> String.downcase()
    size = file_size(file)

    cond do
      extension not in @allowed_extensions ->
        {:error,
         "invalid file type, allowed types are: #{@allowed_extensions |> Enum.join(", ")}"}

      size < @min_file_size ->
        {:error, "file size too small, minimum is #{@min_file_size} bytes"}

      size > @max_file_size ->
        {:error, "file size too large, maximum is #{@max_file_size} bytes"}

      (extension == ".jpg" || extension == ".jpeg") && is_jpg?(file) ->
        :ok

      extension == ".png" && is_png?(file) ->
        :ok

      extension == ".webp" && is_webp?(file) ->
        :ok

      true ->
        {:error, "invalid file type or magic bytes"}
    end
  end

  def transform(:thumb, _) do
    {:convert, "-strip -thumbnail 200x200^ -gravity center -extent 200x200 -format png", :png}
  end

  # Override the persisted filenames:
  # def filename(version, _) do
  #   version
  # end

  def storage_dir(version, {_file, scope}) do
    Configuration.build_storage_dir("users/#{scope.id}/avatars/#{version}")
  end

  # Specify custom headers for s3 objects
  # Available options are [:cache_control, :content_disposition,
  #    :content_encoding, :content_length, :content_type,
  #    :expect, :expires, :storage_class, :website_redirect_location]
  #
  # def s3_object_headers(version, {file, scope}) do
  #   [content_type: MIME.from_path(file.file_name)]
  # end

  ## JPG magic bytes: 0xffd8
  defp is_jpg?(%Waffle.File{} = file) do
    with {:ok, file_content} <- :file.open(file.path, [:read, :binary]),
         {:ok, <<255, 216>>} <- :file.read(file_content, 2) do
      true
    else
      _error ->
        false
    end
  end

  ## PNG magic bytes: 0x89504e470d0a1a0a
  defp is_png?(%Waffle.File{} = file) do
    with {:ok, file_content} <- :file.open(file.path, [:read, :binary]),
         {:ok, <<137, 80, 78, 71, 13, 10, 26, 10>>} <- :file.read(file_content, 8) do
      true
    else
      _error ->
        false
    end
  end

  # WebP magic bytes: 0x52494646 (RIFF) followed by 0x57454250 (WEBP)
  defp is_webp?(%Waffle.File{} = file) do
    with {:ok, file_content} <- :file.open(file.path, [:read, :binary]),
         {:ok, <<82, 73, 70, 70, _::binary-size(4), 87, 69, 66, 80>>} <-
           :file.read(file_content, 12) do
      true
    else
      _error ->
        false
    end
  end

  def file_size(%Waffle.File{} = file) do
    File.stat!(file.path) |> Map.get(:size)
  end
end
