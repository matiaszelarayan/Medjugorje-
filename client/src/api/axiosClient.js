import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
const REFRESH_URL = `${BASE_URL}auth/token/refresh/`;

const axiosClient = axios.create({
  baseURL: BASE_URL,
});

// Interceptor para agregar el token
axiosClient.interceptors.request.use((config) => {
  const access = localStorage.getItem("access");

  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }

  return config;
});

// Interceptor para renovar el token automáticamente
axiosClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refresh");

      try {
        const res = await axios.post(
          REFRESH_URL,
          {
            refresh,
          }
        );

        localStorage.setItem("access", res.data.access);

        axiosClient.defaults.headers.Authorization = `Bearer ${res.data.access}`;

        return axiosClient(originalRequest);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        console.error("REFRESH TOKEN EXPIRADO");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;


 