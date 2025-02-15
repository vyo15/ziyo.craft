import axios from "axios";
import { error } from "console";
import { config } from "process";

const headers = {
  accept: "application/json",
  "Content-Type": "application/json",
  "cache-control": "no-cache",
  Expires: "0",
};

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers,
  timeout: 60 * 1000,
});

instance.interceptors.response.use(
  (config) => config,
  (error) => Promise.reject(error)
);

instance.interceptors.request.use(
  (Response) => Response,
  (error) => Promise.reject(error)
);

export default instance;
