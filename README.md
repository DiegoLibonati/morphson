# Morphson

## Educational Purpose

This project was created primarily for **educational and learning purposes**.  
While it is well-structured and could technically be used in production, it is **not intended for commercialization**.  
The main goal is to explore and demonstrate best practices, patterns, and technologies in software development.

## Getting Started

1. Clone the repository with `git clone "repository link"`
2. Join to `morphson-app` folder and `morphson-api` folder and execute: `npm install` or `yarn install` in the terminal
3. Go to the previous folder and execute: `docker-compose -f dev.docker-compose.yaml build --no-cache` in the terminal
4. Once built, you must execute the command: `docker-compose -f dev.docker-compose.yaml up --force-recreate` in the terminal

NOTE: You have to be standing in the folder containing the: `dev.docker-compose.yaml` and you need to install `Docker Desktop` if you are in Windows.

## Description

**Morphson** is a full-stack web application that automates the transformation of JSON files using a template-based mapping system.

The core workflow has two steps:

**1. Upload an Input JSON**
You upload an existing JSON file â€” this is your data source. Morphson parses it, flattens all nested keys into dot-notation paths, and stores the file along with its key-value map in a PostgreSQL database.

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
Transformation templates can be saved to the database and reused across different Input JSONs. This is the key automation feature: define the mapping structure once, then apply it to any number of Input JSONs that share the same schema. This is particularly useful for workflows that repeatedly need to convert or reshape JSON data from one format to another â€” for example, translating API responses into a different structure, generating config files from environment-specific data, or adapting payloads between services with incompatible schemas.

## Technologies used

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
"husky": "^9.0.0"
"jest": "^30.3.0"
"jest-environment-jsdom": "^30.3.0"
"lint-staged": "^15.0.0"
"postcss": "^8.4.37"
"prettier": "^3.0.0"
"tailwindcss": "^3.4.1"
"ts-jest": "^29.4.6"
"typescript": "^5.2.2"
"typescript-eslint": "^8.0.0"
"vite": "^7.1.6"
```

### Backend

#### Dependencies

```
"@prisma/client": "^5.20.0"
"express": "^4.21.0"
"morgan": "^1.10.1"
"multer": "^1.4.5-lts.1"
```

#### devDependencies

```
"@eslint/js": "^9.0.0"
"@types/express": "^5.0.0"
"@types/jest": "^30.0.0"
"@types/morgan": "^1.9.10"
"@types/multer": "^1.4.12"
"@types/node": "^22.0.0"
"@types/supertest": "^6.0.2"
"eslint": "^9.0.0"
"eslint-config-prettier": "^9.0.0"
"eslint-plugin-prettier": "^5.0.0"
"globals": "^15.0.0"
"husky": "^9.0.0"
"jest": "^30.0.0"
"lint-staged": "^15.0.0"
"prettier": "^3.0.0"
"prisma": "^5.20.0"
"supertest": "^7.0.0"
"ts-jest": "^29.4.6"
"tsc-alias": "^1.8.16"
"tsx": "^4.0.0"
"typescript": "^5.5.3"
"typescript-eslint": "^8.0.0"
```

## Portfolio Link

[`https://www.diegolibonati.com.ar/#/project/morphson`](https://www.diegolibonati.com.ar/#/project/morphson)

## Testing

### Frontend

1. Navigate to the `morphson-app`
2. Execute: `npm test`

For coverage report:

```bash
npm run test:coverage
```

### Backend

1. Navigate to the `morphson-api`
2. Execute: `npm test`

For coverage report:

```bash
npm run test:coverage
```

## Production

### Build & Deploy

The production setup uses `prod.docker-compose.yaml` with multi-stage Docker builds. The frontend is served by Nginx and the API is accessible only internally through the Nginx proxy — it is never exposed directly to the host.

```bash
# Build all services
docker-compose -f prod.docker-compose.yaml build --no-cache

# Start all services
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

### Environment

Set the following in each `.env` file before building. Use `.env.example` as reference — never commit real credentials.

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

### What Nginx Handles

- Serves the compiled React SPA and redirects all unknown routes to `index.html` (client-side routing)
- Proxies `/api/v1/*` requests to `morphson-api:5050` — the API is never directly reachable from outside
- Gzip compression on text assets
- Static assets (`js`, `css`, images) cached for 1 year; `index.html` is never cached so deploys take effect immediately
- Security headers: `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer-when-downgrade`

### Health Checks

All three containers have configured health checks in `prod.docker-compose.yaml`. Docker waits for `morphson-db` to pass `pg_isready` before starting the API, and waits for the API before starting the frontend.

The API also exposes a dedicated endpoint usable by external load balancers or monitoring tools:

```
GET /health → 200 { "status": "ok" }
```

### Security Notes

- Containers run as a non-root user (`appuser`) — both API and frontend images follow this pattern.
- The API is never exposed on a host port; all external traffic goes through Nginx.
- PostgreSQL data is persisted via the named Docker volume `db-data`. Removing it will wipe the database permanently.
- In production, the API uses Morgan's `combined` log format (Apache-style) instead of the colorized `dev` format.

## Documentation APP

### **Version**

```ts
APP VERSION: 0.0.1
README UPDATED: 28/09/2025
AUTHOR: Diego Libonati
```

### **Env Keys**

1. `VITE_API_URL`: Refers to the API URI
2. `PORT`: Refers to the port on which the API is exposed.
3. `DATABASE_URL`: Refers to the database connection URI
4. `NODE_ENV` is the key to distinguish the environment in which the app is running.
5. `BASE_URL` key refers to the URL where the app is hosted.

```ts
# Frontend Envs
VITE_API_URL=http://api:3000

# Backend Envs
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://root:admin@host.docker.internal:5432/jsondb?schema=public
BASE_URL=
```

### **Morphson Endpoints API**

---

- **Endpoint Name**: Get Input Jsons
- **Endpoint Method**: GET
- **Endpoint Prefix**: /api/v1/inputs
- **Endpoint Fn**: This endpoint obtains all the Input Jsons
- **Endpoint Params**: None

---

- **Endpoint Name**: Get Input Json
- **Endpoint Method**: GET
- **Endpoint Prefix**: /api/v1/inputs/:id
- **Endpoint Fn**: This endpoint obtains a Json Input through an id given by params
- **Endpoint Params**:

```ts
{
  id: string;
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
- **Endpoint Prefix**: /api/v1/outputs/:id
- **Endpoint Fn**: This endpoint obtains a Json Output through an id given by params
- **Endpoint Params**:

```ts
{
  id: string;
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
- **Endpoint Fn**: This endpoint is used to translate a Json of type Output thanks to the values of the keys of an Input Json. It also downloads the Json file to be able to use it. You can also save the Output Json structure for future translations or new Json through the same type of Input Json used but with different or the same values.
- **Endpoint Body**:

```ts
{
  idInputJson: string;
  saveOutputJson: boolean;
  outputJsonNameToSave: string;
  contentJsonToTransform: string;
}
```

## Security

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

### **PENDING TASKS - to develop if you want to help:**

1. To be able to customize the values of an array of elements of a json input

## Known Issues

None at the moment.
