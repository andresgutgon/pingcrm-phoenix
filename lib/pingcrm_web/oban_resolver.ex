defmodule PingcrmWeb.ObanResolver do
  use PingcrmWeb, :verified_routes
  @behaviour Oban.Web.Resolver

  @impl true
  def resolve_user(conn) do
    conn.assigns.current_scope.user
  end

  @impl true
  def resolve_access(user) do
    case user do
      %{admin?: true} -> :all
      %{staff?: true} -> :read_only
      _ -> {:forbidden, ~p"/login"}
    end
  end
end
