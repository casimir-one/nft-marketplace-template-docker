### Requirements

- docker
- docker-compose
- node.js v14+
- mongotools: [mongorestore](https://www.mongodb.com/docs/database-tools/mongorestore/), [mongodump](https://www.mongodb.com/docs/database-tools/mongodump/) (for database preset configuration)
- Make utility [make](https://www.gnu.org/software/make/)

### Launch on local environment

##### 1. Add the following records to your local `/etc/hosts` file

```
127.0.0.1 local.casimir.one local.webserver.http.casimir.one local.appchain.ws.casimir.one local.appchain.http.casimir.one local.wallet.casimir.one local.wallet.webserver.casimir.one local.kafka.casimir.one local.dashboard.casimir.one
```

##### 2. Run the application in local docker environment

```sh
make start-local
```

If you need to clear local environment from the application containers and data volumes, run:

```sh
make clean-local
```

Restart the application in local environment and purge existing data volumes

```sh
make restart-local
```

### Development on local environment

##### 1. Add the following records to your local `/etc/hosts` file

```
127.0.0.1 local.casimir.one local.webserver.http.casimir.one local.appchain.ws.casimir.one local.appchain.http.casimir.one local.wallet.casimir.one local.wallet.webserver.casimir.one local.kafka.casimir.one local.dashboard.casimir.one
```

##### 2. Run microservices in local docker environment

```sh
make start-dev
```

If you need to clear local environment from the application containers and data volumes, run:

```sh
make clean-dev
```

To restart microservices in local environment and purge existing data volumes:

```sh
make restart-dev
```
