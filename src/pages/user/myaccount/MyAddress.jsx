import React, { useRef, useState, useEffect } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { MdEdit, MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import AddressModal from "../../../components/AddressModal";
import {
  getAllAddressesApi,
  createAddressApi,
  updateAddressApi,
  deleteAddressApi,
} from "../../../apis/authapis";

const MyAddress = () => {
  const [addresses, setAddresses] = useState([]);
  const [openEditIndex, setOpenEditIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const modalRef = useRef(null);

  // Fetch all addresses on component mount
  useEffect(() => {
    fetchAddresses();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setOpenEditIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch all addresses
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await getAllAddressesApi();
      console.log("📍 Full API Response:", response);
      console.log("📍 Response Data:", response.data);

      // Get current user ID from localStorage
      const userData = JSON.parse(localStorage.getItem("userData"));
      const currentUserId = userData?.userId;
      console.log("👤 Current User ID:", currentUserId);

      // Handle different possible response structures
      let addressList = [];
      if (response.data.data) {
        // API returns { success: true, data: [...] }
        addressList = response.data.data;
      } else if (response.data.addresses) {
        addressList = response.data.addresses;
      } else if (Array.isArray(response.data)) {
        addressList = response.data;
      }

      console.log("📍 All Addresses from API:", addressList);
      console.log("📍 Total addresses:", addressList.length);

      // Filter addresses for current user only
      const userAddresses = addressList.filter(
        (address) => address.userId === currentUserId
      );

      console.log("📍 User's Addresses (filtered):", userAddresses);
      console.log("📍 User's address count:", userAddresses.length);

      setAddresses(userAddresses);
    } catch (error) {
      console.error("❌ Error fetching addresses:", error);
      console.error("❌ Error response:", error.response);
      toast.error(error.response?.data?.message || "Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  };


  // Open modal for adding new address
  const handleAddNew = () => {
    setEditAddress(null);
    setIsModalOpen(true);
  };

  // Open modal for editing address
  const handleEdit = (address) => {
    setEditAddress(address);
    setIsModalOpen(true);
    setOpenEditIndex(null);
  };

  // Handle form submission (create or update)
  const handleSubmit = async (formData) => {
    try {
      setActionLoading(true);
      console.log("📝 Submitting form data:", formData);

      if (editAddress) {
        // Update existing address
        const response = await updateAddressApi(editAddress._id, formData);
        console.log("✅ Address updated - Response:", response.data);
        toast.success("Address updated successfully!");
      } else {
        // Create new address
        const response = await createAddressApi(formData);
        console.log("✅ Address created - Response:", response.data);
        toast.success("Address added successfully!");
      }

      // Refresh addresses list
      console.log("🔄 Refreshing address list...");
      await fetchAddresses();
      console.log("✅ Address list refreshed");

      setIsModalOpen(false);
      setEditAddress(null);
    } catch (error) {
      console.error("❌ Error saving address:", error);
      console.error("❌ Error details:", error.response);
      toast.error(error.response?.data?.message || "Failed to save address");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete address
  const handleDelete = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      setActionLoading(true);
      const response = await deleteAddressApi(addressId);
      console.log("🗑️ Address deleted:", response.data);
      toast.success("Address deleted successfully!");

      // Refresh addresses list
      await fetchAddresses();
      setOpenEditIndex(null);
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error(error.response?.data?.message || "Failed to delete address");
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle dropdown menu
  const toggleDropdown = (index) => {
    setOpenEditIndex(openEditIndex === index ? null : index);
  };

  // Format address for display
  const formatAddress = (address) => {
    const parts = [];
    if (address.streetAddress) {
      parts.push(
        Array.isArray(address.streetAddress)
          ? address.streetAddress.join(", ")
          : address.streetAddress
      );
    }
    if (address.city) parts.push(address.city);
    if (address.state) parts.push(address.state);
    if (address.country) parts.push(address.country);
    if (address.pincode) parts.push(address.pincode);
    return parts.join(", ");
  };

  return (
    <>
      <div>
        <div>
          <h1 className="text-[20px] tracking-[0.4px] md:text-[24px] md:tracking-[0.48px] xl:text-[28px] xl:tracking-[0.56px] font-semibold mb-4">
            My Address
          </h1>
          <button
            onClick={handleAddNew}
            className="font-outfit bg-[#A2CD48] text-white px-6 py-3 text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px] font-semibold rounded-[8px] mb-[22px] hover:bg-[#8fb83d] transition-colors"
          >
            + Add New Address
          </button>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading addresses...</p>
            </div>
          ) : addresses.length === 0 ? (
            // Empty State
            <div className="text-center py-8">
              <p className="text-gray-500 mb-2">No addresses found</p>
              <p className="text-[14px] text-gray-400">
                Click "Add New Address" to create your first address
              </p>
            </div>
          ) : (
            // Address List
            addresses.map((address, index) => (
              <div key={address._id || index}>
                <div className="relative">
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <h1 className="text-[16px] leading-[32px] tracking-[0.64px] md:text-[20px] md:leading-[32px] md:tracking-[0.8px] font-bold">
                        {address.fullname}
                      </h1>
                      <p className="text-[12px] leading-[20px] tracking-[0.48px] md:text-[14px] md:leading-[22px] md:tracking-[0.56px] font-semibold text-gray-700">
                        {formatAddress(address)}
                      </p>
                      {address.mobilenumber && (
                        <p className="text-[12px] md:text-[14px] text-gray-600 mt-1">
                          Mobile: {address.mobilenumber}
                        </p>
                      )}
                      {address.emailAddress && (
                        <p className="text-[12px] md:text-[14px] text-gray-600">
                          Email: {address.emailAddress}
                        </p>
                      )}
                    </div>

                    {/* Three-dot menu */}
                    <div className="relative" ref={openEditIndex === index ? modalRef : null}>
                      <HiOutlineDotsVertical
                        onClick={() => toggleDropdown(index)}
                        className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] cursor-pointer hover:text-[#A2CD48] transition-colors"
                      />

                      {/* Dropdown Menu */}
                      {openEditIndex === index && (
                        <div className="absolute right-0 top-8 bg-white shadow-lg rounded-[8px] border border-gray-200 z-10 min-w-[150px]">
                          <button
                            onClick={() => handleEdit(address)}
                            className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                            disabled={actionLoading}
                          >
                            <MdEdit className="w-5 h-5 text-blue-600" />
                            <span className="text-[14px] font-semibold">Edit</span>
                          </button>
                          <hr className="border-gray-200" />
                          <button
                            onClick={() => handleDelete(address._id)}
                            className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                            disabled={actionLoading}
                          >
                            <MdDelete className="w-5 h-5 text-red-600" />
                            <span className="text-[14px] font-semibold text-red-600">
                              Delete
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {index < addresses.length - 1 && (
                  <hr className="border-b-[1px] border-[#3D3D3D] my-4 md:my-6" />
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Address Modal */}
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditAddress(null);
        }}
        onSubmit={handleSubmit}
        editAddress={editAddress}
        isLoading={actionLoading}
      />
    </>
  );
};

export default MyAddress;
