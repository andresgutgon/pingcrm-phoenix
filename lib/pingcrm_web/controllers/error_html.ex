defmodule PingcrmWeb.ErrorHTML do
  @moduledoc false

  @titles %{
    503 => "503: Service Unavailable",
    500 => "500: Server Error",
    404 => "404: Page Not Found my friend",
    403 => "403: Forbidden"
  }

  @descriptions %{
    503 => "Sorry, we are doing some maintenance. Please check back soon.",
    500 => "Whoops, something went wrong on our servers.",
    404 => "Sorry, the page you are looking for could not be found.",
    403 => "Sorry, you are forbidden from accessing this page."
  }

  use PingcrmWeb, :html

  def render(_template, %{conn: conn} = assigns) do
    status = Map.get(assigns, :status) || Plug.Exception.status(conn.reason)
    meta = meta_for(status)

    {:ok, %{"body" => body, "head" => head}} =
      Inertia.SSR.call(%{
        component: "ErrorPage",
        props: %{
          status: status,
          title: meta.title,
          description: meta.description,
          ssr: true
        },
        url: request_path(conn.request_path, conn.query_string),
        version: "1",
        encryptHistory: false,
        clearHistory: false
      })

    Phoenix.HTML.raw(
      Phoenix.Template.render_to_iodata(
        PingcrmWeb.Layouts,
        "root",
        "html",
        %{
          conn: conn,
          inner_content: Phoenix.HTML.raw(body),
          inertia_head: head,
          page_title: meta.title
        }
      )
    )
  end

  defp meta_for(status) when is_integer(status) do
    %{
      title: Map.get(@titles, status, "#{status}: Unknown Error"),
      description: Map.get(@descriptions, status, "An unexpected error occurred.")
    }
  end

  # Extracted from Inertia.Controller
  defp request_path(path, qs) do
    IO.iodata_to_binary([path, request_url_qs(qs)])
  end

  defp request_url_qs(""), do: ""
  defp request_url_qs(qs), do: [??, qs]
end
