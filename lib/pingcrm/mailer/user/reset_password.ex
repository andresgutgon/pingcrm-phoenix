defmodule Pingcrm.Mailer.User.ResetPassword do
  alias Pingcrm.Mailer.Base

  def send(user, url) do
    Base.deliver(user.email, "Reset password instructions", """

    ==============================

    Hi #{user.email},

    You can reset your password by visiting the URL below:

    #{url}

    If you didn't request this change, please ignore this.


    ==============================
    """)
  end
end
