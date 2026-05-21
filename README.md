# Morphson

## Educational Purpose

This project was created primarily for **educational and learning purposes**.  
While it is well-structured and could technically be used in production, it is **not intended for commercialization**.  
The main goal is to explore and demonstrate best practices, patterns, and technologies in software development.

## Description

**Morphson** is a full-stack web application that automates the transformation of JSON files using a template-based mapping system.

The core workflow has two steps:

**1. Upload an Input JSON**
You upload an existing JSON file — this is your data source. Morphson parses it, flattens all nested keys into dot-notation paths, and stores the file along with its key-value map in a PostgreSQL database.

**2. Define and apply a Transformation Template (Output JSON)**
Using the built-in Monaco editor (the same editor that powers VS Code), you write a JSON template where any value can reference a key from the Input JSON using the `input.<key>` syntax. Morphson provides autocomplete suggestions for all available keys as you type. Once ready, you trigger the transformation: the API resolves every `input.<key>` reference to its actual value from the Input JSON and returns the resulting file as a download.

**Example:**

Input JSON:

```json
{ "user": { "name": "Diego", "country": "Argentina" } }
```

Transformation template:

```json
{ "fullName": "input.user.name", "location": "input.user.country" }
```

Transformed output:

```json
{ "fullName": "Diego", "location": "Argentina" }
```

**Reusable Output Templates**
Transformation templates can be saved to the database and reused across different Input JSONs. This is the key automation feature: define the mapping structure once, then apply it to any number of Input JSONs that share the same schema. This is particularly useful for workflows that repeatedly need to convert or reshape JSON data from one format to another — for example, translating API responses into a different structure, generating config files from environment-specific data, or adapting payloads between services with incompatible schemas.

### API Endpoints

The API surface that the frontend (and any external client) consumes is exposed under `/api/v1`:

---

- **Endpoint Name**: Get Input Jsons
- **Endpoint Method**: GET
- **Endpoint Prefix**: /api/v1/inputs
- **Endpoint Fn**: This endpoint obtains all the Input Jsons
- **Endpoint Params**: None

---

- **Endpoint Name**: Get Input Json
- **Endpoint Method**: GET
- **Endpoint Prefix**: /api/v1/inputs/:idInputJson
- **Endpoint Fn**: This endpoint obtains a Json Input through an id given by params
- **Endpoint Params**:

```ts
{
  idInputJson: string;
}
```

---

- **Endpoint Name**: Get Output Jsons
- **Endpoint Method**: GET
- **Endpoint Prefix**: /api/v1/outputs
- **Endpoint Fn**: This endpoint obtains all the Output Jsons
- **Endpoint Params**: None

---

- **Endpoint Name**: Get Output Json
- **Endpoint Method**: GET
- **Endpoint Prefix**: /api/v1/outputs/:idOutputJson
- **Endpoint Fn**: This endpoint obtains a Json Output through an id given by params
- **Endpoint Params**:

```ts
{
  idOutputJson: string;
}
```

---

- **Endpoint Name**: Upload Input Json
- **Endpoint Method**: POST
- **Endpoint Prefix**: /api/v1/inputs
- **Endpoint Fn**: This endpoint is used to upload a Json Input and then use its values to translate or create a new Json.
- **Endpoint Body**:

```ts
{
  name: string;
  content: string;
}
```

---

- **Endpoint Name**: Get File Content
- **Endpoint Method**: POST
- **Endpoint Prefix**: /api/v1/file/content
- **Endpoint Fn**: This endpoint is used to obtain the content of a Json file.
- **Endpoint Body**:

```ts
{
  file: File;
}
```

---

- **Endpoint Name**: Transform Json
- **Endpoint Method**: POST
- **Endpoint Prefix**: /api/v1/transform
- **Endpoint Fn**: This endpoint is used to translate a Json of type Output thanks to the values of the keys of an Input Json. It also downloads the Json file to be able to use it. You can also save the Output Json structure for future translations or new Json through the same type of Input Json used but with different or the same values. `outputJsonNameToSave` is required only when `saveOutputJson` is `true`.
- **Endpoint Body**:

```ts
{
  idInputJson: string;
  saveOutputJson: boolean;
  outputJsonNameToSave?: string;
  contentJsonToTransform: string;
}
```

---

- **Endpoint Name**: Health Liveness
- **Endpoint Method**: GET
- **Endpoint Prefix**: /api/v1/health/live
- **Endpoint Fn**: Liveness probe. Returns 200 when the process is up. Used by Docker's `HEALTHCHECK` and external load balancers.
- **Endpoint Params**: None

---

- **Endpoint Name**: Health Readiness
- **Endpoint Method**: GET
- **Endpoint Prefix**: /api/v1/health/ready
- **Endpoint Fn**: Readiness probe. Returns 200 when the service is ready to accept traffic.
- **Endpoint Params**: None

## Technologies used

The stack is split between a Vite-powered React frontend, a Node.js + Express API, and a PostgreSQL database managed through Prisma. Everything runs containerized via Docker.

FrontEnd:

1. React JS
2. Typescript
3. TailwindCSS
4. CSS3
5. Vite

BackEnd:

1. NodeJS
2. Typescript

Deploy:

1. Docker
2. Nginx

Database:

1. SQL -> Postgres -> Prisma

## Libraries used

### Frontend

#### Dependencies

```
"@monaco-editor/react": "^4.6.0"
"axios": "^1.7.7"
"monaco-editor": "^0.52.0"
"react": "^19.2.4"
"react-dom": "^19.2.4"
"react-icons": "^5.3.0"
"react-router-dom": "7.13.2"
```

#### devDependencies

```
"@eslint/js": "^9.0.0"
"@testing-library/dom": "^10.4.0"
"@testing-library/jest-dom": "^6.6.3"
"@testing-library/react": "^16.0.1"
"@testing-library/user-event": "^14.5.2"
"@types/jest": "^30.0.0"
"@types/node": "^22.0.0"
"@types/react": "^19.2.14"
"@types/react-dom": "^19.2.3"
"@vitejs/plugin-react": "^5.0.2"
"autoprefixer": "^10.4.18"
"eslint": "^9.0.0"
"eslint-config-prettier": "^9.0.0"
"eslint-plugin-prettier": "^5.5.5"
"eslint-plugin-react-hooks": "^5.0.0"
"eslint-plugin-react-refresh": "^0.4.0"
"globals": "^15.0.0"
"jest": "^30.3.0"
"jest-environment-jsdom": "^30.3.0"
"lint-staged": "^15.0.0"
"msw": "2.10.4"
"postcss": "^8.4.37"
"prettier": "^3.0.0"
"tailwindcss": "^3.4.1"
"ts-jest": "^29.4.6"
"typescript": "^5.2.2"
"typescript-eslint": "^8.0.0"
"undici": "^7.25.0"
"vite": "^7.1.6"
```

### Backend

#### Dependencies

```
"@prisma/client": "^5.20.0"
"express": "^4.21.0"
"express-rate-limit": "^8.5.2"
"helmet": "^8.1.0"
"multer": "^1.4.5-lts.1"
"pino": "^10.3.1"
"pino-http": "^11.0.0"
"zod": "^4.4.3"
```

#### devDependencies

```
"@eslint/js": "^9.0.0"
"@types/express": "^5.0.0"
"@types/jest": "^30.0.0"
"@types/multer": "^1.4.12"
"@types/node": "^22.0.0"
"@types/supertest": "^6.0.2"
"eslint": "^9.0.0"
"eslint-config-prettier": "^9.0.0"
"eslint-plugin-prettier": "^5.0.0"
"globals": "^15.0.0"
"jest": "^30.0.0"
"lint-staged": "^15.0.0"
"pino-pretty": "^13.1.3"
"prettier": "^3.0.0"
"prisma": "^5.20.0"
"supertest": "^7.0.0"
"ts-jest": "^29.4.6"
"tsc-alias": "^1.8.16"
"tsx": "^4.0.0"
"typescript": "^5.5.3"
"typescript-eslint": "^8.0.0"
```

## Getting Started

With the dependencies in mind, here is how to bring the project up locally. The application boots through `docker-compose`, but you must install Node packages in each workspace beforehand so the editor and lint tooling resolve types correctly.

1. Clone the repository with `git clone "repository link"`
2. Copy the example env files in each workspace before continuing — the app won't start without them. From the project root, copy `morphson-app/.env.example` to `morphson-app/.env` and `morphson-api/.env.example` to `morphson-api/.env`. The meaning of every key is documented in [Env Keys](#env-keys) below.
3. Join to `morphson-app` folder and `morphson-api` folder and execute: `npm install` or `yarn install` in the terminal
4. Go to the previous folder and execute: `docker-compose -f dev.docker-compose.yaml build --no-cache` in the terminal
5. Once built, you must execute the command: `docker-compose -f dev.docker-compose.yaml up --force-recreate` in the terminal

NOTE: You have to be standing in the folder containing the: `dev.docker-compose.yaml` and you need to install `Docker Desktop` if you are in Windows.

## Env Keys

Both workspaces use their own `.env` file. The API validates its env at startup with `zod` and refuses to boot if any required key is missing or malformed. Production-specific values are listed later in [Production → Environment](#environment).

1. `VITE_API_URL`: Refers to the API URI used by the frontend.
2. `PORT`: Refers to the port on which the API is exposed.
3. `DATABASE_URL`: Refers to the database connection URI.
4. `NODE_ENV`: The key to distinguish the environment in which the app is running (`development` | `production` | `test`).
5. `BASE_URL`: The URL where the app is hosted.
6. `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SCHEMA`: Postgres connection parameters used by the API container.
7. `LOG_LEVEL`: Pino log level (`fatal` | `error` | `warn` | `info` | `debug` | `trace` | `silent`). Defaults to `info`.
8. `RATE_LIMIT_WINDOW_MS`: Rate-limit window in milliseconds. Defaults to `900000` (15 min).
9. `RATE_LIMIT_MAX`: Max requests per window. `0` disables the limiter. Defaults to `0`.
10. `BODY_LIMIT`: JSON / urlencoded body size limit (e.g. `100kb`, `1mb`, `1gb`). Defaults to `1gb`.
11. `PRISMA_LOG_QUERIES`: When `true`, Prisma logs every query in development. Defaults to `false`.
12. `SEED_DEFAULT_DATA`: When `true`, the API seeds default data on boot. Defaults to `false`.

Development example values:

```ts
# Frontend Envs (morphson-app/.env)
VITE_API_URL=http://api:5050

# Backend Envs (morphson-api/.env)
PORT=5050
NODE_ENV=development
BASE_URL=
DATABASE_URL=postgresql://root:admin@host.docker.internal:5432/morphson_db?schema=public
LOG_LEVEL=info
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=0
BODY_LIMIT=1gb
PRISMA_LOG_QUERIES=false
```

## Testing

Each workspace has its own Jest test suite. Run them in the corresponding folder.

### Frontend

The frontend uses `jest-environment-jsdom` plus `msw` (Mock Service Worker) and `undici` polyfills to intercept HTTP calls in tests without hitting a real backend.

1. Navigate to the `morphson-app`
2. Execute: `npm test`

For coverage report:

```bash
npm run test:coverage
```

### Backend

> **Docker is required.** Backend tests run against a real PostgreSQL instance. The Jest `globalSetup` boots the `test.docker-compose.yml` stack (Postgres on host port `5433`) and runs `prisma migrate deploy` before any test file executes, so mocked-DB drift can't mask a broken migration.

1. Navigate to the `morphson-api`
2. Execute: `npm test`

For coverage report:

```bash
npm run test:coverage
```

### Run both suites in parallel

From the repo root:

```bash
./run-tests.sh
```

It boots both Jest runs concurrently and prints a colored summary per package.

## Security Audit

Once tests pass, audit dependencies and project health before producing a build.

### npm audit

Check for vulnerabilities in dependencies:

```bash
npm audit
```

### React Doctor

Run a health check on the project (security, performance, dead code, architecture):

```bash
npm run doctor
```

Use `--verbose` to see specific files and line numbers:

```bash
npm run doctor -- --verbose
```

## Build

The production setup uses `prod.docker-compose.yaml` with multi-stage Docker builds. Build the images first; the deploy step lives in [Production](#production).

```bash
# Build all services
docker-compose -f prod.docker-compose.yaml build --no-cache
```

## Continuous Integration

The repository ships with a **GitHub Actions** pipeline defined in [`.github/workflows/ci.yml`](.github/workflows/ci.yml). It runs automatically on every `push` and `pull_request` targeting the `main` branch. The pipeline is intentionally **sequential**: a failure in any earlier job short-circuits the rest, so a broken backend never wastes CI minutes on the frontend or on Docker images.

### Pipeline overview

```
                  ┌─── PR or push to main ───┐
                  ▼                          ▼
┌───────────────────────────────────────────────────────────┐
│                   BACKEND (morphson-api)                  │
│                                                           │
│  lint-and-audit  ─▶   testing    ─▶   build               │
│  eslint · prettier   jest + docker    tsc + tsc-alias     │
│  type-check · audit  postgres                             │
└───────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│                  FRONTEND (morphson-app)                  │
│                                                           │
│  lint-and-audit  ─▶   testing    ─▶   build               │
│  eslint · prettier   jest + jsdom     vite build          │
│  type-check · audit  msw                                  │
└───────────────────────────────────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│                       docker-build                        │
│            4-image matrix in parallel (buildx)            │
│       api:dev  ·  api:prod  ·  app:dev  ·  app:prod       │
└───────────────────────────────────────────────────────────┘
```

### Validation jobs (run on every PR and push)

1. **`backend-lint-and-audit`** — `npm ci --ignore-scripts`, `prisma generate`, `eslint`, `prettier --check`, `tsc --noEmit`, `npm audit --audit-level=high` (the audit is informative; it does not fail the build).
2. **`backend-test`** — same install + `prisma generate`, then runs the full Jest suite. The suite spins up `test.docker-compose.yml` (Postgres on port `5433`) inside the job via `jest.globalSetup.ts` and applies `prisma migrate deploy` before any test file executes.
3. **`backend-build`** — compiles the API with `tsc` + `tsc-alias` to confirm the artifact would build for production.
4. **`frontend-lint-and-audit`** — `eslint`, `prettier --check`, `tsc --noEmit`, `npm audit --audit-level=high`.
5. **`frontend-test`** — runs the Jest + jsdom suite with MSW + `undici` polyfills installed.
6. **`frontend-build`** — runs `vite build` against `tsconfig.app.json` to confirm the SPA bundles cleanly.
7. **`docker-build`** — `docker/setup-buildx-action` followed by a parallel `fail-fast: false` matrix that builds the four images: `morphson-api:dev`, `morphson-api:prod`, `morphson-app:dev`, `morphson-app:prod`. The images are built but **not pushed** anywhere — this stage is a smoke test that all Dockerfiles still produce a valid image.

> The repository does **not** ship a release pipeline (no tagging, no GitHub Releases, no image registry pushes). The Docker images produced in CI are ephemeral and discarded with the runner.

### Per-package isolation

Every Node job uses:

- `node-version-file: morphson-<api|app>/.nvmrc` so all runs pin Node 22.
- `cache: npm` with `cache-dependency-path: morphson-<api|app>/package-lock.json` so each workspace caches independently.
- `defaults.run.working-directory: morphson-<api|app>` so scripts resolve against the correct `package.json`.

### Where the build outputs live

| Output | Location |
|---|---|
| Validation logs (lint, tests, audit) | **Actions** tab on GitHub |
| Compiled API (`dist/`) | Ephemeral, inside the runner |
| Compiled SPA (`dist/`) | Ephemeral, inside the runner |
| Docker images | Built in the runner, not pushed — local `docker compose build` is the way to obtain them |

### Running the same checks locally

From inside `morphson-api`:

```bash
npm ci --ignore-scripts
npx prisma generate

npm run lint
npm run format:check
npm run type-check
npm audit --audit-level=high

npm test          # spins up test Postgres via docker compose
npm run build
```

From inside `morphson-app`:

```bash
npm ci --ignore-scripts

npm run lint
npm run format:check
npm run type-check
npm audit --audit-level=high

npm test
npm run build
```

Or run both Jest suites in parallel from the repo root with `./run-tests.sh`.

## Production

This is the final release checklist. It does not duplicate the previous steps — work through them in order, then add the production-only configuration described below.

1. Run [Testing](#testing) on both workspaces.
2. Run the [Security Audit](#security-audit) checks.
3. Run the [Build](#build) step to produce the production images.
4. Configure the production `.env` files (see [Environment](#environment) below).
5. Apply Prisma migrations and start the stack (see [Deploy](#deploy) and [Database Migrations](#database-migrations)).

The frontend is served by Nginx and the API is accessible only internally through the Nginx proxy — it is never exposed directly to the host.

### Environment

Set the following in each `.env` file before starting the containers. Use `.env.example` as reference — never commit real credentials.

```bash
# morphson-api/.env
NODE_ENV=production
PORT=5050
BASE_URL=https://your-domain.com

DB_HOST=morphson-db
DB_PORT=5432
DB_USER=<your_user>
DB_PASSWORD=<your_password>
DB_NAME=morphson_db
DB_SCHEMA=public
DATABASE_URL=postgresql://<user>:<password>@morphson-db:5432/morphson_db?schema=public

# morphson-app/.env
VITE_API_URL=http://morphson-api:5050
```

> The `CHOKIDAR_*` variables are only needed in development for Docker hot reload. Omit them in production.

### Deploy

With the images built and the env files in place, bring the stack up in detached mode:

```bash
docker-compose -f prod.docker-compose.yaml up --force-recreate -d
```

### Database Migrations

Before starting the API for the first time — and after every schema change — run Prisma migrations inside the API container:

```bash
docker-compose -f prod.docker-compose.yaml exec morphson-api npm run migrate:deploy
```

> `migrate:deploy` applies all pending migrations without interactive prompts. Never use `migrate:dev` in production.

### Services & Ports

| Service        | Host Port     | Description                                                    |
| -------------- | ------------- | -------------------------------------------------------------- |
| `morphson-app` | `3000`        | Nginx serves the React frontend                                |
| `morphson-api` | internal only | Not exposed on the host; accessed via Nginx proxy at `/api/v1` |
| `morphson-db`  | `5432`        | PostgreSQL 16                                                  |

### What Nginx Handles

- Serves the compiled React SPA and redirects all unknown routes to `index.html` (client-side routing)
- Proxies `/api/v1/*` requests to `morphson-api:5050` — the API is never directly reachable from outside
- Gzip compression on text assets
- Static assets (`js`, `css`, images) cached for 1 year; `index.html` is never cached so deploys take effect immediately
- Security headers: `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer-when-downgrade`

### Health Checks

All three containers have configured health checks in `prod.docker-compose.yaml`. Docker waits for `morphson-db` to pass `pg_isready` before starting the API, and waits for the API before starting the frontend.

The API also exposes two endpoints usable by external load balancers or monitoring tools:

```
GET /api/v1/health/live  → 200 { "code": "...", "message": "Service is alive.", "data": null }
GET /api/v1/health/ready → 200 { "code": "...", "message": "Service is ready.", "data": null }
```

`Dockerfile.production` wires the `live` endpoint into Docker's `HEALTHCHECK` directive, so the container reports `unhealthy` if the process stops responding.

### Security Notes

- Containers run as a non-root user (`appuser`) — both API and frontend images follow this pattern.
- The API is never exposed on a host port; all external traffic goes through Nginx.
- PostgreSQL data is persisted via the named Docker volume `db-data`. Removing it will wipe the database permanently.
- `helmet` is mounted at the top of the Express stack to set safe defaults (CSP, X-Frame-Options, etc.) and `x-powered-by` is disabled.
- `express-rate-limit` protects every route under `/api/v1`. Tune it via `RATE_LIMIT_WINDOW_MS` / `RATE_LIMIT_MAX`.
- All requests carry a unique `X-Request-Id` (via the `requestId` middleware) and are logged through `pino-http`. In production logs are emitted as structured JSON; in development `pino-pretty` is used for readability.
- `zod` validates every incoming `params` / `body` payload via the `validate` middleware before it reaches the controller — invalid input never touches the database.

## Git Hooks

The repo uses a **centralized pre-commit hook** at `.githooks/pre-commit` (no Husky involved). The hook is registered automatically the first time you run `npm install` inside `morphson-app` — its `prepare` script runs:

```bash
cd ../ && git config core.hooksPath .githooks
```

When you commit, the hook inspects the staged files and runs `lint-staged` (ESLint + Prettier) **only inside the packages whose files actually changed**:

- Staged files under `morphson-api/` → lint-staged inside `morphson-api`.
- Staged files under `morphson-app/` → lint-staged inside `morphson-app`.

The hook fails fast with a clear message if `npx` (Node.js) is missing. Cross-platform shell-script safety is handled via `.gitattributes` (LF enforced) so the same hook works on Windows, macOS and Linux.

## Known Issues

None at the moment.

### Pending Tasks

Open items if you'd like to contribute:

1. To be able to customize the values of an array of elements of a json input

## Version

```ts
APP VERSION: 0.0.1
README UPDATED: 10/05/2026
AUTHOR: Diego Libonati
```

## Portfolio Link

[`https://www.diegolibonati.com.ar/#/project/morphson`](https://www.diegolibonati.com.ar/#/project/morphson)
