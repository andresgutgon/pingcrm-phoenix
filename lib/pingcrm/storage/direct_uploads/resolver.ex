defmodule Pingcrm.Storage.DirectUploads.Resolver do
  def resolve(uploader_str) do
    module =
      uploader_str
      |> Macro.camelize()
      |> then(&Module.concat([Pingcrm.Uploaders, &1]))

    cond do
      not Code.ensure_loaded?(module) ->
        {:error, "Unknown uploader: #{uploader_str}"}

      not implements_direct_uploader?(module) ->
        {:error, "Uploader #{uploader_str} does not support direct uploads"}

      true ->
        {:ok, module}
    end
  end

  defp implements_direct_uploader?(module) do
    Pingcrm.Storage.DirectUploads.Behaviour in (module.module_info(:attributes)[:behaviour] || [])
  end
end
