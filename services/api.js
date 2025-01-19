import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "https://pitp-graduatedirectory.vercel.app/api", // Replace with your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach the token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-auth-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Export Axios instance
export default api;