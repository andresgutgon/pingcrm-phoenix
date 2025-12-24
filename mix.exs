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
      ],
      listeners: [Phoenix.CodeReloader],
      dialyzer: [
        plt_add_apps: [:mix],
        ignore_warnings_for: [
          "lib/mix/tasks/generate_controllers.task.ex",
          "lib/mix/tasks/profile.task.ex"
        ]
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
      # Core dependencies
      {:bcrypt_elixir, "~> 3.0"},
      {:phoenix, "~> 1.8.0-rc.3", override: true},
      {:phoenix_ecto, "~> 4.6.5"},
      {:phoenix_html, "~> 4.2.1"},
      {:ecto_sql, "~> 3.13.2"},
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
      {:oban, "~> 2.19"},
      {:oban_web, "~> 2.11"},

      # AI dependencies
      {:tidewave, "~> 0.2", only: :dev},

      # Development and test dependencies
      {:credo, "~> 1.7", only: [:dev, :test], runtime: false},
      {:dialyxir, "~> 1.3", only: [:dev], runtime: false},
      {:ex_machina, "~> 2.8.0", only: :test},
      {:faker, "~> 0.17", only: :test},
      {:floki, ">= 0.34.0", only: :test},
      {:mix_test_watch, "~> 1.0", only: [:dev, :test], runtime: false},

      # UI dependencies
      {:wayfinder_ex, "~> 0.1.5"},
      {
        :inertia,
        git: "https://github.com/andresgutgon/inertia-phoenix.git",
        branch: "feature/inertia-vitejs-integration"
      },
      {:vitex, git: "https://github.com/andresgutgon/vitex.git", branch: "main"},

      # Storage dependencies
      {:waffle, "~> 1.1"},
      {:waffle_ecto, "~> 0.0.12"},
      {:ex_aws, "~> 2.1.2"},
      {:ex_aws_s3, "~> 2.0"},
      {:aws_signature, "~> 0.4.0"},
      {:hackney, "~> 1.9"},
      {:sweet_xml, "~> 0.6"}
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
