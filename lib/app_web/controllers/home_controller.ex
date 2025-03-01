defmodule AppWeb.HomeController do
  use AppWeb, :controller

  def index(conn, _params) do
    conn
    |> assign_prop(:first_name, "Bob")
    |> render_inertia("HomePage", ssr: true)
  end
end
