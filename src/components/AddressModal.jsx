import React, { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";

const AddressModal = ({ isOpen, onClose, onSubmit, editAddress, isLoading }) => {
    const [formData, setFormData] = useState({
        fullname: "",
        mobilenumber: "",
        emailAddress: "",
        streetAddress: "",
        city: "",
        state: "",
        country: "India",
        pincode: "",
    });

    const [errors, setErrors] = useState({});

    // Populate form when editing
    useEffect(() => {
        if (editAddress) {
            setFormData({
                fullname: editAddress.fullname || "",
                mobilenumber: editAddress.mobilenumber || "",
                emailAddress: editAddress.emailAddress || "",
                streetAddress: Array.isArray(editAddress.streetAddress)
                    ? editAddress.streetAddress.join(", ")
                    : editAddress.streetAddress || "",
                city: editAddress.city || "",
                state: editAddress.state || "",
                country: editAddress.country || "India",
                pincode: editAddress.pincode || "",
            });
        } else {
            // Reset form for new address
            setFormData({
                fullname: "",
                mobilenumber: "",
                emailAddress: "",
                streetAddress: "",
                city: "",
                state: "",
                country: "India",
                pincode: "",
            });
        }
        setErrors({});
    }, [editAddress, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullname.trim()) {
            newErrors.fullname = "Full name is required";
        }

        if (!formData.mobilenumber) {
            newErrors.mobilenumber = "Mobile number is required";
        } else if (!/^\d{10}$/.test(formData.mobilenumber.toString())) {
            newErrors.mobilenumber = "Mobile number must be 10 digits";
        }

        if (!formData.emailAddress.trim()) {
            newErrors.emailAddress = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
            newErrors.emailAddress = "Invalid email format";
        }

        if (!formData.streetAddress.trim()) {
            newErrors.streetAddress = "Street address is required";
        }

        if (!formData.city.trim()) {
            newErrors.city = "City is required";
        }

        if (!formData.state.trim()) {
            newErrors.state = "State is required";
        }

        if (!formData.pincode) {
            newErrors.pincode = "Pincode is required";
        } else if (!/^\d{6}$/.test(formData.pincode.toString())) {
            newErrors.pincode = "Pincode must be 6 digits";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (validateForm()) {
            // Convert streetAddress to array format for API
            const submitData = {
                ...formData,
                mobilenumber: Number(formData.mobilenumber),
                pincode: Number(formData.pincode),
                streetAddress: [formData.streetAddress],
            };
            onSubmit(submitData);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[12px] w-full max-w-[600px] max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                    <h2 className="text-[20px] md:text-[24px] font-semibold">
                        {editAddress ? "Edit Address" : "Add New Address"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                        disabled={isLoading}
                    >
                        <IoClose className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label className="block text-[14px] font-semibold mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#A2CD48] ${errors.fullname ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder="Enter full name"
                                disabled={isLoading}
                            />
                            {errors.fullname && (
                                <p className="text-red-500 text-[12px] mt-1">{errors.fullname}</p>
                            )}
                        </div>

                        {/* Mobile Number */}
                        <div>
                            <label className="block text-[14px] font-semibold mb-2">
                                Mobile Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                name="mobilenumber"
                                value={formData.mobilenumber}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#A2CD48] ${errors.mobilenumber ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder="Enter 10-digit mobile number"
                                disabled={isLoading}
                            />
                            {errors.mobilenumber && (
                                <p className="text-red-500 text-[12px] mt-1">{errors.mobilenumber}</p>
                            )}
                        </div>

                        {/* Email Address */}
                        <div>
                            <label className="block text-[14px] font-semibold mb-2">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                name="emailAddress"
                                value={formData.emailAddress}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#A2CD48] ${errors.emailAddress ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder="Enter email address"
                                disabled={isLoading}
                            />
                            {errors.emailAddress && (
                                <p className="text-red-500 text-[12px] mt-1">{errors.emailAddress}</p>
                            )}
                        </div>

                        {/* Street Address */}
                        <div>
                            <label className="block text-[14px] font-semibold mb-2">
                                Street Address <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="streetAddress"
                                value={formData.streetAddress}
                                onChange={handleChange}
                                rows="3"
                                className={`w-full px-4 py-3 border rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#A2CD48] resize-none ${errors.streetAddress ? "border-red-500" : "border-gray-300"
                                    }`}
                                placeholder="Enter street address"
                                disabled={isLoading}
                            />
                            {errors.streetAddress && (
                                <p className="text-red-500 text-[12px] mt-1">{errors.streetAddress}</p>
                            )}
                        </div>

                        {/* City and State */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[14px] font-semibold mb-2">
                                    City <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#A2CD48] ${errors.city ? "border-red-500" : "border-gray-300"
                                        }`}
                                    placeholder="Enter city"
                                    disabled={isLoading}
                                />
                                {errors.city && (
                                    <p className="text-red-500 text-[12px] mt-1">{errors.city}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-[14px] font-semibold mb-2">
                                    State <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#A2CD48] ${errors.state ? "border-red-500" : "border-gray-300"
                                        }`}
                                    placeholder="Enter state"
                                    disabled={isLoading}
                                />
                                {errors.state && (
                                    <p className="text-red-500 text-[12px] mt-1">{errors.state}</p>
                                )}
                            </div>
                        </div>

                        {/* Country and Pincode */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[14px] font-semibold mb-2">
                                    Country <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#A2CD48]"
                                    placeholder="Enter country"
                                    disabled={isLoading}
                                />
                            </div>

                            <div>
                                <label className="block text-[14px] font-semibold mb-2">
                                    Pincode <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    name="pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-[8px] focus:outline-none focus:ring-2 focus:ring-[#A2CD48] ${errors.pincode ? "border-red-500" : "border-gray-300"
                                        }`}
                                    placeholder="Enter 6-digit pincode"
                                    disabled={isLoading}
                                />
                                {errors.pincode && (
                                    <p className="text-red-500 text-[12px] mt-1">{errors.pincode}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-[8px] hover:bg-gray-50 transition-colors"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-6 py-3 bg-[#A2CD48] text-white font-semibold rounded-[8px] hover:bg-[#8fb83d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isLoading}
                        >
                            {isLoading ? "Saving..." : editAddress ? "Update Address" : "Add Address"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddressModal;
