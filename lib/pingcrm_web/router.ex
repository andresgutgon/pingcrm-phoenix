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
    plug :put_layout, false
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug :fetch_scope
    plug Inertia.Plug
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", PingcrmWeb do
    pipe_through [:browser, :require_confirmed_user]

    get "/", DashboardController, :index, as: :home
    get "/profile", ProfileController, :show, as: :my_profile
    patch "/profile/password", ProfileController, :update_password

    # TODO: Implement for real
    get "/organizations", DashboardController, :index, as: :organizations
    get "/contacts", DashboardController, :index, as: :contacts
    get "/reports", DashboardController, :index, as: :reports

    delete "/logout", Auth.SessionsController, :delete
  end

  scope "/", PingcrmWeb.Auth do
    pipe_through [:browser, :redirect_if_user_is_authenticated]

    get "/login", SessionsController, :new, as: :login
    post "/login", SessionsController, :create

    get "/signup", SignupsController, :new, as: :signup
    post "/signup", SignupsController, :create, as: :signup_create

    get "/reset_password", ResetPasswordController, :new, as: :forgot_password

    post "/reset_password", ResetPasswordController, :create,
      as: :send_reset_password_instructions

    get "/reset_password/:token", ResetPasswordController, :edit
    put "/reset_password/:token", ResetPasswordController, :update
  end

  scope "/", PingcrmWeb.Auth do
    pipe_through [:browser]

    get "/confirmation-sent", ConfirmationsController, :confirmation_sent
    get "/confirm", ConfirmationsController, :new
    post "/confirm", ConfirmationsController, :create, as: :resend_confirmation
    get "/confirm/:token", ConfirmationsController, :edit
    post "/confirm/:token", ConfirmationsController, :confirm_user
  end

  # Explanation on top
  # scope "/fake" do
  #   for i <- 1..@fake_controllers_count do
  #     controller = Module.concat(PingcrmWeb.FakeControllers, :"FakeController#{i}")
  #     resources("/fake-controller-#{i}", controller)
  #   end
  # end
end
