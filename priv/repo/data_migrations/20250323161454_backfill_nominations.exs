defmodule Pingcrm.Repo.Migrations.BackfillNominations do
  use Ecto.Migration

  def up do
    now = NaiveDateTime.utc_now() |> NaiveDateTime.truncate(:second)

    entries = [
      {"Leonardo DiCaprio", "male", 2016, "The Revenant", true},
      {"Meryl Streep", "female", 2018, "The Post", false},
      {"Denzel Washington", "male", 2002, "Training Day", true},
      {"Cate Blanchett", "female", 2014, "Blue Jasmine", true},
      {"Joaquin Phoenix", "male", 2020, "Joker", true},
      {"Natalie Portman", "female", 2011, "Black Swan", true},
      {"Brad Pitt", "male", 2020, "Once Upon a Time in Hollywood", true},
      {"Frances McDormand", "female", 2021, "Nomadland", true},
      {"Anthony Hopkins", "male", 2021, "The Father", true},
      {"Viola Davis", "female", 2017, "Fences", true},
      {"Rami Malek", "male", 2019, "Bohemian Rhapsody", true},
      {"Emma Stone", "female", 2017, "La La Land", true},
      {"Gary Oldman", "male", 2018, "Darkest Hour", true},
      {"Jennifer Lawrence", "female", 2013, "Silver Linings Playbook", true},
      {"Eddie Redmayne", "male", 2015, "The Theory of Everything", true},
      {"Julianne Moore", "female", 2015, "Still Alice", true},
      {"Christian Bale", "male", 2011, "The Fighter", true},
      {"Sandra Bullock", "female", 2010, "The Blind Side", true},
      {"Heath Ledger", "male", 2009, "The Dark Knight", true},
      {"Hilary Swank", "female", 2005, "Million Dollar Baby", true},
      {"Tom Hanks", "male", 1995, "Forrest Gump", true},
      {"Gwyneth Paltrow", "female", 1999, "Shakespeare in Love", true},
      {"Jamie Foxx", "male", 2005, "Ray", true},
      {"Charlize Theron", "female", 2004, "Monster", true},
      {"Russell Crowe", "male", 2001, "Gladiator", true},
      {"Reese Witherspoon", "female", 2006, "Walk the Line", true},
      {"Sean Penn", "male", 2009, "Milk", true},
      {"Kate Winslet", "female", 2009, "The Reader", true},
      {"Adrien Brody", "male", 2003, "The Pianist", true},
      {"Nicole Kidman", "female", 2003, "The Hours", true}
    ]

    for {name, gender, year, movie, won} <- entries do
      execute """
      INSERT INTO nominations (name, gender, year, movie, won, inserted_at, updated_at)
      VALUES (
        #{escape(name)},
        #{escape(gender)},
        #{year},
        #{escape(movie)},
        #{won},
        #{escape(now)},
        #{escape(now)}
      )
      """
    end
  end

  def down do
    execute("DELETE FROM nominations")
  end

  defp escape(value) when is_binary(value), do: "'#{String.replace(value, "'", "''")}'"
  defp escape(%NaiveDateTime{} = dt), do: "'#{NaiveDateTime.to_string(dt)}'"
end

