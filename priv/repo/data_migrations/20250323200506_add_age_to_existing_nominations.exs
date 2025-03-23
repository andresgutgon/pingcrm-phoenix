defmodule Pingcrm.Repo.Migrations.AddAgeToExistingNominations do
  use Ecto.Migration

  def up do
    entries = [
      {"Leonardo DiCaprio", 2016, 42},
      {"Meryl Streep", 2018, 69},
      {"Denzel Washington", 2002, 47},
      {"Cate Blanchett", 2014, 45},
      {"Joaquin Phoenix", 2020, 46},
      {"Natalie Portman", 2011, 30},
      {"Brad Pitt", 2020, 57},
      {"Frances McDormand", 2021, 63},
      {"Anthony Hopkins", 2021, 83},
      {"Viola Davis", 2017, 51},
      {"Rami Malek", 2019, 38},
      {"Emma Stone", 2017, 28},
      {"Gary Oldman", 2018, 59},
      {"Jennifer Lawrence", 2013, 23},
      {"Eddie Redmayne", 2015, 33},
      {"Julianne Moore", 2015, 54},
      {"Christian Bale", 2011, 37},
      {"Sandra Bullock", 2010, 46},
      {"Heath Ledger", 2009, 30},
      {"Hilary Swank", 2005, 31},
      {"Tom Hanks", 1995, 39},
      {"Gwyneth Paltrow", 1999, 27},
      {"Jamie Foxx", 2005, 37},
      {"Charlize Theron", 2004, 29},
      {"Russell Crowe", 2001, 37},
      {"Reese Witherspoon", 2006, 30},
      {"Sean Penn", 2009, 49},
      {"Kate Winslet", 2009, 34},
      {"Adrien Brody", 2003, 30},
      {"Nicole Kidman", 2003, 36}
    ]

    for {name, year, age} <- entries do
      execute("""
      UPDATE nominations
      SET age = #{age}
      WHERE name = #{escape(name)} AND year = #{year};
      """)
    end
  end

  def down do
    execute("UPDATE nominations SET age = NULL;")
  end

  defp escape(str) do
    "'#{String.replace(str, "'", "''")}'"
  end
end

