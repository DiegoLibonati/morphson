import axios from "axios";

import { APP_CONFIG } from "@/src/constants/config";

export const jsonApi = axios.create({
  baseURL: APP_CONFIG.API_PREFIX,
});
