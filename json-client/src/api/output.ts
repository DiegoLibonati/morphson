import axios from "axios";

export const outputApi = axios.create({
  baseURL: `/api/v1/outputs`,
});
