import React, { useEffect, useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { myorderApi, cancelOrderApi } from "../../../apis/authapis";

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
  };
  const handleCancelOrder = async (orderId) => {
    try {
      setCancelLoadingId(orderId);

      await cancelOrderApi(orderId);

      // ✅ Update UI immediately (no refetch needed)
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "cancelled" } : order,
        ),
      );

      setOpenEditIndex(null);
    } catch (error) {
      console.error("Cancel order failed:", error);
      alert("Failed to cancel order. Please try again.");
    } finally {
      setCancelLoadingId(null);
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
        const product = order.products?.[0];
        if (!product) return null;
        const startDate = product.startDate || order.startDate;
        const endDate = product.endDate || order.endDate;
        const visitTimings =
          product.visitTimings?.length > 0
            ? product.visitTimings
            : order.visitTimings;

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
                      order.status === "cancelled"
                    }
                    className={`text-[14px] font-semibold ${
                      order.status === "cancelled"
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
                {order.payment?.status}
              </span>
              {" | "}₹{order.payment?.amount}
            </p>

            {/* Product */}
            <div className="grid grid-cols-12 gap-5">
              <div className="col-span-4">
                <img
                  src={product.productimages}
                  alt={product.productname}
                  className="w-[120px] h-[120px] object-cover"
                />
              </div>

              <div className="col-span-8 flex flex-col gap-2 text-sm">
                <p className="font-semibold">{product.productname}</p>
                {order.status && (
                  <p className="text-sm">
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

                <p>
                  Rental Cost:
                  <span className="ml-1">₹{product.productprice}</span>
                </p>

                <p>
                  Rental Duration:
                  <span className="ml-1">{product.rentalDuration}</span>
                </p>

                {product.securityDeposit > 0 && (
                  <p>
                    Security Deposit:
                    <span className="ml-1">₹{product.securityDeposit}</span>
                  </p>
                )}

                <p>
                  Qty:
                  <span className="ml-1">{product.cartquantity}</span>
                </p>

                {visitTimings?.length > 0 && (
                  <p>
                    Visit:
                    <span className="ml-1">{visitTimings.join(", ")}</span>
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
              </div>
            </div>
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
    </div>
  );
};

export default MyOrders;
