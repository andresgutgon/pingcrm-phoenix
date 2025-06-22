defmodule Pingcrm.Mailer.Base do
  import Swoosh.Email
  alias Pingcrm.Mailer

  def deliver(recipient, subject, body) do
    email =
      new()
      |> to(recipient)
      # Fake email address for the example
      |> from({"Pingcrm", "hi@pingcrm.dev"})
      |> subject(subject)
      |> text_body(body)

    with {:ok, _metadata} <- Mailer.deliver(email) do
      {:ok, email}
    end
  end
end
