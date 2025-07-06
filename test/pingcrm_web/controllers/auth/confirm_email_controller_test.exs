defmodule PingcrmWeb.Auth.ConfirmEmailControllerTest do
  use PingcrmWeb.ConnCase, async: true
  import Ecto.Query
  alias Phoenix.Flash

  alias Pingcrm.Accounts.{User, UserToken}
  alias Pingcrm.Repo

  describe "when not authenticated" do
    test "GET /confirm-email/:token redirects to login", %{conn: conn} do
      {encoded_token, _user_token} =
        UserToken.build_email_token(user_with_account().user, "confirm_email_change")

      conn = get(conn, ~p"/confirm-email/#{encoded_token}")
      assert redirected_to(conn) == ~p"/login"
    end

    test "PATCH /confirm-email/:token redirects to login", %{conn: conn} do
      user_account = user_with_account()
      user = user_account.user

      {:ok, user} =
        user
        |> User.email_changed_changeset(%{"email_changed" => "newemail@example.com"})
        |> Repo.update()

      {encoded_token, user_token} = UserToken.build_email_token(user, "confirm_email_change")
      Repo.insert!(user_token)

      conn = patch(conn, ~p"/confirm-email/#{encoded_token}")
      assert redirected_to(conn) == ~p"/login"
    end
  end

  describe "when authenticated" do
    setup %{conn: conn} do
      user_account = user_with_account()
      user = user_account.user

      conn = log_in_user(conn, user)

      %{conn: conn, user: user}
    end

    test "GET /confirm-email/:token renders the confirm email page with valid token", %{
      conn: conn,
      user: user
    } do
      {encoded_token, user_token} = UserToken.build_email_token(user, "confirm_email_change")
      Repo.insert!(user_token)

      conn = get(conn, ~p"/confirm-email/#{encoded_token}")

      response = html_response(conn, 200)
      assert response =~ "Confirm your email change"
    end

    test "GET /confirm-email/:token renders the confirm email page with invalid token", %{
      conn: conn
    } do
      invalid_token = "invalid_token_123"

      conn = get(conn, ~p"/confirm-email/#{invalid_token}")

      response = html_response(conn, 200)
      assert response =~ "Confirm your email change"
    end

    test "GET /confirm-email/:token assigns token prop to inertia", %{conn: conn, user: user} do
      {encoded_token, user_token} = UserToken.build_email_token(user, "confirm_email_change")
      Repo.insert!(user_token)

      conn = get(conn, ~p"/confirm-email/#{encoded_token}")

      assert conn.assigns.body =~ encoded_token
    end

    test "PATCH /confirm-email/:token successfully confirms email change with valid token", %{
      conn: conn,
      user: user
    } do
      new_email = "updated#{System.unique_integer()}@example.com"

      {:ok, user} =
        user
        |> User.email_changed_changeset(%{"email_changed" => new_email})
        |> Repo.update()

      {encoded_token, user_token} = UserToken.build_email_token(user, "confirm_email_change")
      Repo.insert!(user_token)

      conn = patch(conn, ~p"/confirm-email/#{encoded_token}")

      assert redirected_to(conn) == ~p"/profile"
      assert Flash.get(conn.assigns.flash, :info) =~ "Email confirmed successfully."

      updated_user = Repo.get!(User, user.id)
      assert updated_user.email == new_email
      assert updated_user.email_changed == nil

      refute Repo.get_by(UserToken, user_id: user.id, context: "confirm_email_change")
    end

    test "PATCH /confirm-email/:token fails with invalid token", %{conn: conn, user: user} do
      {:ok, user} =
        user
        |> User.email_changed_changeset(%{
          "email_changed" => "updated#{System.unique_integer()}@example.com"
        })
        |> Repo.update()

      invalid_token = "invalid_token_123"

      conn = patch(conn, ~p"/confirm-email/#{invalid_token}")

      assert redirected_to(conn) == ~p"/confirm-email/#{invalid_token}"

      assert Flash.get(conn.assigns.flash, :error) =~
               "Email confirmation link is invalid or it has expired."

      updated_user = Repo.get!(User, user.id)
      assert updated_user.email == user.email
      assert updated_user.email_changed == user.email_changed
    end

    test "PATCH /confirm-email/:token fails with expired token", %{conn: conn, user: user} do
      # Update user to have a pending email change
      {:ok, user} =
        user
        |> User.email_changed_changeset(%{
          "email_changed" => "updated#{System.unique_integer()}@example.com"
        })
        |> Repo.update()

      {encoded_token, user_token} = UserToken.build_email_token(user, "confirm_email_change")

      expired_date =
        DateTime.utc_now()
        # 8 days ago
        |> DateTime.add(-(8 * 24 * 60 * 60), :second)
        |> DateTime.truncate(:second)

      user_token = %{user_token | inserted_at: expired_date}
      Repo.insert!(user_token)

      conn = patch(conn, ~p"/confirm-email/#{encoded_token}")

      assert redirected_to(conn) == ~p"/confirm-email/#{encoded_token}"

      assert Flash.get(conn.assigns.flash, :error) =~
               "Email confirmation link is invalid or it has expired."

      updated_user = Repo.get!(User, user.id)
      assert updated_user.email == user.email
      assert updated_user.email_changed == user.email_changed
    end

    test "PATCH /confirm-email/:token fails with token for different user", %{
      conn: conn,
      user: user
    } do
      new_email = "updated#{System.unique_integer()}@example.com"

      {:ok, user} =
        user
        |> User.email_changed_changeset(%{"email_changed" => new_email})
        |> Repo.update()

      other_user = user_with_account().user

      {encoded_token, user_token} =
        UserToken.build_email_token(other_user, "confirm_email_change")

      Repo.insert!(user_token)

      conn = patch(conn, ~p"/confirm-email/#{encoded_token}")

      assert redirected_to(conn) == ~p"/confirm-email/#{encoded_token}"
      assert Flash.get(conn.assigns.flash, :error) =~ "No pending email change to confirm."

      updated_user = Repo.get!(User, user.id)
      assert updated_user.email == user.email
      assert updated_user.email_changed == new_email
    end

    test "PATCH /confirm-email/:token fails with token for wrong context", %{
      conn: conn,
      user: user
    } do
      {:ok, user} =
        user
        |> User.email_changed_changeset(%{
          "email_changed" => "updated#{System.unique_integer()}@example.com"
        })
        |> Repo.update()

      {encoded_token, user_token} = UserToken.build_email_token(user, "confirm")
      Repo.insert!(user_token)

      conn = patch(conn, ~p"/confirm-email/#{encoded_token}")

      assert redirected_to(conn) == ~p"/confirm-email/#{encoded_token}"

      assert Flash.get(conn.assigns.flash, :error) =~
               "Email confirmation link is invalid or it has expired."

      updated_user = Repo.get!(User, user.id)
      assert updated_user.email == user.email
      assert updated_user.email_changed == user.email_changed
    end

    test "PATCH /confirm-email/:token cleans up related tokens after successful confirmation", %{
      conn: conn,
      user: user
    } do
      new_email = "updated#{System.unique_integer()}@example.com"

      {:ok, user} =
        user
        |> User.email_changed_changeset(%{"email_changed" => new_email})
        |> Repo.update()

      Repo.delete_all(from t in UserToken, where: t.user_id == ^user.id)

      {encoded_token, user_token} = UserToken.build_email_token(user, "confirm_email_change")
      Repo.insert!(user_token)

      # Create additional "confirm" context tokens for the same user
      {_, confirm_token} = UserToken.build_email_token(user, "confirm")
      Repo.insert!(confirm_token)

      # Create additional token with different context that should remain
      {_, reset_token} = UserToken.build_email_token(user, "reset_password")
      Repo.insert!(reset_token)

      initial_token_count =
        Repo.aggregate(from(t in UserToken, where: t.user_id == ^user.id), :count)

      assert initial_token_count == 3

      # Re-authenticate user since we cleaned up tokens
      conn = log_in_user(conn, user)
      conn = patch(conn, ~p"/confirm-email/#{encoded_token}")

      assert redirected_to(conn) == ~p"/profile"
      assert Flash.get(conn.assigns.flash, :info) =~ "Email confirmed successfully."

      # Verify "confirm" and "confirm_email_change" context tokens were deleted, but other types remain
      remaining_tokens = Repo.all(from(t in UserToken, where: t.user_id == ^user.id))
      assert length(remaining_tokens) == 2

      remaining_contexts = Enum.map(remaining_tokens, & &1.context) |> Enum.sort()
      assert remaining_contexts == ["reset_password", "session"]
    end

    test "PATCH /confirm-email/:token fails when user has no pending email change", %{conn: conn} do
      other_user = user_with_account().user

      {encoded_token, user_token} =
        UserToken.build_email_token(other_user, "confirm_email_change")

      Repo.insert!(user_token)

      conn = log_in_user(conn, other_user)
      conn = patch(conn, ~p"/confirm-email/#{encoded_token}")

      assert redirected_to(conn) == ~p"/confirm-email/#{encoded_token}"
      assert Flash.get(conn.assigns.flash, :error) =~ "No pending email change to confirm."

      updated_user = Repo.get!(User, other_user.id)
      assert updated_user.email == other_user.email
      assert updated_user.email_changed in [nil, ""]
    end

    test "PATCH /confirm-email/:token fails when user has empty email_changed", %{
      conn: conn,
      user: user
    } do
      {:ok, user} =
        user
        |> User.email_changed_changeset(%{"email_changed" => ""})
        |> Repo.update()

      {encoded_token, user_token} = UserToken.build_email_token(user, "confirm_email_change")
      Repo.insert!(user_token)

      conn = patch(conn, ~p"/confirm-email/#{encoded_token}")

      assert redirected_to(conn) == ~p"/confirm-email/#{encoded_token}"
      assert Flash.get(conn.assigns.flash, :error) =~ "No pending email change to confirm."
    end
  end
end
