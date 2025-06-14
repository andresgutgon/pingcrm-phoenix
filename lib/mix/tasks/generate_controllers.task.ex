defmodule Mix.Tasks.GenerateFakeControllers.Task do
  use Mix.Task

  @shortdoc "Generates fake Phoenix controllers with full CRUD actions"

  @moduledoc """
  Generates a number of fake Phoenix controllers with full CRUD actions
  into `lib/pingcrm_web/controllers/fake_controllers`.

  ## Usage

      mix generate_fake_controllers.task [count]

  ## Example

      mix generate_fake_controllers.task 100
  """

  @impl true
  def run(args) do
    # Start app (this might be unnecessary for file generation; optional)
    # ← Replace with your actual app name if needed
    Application.ensure_all_started(:your_app_name)

    count = parse_count!(args)
    target_dir = "lib/pingcrm_web/controllers/fake_controllers"

    File.rm_rf!(target_dir)
    File.mkdir_p!(target_dir)

    Enum.each(1..count, fn i ->
      module_name = "FakeController#{i}"
      file_path = Path.join(target_dir, Macro.underscore(module_name) <> ".ex")

      File.write!(file_path, generate_controller(module_name))
      Code.compile_file(file_path)
    end)

    IO.puts("✅ Generated #{count} fake controllers with CRUD actions in #{target_dir}")
  end

  defp parse_count!([count_str | _]) do
    case Integer.parse(count_str) do
      {n, ""} when n > 0 ->
        n

      _ ->
        raise "❌ Invalid count: #{inspect(count_str)}. Must be a positive integer."
    end
  end

  defp parse_count!(_) do
    raise """
    ❌ Missing count argument.

    Usage:
        mix generate_fake_controllers.task COUNT

    Example:
        mix generate_fake_controllers.task 100
    """
  end

  defp generate_controller(name) do
    """
    defmodule PingcrmWeb.FakeControllers.#{name} do
      use PingcrmWeb, :controller

      def index(conn, _params), do: json(conn, %{action: :index})
      def show(conn, _params), do: json(conn, %{action: :show})
      def new(conn, _params), do: json(conn, %{action: :new})
      def create(conn, _params), do: json(conn, %{action: :create})
      def edit(conn, _params), do: json(conn, %{action: :edit})
      def update(conn, _params), do: json(conn, %{action: :update})
      def delete(conn, _params), do: json(conn, %{action: :delete})
    end
    """
  end
end
