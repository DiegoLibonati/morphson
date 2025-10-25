import axios from "axios";

export const fileApi = axios.create({
  baseURL: `/api/v1/file`,
});
