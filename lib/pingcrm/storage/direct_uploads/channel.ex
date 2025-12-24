defmodule Pingcrm.Storage.DirectUploads.Channel do
  use Phoenix.Channel

  def topic_prefix, do: "storage:direct_upload"
  def all_topics, do: topic_prefix() <> ":*"

  @impl true
  def join("storage:direct_upload:" <> rest, _params, socket) do
    {:ok, socket}
  end
end
