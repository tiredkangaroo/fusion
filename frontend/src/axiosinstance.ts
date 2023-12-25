import axios from "axios";

const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: "http://192.168.1.201:8000",
});

export default axiosInstance;
export const acceptableCodes = [200, 304];
