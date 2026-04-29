import axiosInstance from "./axiosInstance.jsx";

// ==================
// 1. SIGNUP
// ==================
export const SignupApi = (formData) => {
  return axiosInstance.post("/users/signup", formData);
};

// ==================
// 2. VERIFY EMAIL
// ==================
export const VerifyEmailApi = (email, encryptedID) => {
  return axiosInstance.post("/users/verifymail", {
    email,
    encryptedID,
  });
};

// ==================
// 3. LOGIN
// ==================
export const LoginApi = (formData) => {
  return axiosInstance.post("/users/login", formData);
};

// ==================
// 4. GET USER DATA
// ==================
export const getUserDataApi = () => {
  return axiosInstance.get("/users/getUserData");
};

// ==================
// 5. UPDATE USER PROFILE
// ==================
export const updateUserProfileApi = (formData) => {
  return axiosInstance.patch("/users/updateUserProfile", formData);
};

// ==================
// 6. UPLOAD PROFILE PICTURE
// ==================
export const uploadProfilePictureApi = (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  return axiosInstance.post("/users/userProfile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// ==================
// 7. UPDATE PASSWORD
// ==================
export const updatePasswordApi = (passwordData) => {
  return axiosInstance.patch("/users/updatePassword", passwordData);
};
// ==================
// 8. LOGOUT
// ==================
export const LogoutApi = () => {
  return axiosInstance.put("/users/logout");
};

// ==================
// 9. FORGOT PASSWORD
// ==================
export const forgotPasswordApi = (email) => {
  return axiosInstance.post("/users/forgetPassword", { email });
};

// ==================
// 10. SET PASSWORD (RESET)
// ==================
export const setPasswordApi = (token, password) => {
  return axiosInstance.put("/users/setPassword", { token, password });
};

// ==================
// 11. GET ALL EQUIPMENTS (with pagination)
// ==================
export const getAllEquipmentsApi = (page = 1, limit = 10) => {
  return axiosInstance.get("/user/getallequipment", {
    params: { page, limit },
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
    limit: filters.limit || 10,
  };

  // Add optional filter parameters only if they have values
  if (filters.subCategory) params.subCategory = filters.subCategory;
  if (filters.location) params.city = filters.location; // Send location as city filter
  if (filters.date) params.date = filters.date;
  if (filters.rentalDuration) params.rentalDuration = filters.rentalDuration;
  if (filters.priceRange) params.priceRange = filters.priceRange;

  // console.log("🌐 API Call - Equipment Filters:", params);
  // console.log("📍 Full URL:", "/user/equipmentfilters");

  return axiosInstance.get("/user/equipmentfilters", { params });
};

// ==================
// 14. GET ALL NURSES (with pagination)
// ==================
export const getAllNursesApi = (page = 1, limit = 10) => {
  return axiosInstance.get("/user/getallservices", {
    params: { page, limit },
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
    limit: filters.limit || 10,
  };

  // Add optional filter parameters only if they have values
  if (filters.subCategory) params.subCategory = filters.subCategory;
  if (filters.location) params.city = filters.location; // Send location as city filter
  if (filters.experience) params.experience = filters.experience;
  if (filters.gender) params.gender = filters.gender;

  // console.log("🌐 getNurseFiltersApi - Sending params:", params);
  // console.log("📍 API Endpoint: /user/servicefilters");

  return axiosInstance.get("/user/servicefilters", { params });
};

// ==================
// 17. GET FILTER DROPDOWN DATA
// ==================
export const getFilterDropdownDataApi = () => {
  return axiosInstance.get("/services/filterdata/dropdown");
};

// ==================
// 18. GLOBAL SEARCH
// ==================
export const globalSearchApi = (search, page = 1, limit = 10) => {
  return axiosInstance.get("/services/globalsearch", {
    params: { search, page, limit },
  });
};

// ==================
// 19. CREATE ADDRESS
// ==================
export const createAddressApi = (addressData) => {
  return axiosInstance.post("/userAddress/create", addressData);
};

// ==================
// 20. GET ALL ADDRESSES
// ==================
export const getAllAddressesApi = () => {
  return axiosInstance.get("/userAddress/");
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

// ==================
// 23. GET USER BOOKINGS
// ==================
export const getUserBookingsApi = (status = null) => {
  const params = status ? { status } : {};
  return axiosInstance.get("/booking/user", { params });
};

// ==================
// 24. GET BOOKING DETAILS BY ID
// ==================
export const getBookingByIdApi = (bookingId) => {
  return axiosInstance.get(`/booking/${bookingId}`);
};

// ==================
// 25. CANCEL BOOKING
// ==================
export const cancelBookingApi = (bookingId) => {
  return axiosInstance.delete(`/booking/cancel/${bookingId}`);
};

// ==================
// 26. GET ALL COUPONS
// ==================
export const getAllCouponsApi = (page = 1, limit = 10) => {
  return axiosInstance.get("/user/all/coupon", {
    params: { page, limit },
  });
};

// ==================
// 27. SEARCH COUPONS
// ==================
export const searchCouponsApi = (keyword) => {
  return axiosInstance.get("/user/search", {
    params: { keyword },
  });
};

// ==================
// 28. APPLY COUPON (Direct Booking - Validation)
// ==================
export const applyCouponApi = (couponCode, selectedCartIds) => {
  return axiosInstance.post("/user/apply/coupon", {
    couponCode,
    selectedCartIds,
  });
};

// ==================
// 29. BUY NOW API (Direct Booking with Payment)
// ==================
export const buyNowApi = (buyNowData) => {
  return axiosInstance.post("/user/booking/buy-now", buyNowData);
};

// ==================
// 30. CREATE BOOKING API (Cart-based Booking)
// ==================
export const createBookingApi = (bookingData) => {
  return axiosInstance.post("/user/booking/create", bookingData);
};

// ==================
// 31. VERIFY PAYMENT API (Razorpay Payment Verification)
// ==================
export const verifyPaymentApi = (paymentData) => {
  return axiosInstance.post("/user/payment/verify", paymentData);
};

// ==================
// 32. GET BOOKING DETAILS BY ID (For Thank You Page)
// ==================
export const getBookingDetailsApi = (bookingId) => {
  return axiosInstance.get(`/user/booking/${bookingId}`);
};

// ==================
// 33. ADD TO CART API
// ==================
export const addToCartApi = (cartData) => {
  return axiosInstance.post("/cart/add", cartData);
};

// ==================
// 34. GET USER CART
// ==================
export const getUserCartApi = () => {
  return axiosInstance.get("/cart/user");
};

// ==================
// 35. UPDATE CART ITEM
// ==================
export const updateCartApi = (cartId, updateData) => {
  return axiosInstance.put(`/cart/update/${cartId}`, updateData);
};

// ==================
// 36. DELETE CART ITEM (Remove single item)
// ==================
export const deleteCartApi = (cartId) => {
  return axiosInstance.delete(`/cart/remove/${cartId}`);
};

// ==================
// 37. CART CHECKOUT / BOOKING API
// Handles payload: { selectedItems: [], paymentMode: "", addressId: "" }
// ==================
export const cartBookingApi = (bookingData) => {
  return axiosInstance.post("/user/booking/create", bookingData);
};
export const myorderApi = ({ status, page = 1, limit = 5 } = {}) => {
  return axiosInstance.get("/user/booking", {
    params: {
      status,
      page,
      limit,
    },
  });
};
export const cancelOrderApi = (orderId) => {
  return axiosInstance.put(`/user/booking/cancel/${orderId}`);
};
export const extendBookingApi = (bookingId, extensionData) => {
  return axiosInstance.put(`/user/booking/extend/${bookingId}`, extensionData);
};


export const subscribeApi = (email) => {
  return axiosInstance.post("/user/subscribe", { email });
};

// ==================
// 38. POST REVIEW API
// ==================
export const postReviewApi = (productId, productType, reviewData) => {
  const formData = new FormData();

  // Append all review fields
  formData.append("rating", reviewData.rating);
  formData.append("reviewtitle", reviewData.reviewtitle);
  formData.append("reviewcontent", reviewData.reviewcontent);
  formData.append("recommendthisproduct", reviewData.recommendthisproduct);

  // Append image if provided
  if (reviewData.reviewimage) {
    formData.append("reviewimage", reviewData.reviewimage);
  }

  return axiosInstance.post(
    `/reviews/${productId}?type=${productType}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

// ==================
// 39. GET REVIEWS API
// ==================
export const getReviewsApi = (productId, productType, page = 1, limit = 10) => {
  return axiosInstance.get(
    `/reviews/single/${productId}`,
    {
      params: {
        type: productType,
        page,
        limit,
      },
    }
  );
};

// ==================
// 40. GET ALL BLOGS API
// ==================
export const getAllBlogsApi = (page = 1, limit = 10) => {
  return axiosInstance.get("/user/blogs/all", {
    params: { page, limit },
  });
};

// ==================
// 41. GET BLOG BY ID API
// ==================
export const getBlogByIdApi = (blogId) => {
  return axiosInstance.get(`/user/blogs/${blogId}`);
};

// ==================
// 42. CONTACT US API
// ==================
export const contactUsApi = (contactData) => {
  return axiosInstance.post("/userAddress/contactus", contactData);
};

export const getAllNotificationsApi = (page = 1, limit = 10) => {
  return axiosInstance.get("/user/notifications/all", { params: { page, limit } });
};

export const getNotificationByIdApi = (id) => {
  return axiosInstance.get(`/user/notifications/${id}`);
};
export const getRandomReviewsApi = () => {
  return axiosInstance.get(`/reviews/random/all`);
}