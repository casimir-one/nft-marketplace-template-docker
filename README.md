### Requirements

- docker
- docker-compose
- node.js v14+
- mongotools: [mongorestore](https://www.mongodb.com/docs/database-tools/mongorestore/), [mongodump](https://www.mongodb.com/docs/database-tools/mongodump/) (for database preset configuration)
- Make utility [make](https://www.gnu.org/software/make/)


### Launch on local environment

1. Add the following records to your local `/etc/hosts` file:

```
127.0.0.1 local.casimir.one local.webserver.http.casimir.one local.appchain.ws.casimir.one local.appchain.http.casimir.one local.wallet.casimir.one local.wallet.webserver.casimir.one local.kafka.casimir.one local.dashboard.casimir.one
```

2. Run the application in local docker environment:

```sh
make start-local
```

Clean local environment from application containers and data volumes

```sh
make clean-local
```

Restart the application in local environment and purge existing data volumes

```sh
make restart-local
```


### Development on local environment

1. Add the following records to your local `/etc/hosts` file:

```
127.0.0.1 local.casimir.one local.webserver.http.casimir.one local.appchain.ws.casimir.one local.appchain.http.casimir.one local.wallet.casimir.one local.wallet.webserver.casimir.one local.kafka.casimir.one local.dashboard.casimir.one
```

1. Run microservices in local docker environment:

```sh
make start-dev
```

Clean local environment from application containers and data volumes

```sh
make clean-dev
```

Restart microservices in local environment and purge existing data volumes

```sh
make restart-dev
```
