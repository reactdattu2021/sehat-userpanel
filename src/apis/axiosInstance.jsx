import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5002/Sehatmitra"
})

// ✅ AUTO-ATTACH JWT TOKEN
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ✅ HANDLE 401 ERRORS
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Only clear auth and redirect if user was actually logged in
            const wasLoggedIn = localStorage.getItem('authToken');

            if (wasLoggedIn) {
                console.log('🔒 Session expired - redirecting to login');
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
                window.location.href = '/';
            } else {
                // User wasn't logged in - just log the 401 and let the component handle it
                console.log('⚠️ 401 error on unauthenticated request - component will handle');
            }
        }
        return Promise.reject(error);
    }
);



export default axiosInstance