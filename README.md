## Requirements

- docker
- docker-compose
- node.js v14+
- mongotools: [mongorestore](https://www.mongodb.com/docs/database-tools/mongorestore/), [mongodump](https://www.mongodb.com/docs/database-tools/mongodump/) (for database preset configuration)
- Make utility [make](https://www.gnu.org/software/make/)

## Setup

Add the following records to your local `/etc/hosts` file

```
127.0.0.1 local.casimir.one local.webserver.http.casimir.one local.appchain.ws.casimir.one local.appchain.http.casimir.one local.wallet.casimir.one local.wallet.webserver.casimir.one local.kafka.casimir.one local.dashboard.casimir.one
```

---

### Run the application on local environment

##### Run entire application in local docker environment

```sh
make start-local
```

##### Clear local environment

```sh
make stop-local
```

---

### Frontend development on local environment

##### Run required microservices for frontend development in local docker environment

```sh
make start-frontend-dev
```

##### Clear local environment

```sh
make stop-frontend-dev
```

---

### Backend and Frontend development on local environment

##### Run required microservices for frontend/backend development in local docker environment

```sh
make start-backend-frontend-dev
```

##### Clear local environment

```sh
make stop-backend-frontend-dev
```