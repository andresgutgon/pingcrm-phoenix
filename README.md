# Coffee Pitch
Bring people together to collaborate and create in cafés and coworking spaces.


## Install deps in development
Elixir is run inside a docker container. To install the dependencies run the following command:
```bash
docker compose run web mix deps.get
```

## Tests on the docker container from outside

Run tests in watch mode by running `./bin/test`

You can pass a file path and also a line number with the following syntax:

```bash
./bin/test tests/ui/text_test.exs:23
```

Test in watch mode

```bash
./bin/test --watch
```

Run test in debug mode. You can put a require IEx; IEx.pry
in your test file to stop the execution and start a debug session.

```bash
./bin/test --debug
```
