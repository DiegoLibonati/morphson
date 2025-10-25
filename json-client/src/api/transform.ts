import axios from "axios";

export const transformApi = axios.create({
  baseURL: `/api/v1/transform`,
});
