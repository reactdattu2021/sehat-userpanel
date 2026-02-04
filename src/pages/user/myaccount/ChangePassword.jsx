import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { updatePasswordApi } from "../../../apis/authapis";
import { useAuth } from "../../../context/AuthContext";

const ChangePassword = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      setError("All fields are required");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      setError("New password must be different from current password");
      return;
    }

    try {
      setLoading(true);

      const response = await updatePasswordApi({
        oldpassword: formData.currentPassword,
        newpassword: formData.newPassword,
        confirmpassword: formData.confirmPassword,
      });

      if (response.data.success) {
        setSuccess("Password updated successfully! Redirecting to login...");
        // Clear form
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        // Logout and redirect to home page after 2 seconds
        setTimeout(async () => {
          await logout();
          navigate("/");
        }, 2000);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error updating password:", error);
      setError(error.response?.data?.message || "Failed to update password");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-[20px] tracking-[0.4px] md:text-[24px] md:tracking-[0.48px] xl:text-[28px] xl:tracking-[0.56px] font-bold">
        Password Manager
      </h1>

      {/* Success Message */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-[12px]">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-[12px]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1">
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
            placeholder="Current Password"
            required
            className="border-[1px] border-[#3D3D3D] rounded-[12px] px-4 py-3 text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold placeholder:text-[#3D3D3D]"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="New Password"
            required
            className="border-[1px] border-[#3D3D3D] rounded-[12px] px-4 py-3 text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold placeholder:text-[#3D3D3D]"
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
            className="border-[1px] border-[#3D3D3D] rounded-[12px] px-4 py-3 text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold placeholder:text-[#3D3D3D]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#A2CD48] text-white text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px] font-semibold px-6 py-3 rounded-[8px] font-outfit hover:bg-[#8fb83d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
