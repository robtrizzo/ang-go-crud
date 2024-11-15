# Angular / Go CRUD App

View a table of users; create, edit, and delete them.

Client uses Angular 16 with Material

Server uses Go 1.22

Database uses PostgreSQL

## Dev Environment

Create `.server.dev.env` and `.db.dev.env` files - use the example env files as references for what they require.

> Note: docker-compose persistent volumes don't refresh between restarts, so if you change the `.db.dev.env` vars, make sure to tear down the `pgdata` volume with `docker-compose -f docker-compose.dev.yml down -v`.

Build the dev project with `docker-compose -f docker-compose.dev.yml build`. Run it with `docker-compose -f docker-compose.dev.yml up`.

Navigate to `http://localhost:4200` to view the client. Run `curl localhost:1323` to healthcheck the server.

### Without Docker

#### Server

Create a `/server/.env` file with the DB_URL var. Use `.server.env.example` as an example.

Run `go mod download`

Navigate to the `/server` directory and run `go run cmd/main.go`.

Run `curl localhost:1323` to test the server.

#### Client

Navigate to the `/client` directory

Run `npm install -g @angular/cli@16`

Run `npm install`

Run `ng serve`

Navigate to `http://localhost:4200` to view the client.


## Testing

### With Docker

#### Server

Run `docker exec -it server_go go test ./controller`

#### Client

For now, run client tests locally after installing dependencies.

TODO: requires adding a chrome binary to the client docker image. 

Could even be worth creating a standalone container for the purpose of testing so that the client dev container doesn't get bloated.

### Without Docker

#### Server

Navigate to `/server`

Run `go test ./controller`

#### Client

Navigate to `/client`

Run `ng test`
