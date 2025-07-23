defmodule Pingcrm.Mailer.User.Confirm do
  alias Pingcrm.Mailer.Base

  def send(user, url) do
    Base.deliver(user.email, "Confirmation instructions", """

    ==============================

    Hi #{user.email},

    You can confirm your account by visiting the URL below:

    #{url}

    If you didn't create an account with us, please ignore this.

    ==============================
    """)
  end
end
