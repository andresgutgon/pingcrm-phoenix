defmodule Pingcrm.MixProject do
  use Mix.Project

  def project do
    [
      app: :pingcrm,
      version: "0.1.0",
      elixir: "~> 1.14",
      elixirc_paths: elixirc_paths(Mix.env()),
      start_permanent: Mix.env() == :prod,
      aliases: aliases(),
      deps: deps(),
      preferred_cli_env: [
        "test.watch": :test
      ]
    ]
  end

  def application do
    [
      mod: {Pingcrm.Application, []},
      extra_applications: [:logger, :runtime_tools]
    ]
  end

  defp elixirc_paths(:test), do: ["lib", "test/support", "test/factories"]
  defp elixirc_paths(_), do: ["lib"]

  defp deps do
    [
      {:bcrypt_elixir, "~> 3.0"},
      {:phoenix, "~> 1.8.0-rc.1", override: true},
      {:phoenix_ecto, "~> 4.6"},
      {:phoenix_html, "~> 4.2.1"},
      {:ecto_sql, "~> 3.12"},
      {:postgrex, ">= 0.0.0"},
      {:swoosh, "~> 1.5"},
      {:gen_smtp, "~> 1.2"},
      {:finch, "~> 0.13"},
      {:telemetry_metrics, "~> 1.0"},
      {:telemetry_poller, "~> 1.0"},
      {:gettext, "~> 0.26"},
      {:jason, "~> 1.2"},
      {:dns_cluster, "~> 0.1.1"},
      {:bandit, "~> 1.5"},
      {:credo, "~> 1.7", only: [:dev, :test], runtime: false},
      {:dialyxir, "~> 1.3", only: [:dev], runtime: false},
      {:ex_machina, "~> 2.8.0", only: :test},
      {:faker, "~> 0.17", only: :test},
      {:floki, ">= 0.34.0", only: :test},
      {:mix_test_watch, "~> 1.0", only: [:dev, :test], runtime: false},
      {
        :inertia,
        git: "https://github.com/andresgutgon/inertia-phoenix.git",
        branch: "feature/inertia-vitejs-integration"
      },
      {:vitex, git: "https://github.com/andresgutgon/vitex.git", branch: "main"},
      {:wayfinder,
       git: "https://github.com/andresgutgon/phoenix-wayfinder.git",
       ref: "0dbbb8405d3f38438052c049da5d4d33bbf69c6d"}
    ]
  end

  defp aliases do
    [
      setup: ["deps.get", "ecto.setup", "assets.setup", "assets.build"],
      "ecto.setup": ["ecto.create", "ecto.migrate", "run priv/repo/seeds.exs"],
      "ecto.reset": ["ecto.drop", "ecto.setup"],
      test: ["ecto.create --quiet", "ecto.migrate --quiet", "test"],
      check: [
        "format --check-formatted",
        "credo --strict",
        "cmd mix dialyzer --halt-exit-status"
      ],
      "assets.build": ["wayfinder.generate", "cmd pnpm --dir assets run build"],
      "assets.deploy": ["assets.build", "phx.digest"]
    ]
  end
end
