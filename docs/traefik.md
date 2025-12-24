# Why traefik in development?

Traefik is used to simulate a production setup where we have multiple subdomains and services. It allows us to route traffic to different applications based on the domain name, making it easier to manage and test our applications in a local environment.

This also help simulate assets being served from a different domain, which is a common practice in production to improve performance and security.


### /ect/hosts
```bash
127.0.0.1 pingcrm.test
127.0.0.1 app.pingcrm.test
127.0.0.1 assets.pingcrm.test
127.0.0.1 vite.pingcrm.test
```

## SSL certificates in development
```bash
cd docker/dev-certificates
mkcert "*.pingcrm.test" pingcrm.test
```

## How install mkcert
```bash
brew install mkcert
brew install nss # if you use Firefox
```
