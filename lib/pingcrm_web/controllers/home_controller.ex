defmodule PingcrmWeb.HomeController do
  use PingcrmWeb, :controller

  alias Pingcrm.Academy

  def index(conn, _params) do
    ssr = true

    conn
    |> assign_prop(:ssr, ssr)
    |> assign_prop(:nominations, nominations())
    |> render_inertia("HomePage", ssr: ssr)
  end

  def show(conn, %{"id" => id}) do
    nomination = Academy.get_nomination!(id) |> nomination()

    conn
    |> assign_prop(:nomination, nomination)
    |> render_inertia("NominationPage")
  end

  defp nominations() do
    Academy.list_nominations()
    |> Enum.map(fn db_nomination ->
      nomination(db_nomination)
    end)
  end

  defp nomination(n) do
    %{
      id: n.id,
      name: n.name,
      age: n.age,
      gender: n.gender,
      year: n.year,
      movie: n.movie,
      won: n.won
    }
  end
end
