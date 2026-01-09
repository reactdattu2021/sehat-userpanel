import React, { useState, useEffect } from "react";
import { MdOutlineEdit } from "react-icons/md";
import { useAuth } from "../../../context/AuthContext";
import { getUserDataApi, updateUserProfileApi, uploadProfilePictureApi } from "../../../apis/authapis";


const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  const [profileImage, setProfileImage] = useState(
    "/assets/userImages/Rectangle 11.png"
  );

  const [userData, setUserData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    profileUrl: null
  });

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    gender: ""
  });

  // Fetch user data from backend on component mount
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await getUserDataApi();

      if (response.data.success) {
        const data = response.data.user_response;
        setUserData(data);
        setFormData({
          firstname: data.firstname || "",
          lastname: data.lastname || "",
          email: data.email || "",
          phone: data.phone || "",
          gender: ""
        });

        // Set profile image if available
        if (data.profileUrl) {
          setProfileImage(data.profileUrl);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load user data");
      setLoading(false);

      // Fallback to AuthContext data if API fails
      if (user) {
        setFormData({
          firstname: user.firstname || "",
          lastname: user.lastname || "",
          email: user.email || "",
          phone: user.phone || "",
          gender: ""
        });
      }
    }
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Store the file for later upload
      setSelectedImageFile(file);

      // Show preview immediately
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // 1. Upload image first if selected
      if (selectedImageFile) {
        const imageResponse = await uploadProfilePictureApi(selectedImageFile);
        if (!imageResponse.data.success) {
          setError("Failed to upload profile picture");
          return;
        }
      }

      // 2. Update profile fields
      // Remove gender field if empty to avoid validation error
      const updateData = { ...formData };
      if (!updateData.gender || updateData.gender === "") {
        delete updateData.gender;
      }

      const response = await updateUserProfileApi(updateData);

      if (response.data.success) {
        setSuccess("Profile updated successfully!");
        setUserData({
          ...userData,
          ...formData
        });
        setIsEditing(false);
        setSelectedImageFile(null); // Clear selected image

        // Refresh user data
        setTimeout(() => {
          fetchUserData();
          setSuccess("");
        }, 2000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    // Reset form data to fetched user data
    setFormData({
      firstname: userData.firstname || "",
      lastname: userData.lastname || "",
      email: userData.email || "",
      phone: userData.phone || "",
      gender: ""
    });

    // Reset image preview
    setSelectedImageFile(null);
    if (userData.profileUrl) {
      setProfileImage(userData.profileUrl);
    } else {
      setProfileImage("/assets/userImages/Rectangle 11.png");
    }

    setError("");
    setSuccess("");
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#34658C]"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-[20px] tracking-[0.4px] md:text-[24px] md:tracking-[0.48px] xl:text-[28px] xl:tracking-[0.56px] font-semibold mb-4">
        {isEditing ? "My Account Details" : "My Profile"}
      </h1>

      {/* Success Message */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-[12px] mb-4">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-[12px] mb-4">
          {error}
        </div>
      )}

      {/* Profile Picture */}
      <div className="relative w-[80px] h-[80px] md:w-[100px] md:h-[100px] xl:w-[120px] xl:h-[120px] mb-[28px]">
        <img
          src={profileImage}
          alt="Profile"
          className="w-full h-full rounded-full object-cover"
        />

        {/* Edit Icon - Only show in edit mode */}
        {isEditing && (
          <>
            <label
              htmlFor="profileInput"
              className="absolute bottom-0 right-0 w-[32px] h-[32px] bg-white rounded-full flex items-center justify-center shadow-md cursor-pointer hover:bg-gray-100"
              style={{ boxShadow: "0px 4px 4px 0px #00000040" }}
            >
              <MdOutlineEdit className="w-[16px] h-[16px] text-black" />
            </label>

            <input
              type="file"
              id="profileInput"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </>
        )}
      </div>

      {!isEditing ? (
        /* VIEW MODE - Display user details */
        <div className="space-y-[22px]">
          {/* First Name and Last Name */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="border-[1px] border-[#3D3D3D] px-4 py-3 rounded-[12px]">
              <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold text-[#3D3D3D]">
                {formData.firstname || "Enter first name"}
              </p>
            </div>
            <div className="border-[1px] border-[#3D3D3D] px-4 py-3 rounded-[12px]">
              <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold text-[#3D3D3D]">
                {formData.lastname || "Enter last name"}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="grid grid-cols-1">
            <div className="border-[1px] border-[#3D3D3D] px-4 py-3 rounded-[12px]">
              <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold text-[#3D3D3D]">
                {formData.email || "Enter email address"}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="grid grid-cols-1">
            <div className="border-[1px] border-[#3D3D3D] px-4 py-3 rounded-[12px]">
              <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold text-[#3D3D3D]">
                {formData.phone || "Enter mobile number"}
              </p>
            </div>
          </div>

          {/* Gender Display */}
          {formData.gender && (
            <div className="flex gap-2">
              <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold text-[#3D3D3D]">
                Gender: {formData.gender.charAt(0).toUpperCase() + formData.gender.slice(1)}
              </p>
            </div>
          )}

          {/* Edit Button */}
          <button
            onClick={() => setIsEditing(true)}
            className="font-outfit bg-[#A2CD48] px-6 py-3 rounded-[8px] text-white text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px] font-semibold hover:bg-[#8fb83d] transition-colors"
          >
            Edit Profile
          </button>
        </div>
      ) : (
        /* EDIT MODE - Show form */
        <form onSubmit={handleSubmit} className="space-y-[22px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              placeholder="Enter first name"
              required
              className="border-[1px] border-[#3D3D3D] px-4 py-3 text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] placeholder:text-[#3D3D3D] font-semibold rounded-[12px]"
            />
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              placeholder="Enter Last name"
              required
              className="border-[1px] border-[#3D3D3D] px-4 py-3 text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] placeholder:text-[#3D3D3D] font-semibold rounded-[12px]"
            />
          </div>

          <div className="grid grid-cols-1">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
              required
              className="border-[1px] border-[#3D3D3D] px-4 py-3 text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] placeholder:text-[#3D3D3D] font-semibold rounded-[12px]"
            />
          </div>

          <div className="grid grid-cols-1">
            <input
              type="number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter Mobile Number"
              required
              className="border-[1px] border-[#3D3D3D] px-4 py-3 text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] placeholder:text-[#3D3D3D] font-semibold rounded-[12px]"
            />
          </div>

          <div className="flex gap-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={formData.gender === "male"}
                onChange={handleChange}
                className="w-5 h-5 accent-[#34658C]"
              />
              <span className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold text-[#3D3D3D]">
                Male
              </span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={formData.gender === "female"}
                onChange={handleChange}
                className="w-5 h-5 accent-[#34658C]"
              />
              <span className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold text-[#3D3D3D]">
                {" "}
                Female
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="font-outfit bg-[#A2CD48] px-6 py-3 rounded-[8px] text-white text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px] font-semibold hover:bg-[#8fb83d] transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="font-outfit bg-gray-300 px-6 py-3 rounded-[8px] text-gray-700 text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px] font-semibold hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
