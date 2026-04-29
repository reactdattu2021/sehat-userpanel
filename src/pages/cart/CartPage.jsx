import React, { useEffect, useRef, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { Products, Services, Summary } from "../../utils/Data";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoMdArrowDropdown, IoMdArrowDropup, IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CartStepper from "../commonComponents/Stepper";
import Stepper from "../commonComponents/Stepper";
import {
  getUserCartApi,
  updateCartApi,
  deleteCartApi,
  getAllCouponsApi,
  applyCouponApi,
} from "../../apis/authapis";

const CartPage = () => {
  const [openEditIndex, setOpenEditIndex] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [editCart, setEditCart] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Coupon states
  const [coupons, setCoupons] = useState([]);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);

  const navigate = useNavigate();
  const modalRef = useRef(null);

  // Fetch cart data from API
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await getUserCartApi();
        if (response.data.success) {
          const items = response.data.data || [];
          setCartItems(items);
          // Select all items by default
          setSelectedItems(items.map(item => item._id));
          // Open first item accordion
          setOpenIndex(0);
          // Set total based on all items
          setTotalAmount(response.data.total || 0);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCartData();
    fetchCoupons();
  }, []);

  // Recalculate total when selected items change
  useEffect(() => {
    const selectedTotal = cartItems
      .filter(item => selectedItems.includes(item._id))
      .reduce((sum, item) => sum + (item.TotalAmount || 0), 0);
    setTotalAmount(selectedTotal);
  }, [selectedItems, cartItems]);

  const fetchCoupons = async () => {
    try {
      const response = await getAllCouponsApi(1, 50);
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

    if (totalAmount === 0) {
      toast.error("Cart is empty");
      return;
    }

    if (appliedCoupon) {
      toast.error("Remove current coupon before applying a new one");
      return;
    }

    try {
      setCouponLoading(true);
      const selectedCartIds = selectedItems;
      const response = await applyCouponApi(code, selectedCartIds);

      if (response.data.success) {
        const { discount, selectedOriginalAmount, finalAmount } = response.data;

        setAppliedCoupon({
          code: code,
          discount: discount,
          originalAmount: selectedOriginalAmount
        });

        setTotalAmount(finalAmount);

        toast.success(`Coupon applied! You saved ₹${discount}`);
        setShowCouponModal(false);
        setCouponCode("");
      }
    } catch (error) {
      console.error("Error applying coupon:", error);
      toast.error(error.response?.data?.message || "Invalid coupon code");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    if (appliedCoupon) {
      setTotalAmount(appliedCoupon.originalAmount);
      setAppliedCoupon(null);
      setCouponCode("");
      toast.info("Coupon removed");
    }
  };

  const openEdit = (item) => {
    let startTime = '';
    let endTime = '';

    if (item.startDate) {
      const date = new Date(item.startDate);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      startTime = `${hours}:${minutes}`;
    }

    if (item.endDate) {
      const date = new Date(item.endDate);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      endTime = `${hours}:${minutes}`;
    }

    setEditCart({
      _id: item._id,
      cartquantity: item.cartquantity,
      rentalDuration: item.rentalDuration,
      rentalValue: item.rentalValue,
      startDate: item.startDate ? new Date(item.startDate).toISOString().split('T')[0] : '',
      startTime: startTime,
      endDate: item.endDate ? new Date(item.endDate).toISOString().split('T')[0] : '',
      endTime: endTime,
      visitTimings: item.visitTimings || [],
      isService: !!item.servicesId,
    });
    setShowEditModal(true);
    setOpenEditIndex(null);
  };
  const updateQuantity = async (cartId, qty) => {
    if (qty < 1) return;

    try {
      const item = cartItems.find(i => i._id === cartId);
      if (!item) return;

      const res = await updateCartApi(cartId, {
        cartquantity: qty,
        rentalDuration: item.rentalDuration,
        rentalValue: item.rentalValue
      });

      if (res.data.success) {
        const cartResponse = await getUserCartApi();
        setCartItems(cartResponse.data.data || []);
        setTotalAmount(cartResponse.data.total || 0);
      }
    } catch (err) {
      console.error("Quantity update failed", err);
    }
  };

  // Update cart quantity
  const changeEditQty = (type) => {
    setEditCart((prev) => ({
      ...prev,
      cartquantity:
        type === "inc"
          ? prev.cartquantity + 1
          : Math.max(1, prev.cartquantity - 1),
    }));
  };
  const saveEditCart = async () => {
    try {
      const { _id, isService, startTime, endTime, ...payload } = editCart;

      if (payload.startDate && payload.endDate) {
        const startDateTime = new Date(`${payload.startDate}T${startTime || '00:00'}`);
        const endDateTime = new Date(`${payload.endDate}T${endTime || '00:00'}`);

        if (endDateTime <= startDateTime) {
          alert('End date/time must be after start date/time');
          return;
        }

        payload.startDate = startDateTime.toISOString();
        payload.endDate = endDateTime.toISOString();

        const diffMs = endDateTime - startDateTime;
        const rDuration = payload.rentalDuration.toLowerCase();

        if (rDuration === "perhour") {
          payload.rentalValue = Math.ceil(diffMs / (1000 * 60 * 60));
        } else if (rDuration === "perday") {
          payload.rentalValue = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        } else if (rDuration === "perweek") {
          payload.rentalValue = Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 7));
        } else if (rDuration === "permonth") {
          payload.rentalValue = Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 30));
        }
      }

      const response = await updateCartApi(_id, payload);

      if (response.data.success) {
        const cartResponse = await getUserCartApi();
        setCartItems(cartResponse.data.data);
        setTotalAmount(cartResponse.data.total);
        setEditCart(null);
        setShowEditModal(false);
      }
    } catch (err) {
      console.error("Cart update failed", err);
      alert("Failed to update cart. Please try again.");
    }
  };

  // Delete cart item
  const deleteCartItem = async (cartId) => {
    try {
      // console.log("Deleting cart item:", cartId);
      const response = await deleteCartApi(cartId);
      // console.log("Delete response:", response.data);

      if (response.data.success) {
        // Close the modal
        setOpenEditIndex(null);

        // Refresh cart data
        const cartResponse = await getUserCartApi();
        if (cartResponse.data.success) {
          setCartItems(cartResponse.data.data || []);
          setTotalAmount(cartResponse.data.total || 0);
        }
      }
    } catch (error) {
      console.error("Error deleting cart item:", error);
      alert("Failed to delete item from cart. Please try again.");
    }
  };

  // Close modal if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setOpenEditIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-[1440px]  mx-auto px-5 md:px-8 xl:px-[120px]">
      <Stepper currentStep="cart" />
      {/* Your Products */}
      <div className="grid grid-cols-12 lg:grid-cols-12 gap-6  pb-[60px] md:pb-[80px] xl:pb-[120px]">
        <div className="col-span-12 lg:col-span-7">
          <div>
            <h1 className="text-[20px] tracking-[0.4px] md:text-[24px] md:tracking-[0.48px] font-semibold my-3">
              Your Products
            </h1>
            {cartItems
              .filter((item) => item.equipmentId)
              .map((data, index) => (
                <div
                  key={data._id}
                  className="p-3 md:p-5 xl:p-[24px] border-b border-[#3D3D3D]"
                >
                  <div className="grid  grid-cols-12 gap-2">
                    <div className=" col-span-1 md:col-span-2 flex justify-start items-center">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(data._id)}
                        onChange={() => {
                          setSelectedItems((prev) => {
                            if (prev.includes(data._id))
                              return prev.filter((id) => id !== data._id);
                            return [...prev, data._id];
                          });
                        }}
                        className="w-5 h-5 cursor-pointer accent-[#34658C]"
                      />
                    </div>

                    <div className="col-span-4 md:col-span-3">
                      <img
                        src={
                          data.equipmentId?.profileImage ||
                          data.equipmentImages?.[0] ||
                          "/placeholder.jpg"
                        }
                        className="w-[100px] h-[100px] md:w-[140px] md:h-[140px] object-cover rounded-lg"
                        alt={data.equipmentName}
                      />
                    </div>
                    <div className="col-span-6 md:col-span-5">
                      <h1 className="text-[16px] tracking-[0.32px] md:text-[20px] md:tracking-[0.4px] font-semibold text-[#34658C] mb-[6px]">
                        {data.equipmentName}
                      </h1>
                      <div className="flex flex-col gap-[2px]">
                        <p className="text-[12px] leading-[20px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-bold">
                          Rental Duration:{" "}
                          <span className="font-normal">
                            {data.rentalValue}{" "}
                            {data.rentalDuration?.toLowerCase() === "perday"
                              ? "Day(s)"
                              : data.rentalDuration?.toLowerCase() === "perweek"
                                ? "Week(s)"
                                : "Month(s)"}
                          </span>
                        </p>
                        <p className="text-[12px] leading-[20px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-bold">
                          Start Date:{" "}
                          <span className="font-normal">
                            {new Date(data.startDate).toLocaleString(
                              "en-IN",
                              {
                                dateStyle: "short",
                                timeStyle: "short"
                              }
                            )}
                          </span>
                        </p>
                        <p className="text-[12px] leading-[20px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-bold">
                          End Date:{" "}
                          <span className="font-normal">
                            {new Date(data.endDate).toLocaleString(
                              "en-IN",
                              {
                                dateStyle: "short",
                                timeStyle: "short"
                              }
                            )}
                          </span>
                        </p>
                        <p className="text-[12px] leading-[20px] tracking-[0.48px] md:text-[14px] md:leading-[26px] md:tracking-[0.56px] font-bold">
                          Qty:{" "}
                          <span className="font-normal inline-flex items-center gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateQuantity(data._id, data.cartquantity - 1);
                              }}
                              className="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded text-lg font-bold"
                            >
                              -
                            </button>
                            {data.cartquantity}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateQuantity(data._id, data.cartquantity + 1);
                              }}
                              className="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded text-lg font-bold"
                            >
                              +
                            </button>
                          </span>
                        </p>
                      </div>
                    </div>
                    <div
                      className="col-span-1 md:col-span-2 flex justify-end relative"
                      onClick={() => setOpenEditIndex(`product-${index}`)}
                    >
                      <HiOutlineDotsVertical className="w-[16px] h-[16px] md:w-[24px] md:h-[24px] cursor-pointer" />
                      {openEditIndex === `product-${index}` && (
                        <div
                          ref={modalRef}
                          className="absolute  right-[-50%] top-[25%] bg-white w-[70px] md:w-[105px] p-2 md:p-3   flex flex-col gap-2 rounded-[12px] z-50 items-start"
                          style={{ boxShadow: "0px 0px 4px 0px #00000040" }}
                        >
                          {/* <button className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]  text-[#3D3D3D] font-semibold  ">
                          Edit
                        </button> */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteCartItem(data._id);
                            }}
                            className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]  text-[#3D3D3D] font-semibold  "
                          >
                            Delete
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();

                              openEdit(data);
                            }}
                            className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px] text-[#34658C] font-semibold"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
          <div>
            {/* <h1 className="text-[20px] tracking-[0.4px] md:text-[24px] md:tracking-[0.48px] font-semibold my-3">
              Your Services
            </h1> */}
            {cartItems
              .filter((item) => item.servicesId)
              .map((data, index) => (
                <div
                  key={data._id}
                  className="p-3 md:p-5 xl:p-[24px] border-b border-[#3D3D3D]"
                >
                  <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-1 md:col-span-2 flex justify-start items-center">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(data._id)}
                        onChange={() => {
                          setSelectedItems((prev) => {
                            if (prev.includes(data._id))
                              return prev.filter((id) => id !== data._id);
                            return [...prev, data._id];
                          });
                        }}
                        className="w-5 h-5 cursor-pointer accent-[#34658C]"
                      />
                    </div>

                    <div className="col-span-4 md:col-span-3">
                      <img
                        src={
                          data.servicesId?.profileImage ||
                          data.serviceImages?.[0] ||
                          "/placeholder.jpg"
                        }
                        className="w-[100px] h-[100px] md:w-[140px] md:h-[140px] object-cover rounded-lg"
                        alt={data.serviceName}
                      />
                    </div>
                    <div className="col-span-6 md:col-span-5">
                      <h1 className="text-[20px] tracking-[0.4px] font-semibold text-[#34658C] mb-[6px]">
                        {data.serviceName}
                      </h1>
                      <div className="flex flex-col gap-[2px]">
                        <p className="text-[12px] leading-[20px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-bold">
                          Rental Duration:{" "}
                          <span className="font-normal">
                            {data.rentalValue}{" "}
                            {data.rentalDuration?.toLowerCase() === "perhour"
                              ? "Hour(s)"
                              : data.rentalDuration?.toLowerCase() === "perday"
                                ? "Day(s)"
                                : "Week(s)"}
                          </span>
                        </p>
                        <p className="text-[12px] leading-[20px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-bold">
                          Start Date:{" "}
                          <span className="font-normal">
                            {new Date(data.startDate).toLocaleString(
                              "en-IN",
                              {
                                dateStyle: "short",
                                timeStyle: "short"
                              }
                            )}
                          </span>
                        </p>
                        <p className="text-[12px] leading-[20px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-bold">
                          End Date:{" "}
                          <span className="font-normal">
                            {new Date(data.endDate).toLocaleString(
                              "en-IN",
                              {
                                dateStyle: "short",
                                timeStyle: "short"
                              }
                            )}
                          </span>
                        </p>
                        <p className="text-[12px] leading-[20px] tracking-[0.48px] md:text-[14px] md:leading-[26px] md:tracking-[0.56px] font-bold">
                          Qty:{" "}
                          <span className="font-normal inline-flex items-center gap-2">
                            {data.cartquantity || 1}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div
                      className="col-span-1 md:col-span-2  flex justify-end relative"
                      onClick={() => setOpenEditIndex(`service-${index}`)}
                    >
                      <HiOutlineDotsVertical className="w-[16px] h-[16px] md:w-[24px] md:h-[24px] cursor-pointer" />
                      {openEditIndex === `service-${index}` && (
                        <div
                          ref={modalRef}
                          className="absolute right-[-50%] top-[25%] bg-white w-[70px] md:w-[105px] p-2 md:p-3  flex flex-col gap-2 rounded-[12px] z-50 items-start"
                          style={{ boxShadow: "0px 0px 4px 0px #00000040" }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openEdit(data);
                            }}
                            className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]  text-[#3D3D3D] font-semibold  ">
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteCartItem(data._id);
                            }}
                            className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]  text-[#3D3D3D] font-semibold  "
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5 flex flex-col h-full justify-center">
          <div
            className="p-4 md:p-[32px] rounded-[32px]"
            style={{ boxShadow: "0px 0px 4px 0px #00000040" }}
          >
            <h1 className="text-[20px] tracking-[0.4px] md:text-[24px] md:tracking-[0.48px] mb-6 font-medium">
              Rent Cost Summary
            </h1>
            {cartItems
              .filter(item => selectedItems.includes(item._id))
              .map((item, index) => (
                <div key={item._id} className="border-b  border-[#34658C] ">
                  <div
                    className="flex justify-between my-6"
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
                          {item.rentalValue}{" "}
                          {item.rentalDuration?.toLowerCase() === "perday"
                            ? "Day(s)"
                            : item.rentalDuration?.toLowerCase() === "perhour"
                              ? "Hour(s)"
                              : item.rentalDuration?.toLowerCase() === "perweek"
                                ? "Week(s)"
                                : "Month(s)"}
                        </span>
                      </p>
                      <p className="flex justify-between">
                        <span className="font-bold">Tax ({item.producttaxpercentage || 0}%):</span>
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

            <div className="py-3 flex flex-col gap-4 md:gap-6">
              {/* Coupon Section */}
              <div className="flex flex-col gap-4">
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

              {appliedCoupon && (
                <div className="flex justify-between font-outfit">
                  <p className="text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px] font-semibold">
                    Subtotal:
                  </p>
                  <p className="text-[16px] tracking-[0.32px] md:text-[20px] md:tracking-[0.4px] font-semibold">
                    ₹{appliedCoupon.originalAmount.toFixed(2)}
                  </p>
                </div>
              )}

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
                <p className="text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px] font-semibold">
                  Total Amount :
                </p>
                <p className="text-[16px] tracking-[0.32px] md:text-[20px] md:tracking-[0.4px] font-semibold">
                  ₹{totalAmount.toFixed(2)}/-
                </p>
              </div>
            </div>
            <Link
              to="/checkout"
              state={{
                isDirectBooking: false,
                bookingData: {
                  selectedCartIds: selectedItems,
                },
                cartItems: cartItems.filter((item) =>
                  selectedItems.includes(item._id),
                ),
              }}
              onClick={async (e) => {
                if (selectedItems.length === 0) {
                  e.preventDefault();
                  alert("Please select at least one item to checkout");
                  return;
                }

                // Fix cart items with lowercase rentalDuration before checkout
                e.preventDefault();

                const normalizeRentalDuration = (duration) => {
                  const mapping = {
                    'perhour': 'perHour',
                    'perday': 'perDay',
                    'perweek': 'perWeek',
                    'permonth': 'perMonth',
                  };
                  return mapping[duration?.toLowerCase()] || duration;
                };

                try {
                  // Update all selected cart items with correct rentalDuration format
                  const selectedCartItems = cartItems.filter((item) =>
                    selectedItems.includes(item._id)
                  );

                  for (const item of selectedCartItems) {
                    const normalizedDuration = normalizeRentalDuration(item.rentalDuration);

                    // Only update if the duration was in lowercase
                    if (normalizedDuration !== item.rentalDuration) {
                      // console.log(`Fixing cart item ${item._id}: ${item.rentalDuration} -> ${normalizedDuration}`);
                      await updateCartApi(item._id, {
                        rentalDuration: normalizedDuration
                      });
                    }
                  }

                  // Refresh cart data to get updated items
                  const cartResponse = await getUserCartApi();
                  if (cartResponse.data.success) {
                    const updatedCartItems = cartResponse.data.data || [];
                    setCartItems(updatedCartItems);

                    // Now navigate to checkout with updated data
                    navigate('/checkout', {
                      state: {
                        isDirectBooking: false,
                        bookingData: {
                          selectedCartIds: selectedItems,
                        },
                        cartItems: updatedCartItems.filter((item) =>
                          selectedItems.includes(item._id)
                        ),
                        cartTotalAmount: totalAmount, // Pass final total from cart
                      }
                    });
                  }
                } catch (error) {
                  console.error("Error fixing cart items:", error);
                  alert("Failed to prepare cart for checkout. Please try again.");
                }
              }}
            >
              <button
                disabled={selectedItems.length === 0}
                className="text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px] font-semibold bg-[#34658C] w-full px-6 py-3 rounded-[12px] text-white font-outfit disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Checkout ({selectedItems.length})
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Edit Cart Modal */}
      {showEditModal && editCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-[24px] p-6 md:p-8 max-w-[500px] w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-[20px] md:text-[24px] font-semibold text-[#34658C] mb-6">
              Edit Cart Item
            </h2>

            <div className="flex flex-col gap-4">
              {/* Rental Duration */}
              <div>
                <label className="block text-[14px] md:text-[16px] font-semibold mb-2">
                  Rental Duration Type
                </label>
                <select
                  value={editCart.rentalDuration}
                  onChange={(e) =>
                    setEditCart((prev) => ({
                      ...prev,
                      rentalDuration: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#34658C]"
                >
                  {editCart.isService ? (
                    <>
                      <option value="perHour">Per Hour</option>
                      <option value="perDay">Per Day</option>
                      <option value="perWeek">Per Week</option>
                      <option value="perMonth">Per Month</option>
                    </>
                  ) : (
                    <>
                      <option value="perDay">Per Day</option>
                      <option value="perWeek">Per Week</option>
                      <option value="perMonth">Per Month</option>
                    </>
                  )}
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-[14px] md:text-[16px] font-semibold mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={editCart.startDate}
                  onChange={(e) =>
                    setEditCart((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#34658C]"
                />
              </div>

              {/* Start Time - For both equipment and services */}
              <div>
                <label className="block text-[14px] md:text-[16px] font-semibold mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={editCart.startTime || ''}
                  onChange={(e) =>
                    setEditCart((prev) => ({
                      ...prev,
                      startTime: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#34658C]"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-[14px] md:text-[16px] font-semibold mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={editCart.endDate || ''}
                  onChange={(e) =>
                    setEditCart((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  min={editCart.startDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#34658C]"
                />
              </div>

              {/* End Time */}
              <div>
                <label className="block text-[14px] md:text-[16px] font-semibold mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={editCart.endTime || ''}
                  onChange={(e) =>
                    setEditCart((prev) => ({
                      ...prev,
                      endTime: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#34658C]"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditCart(null);
                }}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-[14px] md:text-[16px] font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveEditCart}
                className="flex-1 px-6 py-3 bg-[#34658C] text-white rounded-lg text-[14px] md:text-[16px] font-semibold hover:bg-[#2a5270]"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )
      }

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
                    const isEligible = totalAmount >= coupon.minimumamount;
                    const amountNeeded = coupon.minimumamount - totalAmount;

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

export default CartPage;
