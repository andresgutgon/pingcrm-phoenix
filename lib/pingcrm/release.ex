defmodule Pingcrm.Release do
  @moduledoc """
  Used for executing DB release tasks when run in production without Mix
  installed.
  """
  @app :pingcrm

  @doc """
  Print migration status for the given type: :default or :data.
  """
  def migration_status(type \\ :default) do
    load_app()

    for repo <- repos() do
      path = migrations_path(repo, type)

      {:ok, repo_status, _} =
        Ecto.Migrator.with_repo(repo, &Ecto.Migrator.migrations(&1, path), mode: :temporary)

      print_migration_status(repo, repo_status)
    end
  end

  def migrate(opts \\ [all: true]) do
    migrate_type(:default, opts)
  end

  def migrate_data(opts \\ [all: true]) do
    migrate_type(:data, opts)
  end

  def rollback(repo, version, type \\ :default) do
    load_app()
    path = migrations_path(repo, type)
    {:ok, _, _} = Ecto.Migrator.with_repo(repo, &Ecto.Migrator.run(&1, path, :down, to: version))
  end

  defp migrate_type(type, opts) do
    load_app()

    for repo <- repos() do
      path = migrations_path(repo, type)
      {:ok, _, _} = Ecto.Migrator.with_repo(repo, &Ecto.Migrator.run(&1, path, :up, opts))
    end
  end

  defp migrations_path(repo, :default), do: Ecto.Migrator.migrations_path(repo, "migrations")
  defp migrations_path(repo, :data), do: Ecto.Migrator.migrations_path(repo, "data_migrations")

  defp print_migration_status(repo, status) do
    IO.puts(
      """
      Repo: #{inspect(repo)}
      Status   Migration ID   Migration Name
      --------------------------------------------------
      """ <>
        Enum.map_join(status, "\n", fn {stat, num, name} ->
          "  #{pad(stat, 10)}#{pad(num, 16)}#{name}"
        end) <> "\n"
    )
  end

  defp pad(content, size), do: to_string(content) |> String.pad_trailing(size)

  defp repos, do: Application.fetch_env!(@app, :ecto_repos)

  defp load_app, do: Application.load(@app)
end
