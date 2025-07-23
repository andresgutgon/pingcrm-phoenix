defmodule Pingcrm.Mailer.User.ConfirmEmailChange do
  alias Pingcrm.Mailer.Base

  def send(user, url) do
    Base.deliver(user.email, "Confirm your new email", """

    ==============================

    Hi #{user.email},

    You can confirm your new email address by visiting the URL below:

    #{url}

    If you didn't request an email change, please ignore this.

    ==============================
    """)
  end
end
