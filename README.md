<p align="center">
  <a href="#" target="blank"><img src="./assets/nest-logo.svg" width="200" alt="Nest Logo" /></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript repository of a Time-Lock server.

## Installation

```bash
npm install
```

## Environment Variables

```
API_ACCESS_TOKEN=SET_SOMETHING_RANDOM

PG_DATABASE_URL=_YOUR_POSTGRES_DATABASE_CONNECTION_URL
PG_DATABASE_EXTRA_OPTIONS=_CockroachDB_extra_options
PG_DATABASE_SSL=true

SYNC_DATABASE=false
DROP_DATABASE=false
```

## Running the app

```bash
# development
npm run start:dev

# production mode
npm run start:prod
```

## OpenAPI Documentation Endpoints

```
/openapi
/openapi-json
/openapi-yaml
```
Examples:

- https://timelock.onrender.com/openapi
- https://timelock.onrender.com/openapi-json
- https://timelock.onrender.com/openapi-yaml
- https://timelock.cyclic.app/openapi
- https://timelock.cyclic.app/openapi-json
- https://timelock.cyclic.app/openapi-yaml

## License

This repository is under [AGPLv3](./LICENSE.md) license.