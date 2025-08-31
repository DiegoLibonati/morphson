# JSON Transformer

## Getting Started

1. Clone the repository with `git clone "repository link"`
2. Join to `json-client` folder and `json-api` folder and execute: `npm install` or `yarn install` in the terminal
3. Go to the previous folder and execute: `docker-compose -f dev.docker-compose.yaml build --no-cache` in the terminal
4. Once built, you must execute the command: `docker-compose -f dev.docker-compose.yaml up --force-recreate` in the terminal

NOTE: You have to be standing in the folder containing the: `dev.docker-compose.yaml` and you need to install `Docker Desktop` if you are in Windows.

## Description

This project aims to automate the creation and/or translation of new JSON files by leveraging an existing JSON file. The core idea and functionality involve extracting the values from the keys of the old JSON to reuse them when creating a new JSON. Additionally, it allows saving the structure of the new JSON to reuse the values from different old JSON files. This enables automation, simplifying the process of translating or generating new JSON structures.

## Technologies used

FrontEnd:

1. React
2. Typescript
3. TailwindCSS
4. CSS3
5. HTML5

BackEnd:

1. NodeJS
2. Typescript

Deploy:

1. Docker

Database:

1. SQL - Postgres

## Libraries used

### Frontend

#### Dependencies

```
"react": "^18.3.1"
"react-dom": "^18.3.1"
"react-icons": "^5.3.0"
"react-router-dom": "^6.26.2"
"axios": "^1.7.7"
"@monaco-editor/react": "^4.6.0"
"monaco-editor": "^0.52.0"
```

#### devDependencies

```
"@testing-library/dom": "^10.4.0"
"@testing-library/jest-dom": "^6.6.2"
"@testing-library/react": "^16.0.1"
"@testing-library/user-event": "^14.5.2"
"@vitejs/plugin-react": "^4.3.1"
"@eslint/js": "^9.9.0"
"eslint": "^9.9.0"
"eslint-plugin-react-hooks": "^5.1.0-rc.0"
"eslint-plugin-react-refresh": "^0.4.9"
"autoprefixer": "^10.4.20"
"postcss-loader": "^8.1.1"
"tailwindcss": "^3.4.13"
"typescript": "^5.5.3"
"typescript-eslint": "^8.0.1"
"globals": "^15.9.0"
"vite": "^5.4.1"
"jest": "^29.7.0"
"jest-environment-jsdom": "^29.7.0"
"ts-jest": "^29.2.5"
"axios-mock-adapter": "^2.1.0"
"@types/jest": "^29.5.13"
"@types/node": "^22.7.4"
"@types/react": "^18.3.3"
"@types/react-dom": "^18.3.0"
```

### Backend

#### Dependencies

```
"@prisma/client": "^5.20.0"
"express": "^4.21.0"
"multer": "^1.4.5-lts.1"
```

#### devDependencies

```
"@types/express": "^5.0.0"
"@types/jest": "^29.5.14"
"@types/node": "^20.10.5"
"@types/supertest": "^6.0.2"
"@types/multer": "^1.4.12"
"prisma": "^5.20.0"
"nodemon": "^3.1.7"
"ts-node": "^10.9.2"
"typescript": "^5.5.3"
"tsconfig-paths": "^4.2.0"
"jest": "^29.7.0"
"supertest": "^7.0.0"
"ts-jest": "^29.2.5"
```

## Portfolio Link

[`https://www.diegolibonati.com.ar/#/project/JSON-Transformer`](https://www.diegolibonati.com.ar/#/project/JSON-Transformer)

## Video

https://github.com/user-attachments/assets/17fdb19c-e914-4127-976d-78d287afe2e1

## Testing

### Frontend

1. Join to `json-client` folder
2. Execute: `yarn test` or `npm test`

### Backend

1. Join to `json-api` folder
2. Execute: `yarn test` or `npm test`

## Documentation APP

### **Version**

```ts
APP VERSION: 0.0.1
README UPDATED: 01/01/2025
AUTHOR: Diego Libonati
```

### **Env Keys**

NOTE: You must create two .env, one for the client called `client.env` and one for the api called `api.env` both inside the json-config folder.

1. `VITE_API_URL`: Refers to the API URI
2. `VITE_API_PREFIX`: Refers to the prefix where API endpoints are used.
3. `PORT`: Refers to the port on which the API is exposed.
4. `DATABASE_URL`: Refers to the database connection URI

```ts
# Frontend Envs -> client.env
VITE_API_URL=http://api:3000
VITE_API_PREFIX=/api/v1

# Backend Envs -> api.env
PORT=3000
DATABASE_URL=postgresql://root:admin@db:5432/jsondb?schema=public
```

### **JSON Transformer Endpoints API**

---

- **Endpoint Name**: GetJsonInputs
- **Endpoint Method**: GET
- **Endpoint Prefix**: /api/v1/json/inputs
- **Endpoint Fn**: This endpoint obtains all the Input Jsons
- **Endpoint Params**: None

---

- **Endpoint Name**: GetJsonInput
- **Endpoint Method**: GET
- **Endpoint Prefix**: /api/v1/json/input/:id
- **Endpoint Fn**: This endpoint obtains a Json Input through an id given by params
- **Endpoint Params**:

```ts
{
  id: string;
}
```

---

- **Endpoint Name**: GetJsonOutputs
- **Endpoint Method**: GET
- **Endpoint Prefix**: /api/v1/json/outputs
- **Endpoint Fn**: This endpoint obtains all the Output Jsons
- **Endpoint Params**: None

---

- **Endpoint Name**: GetJsonOutput
- **Endpoint Method**: GET
- **Endpoint Prefix**: /api/v1/json/output/:id
- **Endpoint Fn**: This endpoint obtains a Json Output through an id given by params
- **Endpoint Params**:

```ts
{
  id: string;
}
```

---

- **Endpoint Name**: UploadJson
- **Endpoint Method**: POST
- **Endpoint Prefix**: /api/v1/json/upload
- **Endpoint Fn**: This endpoint is used to upload a Json Input and then use its values to translate or create a new Json.
- **Endpoint Body**:

```ts
{
  name: string;
  content: string;
}
```

---

- **Endpoint Name**: GetFileContent
- **Endpoint Method**: POST
- **Endpoint Prefix**: /api/v1/json/getContent
- **Endpoint Fn**: This endpoint is used to obtain the content of a Json file.
- **Endpoint Body**:

```ts
{
  file: File;
}
```

---

- **Endpoint Name**: TransformJson
- **Endpoint Method**: POST
- **Endpoint Prefix**: /api/v1/json/transform
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

### **PENDING TASKS - to develop if you want to help:**

1. To be able to customize the values of an array of elements of a json input