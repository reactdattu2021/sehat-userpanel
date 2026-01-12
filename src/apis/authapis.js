import axiosInstance from "./axiosInstance.jsx";

// ==================
// 1. SIGNUP
// ==================
export const SignupApi = (formData) => {
  return axiosInstance.post('/users/signup', formData);
};

// ==================
// 2. VERIFY EMAIL
// ==================
export const VerifyEmailApi = (email, encryptedID) => {
  return axiosInstance.post('/users/verifymail', {
    email,
    encryptedID
  });
};

// ==================
// 3. LOGIN
// ==================
export const LoginApi = (formData) => {
  return axiosInstance.post('/users/login', formData);
};

// ==================
// 4. GET USER DATA
// ==================
export const getUserDataApi = () => {
  return axiosInstance.get('/users/getUserData');
};

// ==================
// 5. UPDATE USER PROFILE
// ==================
export const updateUserProfileApi = (formData) => {
  return axiosInstance.patch('/users/updateUserProfile', formData);
};

// ==================
// 6. UPLOAD PROFILE PICTURE
// ==================
export const uploadProfilePictureApi = (imageFile) => {
  const formData = new FormData();
  formData.append('image', imageFile);

  return axiosInstance.post('/users/userProfile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

// ==================
// 7. UPDATE PASSWORD
// ==================
export const updatePasswordApi = (passwordData) => {
  return axiosInstance.patch('/users/updatePassword', passwordData);
};
// ==================
// 8. LOGOUT
// ==================
export const LogoutApi = () => {
  return axiosInstance.put('/users/logout');
};

// ==================
// 9. FORGOT PASSWORD
// ==================
export const forgotPasswordApi = (email) => {
  return axiosInstance.post('/users/forgetPassword', { email });
};

// ==================
// 10. SET PASSWORD (RESET)
// ==================
export const setPasswordApi = (token, password) => {
  return axiosInstance.put('/users/setPassword', { token, password });
};

// ==================
// 11. GET ALL EQUIPMENTS (with pagination)
// ==================
export const getAllEquipmentsApi = (page = 1, limit = 10) => {
  return axiosInstance.get('/user/getallequipment', {
    params: { page, limit }
  });
};

// ==================
// 12. GET EQUIPMENT BY ID
// ==================
export const getEquipmentByIdApi = (equipmentId) => {
  return axiosInstance.get(`/user/getequipment/${equipmentId}`);
};

// ==================
// 13. GET EQUIPMENT WITH FILTERS
// ==================
export const getEquipmentFiltersApi = (filters = {}) => {
  const params = {
    page: filters.page || 1,
    limit: filters.limit || 10
  };

  // Add optional filter parameters only if they have values
  if (filters.subCategory) params.subCategory = filters.subCategory;
  if (filters.location) params.city = filters.location; // Send location as city filter
  if (filters.date) params.date = filters.date;
  if (filters.rentalDuration) params.rentalDuration = filters.rentalDuration;
  if (filters.priceRange) params.priceRange = filters.priceRange;

  console.log('🌐 API Call - Equipment Filters:', params);
  console.log('📍 Full URL:', '/user/equipmentfilters');

  return axiosInstance.get('/user/equipmentfilters', { params });
};

// ==================
// 14. GET ALL NURSES (with pagination)
// ==================
export const getAllNursesApi = (page = 1, limit = 10) => {
  return axiosInstance.get('/user/getallservices', {
    params: { page, limit }
  });
};

// ==================
// 15. GET NURSE BY ID
// ==================
export const getNurseByIdApi = (nurseId) => {
  return axiosInstance.get(`/user/getservice/${nurseId}`);
};

// ==================
// 16. GET NURSES WITH FILTERS
// ==================
export const getNurseFiltersApi = (filters = {}) => {
  const params = {
    page: filters.page || 1,
    limit: filters.limit || 10
  };

  // Add optional filter parameters only if they have values
  if (filters.subCategory) params.subCategory = filters.subCategory;
  if (filters.location) params.city = filters.location; // Send location as city filter
  if (filters.experience) params.experience = filters.experience;
  if (filters.gender) params.gender = filters.gender;

  console.log('🌐 getNurseFiltersApi - Sending params:', params);
  console.log('📍 API Endpoint: /user/servicefilters');

  return axiosInstance.get('/user/servicefilters', { params });
};

// ==================
// 17. GET FILTER DROPDOWN DATA
// ==================
export const getFilterDropdownDataApi = () => {
  return axiosInstance.get('/services/filterdata/dropdown');
};

// ==================
// 18. GLOBAL SEARCH
// ==================
export const globalSearchApi = (search, page = 1, limit = 10) => {
  return axiosInstance.get('/services/globalsearch', {
    params: { search, page, limit }
  });
};

// ==================
// 19. CREATE ADDRESS
// ==================
export const createAddressApi = (addressData) => {
  return axiosInstance.post('/userAddress/create', addressData);
};

// ==================
// 20. GET ALL ADDRESSES
// ==================
export const getAllAddressesApi = () => {
  return axiosInstance.get('/userAddress/');
};

// ==================
// 21. UPDATE ADDRESS
// ==================
export const updateAddressApi = (addressId, addressData) => {
  return axiosInstance.put(`/userAddress/update/${addressId}`, addressData);
};

// ==================
// 22. DELETE ADDRESS
// ==================
export const deleteAddressApi = (addressId) => {
  return axiosInstance.delete(`/userAddress/delete/${addressId}`);
};

