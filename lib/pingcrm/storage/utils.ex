defmodule Pingcrm.Storage.Utils do
  def validate_image(
        {file, options: [extensions: extensions, min_size: min_size, max_size: max_size]}
      ) do
    extension = file.file_name |> Path.extname() |> String.downcase()
    size = file_size(file)

    cond do
      extension not in extensions ->
        {:error, "invalid file type, allowed types are: #{Enum.join(extensions, ", ")}"}

      size < min_size ->
        {:error, "file size too small, minimum is #{format_mb(min_size)} MB"}

      size > max_size ->
        {:error, "file size too large, maximum is #{format_mb(max_size)} MB"}

      extension in [".jpg", ".jpeg"] && is_jpg?(file) ->
        :ok

      extension == ".png" && is_png?(file) ->
        :ok

      extension == ".webp" && is_webp?(file) ->
        :ok

      true ->
        {:error, "invalid file type or magic bytes"}
    end
  end

  defp format_mb(bytes) do
    # e.g. 100000 -> 0.1 MB, 6000000 -> 6.0 MB
    Float.round(bytes / 1_000_000, 1)
  end

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

  defp file_size(%Waffle.File{} = file) do
    File.stat!(file.path) |> Map.get(:size)
  end
end
