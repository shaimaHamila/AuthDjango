import axios, { InternalAxiosRequestConfig } from "axios";
import { ACCESS_TOKEN } from "../helpers/Constans";

export const publicApi = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}/api`
});

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}/api`,
    withCredentials: false,
    timeout: 10000
})

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig<any>) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers = config.headers || {}
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }

)

api.interceptors.request.use(
    (response: any) => {
        return response
    },
    async (error) => {
        if (error.response.status === 401 || error.response.status === 500) {
            localStorage.removeItem(ACCESS_TOKEN);
            window.location.href = "/login";
        }
        return Promise.reject(error);
    },
);

export default api