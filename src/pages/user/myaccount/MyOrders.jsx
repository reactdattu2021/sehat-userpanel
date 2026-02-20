import React, { useEffect, useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import {
  myorderApi,
  cancelOrderApi,
  extendBookingApi,
  verifyPaymentApi,
} from "../../../apis/authapis";
import { toast } from "react-toastify";
import { IoMdClose } from "react-icons/io";

const formatIST = (date) =>
  new Date(date).toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [openEditIndex, setOpenEditIndex] = useState(null);
  const [cancelLoadingId, setCancelLoadingId] = useState(null);
  const [extensionModal, setExtensionModal] = useState({
    isOpen: false,
    order: null,
    product: null,
  });
  const [extending, setExtending] = useState(false);
  const [extensionData, setExtensionData] = useState({
    additionalDays: 1,
    paymentMode: "COD",
  });

  const limit = 5;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const res = await myorderApi({
          page: currentPage,
          limit,
        });

        if (res?.data?.success) {
          setOrders(res.data.bookings || []);
          setTotalPages(res.data.totalPages || 1);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const handleCancelOrder = async (orderId) => {
    try {
      setCancelLoadingId(orderId);
      await cancelOrderApi(orderId);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "cancelled" } : order,
        ),
      );
      setOpenEditIndex(null);
      toast.success("Order cancelled successfully");
    } catch (error) {
      console.error("Cancel order failed:", error);
      toast.error(error.response?.data?.message || "Failed to cancel order.");
    } finally {
      setCancelLoadingId(null);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleExtensionSubmit = async () => {
    if (extensionData.additionalDays <= 0) {
      toast.error("Please enter a valid number of days");
      return;
    }

    try {
      setExtending(true);

      // ✅ Correct Payload based on Backend: { additionalDays, paymentMode, selectedItemIds }
      const payload = {
        additionalDays: extensionData.additionalDays,
        paymentMode: extensionData.paymentMode,
        selectedItemIds: [extensionModal.product._id],
      };

      const res = await extendBookingApi(extensionModal.order._id, payload);

      if (res.data.success) {
        if (extensionData.paymentMode === "online") {
          const loaded = await loadRazorpayScript();
          if (!loaded) {
            toast.error("Razorpay SDK failed to load");
            return;
          }

          const { razorpay_order_id, razorpay_key_id, amount, extension_data } =
            res.data;
          const options = {
            key: razorpay_key_id,
            amount: amount * 100,
            currency: "INR",
            name: "SehatMitra",
            description: "Booking Extension",
            order_id: razorpay_order_id,
            handler: async (response) => {
              try {
                // Verify extension payment
                const verifyPayload = {
                  razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  isExtension: true,
                  bookingId: extensionModal.order._id,
                  extension_data, // Pass original extension data for processing
                };

                const verifyRes = await verifyPaymentApi(verifyPayload);
                if (verifyRes.data.success) {
                  toast.success("Payment success! Booking extended.");
                  window.location.reload();
                }
              } catch (err) {
                console.error("Verification failed:", err);
                toast.error(
                  "Payment verification failed. Please contact support.",
                );
              }
            },
            prefill: {
              name: extensionModal.order.shipping_address?.fullname,
              email: extensionModal.order.shipping_address?.emailAddress,
              contact: extensionModal.order.shipping_address?.mobilenumber,
            },
            theme: { color: "#34658C" },
            modal: {
              ondismiss: () => {
                toast.info("Payment cancelled");
                setExtending(false);
              },
            },
          };
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          toast.success("Booking extended successfully!");
          setExtensionModal({ isOpen: false, order: null, product: null });
          window.location.reload();
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Extension failed");
    } finally {
      // Don't set extending false here if online, as modal is still open
      if (extensionData.paymentMode !== "online") {
        setExtending(false);
      }
    }
  };

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;
  if (!orders.length)
    return <p className="text-center mt-10">No orders found</p>;

  return (
    <div>
      <h1 className="text-[28px] md:text-[36px] font-bold text-[#34658C] mb-6">
        Your Orders
      </h1>

      {orders.map((order) => {
        if (!order.products?.length) return null;

        return (
          <div key={order._id} className="border-b border-black mb-6 pb-4">
            {/* Order Header */}
            <div className="flex justify-between items-start relative mb-2">
              <h2 className="font-bold text-[#34658C]">
                Order ID: {order.orderId}
              </h2>

              {/* 3 dots */}
              <HiOutlineDotsVertical
                className="w-[20px] h-[20px] text-black cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenEditIndex(
                    openEditIndex === order._id ? null : order._id,
                  );
                }}
              />

              {/* Dropdown */}
              {openEditIndex === order._id && (
                <div
                  className="absolute right-0 top-6 bg-white w-[120px] p-3 rounded-[12px] z-50"
                  style={{ boxShadow: "0px 0px 4px 0px #00000040" }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancelOrder(order._id);
                    }}
                    disabled={
                      cancelLoadingId === order._id ||
                      [
                        "cancelled",
                        "delivered",
                        "returned",
                        "completed",
                      ].includes(order.status) ||
                      order.payment?.refundStatus === "processed" ||
                      order.payment?.depositRefundStatus === "processed"
                    }
                    className={`text-[14px] font-semibold ${
                      [
                        "cancelled",
                        "delivered",
                        "returned",
                        "completed",
                      ].includes(order.status) ||
                      order.payment?.refundStatus === "processed" ||
                      order.payment?.depositRefundStatus === "processed"
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-red-600"
                    }`}
                  >
                    {cancelLoadingId === order._id
                      ? "Cancelling..."
                      : order.status === "cancelled"
                        ? "Cancelled"
                        : "Cancel Order"}
                  </button>
                </div>
              )}
            </div>

            <p className="text-sm mb-3">
              Payment Status:
              <span className="ml-1 font-semibold capitalize">
                {order.status === "cancelled" &&
                order.payment?.refundStatus !== "none"
                  ? order.payment?.refundStatus === "processed"
                    ? "Refunded"
                    : "Refund Pending"
                  : order.payment?.status}
              </span>
              {" | Total Amount: "}₹{order.payment?.amount}
            </p>

            {order.status && (
              <p className="text-sm mb-3">
                Order Status:
                <span
                  className={`ml-1 font-semibold capitalize ${
                    order.status === "cancelled" ? "text-red-600" : ""
                  }`}
                >
                  {order.status}
                </span>
              </p>
            )}

            {/* Products */}
            {order.products.map((product, index) => {
              const startDate = product.startDate || order.startDate;
              const endDate = product.endDate || order.endDate;

              return (
                <div
                  key={product._id || index}
                  className={`grid grid-cols-12 gap-5 ${index > 0 ? "mt-4 pt-4 border-t border-gray-300" : ""}`}
                >
                  <div className="col-span-4">
                    <img
                      src={product.productimages}
                      alt={product.productname}
                      className="w-[120px] h-[120px] object-cover"
                    />
                  </div>

                  <div className="col-span-8 flex flex-col gap-2 text-sm">
                    <p className="font-semibold">{product.productname}</p>

                    <p>
                      Rental Duration:
                      <span className="ml-1">{product.rentalDuration}</span>
                    </p>

                    <p>
                      Price:
                      <span className="ml-1">₹{product.productprice}</span>
                    </p>
                    <p>
                      shipping cost:
                      <span className="ml-1">₹{product.shippingcost}</span>
                    </p>
                    <p>
                      tax:
                      <span className="ml-1">{product.taxpercentage}%</span>
                    </p>

                    {product.securityDeposit > 0 && (
                      <p>
                        Security Deposit:
                        <span className="ml-1">₹{product.securityDeposit}</span>
                      </p>
                    )}

                    {product.modelType === "equipment" && (
                      <p>
                        Qty:
                        <span className="ml-1">{product.cartquantity}</span>
                      </p>
                    )}

                    {startDate && endDate && (
                      <>
                        <p>
                          Start:
                          <span className="ml-1">{formatIST(startDate)}</span>
                        </p>
                        <p>
                          End:
                          <span className="ml-1">{formatIST(endDate)}</span>
                        </p>
                      </>
                    )}

                    {!["cancelled", "completed", "returned"].includes(
                      order.status,
                    ) && (
                      <button
                        onClick={() =>
                          setExtensionModal({ isOpen: true, order, product })
                        }
                        className="mt-2 bg-[#34658C] text-white px-4 py-1.5 rounded-md text-xs font-semibold hover:bg-[#2a5270] transition-colors w-fit"
                      >
                        Extend Rental
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-10">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-3 rounded-lg font-semibold flex items-center justify-center ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#34658C] text-white hover:bg-[#2a5270]"
            }`}
          >
            <MdKeyboardArrowLeft className="w-6 h-6" />
          </button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={`px-4 py-2 rounded-lg font-semibold ${
                  currentPage === index + 1
                    ? "bg-[#A2CD48] text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-3 rounded-lg font-semibold flex items-center justify-center ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#34658C] text-white hover:bg-[#2a5270]"
            }`}
          >
            <MdKeyboardArrowRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Extension Modal */}
      {extensionModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setExtensionModal({ isOpen: false, order: null })}
              className="absolute right-4 top-4 text-gray-400 hover:text-black"
            >
              <IoMdClose size={24} />
            </button>

            <h2 className="text-2xl font-bold text-[#34658C] mb-4">
              Extend Rental
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Extend your booking duration. Additional charges will be
              calculated based on product rates.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  How many{" "}
                  {(() => {
                    const unit =
                      extensionModal.product?.rentalDuration || "perDay";
                    const mapping = {
                      perHour: "Hours",
                      perhour: "Hours",
                      perDay: "Days",
                      perday: "Days",
                      perWeek: "Weeks",
                      perweek: "Weeks",
                      perMonth: "Months",
                      permonth: "Months",
                    };
                    return mapping[unit] || "Units";
                  })()}{" "}
                  to extend "{extensionModal.product?.productname}"?
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={extensionData.additionalDays}
                    onChange={(e) =>
                      setExtensionData({
                        ...extensionData,
                        additionalDays: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#34658C]"
                    placeholder="Enter extension value..."
                  />
                </div>
              </div>

              {extensionData.additionalDays > 0 && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs text-blue-800 font-semibold mb-1 uppercase tracking-wider">
                    New End Date Preview
                  </p>
                  <div className="flex justify-between text-[13px] text-blue-900 font-bold">
                    <span>{extensionModal.product?.productname}:</span>
                    <span>
                      {(() => {
                        const currentEnd = new Date(
                          extensionModal.product?.endDate,
                        );
                        const unit =
                          extensionModal.product?.rentalDuration || "";
                        if (unit.toLowerCase().includes("hour")) {
                          currentEnd.setHours(
                            currentEnd.getHours() +
                              extensionData.additionalDays,
                          );
                        } else if (unit.toLowerCase().includes("week")) {
                          currentEnd.setDate(
                            currentEnd.getDate() +
                              extensionData.additionalDays * 7,
                          );
                        } else if (unit.toLowerCase().includes("month")) {
                          currentEnd.setMonth(
                            currentEnd.getMonth() +
                              extensionData.additionalDays,
                          );
                        } else {
                          currentEnd.setDate(
                            currentEnd.getDate() + extensionData.additionalDays,
                          );
                        }
                        return formatIST(currentEnd);
                      })()}
                    </span>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Payment Mode
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="payMode"
                      value="COD"
                      checked={extensionData.paymentMode === "COD"}
                      onChange={(e) =>
                        setExtensionData({
                          ...extensionData,
                          paymentMode: e.target.value,
                        })
                      }
                      className="accent-[#34658C]"
                    />
                    <span className="text-sm">COD</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="payMode"
                      value="online"
                      checked={extensionData.paymentMode === "online"}
                      onChange={(e) =>
                        setExtensionData({
                          ...extensionData,
                          paymentMode: e.target.value,
                        })
                      }
                      className="accent-[#34658C]"
                    />
                    <span className="text-sm">Online</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={() =>
                    setExtensionModal({ isOpen: false, order: null })
                  }
                  className="flex-1 py-3 rounded-lg border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExtensionSubmit}
                  disabled={extending}
                  className="flex-1 py-3 rounded-lg bg-[#A2CD48] text-white font-semibold hover:bg-[#8fb83d] transition-colors disabled:opacity-50"
                >
                  {extending ? "Processing..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
