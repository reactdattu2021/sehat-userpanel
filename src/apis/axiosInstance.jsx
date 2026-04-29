import axios from "axios";

const axiosInstance = axios.create({
    baseURL:"https://sehatmitrabackend.onrender.com/Sehatmitra"
})

// ✅ AUTO-ATTACH JWT TOKEN (Only for protected routes)
axiosInstance.interceptors.request.use(
    (config) => {
        // List of public endpoints that don't need authentication
        const publicEndpoints = [
            '/user/getallequipment',
            '/user/getallservices',
            '/user/getequipment/',
            '/user/getservice/',
            '/user/equipmentfilters',
            '/user/servicefilters',
            '/services/filterdata/dropdown',
            '/services/globalsearch',
            '/user/blogs/all',
            '/user/blogs/',
            '/reviews/single/',
            '/user/search',
            '/userAddress/contactus',
            '/user/subscribe',
        ];

        // Check if the current request is to a public endpoint
        const isPublicEndpoint = publicEndpoints.some(endpoint =>
            config.url?.includes(endpoint)
        );

        // Only attach token if it's NOT a public endpoint
        if (!isPublicEndpoint) {
            const token = localStorage.getItem('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
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
                // console.log('🔒 Session expired - redirecting to login');
                localStorage.removeItem('authToken');
                localStorage.removeItem('userData');
                window.location.href = '/';
            } else {
                // User wasn't logged in - just log the 401 and let the component handle it
                // console.log('⚠️ 401 error on unauthenticated request - component will handle');
            }
        }
        return Promise.reject(error);
    }
);



export default axiosInstance
