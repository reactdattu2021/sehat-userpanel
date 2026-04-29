import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoMdArrowDropdown, IoMdArrowDropup, IoMdClose } from "react-icons/io";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import Stepper from "../commonComponents/Stepper";
import {
  getAllAddressesApi,
  createAddressApi,
  updateAddressApi,
  deleteAddressApi,
  getAllCouponsApi,
  applyCouponApi,
} from "../../apis/authapis";

const CheckOut = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { isDirectBooking, bookingData, cartItems, cartTotalAmount } = location.state || {};

  const [openIndex, setOpenIndex] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    fullname: "",
    mobilenumber: "",
    emailAddress: "",
    streetAddress: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  });

  // Coupon states
  const [coupons, setCoupons] = useState([]);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const [orderSummary, setOrderSummary] = useState(null);

  useEffect(() => {
    fetchAddresses();
    fetchCoupons();

    if (isDirectBooking && bookingData) {
      calculateOrderSummary();
    } else if (cartItems && cartItems.length > 0) {
      calculateCartOrderSummary();
    }
  }, []);

  const calculateOrderSummary = () => {
    if (!bookingData) return;

    const { pricing, quantity, rentalValue, productType } = bookingData;

    // MATCH BACKEND CALCULATION EXACTLY
    // Backend: const baseAmount = unitPrice * qty * rentalValue;
    const baseAmount = pricing.unitPrice * quantity * rentalValue;

    // Backend: const taxAmount = (baseAmount * pricing.taxPercentage) / 100;
    const taxAmount = (baseAmount * pricing.taxPercentage) / 100;

    // Backend: const safeShipping = productType === "services" ? 0 : shippingCost;
    // Backend: totalAmount includes (safeShipping * qty)
    const safeShipping = productType === "services" ? 0 : (pricing.shippingCost || 0);
    const shippingCost = safeShipping * quantity;

    // Backend: const securityDeposit = (pricingDoc.pricings.securityDeposit || 0) * qty;
    const securityDeposit = (pricing.securityDeposit || 0) * quantity;

    // Backend: totalAmount = baseAmount + taxAmount + (safeShipping * qty) + securityDeposit;
    const totalAmount = baseAmount + taxAmount + shippingCost + securityDeposit;

    setOrderSummary({
      productName: bookingData.productName,
      productImage: bookingData.productImage,
      rentalDuration: bookingData.rentalDuration,
      rentalValue: bookingData.rentalValue,
      quantity: bookingData.quantity,
      productType: bookingData.productType,
      baseAmount,
      taxAmount,
      shippingCost,
      securityDeposit,
      totalAmount,
      unitPrice: pricing.unitPrice,
      taxPercentage: pricing.taxPercentage,
      discountAmount: 0,
    });
  };

  const calculateCartOrderSummary = () => {
    if (!cartItems || cartItems.length === 0) return;

    let totalBase = 0;
    let totalTax = 0;
    let totalShipping = 0;
    let totalSecurity = 0;

    cartItems.forEach(item => {
      // Backend already calculated these values with quantity
      const base = item.equipmentPrice || item.servicePrice || 0;
      const tax = (base * (item.producttaxpercentage || 0)) / 100;
      const shipping = item.productshippingcost || 0;  // Already × qty from backend
      const security = item.refundableSecurityDep || 0;  // Already × qty from backend

      totalBase += base;
      totalTax += tax;
      totalShipping += shipping;
      totalSecurity += security;
    });

    // Use cart total if provided (includes any discounts applied in cart)
    // Otherwise calculate from items
    const totalAmount = cartTotalAmount !== undefined ? cartTotalAmount : (totalBase + totalTax + totalShipping + totalSecurity);

    setOrderSummary({
      isCart: true,
      itemCount: cartItems.length,
      baseAmount: totalBase,
      taxAmount: totalTax,
      shippingCost: totalShipping,
      securityDeposit: totalSecurity,
      totalAmount: totalAmount,
      discountAmount: 0,
    });
  };

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await getAllAddressesApi();

      const userData = JSON.parse(localStorage.getItem("userData"));
      const currentUserId = userData?.userId;

      let addressList = [];
      if (response.data.data) {
        addressList = response.data.data;
      } else if (response.data.addresses) {
        addressList = response.data.addresses;
      } else if (Array.isArray(response.data)) {
        addressList = response.data;
      }

      const userAddresses = addressList.filter(
        (address) => address.userId === currentUserId
      );

      setAddresses(userAddresses);

      if (userAddresses.length === 0) {
        setShowAddressForm(true);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast.error(error.response?.data?.message || "Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  };

  const fetchCoupons = async () => {
    try {
      const response = await getAllCouponsApi(1, 50);
      // console.log("📍 Fetched coupons:", response.data);

      if (response.data.success) {
        const activeCoupons = response.data.data.filter(
          coupon => coupon.status === 'active' &&
            new Date(coupon.expireDate) > new Date()
        );
        setCoupons(activeCoupons);
      }
    } catch (error) {
      console.error("Error fetching coupons:", error);
    }
  };

  const handleApplyCoupon = async (code) => {
    if (!code) {
      toast.error("Please enter a coupon code");
      return;
    }

    if (!orderSummary) {
      toast.error("Order summary not available");
      return;
    }

    if (appliedCoupon) {
      toast.error("Remove current coupon before applying a new one");
      return;
    }

    try {
      setCouponLoading(true);

      // Find the coupon details
      const couponDetails = coupons.find(c => c.couponCode === code);

      if (!couponDetails) {
        toast.error("Invalid coupon code");
        setCouponLoading(false);
        return;
      }

      // Check minimum amount
      if (orderSummary.totalAmount < couponDetails.minimumamount) {
        toast.error(`Minimum order amount is ₹${couponDetails.minimumamount}`);
        setCouponLoading(false);
        return;
      }

      if (isDirectBooking) {
        // For direct booking, validate coupon applicability on frontend
        const { productId, productType } = bookingData;

        // Check if coupon is universal or applicable to this product
        if (!couponDetails.isUniversal) {
          let isApplicable = false;

          // Check based on product type
          if (productType === "equipment") {
            const applicableEquipmentIds = couponDetails.applicableProducts?.equipmentIds || [];
            isApplicable = applicableEquipmentIds.some(id => id.toString() === productId.toString());
          } else if (productType === "services") {
            const applicableServicesIds = couponDetails.applicableProducts?.servicesIds || [];
            isApplicable = applicableServicesIds.some(id => id.toString() === productId.toString());
          }

          if (!isApplicable) {
            toast.error("This coupon is not applicable to the selected product");
            setCouponLoading(false);
            return;
          }
        }

        // Calculate discount
        let discount = 0;

        const qty = bookingData.quantity || 1;

        if (couponDetails.discountType === "percentage") {
          discount = (orderSummary.totalAmount * couponDetails.discountamount) / 100;
        } else {
          //  Multiply fixed discount with quantity
          discount = (couponDetails.discountamount || 0) * qty;
        }

        // Prevent over-discount
        discount = Math.min(discount, orderSummary.totalAmount);

        setAppliedCoupon({
          code: code,
          discount: discount,
          couponId: couponDetails._id
        });

        // Update order summary with discount
        setOrderSummary(prev => ({
          ...prev,
          discountAmount: discount,
          totalAmount: prev.totalAmount - discount
        }));

        toast.success(`Coupon applied! You saved ₹${discount}`);
        setShowCouponModal(false);
        setCouponCode("");
      } else {
        // For cart-based booking, call backend API
        const selectedCartIds = cartItems.map(item => item._id);
        const response = await applyCouponApi(code, selectedCartIds);

        if (response.data.success) {
          const { discount, selectedOriginalAmount, finalAmount } = response.data;

          setAppliedCoupon({
            code: code,
            discount: discount,
            originalAmount: selectedOriginalAmount
          });

          // Update order summary with backend values
          setOrderSummary(prev => ({
            ...prev,
            discountAmount: discount,
            totalAmount: finalAmount
          }));

          toast.success(`Coupon applied! You saved ₹${discount}`);
          setShowCouponModal(false);
          setCouponCode("");
        }
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast.error(error.response?.data?.message || "Failed to apply coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    if (appliedCoupon && orderSummary) {
      if (isDirectBooking) {
        // For direct booking, add discount back
        setOrderSummary(prev => ({
          ...prev,
          discountAmount: 0,
          totalAmount: prev.totalAmount + appliedCoupon.discount
        }));
      } else {
        // For cart booking, restore original amount from backend
        setOrderSummary(prev => ({
          ...prev,
          discountAmount: 0,
          totalAmount: appliedCoupon.originalAmount || (prev.totalAmount + appliedCoupon.discount)
        }));
      }

      setAppliedCoupon(null);
      setCouponCode("");
      toast.info("Coupon removed");
    }
  };

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setFormData({
      fullname: "",
      mobilenumber: "",
      emailAddress: "",
      streetAddress: "",
      city: "",
      state: "",
      country: "",
      pincode: "",
    });
    setShowAddressForm(true);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setFormData({
      fullname: address.fullname || "",
      mobilenumber: address.mobilenumber || "",
      emailAddress: address.emailAddress || "",
      streetAddress: address.streetAddress || "",
      city: address.city || "",
      state: address.state || "",
      country: address.country || "",
      pincode: address.pincode || "",
    });
    setShowAddressForm(true);
  };

  const handleDelete = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      setSubmitting(true);
      await deleteAddressApi(addressId);
      toast.success("Address deleted successfully!");

      if (selectedAddressId === addressId) {
        setSelectedAddressId(null);
      }

      await fetchAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error(error.response?.data?.message || "Failed to delete address");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();

    if (!formData.fullname || !formData.mobilenumber || !formData.emailAddress ||
      !formData.streetAddress || !formData.city || !formData.state ||
      !formData.country || !formData.pincode) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setSubmitting(true);

      if (editingAddress) {
        await updateAddressApi(editingAddress._id, formData);
        toast.success("Address updated successfully!");
      } else {
        await createAddressApi(formData);
        toast.success("Address added successfully!");
      }

      await fetchAddresses();

      setFormData({
        fullname: "",
        mobilenumber: "",
        emailAddress: "",
        streetAddress: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
      });
      setEditingAddress(null);
      setShowAddressForm(false);
    } catch (error) {
      console.error("Error saving address:", error);
      toast.error(error.response?.data?.message || "Failed to save address");
    } finally {
      setSubmitting(false);
    }
  };

  const handleProceedToPayment = () => {
    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    // Find the selected address object
    const selectedAddress = addresses.find(addr => addr._id === selectedAddressId);

    navigate('/payment', {
      state: {
        isDirectBooking,
        bookingData: isDirectBooking ? bookingData : { selectedCartIds: cartItems.map(item => item._id) },
        addressId: selectedAddressId,
        selectedAddress,
        orderSummary,
        appliedCoupon,
        cartItems: isDirectBooking ? null : cartItems
      }
    });
  };

  const renderForm = () => {
    return (
      <div>
        <h1 className="text-[24px] tracking-[0.48px] font-semibold">
          {editingAddress ? "Edit Address" : "Add Address"}
        </h1>

        <form className="space-y-3" onSubmit={handleSaveAddress}>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className="px-4 py-3 rounded-[8px] border border-black w-full text-[16px] leading-[26px] tracking-[0.64px] text-[#6D6D6D] font-semibold"
              placeholder="Name*"
              required
            />

            <input
              type="tel"
              name="mobilenumber"
              value={formData.mobilenumber}
              onChange={handleChange}
              className="px-4 py-3 rounded-[8px] border border-black w-full text-[16px] leading-[26px] tracking-[0.64px] text-[#6D6D6D] font-semibold"
              placeholder="Mobile Number*"
              required
            />
          </div>
          <div className="grid grid-cols-1">
            <input
              type="email"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleChange}
              className="px-4 py-3 rounded-[8px] border border-black w-full text-[16px] leading-[26px] tracking-[0.64px] text-[#6D6D6D] font-semibold"
              placeholder="Email*"
              required
            />
          </div>
          <div className="grid grid-cols-1">
            <input
              type="text"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleChange}
              className="px-4 py-3 rounded-[8px] border border-black w-full text-[16px] leading-[26px] tracking-[0.64px] text-[#6D6D6D] font-semibold"
              placeholder="Street Address*"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="px-4 py-3 rounded-[8px] border border-black w-full text-[16px] leading-[26px] tracking-[0.64px] text-[#6D6D6D] font-semibold"
              placeholder="Pincode*"
              required
            />
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="px-4 py-3 rounded-[8px] border border-black w-full text-[16px] leading-[26px] tracking-[0.64px] text-[#6D6D6D] font-semibold"
              placeholder="City*"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="px-4 py-3 rounded-[8px] border border-black w-full text-[16px] leading-[26px] tracking-[0.64px] text-[#6D6D6D] font-semibold"
              placeholder="State*"
              required
            />

            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="px-4 py-3 rounded-[8px] border border-black w-full text-[16px] leading-[26px] tracking-[0.64px] text-[#6D6D6D] font-semibold"
              placeholder="Country*"
              required
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#A2CD48] flex-1 px-6 py-3 rounded-[8px] text-white text-[20px] tracking-[0.04px] font-semibold disabled:opacity-50"
            >
              {submitting ? "Saving..." : editingAddress ? "Update Address" : "Save Address"}
            </button>
            {addresses.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setShowAddressForm(false);
                  setEditingAddress(null);
                }}
                className="bg-gray-500 flex-1 px-6 py-3 rounded-[8px] text-white text-[20px] tracking-[0.04px] font-semibold"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    );
  };

  const formatRentalDuration = (duration) => {
    const durationMap = {
      perHour: "Hour",
      perDay: "Day",
      perWeek: "Week",
      perMonth: "Month",
    };
    return durationMap[duration] || duration;
  };

  const formatTime = (time24) => {
    if (!time24) return '';
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="max-w-[1440px] mx-auto px-5 md:px-8 xl:px-[120px]">
      <Stepper currentStep="checkout" />

      <div className="grid grid-cols-12 gap-6  pb-[60px] md:pb-[80px] xl:pb-[120px]">
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-4 md:gap-6 xl:gap-8">
          <h1 className="text-[20px] tracking-[0.4px] md:text-[24px] md:tracking-[0.28px] font-semibold font-outfit">
            Select Delivery Address
          </h1>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading addresses...</p>
            </div>
          ) : (
            <>
              {showAddressForm ? (
                <>{renderForm()}</>
              ) : (
                <>
                  <button
                    onClick={handleAddNew}
                    className="px-6 py-3 bg-[#34658C] text-white rounded-[12px] text-[16px] tracking-[0.32px] font-semibold w-fit md:w-[290px] font-outfit hover:bg-[#2a5270] transition-colors"
                  >
                    + Add New Address
                  </button>

                  {addresses.length > 0 && (
                    <div className="flex flex-col gap-4">
                      {addresses.map((addr, index) => (
                        <div
                          key={addr._id || index}
                          className={`bg-[#EBF0F4] grid grid-cols-12 gap-4 rounded-[12px] p-[24px] transition-all ${selectedAddressId === addr._id
                            ? "ring-2 ring-[#A2CD48]"
                            : ""
                            }`}
                        >
                          <div className="col-span-1 flex items-center">
                            <input
                              type="radio"
                              name="selectedAddress"
                              checked={selectedAddressId === addr._id}
                              onChange={() => setSelectedAddressId(addr._id)}
                              className="w-[12px] h-[12px]  md:w-[16px] md:h-[16px] cursor-pointer"
                            />
                          </div>
                          <div className="col-span-9 md:col-span-8 flex flex-col gap-1 md:gap-2 w-full h-full">
                            <p className="text-[16px] leading-[26px] tracking-[0.64px] md:text-[24px] md:leading-[32px] md:tracking-[0.96px] font-bold">
                              {addr.fullname}
                            </p>
                            <p className="text-[14px] leading-[22px] tracking-[0.56px] font-semibold">
                              {addr.streetAddress}, {addr.city}, {addr.state},{" "}
                              {addr.pincode}, {addr.country}
                            </p>
                            <p className="text-[14px] leading-[26px] tracking-[0.28px] md:text-[20px] md:leading-[32px] md:tracking-[0.8px] font-semibold w-full">
                              Contact Number: {addr.mobilenumber}
                            </p>
                            {addr.emailAddress && (
                              <p className="text-[14px] leading-[22px] tracking-[0.56px] font-semibold text-gray-600">
                                Email: {addr.emailAddress}
                              </p>
                            )}
                          </div>
                          <div className="col-span-2 md:col-span-3 flex justify-end items-start h-full gap-2">
                            <BiEdit
                              onClick={() => handleEdit(addr)}
                              className="w-[20px] h-[20px]  md:w-[24px] md:h-[24px] text-[#A2CD48] cursor-pointer hover:text-[#8fb83d] transition-colors"
                            />
                            <MdDelete
                              onClick={() => handleDelete(addr._id)}
                              className="w-[20px] h-[20px]  md:w-[24px] md:h-[24px] text-red-500 cursor-pointer hover:text-red-600 transition-colors"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>

        <div className="col-span-12 lg:col-span-5 flex flex-col h-full justify-center">
          <div
            className="p-4 md:p-[32px] rounded-[32px]"
            style={{ boxShadow: "0px 0px 4px 0px #00000040" }}
          >
            <h1 className="text-[20px] tracking-[0.4px] md:text-[24px] md:tracking-[0.48px] mb-6 font-medium">
              Rent Cost Summary
            </h1>

            {isDirectBooking && orderSummary ? (
              <div className="border-b border-[#34658C]">
                <div
                  className="flex justify-between my-6 cursor-pointer"
                  onClick={() => toggleAccordion(0)}
                >
                  <h1 className="text-[#34658C] text-[16px] tracking-[0.32px] md:text-[20px] md:tracking-[0.4px] font-medium">
                    {orderSummary.productName}
                  </h1>
                  <div className="flex gap-3">
                    <p className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]">
                      ({orderSummary.quantity})
                    </p>
                    {openIndex === 0 ? (
                      <IoMdArrowDropdown className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] text-[#3D3D3D]" />
                    ) : (
                      <IoMdArrowDropup className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] text-[#3D3D3D]" />
                    )}
                  </div>
                </div>

                {openIndex === 0 && (
                  <div className="my-6 flex flex-col gap-2 text-[12px] leading-[22px] tracking-[0.48px] md:text-[14px] leading-[26px] tracking-[0.48px]">
                    <p className="flex justify-between">
                      <span className="font-bold">Rental Cost:</span>
                      <span className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]">
                        ₹{orderSummary.unitPrice} × {orderSummary.quantity}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-bold">Rental Duration:</span>
                      <span className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]">
                        {orderSummary.rentalValue} {formatRentalDuration(orderSummary.rentalDuration)}(s)
                      </span>
                    </p>
                    {bookingData?.fromDate && bookingData?.fromTime && (
                      <p className="flex justify-between">
                        <span className="font-bold">From:</span>
                        <span className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]">
                          {new Date(bookingData.fromDate).toLocaleDateString()} {formatTime(bookingData.fromTime)}
                        </span>
                      </p>
                    )}
                    {bookingData?.toDate && bookingData?.toTime && (
                      <p className="flex justify-between">
                        <span className="font-bold">To:</span>
                        <span className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]">
                          {new Date(bookingData.toDate).toLocaleDateString()} {formatTime(bookingData.toTime)}
                        </span>
                      </p>
                    )}
                    <p className="flex justify-between">
                      <span className="font-bold">Tax ({orderSummary.taxPercentage}%):</span>
                      <span className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]">
                        ₹{orderSummary.taxAmount.toFixed(2)}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-bold">Shipping:</span>
                      <span className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]">
                        ₹{orderSummary.shippingCost.toFixed(2)}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-bold">
                        Refundable Security Deposit:
                      </span>
                      <span className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]">
                        ₹{orderSummary.securityDeposit.toFixed(2)}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            ) : (!isDirectBooking && cartItems && cartItems.length > 0) ? (
              <div className="flex flex-col gap-4">
                {cartItems.map((item, index) => (
                  <div key={item._id} className="border-b border-[#34658C]">
                    <div
                      className="flex justify-between my-6 cursor-pointer"
                      onClick={() => toggleAccordion(index)}
                    >
                      <h1 className="text-[#34658C] text-[16px] tracking-[0.32px] md:text-[20px] md:tracking-[0.4px] font-medium">
                        {item.equipmentName || item.serviceName}
                      </h1>
                      <div className="flex gap-3">
                        <p className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]">
                          ({item.cartquantity || 1})
                        </p>
                        {openIndex === index ? (
                          <IoMdArrowDropdown className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] text-[#3D3D3D]" />
                        ) : (
                          <IoMdArrowDropup className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] text-[#3D3D3D]" />
                        )}
                      </div>
                    </div>

                    {openIndex === index && (
                      <div className="my-6 flex flex-col gap-2 text-[12px] leading-[22px] tracking-[0.48px] md:text-[14px] leading-[26px] tracking-[0.48px]">
                        <p className="flex justify-between">
                          <span className="font-bold">Rental Cost:</span>
                          <span className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]">
                            ₹{item.equipmentPrice || item.servicePrice || 0}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span className="font-bold">Rental Duration:</span>
                          <span className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]">
                            {item.rentalValue} {formatRentalDuration(item.rentalDuration)}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span className="font-bold">Tax ({item.producttaxpercentage}%):</span>
                          <span className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]">
                            ₹{(((item.equipmentPrice || item.servicePrice || 0) * (item.producttaxpercentage || 0)) / 100).toFixed(2)}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span className="font-bold">Shipping:</span>
                          <span className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]">
                            ₹{item.productshippingcost || 0}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span className="font-bold">
                            Refundable Security Deposit:
                          </span>
                          <span className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]">
                            ₹{item.refundableSecurityDep || 0}
                          </span>
                        </p>
                        <p className="flex justify-between border-t pt-2 mt-2">
                          <span className="font-bold">Item Total:</span>
                          <span className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px] font-bold">
                            ₹{item.TotalAmount || 0}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                <p>Cart summary will appear here</p>
              </div>
            )}

            {/* Coupon Section - Only show for direct booking, hide for cart flow */}
            {isDirectBooking && (
              <div className="py-3 flex flex-col gap-4">
                {appliedCoupon ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex justify-between items-center">
                    <div>
                      <p className="text-green-700 font-semibold text-[14px]">
                        ✓ Coupon Applied: {appliedCoupon.code}
                      </p>
                      <p className="text-green-600 text-[12px]">
                        You saved ₹{appliedCoupon.discount}
                      </p>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-red-500 text-[12px] font-semibold hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => setShowCouponModal(true)}
                      className="text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px] font-medium font-outfit text-left"
                    >
                      Have a Coupon?{" "}
                      <span className="text-[#A2CD48] cursor-pointer hover:text-[#8fb83d]">
                        View Available Coupons
                      </span>
                    </button>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-[14px] font-semibold uppercase"
                      />
                      <button
                        onClick={() => handleApplyCoupon(couponCode)}
                        disabled={couponLoading || !couponCode}
                        className="bg-[#A2CD48] text-white px-6 py-2 rounded-lg text-[14px] font-semibold disabled:opacity-50 hover:bg-[#8fb83d] transition-colors"
                      >
                        {couponLoading ? "Applying..." : "Apply"}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Total Amount */}
            <div className="py-3 flex flex-col gap-4 md:gap-6 border-t border-gray-200">
              {orderSummary && (
                <>
                  <div className="flex justify-between font-outfit">
                    <p className="text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px] font-semibold">
                      Subtotal:
                    </p>
                    <p className="text-[16px] tracking-[0.32px] md:text-[20px] md:tracking-[0.4px] font-semibold">
                      ₹{(orderSummary.totalAmount + (appliedCoupon?.discount || 0)).toFixed(2)}
                    </p>
                  </div>

                  {appliedCoupon && (
                    <div className="flex justify-between font-outfit text-green-600">
                      <p className="text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px] font-semibold">
                        Discount ({appliedCoupon.code}):
                      </p>
                      <p className="text-[16px] tracking-[0.32px] md:text-[20px] md:tracking-[0.4px] font-semibold">
                        -₹{appliedCoupon.discount.toFixed(2)}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between font-outfit">
                    <p className="text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px] font-bold">
                      Total Amount:
                    </p>
                    <p className="text-[16px] tracking-[0.32px] md:text-[20px] md:tracking-[0.4px] font-bold text-[#34658C]">
                      ₹{orderSummary.totalAmount.toFixed(2)}/-
                    </p>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={handleProceedToPayment}
              className="text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px] font-semibold bg-[#34658C] w-full px-6 py-3 rounded-[12px] text-white font-outfit disabled:opacity-50 hover:bg-[#2a5270] transition-colors"
              disabled={!selectedAddressId}
            >
              Proceed to Payment
            </button>
            {
              !selectedAddressId && addresses.length > 0 && !showAddressForm && (
                <p className="text-red-500 text-[12px] md:text-[14px] text-center mt-2">
                  Please select a delivery address
                </p>
              )
            }
          </div >
        </div >
      </div >

      {/* Coupon Modal */}
      {
        showCouponModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[24px] max-w-[600px] w-full max-h-[80vh] overflow-y-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-[24px] font-semibold">Available Coupons</h2>
                <button
                  onClick={() => setShowCouponModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <IoMdClose className="w-[28px] h-[28px]" />
                </button>
              </div>

              <div className="space-y-3">
                {coupons.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">
                    No coupons available at the moment
                  </p>
                ) : (
                  coupons.map((coupon) => {
                    const isEligible = orderSummary && orderSummary.totalAmount >= coupon.minimumamount;
                    const amountNeeded = orderSummary ? coupon.minimumamount - orderSummary.totalAmount : 0;

                    return (
                      <div
                        key={coupon._id}
                        className="border border-[#34658C] rounded-[12px] p-4 hover:bg-[#EBF0F4] transition-colors"
                      >
                        <div className="flex justify-between items-start gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className="bg-[#34658C] text-white px-3 py-1 rounded-full text-[14px] font-bold">
                                {coupon.couponCode}
                              </span>
                              {coupon.isUniversal && (
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[12px]">
                                  Universal
                                </span>
                              )}
                            </div>
                            <p className="text-[18px] font-semibold text-[#A2CD48] mb-1">
                              Save ₹{coupon.discountamount}
                            </p>
                            <p className="text-[12px] text-gray-600">
                              Min. order: ₹{coupon.minimumamount}
                            </p>
                            <p className="text-[12px] text-gray-500">
                              Valid till: {new Date(coupon.expireDate).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={() => handleApplyCoupon(coupon.couponCode)}
                            disabled={couponLoading || !isEligible}
                            className="bg-[#A2CD48] text-white px-4 py-2 rounded-lg text-[14px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#8fb83d] transition-colors"
                          >
                            Apply
                          </button>
                        </div>
                        {!isEligible && amountNeeded > 0 && (
                          <p className="text-red-500 text-[12px] mt-2">
                            Add ₹{amountNeeded.toFixed(2)} more to use this coupon
                          </p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default CheckOut;
