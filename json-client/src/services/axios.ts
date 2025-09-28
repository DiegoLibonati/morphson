import axios from "axios";

import { APP_CONFIG } from "@src/constants/config";

export const transformApi = axios.create({
  baseURL: `${APP_CONFIG.API_PREFIX}/transform`,
});

export const fileApi = axios.create({
  baseURL: `${APP_CONFIG.API_PREFIX}/file`,
});

export const inputApi = axios.create({
  baseURL: `${APP_CONFIG.API_PREFIX}/inputs`,
});

export const outputApi = axios.create({
  baseURL: `${APP_CONFIG.API_PREFIX}/outputs`,
});
