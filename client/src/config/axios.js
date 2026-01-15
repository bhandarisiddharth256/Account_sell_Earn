import axios from 'axios';

const api = axios.create({
    baseURL : import.meta.env.VITE_BASE_URL || "https://account-sellearn-server.vercel.app"
})

export default api