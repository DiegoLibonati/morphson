import { envs } from "@src/config/env.config";

import app from "@src/app";

const PORT = envs.PORT;
const ENV = envs.ENV;
const BASE_URL = envs.BASE_URL;

const onInit = () => {
  const baseUrl = ENV === "development" ? `http://localhost:${PORT}` : BASE_URL;

  console.log(`🚀 Server running in ${ENV} mode on ${baseUrl}`);
};

app.listen(PORT, onInit);
