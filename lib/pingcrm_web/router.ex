defmodule PingcrmWeb.Router do
  use PingcrmWeb, :router
  use Routes

  import PingcrmWeb.UserAuth

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {PingcrmWeb.Layouts, :root}
    plug :put_layout, html: {PingcrmWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug :fetch_current_scope_for_user
    plug Inertia.Plug
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", PingcrmWeb do
    pipe_through [:browser, :require_authenticated_user]

    get "/", DashboardController, :index, as: :dashboard
  end

  scope "/", PingcrmWeb do
    pipe_through [:browser]

    # Auth
    get "/login", UserSessionController, :new
    post "/login", UserSessionController, :create
    delete "/logout", UserSessionController, :delete
  end
end
