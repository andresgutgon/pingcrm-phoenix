defmodule PingcrmWeb.Router do
  use PingcrmWeb, :router
  use Wayfinder.PhoenixRouter, otp_app: :pingcrm

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

    get "/", DashboardController, :index, as: :home

    # TODO: Implement for real
    get "/organizations", DashboardController, :index, as: :organizations
    get "/contacts", DashboardController, :index, as: :contacts
    get "/reports", DashboardController, :index, as: :reports
  end

  scope "/", PingcrmWeb do
    pipe_through [:browser]

    # Auth
    get "/login", UserSessionController, :new, as: :login
    post "/login", UserSessionController, :create
    delete "/logout", UserSessionController, :delete
  end
end
