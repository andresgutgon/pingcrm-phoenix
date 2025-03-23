defmodule Pingcrm.Academy.Nomination do
  use Ecto.Schema
  import Ecto.Changeset

  schema "nominations" do
    field :name, :string
    field :year, :integer
    field :movie, :string
    field :won, :boolean, default: false
    field :gender, :string

    timestamps(type: :utc_datetime)
  end

  @doc false
  def changeset(nomination, attrs) do
    nomination
    |> cast(attrs, [:name, :year, :movie, :won])
    |> validate_required([:name, :year, :movie, :won])
  end
end
