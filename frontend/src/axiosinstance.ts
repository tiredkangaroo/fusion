import axios from "axios";

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:8000",
});

export default axiosInstance;
export const acceptableCodes = [200, 304];
