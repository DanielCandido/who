import { baseURL } from "@/config";
import axios from "axios";

export interface CustomHeaders {
  key: string;
  value: string;
}

const api = axios.create({ baseURL: baseURL });

api.interceptors.request.use((request) => {
  console.log({ request });
  return request;
});

api.interceptors.response.use(
  (response) => {
    // console.log({response});
    return response;
  },
  (error) => {
    // console.log({error});
    return Promise.reject(error);
  }
);

export default api;
