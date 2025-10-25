import axios from "axios";

export const inputApi = axios.create({
  baseURL: `/api/v1/inputs`,
});
