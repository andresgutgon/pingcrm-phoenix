defmodule PingcrmWeb.Auth.SignupsControllerTest do
  use PingcrmWeb.ConnCase, async: true
  import Ecto.Query
  import Swoosh.TestAssertions

  alias Pingcrm.Accounts.{User, UserToken}
  alias Pingcrm.Repo

  describe "GET /signup" do
    test "renders signup page", %{conn: conn} do
      conn = get(conn, ~p"/signup")
      response = html_response(conn, 200)
      assert response =~ "Create your account"
    end

    test "redirects if already logged in", %{conn: conn} do
      conn = conn |> log_in_user(account_owner().user) |> get(~p"/signup")

      assert redirected_to(conn) == ~p"/"
    end
  end

  describe "POST /signup" do
    @tag :capture_log
    test "creates account and redirects to confirmation sent page", %{conn: conn} do
      email = unique_user_email()
      params = valid_user_attributes(%{user: %{email: email}})

      conn = post(conn, ~p"/signup", params)

      assert redirected_to(conn) == ~p"/confirmation-sent?email=#{email}"

      conn = get(recycle(conn), ~p"/confirmation-sent?email=#{email}")
      response = html_response(conn, 200)
      assert response =~ "Email sent to #{email}"
    end

    test "sends confirmation email", %{conn: conn} do
      email = unique_user_email()
      params = valid_user_attributes(%{user: %{email: email}})
      post(conn, ~p"/signup", params)

      assert_email_sent(fn message ->
        body = message.html_body || message.text_body

        user =
          Repo.one!(
            from u in User,
              where: u.email == ^email and is_nil(u.confirmed_at)
          )

        user_token = Repo.get_by!(UserToken, user_id: user.id, context: "confirm")

        assert message.subject =~ "Confirmation instructions"
        assert message.to == [{"", user.email}]
        assert body =~ "Hi #{email}"
        [_, token] = Regex.run(~r/\/confirm\/([A-Za-z0-9\-_]+)/, body)

        decoded_token = Base.url_decode64!(token, padding: false)
        assert user_token.token == :crypto.hash(:sha256, decoded_token)
      end)
    end

    test "Set user as admin of the account", %{conn: conn} do
      email = unique_user_email()
      params = valid_user_attributes(%{user: %{email: email}})
      post(conn, ~p"/signup", params)

      user =
        Repo.one!(
          from u in User,
            where: u.email == ^email and is_nil(u.confirmed_at)
        )
        |> Repo.preload([:accounts, :memberships])

      assert length(user.accounts) == 1
      assert length(user.memberships) == 1
      membership = hd(user.memberships)
      assert membership.role == "admin"
      assert membership.account_id == hd(user.accounts).id
    end

    test "data is valid or display errors", %{conn: conn} do
      params =
        valid_user_attributes(%{
          account: %{name: "X"},
          user: %{email: "with spaces", password: "too short", password_confirmation: "too short"}
        })

      conn = post(conn, ~p"/signup", params)

      assert redirected_to(conn) == ~p"/signup"

      assert inertia_errors(conn) == %{
               "account.name" => "should be at least 2 character(s)",
               "user.email" => "must have the @ sign and no spaces",
               "user.password" => "at least one digit or punctuation character"
             }
    end

    test "requires password confirmation", %{conn: conn} do
      params =
        valid_user_attributes(%{
          user: %{password_confirmation: ""}
        })

      conn = post(conn, ~p"/signup", params)

      assert redirected_to(conn) == ~p"/signup"
      assert inertia_errors(conn) == %{"user.password_confirmation" => "can't be blank"}
    end

    test "validates password confirmation matches password", %{conn: conn} do
      params =
        valid_user_attributes(%{
          user: %{
            password: "Secret_Password1234!@#",
            password_confirmation: "Different_Password1234!@#"
          }
        })

      conn = post(conn, ~p"/signup", params)

      assert redirected_to(conn) == ~p"/signup"
      assert inertia_errors(conn) == %{"user.password_confirmation" => "does not match password"}
    end
  end
end
