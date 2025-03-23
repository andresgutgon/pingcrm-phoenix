defmodule PingcrmWeb.Layouts do
  @moduledoc """
  This module holds different layouts used by your application.

  See the `layouts` directory for all templates available.
  The "root" layout is a skeleton rendered as part of the
  application router. The "app" layout is set as the default
  layout on both `use PingcrmWeb, :controller` and
  `use PingcrmWeb, :live_view`.
  """
  use PingcrmWeb, :html

  embed_templates "layouts/*"
  def dev_env?, do: Application.get_env(:pingcrm, :env) == :dev
end
