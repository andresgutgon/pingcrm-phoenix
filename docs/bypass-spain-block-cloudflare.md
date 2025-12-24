# What's this?

LaLiga and Cloudflare have had recurring conflicts where access to **laliga.com** and related domains was intermittently blocked in Spain. This guide explains a workaround to bypass those restrictions by using Cloudflare's own WARP service in proxy mode, so you can still reach Cloudflare-backed resources (like R2 buckets) even if laliga.com or other sites are restricted.

> ⚠️ **Warning**
> These steps might not be necessary anymore depending on when you read this. Cloudflare and LaLiga periodically adjust their configurations, which could mean the block disappears (or changes) at any time.


> ⚠️ **Warning**
> Skip to the end. WRAP modes are explained there. I'm using just `warp` mode so no need to do anything special in Docker or in the Elixir app.


## Use Clouldflare's WARP

One of the easiest ways to bypass Cloudflare blocks is by using Cloudflare's own WARP VPN service. WARP encrypts your internet traffic and routes it through Cloudflare's network, which can help you access blocked content.

## Installation

```bash
 brew install --cask cloudflare-warp
```

## Usage in proxy mode

WARP is started in a Mac OS daemon mode. so if this does not work you can stop
and start the service again:

```bash
sudo launchctl unload /Library/LaunchDaemons/com.cloudflare.[YOUR_THINK].macos.warp.daemon.plist
sudo launchctl load /Library/LaunchDaemons/com.cloudflare.[YOUR_THING].macos.warp.daemon.plist
```

```bash
warp-cli registration new
warp-cli mode proxy
warp-cli proxy port 4000
```

## Test it works

Now request to your R2 buckets should work. Check the proxy:

```bash
HTTPS_PROXY=http://127.0.0.1:40000 \
 curl -v https://[YOUR_CLOULDFLARE_ACCOUNT_ID].r2.cloudflarestorage.com/
```

## Docker integration

This port is forwarded in `docker-compose.yml` in `web` service:
THE DAYS SPAIN ISPs are not blocking R2 buckets you just comment this line and
don't use WARP.

```yaml
environment:
  - HTTPS_PROXY=http://host.docker.internal:4000
```

## TROUBLESHOOTING

Check the status

```bash
warp-cli status
```

### PROXY MODE not working

Proxy mode has a timeout of 10 seconds. so uploading multiple files or a file of
1MB fail. If this change you can pass in the storage configuration the proxy
options to Waffle ExAWS:

````elixir
ex_aws: [
  access_key_id: env[:S3_ACCESS_KEY_ID],
  secret_access_key: env[:S3_SECRET_ACCESS_KEY],
  region: "auto",
  s3:
    [
      scheme: "https://",
      host: assets_host,
      region: "auto",
      path_style: true
    ]
  |> assets_proxy(prod_mode)
]

defp assets_proxy(opts, true), do: opts

# This is only needed if you're on Spain on weekends (LOL)
# More info: docs/bypass-spain-block-cloudflare.md
# Check docker-compose in web for this env set. If it's commented uncomment it.
defp assets_proxy(opts, false) do
    case System.get_env("HTTPS_PROXY") do
      nil -> opts
      "" -> opts
      proxy_url ->
        IO.puts("Using HTTPS_PROXY for assets: #{proxy_url}")
        Keyword.put(opts, :http_opts, proxy: proxy_url)
    end
end

# In docker-compose.yml web service

```yaml
  environment:
    - HTTPS_PROXY=http://host.docker.internal:40000
````

## WARP modes

- `proxy`: Routes traffic through Cloudflare's network using a local proxy server. This mode is useful for bypassing restrictions on specific websites or services.
- `warp`: Encrypts all your internet traffic and routes it through Cloudflare's network, providing enhanced privacy and security.

I'm using just `warp` mode so no need to do anything special in Docker or in the Elixir app.
