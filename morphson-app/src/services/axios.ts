import axios from "axios";

export const apiFile = axios.create({
  baseURL: `/api/v1/file`,
});

export const apiInput = axios.create({
  baseURL: `/api/v1/inputs`,
});

export const apiOutput = axios.create({
  baseURL: `/api/v1/outputs`,
});

export const apiTransform = axios.create({
  baseURL: `/api/v1/transform`,
});
