defmodule Pingcrm.Academy do
  @moduledoc """
  The Academy context.
  """

  import Ecto.Query, warn: false
  alias Pingcrm.Repo

  alias Pingcrm.Academy.Nomination

  @doc """
  Returns the list of nominations.

  ## Examples

      iex> list_nominations()
      [%Nomination{}, ...]

  """
  def list_nominations do
    Repo.all(Nomination)
  end

  @doc """
  Gets a single nomination.

  Raises `Ecto.NoResultsError` if the Nomination does not exist.

  ## Examples

      iex> get_nomination!(123)
      %Nomination{}

      iex> get_nomination!(456)
      ** (Ecto.NoResultsError)

  """
  def get_nomination!(id), do: Repo.get!(Nomination, id)

  @doc """
  Creates a nomination.

  ## Examples

      iex> create_nomination(%{field: value})
      {:ok, %Nomination{}}

      iex> create_nomination(%{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def create_nomination(attrs \\ %{}) do
    %Nomination{}
    |> Nomination.changeset(attrs)
    |> Repo.insert()
  end

  @doc """
  Updates a nomination.

  ## Examples

      iex> update_nomination(nomination, %{field: new_value})
      {:ok, %Nomination{}}

      iex> update_nomination(nomination, %{field: bad_value})
      {:error, %Ecto.Changeset{}}

  """
  def update_nomination(%Nomination{} = nomination, attrs) do
    nomination
    |> Nomination.changeset(attrs)
    |> Repo.update()
  end

  @doc """
  Deletes a nomination.

  ## Examples

      iex> delete_nomination(nomination)
      {:ok, %Nomination{}}

      iex> delete_nomination(nomination)
      {:error, %Ecto.Changeset{}}

  """
  def delete_nomination(%Nomination{} = nomination) do
    Repo.delete(nomination)
  end

  @doc """
  Returns an `%Ecto.Changeset{}` for tracking nomination changes.

  ## Examples

      iex> change_nomination(nomination)
      %Ecto.Changeset{data: %Nomination{}}

  """
  def change_nomination(%Nomination{} = nomination, attrs \\ %{}) do
    Nomination.changeset(nomination, attrs)
  end
end
