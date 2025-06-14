defmodule PingcrmWeb.Router do
  use PingcrmWeb, :router
  use Wayfinder.PhoenixRouter

  # For running profiling on Wayfinder
  # @fake_controllers_count 100
  # Gen fake controlers
  # docker compose run web mix generate_fake_controllers.task 1000

  # Profile Wayfinder
  # docker compose run web mix profile.task wayfinder.generate

  # Uncomment to enable fake controllers
  # @compile {:no_warn_undefined,
  #           for i <- 1..@fake_controllers_count do
  #             Module.concat(PingcrmWeb.FakeControllers, :"FakeController#{i}")
  #           end}

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

  # Explanation on top
  # scope "/fake" do
  #   for i <- 1..@fake_controllers_count do
  #     controller = Module.concat(PingcrmWeb.FakeControllers, :"FakeController#{i}")
  #     resources("/fake-controller-#{i}", controller)
  #   end
  # end
end
