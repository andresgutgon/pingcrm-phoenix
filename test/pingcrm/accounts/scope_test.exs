defmodule Pingcrm.Accounts.ScopeTest do
  use Pingcrm.DataCase

  alias Pingcrm.Accounts.{Scope, User}

  describe "for_user/2" do
    test "returns nil when user is nil" do
      assert Scope.for_user(nil, 123) == nil
    end

    test "returns nil when user has no memberships" do
      user = insert(:user)
      assert Scope.for_user(user, nil) == nil
    end

    test "returns scope with current account when account_id is provided" do
      %{user: user, account: account} = user_with_account()

      # Set the account as default for the user
      user = user |> Ecto.Changeset.change(default_account_id: account.id) |> Repo.update!()

      scope = Scope.for_user(user, account.id)

      assert %Scope{} = scope
      assert scope.user.id == user.id
      assert scope.account.id == account.id
      assert scope.account.name == account.name
      assert scope.account.is_current == true
      assert scope.account.is_default == true
      assert scope.role == "member"
      assert length(scope.accounts) == 1
      assert hd(scope.accounts).id == account.id
      assert hd(scope.accounts).is_current == true
      assert hd(scope.accounts).is_default == true
    end

    test "returns scope with admin role for account owner" do
      %{user: user, account: account} = account_owner()

      scope = Scope.for_user(user, account.id)

      assert scope.role == "admin"
    end

    test "returns scope with default account when no account_id provided and user has default_account_id" do
      %{user: user, account: account} = user_with_account()

      # Update user to have this account as default
      user = user |> Ecto.Changeset.change(default_account_id: account.id) |> Repo.update!()

      scope = Scope.for_user(user, nil)

      assert scope.account.id == account.id
      assert scope.account.is_default == true
    end

    test "returns scope with first account when no account_id and no default_account_id" do
      %{user: user, account: account} = user_with_account()

      # Ensure user has no default account
      user = user |> Ecto.Changeset.change(default_account_id: nil) |> Repo.update!()

      scope = Scope.for_user(user, nil)

      assert scope.account.id == account.id
    end

    test "handles user with multiple accounts correctly" do
      %{user: user, account: first_account} = user_with_account()
      second_account = insert(:account)
      insert(:membership, %{user: user, account: second_account, role: "admin"})

      # Set first account as default
      user = user |> Ecto.Changeset.change(default_account_id: first_account.id) |> Repo.update!()

      # Test with specific account_id
      scope = Scope.for_user(user, second_account.id)

      assert scope.account.id == second_account.id
      assert scope.account.is_current == true
      assert scope.account.is_default == false
      assert scope.role == "admin"
      assert length(scope.accounts) == 2

      current_account = Enum.find(scope.accounts, & &1.is_current)
      default_account = Enum.find(scope.accounts, & &1.is_default)

      assert current_account.id == second_account.id
      assert default_account.id == first_account.id
    end

    test "returns nil when specified account_id doesn't match any membership" do
      %{user: user} = user_with_account()
      non_existent_account = insert(:account)

      scope = Scope.for_user(user, non_existent_account.id)

      assert scope == nil
    end

    test "works with preloaded memberships" do
      %{user: user, account: account} = user_with_account()

      # Preload memberships
      user = Repo.preload(user, memberships: :account)

      scope = Scope.for_user(user, account.id)

      assert %Scope{} = scope
      assert scope.account.id == account.id
    end

    test "works without preloaded memberships" do
      %{user: user, account: account} = user_with_account()

      user = Repo.get!(User, user.id)
      refute Ecto.assoc_loaded?(user.memberships)

      scope = Scope.for_user(user, account.id)

      assert %Scope{} = scope
      assert scope.account.id == account.id
    end

    test "serializes accounts correctly with presenter" do
      %{user: user, account: account} = user_with_account()

      scope = Scope.for_user(user, account.id)

      # Check that account is serialized using presenter
      assert is_map(scope.account)
      assert Map.has_key?(scope.account, :id)
      assert Map.has_key?(scope.account, :name)
      assert Map.has_key?(scope.account, :is_current)
      assert Map.has_key?(scope.account, :is_default)

      # Check accounts array is also properly serialized
      assert is_list(scope.accounts)
      account_map = hd(scope.accounts)
      assert Map.has_key?(account_map, :id)
      assert Map.has_key?(account_map, :name)
      assert Map.has_key?(account_map, :is_current)
      assert Map.has_key?(account_map, :is_default)
    end

    test "correctly identifies default account across multiple accounts" do
      %{user: user, account: first_account} = user_with_account()
      second_account = insert(:account)
      third_account = insert(:account)

      insert(:membership, %{user: user, account: second_account})
      insert(:membership, %{user: user, account: third_account})

      user =
        user |> Ecto.Changeset.change(default_account_id: second_account.id) |> Repo.update!()

      scope = Scope.for_user(user, first_account.id)

      default_accounts = Enum.filter(scope.accounts, & &1.is_default)
      current_accounts = Enum.filter(scope.accounts, & &1.is_current)

      assert length(default_accounts) == 1
      assert length(current_accounts) == 1
      assert hd(default_accounts).id == second_account.id
      assert hd(current_accounts).id == first_account.id
    end

    test "includes account initials from first 2 letters of name" do
      %{user: user, account: account} = user_with_account()

      scope = Scope.for_user(user, account.id)

      # Account initials should be first 2 letters of name
      expected_initials = String.slice(account.name, 0, 2)
      assert scope.account.initials == expected_initials
    end

    test "includes initials for all accounts in accounts list" do
      %{user: user, account: first_account} = user_with_account()
      second_account = insert(:account, name: "Beta Solutions")
      third_account = insert(:account, name: "Gamma Industries")

      insert(:membership, %{user: user, account: second_account})
      insert(:membership, %{user: user, account: third_account})

      scope = Scope.for_user(user, first_account.id)

      # Check that all accounts have initials key
      assert Enum.all?(scope.accounts, &Map.has_key?(&1, :initials))

      # Check specific initials for each account
      alpha_account = Enum.find(scope.accounts, &(&1.id == first_account.id))
      beta_account = Enum.find(scope.accounts, &(&1.id == second_account.id))
      gamma_account = Enum.find(scope.accounts, &(&1.id == third_account.id))

      assert String.slice(first_account.name, 0, 2) == alpha_account.initials
      assert beta_account.initials == "Be"
      assert gamma_account.initials == "Ga"
    end

    test "handles edge cases for initials" do
      # Test single letter names - just use regular factory and update after
      %{user: user, account: account} = user_with_account()

      # Update account name to single character
      account = account |> Ecto.Changeset.change(name: "X") |> Repo.update!()

      scope = Scope.for_user(user, account.id)

      assert scope.account.initials == "X"
    end

    test "handles empty account names gracefully for initials" do
      %{user: user, account: account} = user_with_account()

      # Update to empty name
      account = account |> Ecto.Changeset.change(name: "") |> Repo.update!()

      scope = Scope.for_user(user, account.id)

      # Should handle empty strings gracefully
      assert scope.account.initials == ""
    end
  end
end
