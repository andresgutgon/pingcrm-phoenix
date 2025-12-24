defmodule PingcrmWeb.Router do
  import PingcrmWeb.UserAuth

  alias PingcrmWeb.Plugs.Host
  use PingcrmWeb, :router
  use Wayfinder.PhoenixRouter

  import Oban.Web.Router

  @main_domain Application.compile_env!(:pingcrm, PingcrmWeb)[:main_domain]
  @app_domain Application.compile_env!(:pingcrm, PingcrmWeb)[:app_domain]

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
    plug Host
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", PingcrmWeb, host: @main_domain do
    pipe_through [:browser]
    get "/", HomeController, :show, as: :public_home
  end

  scope "/", PingcrmWeb.Auth, host: @app_domain do
    pipe_through [:browser]

    get "/confirmation-sent", ConfirmationsController, :confirmation_sent
    get "/confirm", ConfirmationsController, :new
    post "/confirm", ConfirmationsController, :create, as: :resend_confirmation
    get "/confirm/:token", ConfirmationsController, :edit
    post "/confirm/:token", ConfirmationsController, :confirm_user
  end

  scope "/", PingcrmWeb.Auth, host: @app_domain do
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

  scope "/", PingcrmWeb, host: @app_domain do
    pipe_through [:browser, :require_confirmed_user]

    oban_dashboard("/oban-queues", resolver: PingcrmWeb.ObanResolver)

    scope "/", Auth do
      get "/confirm-email/:token", ConfirmEmailController, :edit

      patch "/confirm-email/:token", ConfirmEmailController, :update, as: :confirm_email_change

      delete "/logout", SessionsController, :delete
    end

    scope "/direct_uploads" do
      post "/:uploader/:entity_id/sign", DirectUploadsController, :sign
      post "/:uploader/:entity_id/store", DirectUploadsController, :store
    end

    scope "/profile", Profile do
      get "/", ProfileController, :show, as: :my_profile
      patch "/", ProfileController, :update, as: :update_profile
      patch "/password", ProfileController, :update_password
      patch "/email", ProfileController, :update_email
      delete "/avatar", ProfileController, :delete_avatar
      post "/change_account/:id", ProfileController, :change_account
      patch "/set_default_account/:account_id", ProfileController, :set_default_account
    end

    scope "/dashboard", Dashboard do
      get "/", DashboardIndexController, :index, as: :dashboard
      get "/organizations", DashboardIndexController, :index, as: :organizations
      get "/contacts", DashboardIndexController, :index, as: :contacts
      get "/reports", DashboardIndexController, :index, as: :reports
    end

    scope "/account", Account do
      get "/", SettingsController, :show, as: :account
      get "/team", TeamController, :show, as: :team_page
      get "/billing", BillingController, :show, as: :billing_page
    end
  end
end
