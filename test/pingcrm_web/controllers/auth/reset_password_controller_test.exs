defmodule Pingcrm.Auth.ResetPasswordControllerTest do
  use PingcrmWeb.ConnCase, async: true

  alias Pingcrm.Accounts
  alias Pingcrm.Accounts.Auth
  alias Pingcrm.Repo

  setup do
    %{user: account_owner().user}
  end

  describe "GET /reset_password" do
    test "renders the reset password page", %{conn: conn} do
      conn = get(conn, ~p"/reset_password")
      response = html_response(conn, 200)
      assert response =~ "Forgot your password?"
    end

    test "passes email as inertia prop when provided as query parameter", %{conn: conn} do
      email = "test@example.com"
      conn = get(conn, ~p"/reset_password?email=#{email}")

      # Check that the response is successful
      assert html_response(conn, 200)

      # Check that the email is passed as an Inertia prop
      assert inertia_props(conn)[:email] == email
    end

    test "does not pass email prop when email parameter is empty", %{conn: conn} do
      conn = get(conn, ~p"/reset_password?email=")

      assert html_response(conn, 200)
      refute Map.has_key?(inertia_props(conn), :email)
    end

    test "does not pass email prop when email parameter is not provided", %{conn: conn} do
      conn = get(conn, ~p"/reset_password")

      assert html_response(conn, 200)
      refute Map.has_key?(inertia_props(conn), :email)
    end

    test "does not pass email prop when email format is invalid", %{conn: conn} do
      invalid_emails = [
        "invalid-email",
        "@example.com",
        "test@",
        "test @example.com",
        "test@ example.com",
        "",
        "   ",
        "test.example.com"
      ]

      for invalid_email <- invalid_emails do
        conn = get(conn, ~p"/reset_password?email=#{invalid_email}")

        assert html_response(conn, 200)

        refute Map.has_key?(inertia_props(conn), :email),
               "Expected invalid email '#{invalid_email}' to not be passed as prop"
      end
    end

    test "passes email prop only for valid email formats", %{conn: conn} do
      valid_emails = [
        "test@example.com",
        "user@domain.org",
        "firstname.lastname@company.co.uk",
        "test+tag@gmail.com",
        "123@456.789"
      ]

      for valid_email <- valid_emails do
        conn = get(conn, ~p"/reset_password?email=#{valid_email}")

        assert html_response(conn, 200)

        assert inertia_props(conn)[:email] == valid_email,
               "Expected valid email '#{valid_email}' to be passed as prop"
      end
    end
  end

  describe "POST /reset_password" do
    @tag :capture_log
    test "sends a new reset password token", %{conn: conn, user: user} do
      conn = post(conn, ~p"/reset_password", %{"email" => user.email})
      assert redirected_to(conn) == ~p"/login"

      assert Phoenix.Flash.get(conn.assigns.flash, :success) =~
               "If your email is in our system"

      assert Repo.get_by!(Accounts.UserToken, user_id: user.id).context == "reset_password"
    end

    test "does not send reset password token if email is invalid", %{conn: conn} do
      conn = post(conn, ~p"/reset_password", %{"email" => "unknown@example.com"})

      assert redirected_to(conn) == ~p"/login"

      assert Phoenix.Flash.get(conn.assigns.flash, :success) =~
               "If your email is in our system"

      assert Repo.all(Accounts.UserToken) == []
    end
  end

  describe "GET /reset_password/:token" do
    setup %{user: user} do
      token =
        extract_user_token(fn url ->
          Auth.send_reset_password(user, url)
        end)

      %{token: token}
    end

    test "renders reset password", %{conn: conn, token: token} do
      conn = get(conn, ~p"/reset_password/#{token}")
      assert html_response(conn, 200) =~ "Change your password"
    end

    test "does not render reset password with invalid token", %{conn: conn} do
      conn = get(conn, ~p"/reset_password/oops")
      assert redirected_to(conn) == ~p"/login"

      assert Phoenix.Flash.get(conn.assigns.flash, :error) =~
               "Reset password link is invalid or it has expired"
    end
  end

  describe "PUT /reset_password/:token" do
    setup %{user: user} do
      token =
        extract_user_token(fn url ->
          Auth.send_reset_password(user, url)
        end)

      %{token: token}
    end

    test "resets password once", %{conn: conn, user: user, token: token} do
      conn =
        put(conn, ~p"/reset_password/#{token}", %{
          "password" => valid_user_password(),
          "password_confirmation" => valid_user_password()
        })

      assert redirected_to(conn) == ~p"/login"
      refute get_session(conn, :user_token)

      assert Phoenix.Flash.get(conn.assigns.flash, :success) =~
               "Password reset successfully"

      assert Accounts.get_user_by_email_and_password(user.email, valid_user_password())
    end

    test "updates hashed_password when password is reset", %{conn: conn, user: user, token: token} do
      # Get the original hashed password
      original_hashed_password = user.hashed_password

      # Reset the password
      conn =
        put(conn, ~p"/reset_password/#{token}", %{
          "password" => valid_user_password(),
          "password_confirmation" => valid_user_password()
        })

      assert redirected_to(conn) == ~p"/login"

      # Reload the user and verify the hashed_password has changed
      updated_user = Repo.get!(Accounts.User, user.id)
      assert updated_user.hashed_password != original_hashed_password
      assert updated_user.hashed_password != nil

      # Verify the new password works
      assert Accounts.get_user_by_email_and_password(user.email, valid_user_password())
    end

    test "does not reset password on invalid data", %{conn: conn, token: token} do
      conn =
        put(conn, ~p"/reset_password/#{token}", %{
          "password" => "too short",
          "password_confirmation" => "does not match"
        })

      assert redirected_to(conn) == ~p"/reset_password/#{token}"

      assert inertia_errors(conn) == %{
               password: "at least one digit or punctuation character",
               password_confirmation: "does not match password"
             }
    end

    test "does not reset password with invalid token", %{conn: conn} do
      conn = put(conn, ~p"/reset_password/oops")
      assert redirected_to(conn) == ~p"/login"

      assert Phoenix.Flash.get(conn.assigns.flash, :error) =~
               "Reset password link is invalid or it has expired"
    end
  end
end
