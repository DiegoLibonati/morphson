import axios from "axios";

export const transformApi = axios.create({
  baseURL: `/api/v1/transform`,
});

export const fileApi = axios.create({
  baseURL: `/api/v1/file`,
});

export const inputApi = axios.create({
  baseURL: `/api/v1/inputs`,
});

export const outputApi = axios.create({
  baseURL: `/api/v1/outputs`,
});
