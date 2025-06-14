defmodule Mix.Tasks.Profile.Task do
  use Mix.Task

  @shortdoc "Times the execution duration of a Mix task"

  @moduledoc """
  Usage:
      mix profile.task some.task.name [args...]

  This measures the wall-clock time it takes to run the given Mix task once.
  """

  @impl true
  def run([task | args]) do
    Application.ensure_all_started(:pingcrm)

    IO.puts("Running `mix #{task} #{Enum.join(args, " ")}`...")

    {time_microseconds, _result} =
      :timer.tc(fn ->
        Mix.Task.run("#{task}#{Enum.join(args, " ")}")
      end)

    ms = Float.round(time_microseconds / 1_000, 2)
    IO.puts("\n✅ Completed in #{ms} ms")
  end

  def run([]) do
    raise "Usage: mix profile.task some.task.name [args...]"
  end
end
