import React, { useState, useEffect } from "react";
import { IoDocumentText } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropup } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getBookingDetailsApi } from "../../apis/authapis";

const Thankyou = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [openIndex, setOpenIndex] = useState(null);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Get booking ID from location state
        const bookingFromState = location.state?.booking;

        if (bookingFromState?._id) {
            fetchBookingDetails(bookingFromState._id);
        } else {
            toast.error("No booking information found");
            setLoading(false);
        }
    }, [location.state]);

    const fetchBookingDetails = async (bookingId) => {
        try {
            setLoading(true);
            const response = await getBookingDetailsApi(bookingId);

            console.log("✅ Booking Details Response:", response.data);

            if (response.data.success) {
                setBookingDetails(response.data.booking);
            } else {
                toast.error("Failed to fetch booking details");
            }
        } catch (error) {
            console.error("❌ Error fetching booking details:", error);
            toast.error(error.response?.data?.message || "Failed to load booking details");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
      if (!dateString) return "N/A";

      const date = new Date(dateString);

      return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true, // AM/PM format
      });
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

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#A2CD48] mx-auto mb-4"></div>
                    <p className="text-gray-500 text-lg">Loading your booking details...</p>
                </div>
            </div>
        );
    }

    if (!bookingDetails) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <p className="text-gray-500 text-lg mb-4">No booking details available</p>
                    <button
                        onClick={() => navigate("/")}
                        className="bg-[#A2CD48] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#8fb83d] transition-colors"
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        );
    }

    const { shipping_address, rentalPeriod, payment, products, orderId, status, orderamount, createdAt } = bookingDetails;

    return (
        <div className="max-w-[1440px] mx-auto px-5 md:px-8 xl:px-[120px] pb-[60px] md:pb-[80px] xl:pb-[120px]">
            <div className="flex flex-col items-center gap-3 mb-[40px] md:mb-[80px]">
                <img
                    src="/assets/thankyouImages/LqHka7UUzf 1.png"
                    className="w-[100px] h-[100px] md:w-[200px] md:h-[200px]"
                />
                <h1 className="text-[16px] tracking-[0.32px] md:text-[28px] md:tracking-[0.48px] font-bold ">
                    Thank You, {shipping_address?.fullname || "Valued Customer"}!
                </h1>
                <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[20px] md:leading-[32px] md:tracking-[0.8px] font-semibold">
                    Your order has been placed successfully.
                </p>
                <div className="flex items-center gap-1">
                    <IoDocumentText className="w-[24px] h-[24px]" />
                    <p className="text-[12px] leading-[18px] tracking-[0.48px] md:text-[16px] md:leading-[22px] md:tracking-[0.64px] italic">
                        A confirmation email & invoice have been sent to your registered
                        email.
                    </p>
                </div>
            </div>
            {/* Order Details */}
            <div className="bg-[#EBF0F4] rounded-[24px] p-[32px] mb-[32px] md:mb-[50px]">
                <h1 className=" text-[20px] tracking-[0.4px] md:text-[32px] md:tracking-[0.64px] text-[#34658C] font-semibold mb-3">
                    Order Details
                </h1>


                <div className="flex flex-col gap-2 md:gap-5">
                    {/* Row */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start w-full">
                        <p className="text-[12px] leading-[20px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold w-[50%]">
                            Order ID :
                        </p>
                        <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold  w-[50%]">
                            {orderId || "N/A"}
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row md:justify-between md:items-start w-full">
                        <p className="text-[12px] leading-[20px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold w-[50%]">
                            Order Date :
                        </p>
                        <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold  w-[50%]">
                            {formatDate(createdAt)}
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row md:justify-between md:items-start w-full">
                        <p className="text-[12px] leading-[20px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold w-[50%]">
                            Total Amount :
                        </p>
                        <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold w-[50%]">
                            ₹{(payment?.amount || orderamount || 0).toFixed(2)}/-
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row md:justify-between md:items-start w-full">
                        <p className="text-[12px] leading-[20px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold w-[50%]">
                            Payment Mode :
                        </p>
                        <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold w-[50%]">
                            {payment?.status === "paid" ? "Online Payment" : location.state?.paymentMode || "N/A"}
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row md:justify-between md:items-start w-full">
                        <p className="text-[12px] leading-[20px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold w-[50%]">
                            Shipping Address :
                        </p>
                        <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold  w-full md:w-[50%]">
                            {shipping_address?.streetAddress?.join(", ") || ""}, {shipping_address?.city}, {shipping_address?.state}, {shipping_address?.pincode}, {shipping_address?.country}
                        </p>
                    </div>
                </div>
            </div>

            {/* Orders */}
            <div className="grid grid-cols-12 gap-4  md:gap-8">
                <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
                    <h1 className="text-[28px] tracking-[0.56px] md:text-[36px] md:tracking-[0.72px] font-bold text-[#34658C]">
                        Your Orders
                    </h1>
                    {products && products.length > 0 ? products.map((product, index) => (
                        <div key={product._id || index} className="border-b border-[#000000]">
                            <h1 className="text-[16px] tracking-[0.32px] md:text-[20px] md:tracking-[0.4px] font-bold text-[#34658C] mb-3">
                                {product.productname || product.details?.equipmentName || "N/A"}
                            </h1>
                            <div className="flex flex-col md:flex-row gap-1 md:gap-6 mb-3">
                                <p className="text-[12px] leading-[20px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
                                    Shipment ID:{" "}
                                    <span className="text-[12px] leading-[20px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-normal">
                                        {orderId || "N/A"}
                                    </span>
                                </p>
                                {/* <p className="text-[12px] leading-[20px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold ">
                                    Est. Delivery:{" "}
                                    <span className="text-[12px] leading-[20px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-normal">
                                        {formatDate(rentalPeriod?.end)}
                                    </span>
                                </p> */}
                            </div>
                            <div className="grid grid-cols-12 gap-5 mb-5">
                                <div className=" col-span-4">
                                    <img
                                        src={product.productimages || "/assets/placeholder-image.png"}
                                        alt={product.productname || "Product"}
                                        className="w-[100px] h-[100px] md:w-[120px] md:h-[120px]"
                                        onError={(e) => { e.target.src = "/assets/placeholder-image.png"; }}
                                    />
                                </div>
                                <div className="col-span-8 flex flex-col gap-2 text-[12px] leading-[20px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px]">
                                    <p className="font-semibold">
                                        Rental Cost:{" "}
                                        <span className="font-normal">₹{product.productprice?.toFixed(2) || "0.00"}</span>
                                    </p>
                                    <p className="font-semibold">
                                        Rental Duration:{" "}
                                        <span className="font-normal">{formatDate(rentalPeriod?.start)} - {formatDate(rentalPeriod?.end)}</span>
                                    </p>
                                    <p className="font-semibold">
                                        Security Deposit:{" "}
                                        <span className="font-normal">₹{product.securityDeposit?.toFixed(2) || "0.00"}</span>
                                    </p>
                                    <p className="font-semibold">
                                        Qty: <span className="font-normal">{product.cartquantity || product.productquantity || 1}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )) : <p className="text-gray-500">No products found</p>}
                </div>
                <div className="col-span-12 lg:col-span-5 flex flex-col h-full justify-center gap-3">
                    <div
                        className="p-4 md:p-[32px] rounded-[32px]"
                        style={{ boxShadow: "0px 0px 4px 0px #00000040" }}
                    >
                        <h1 className="text-[20px] tracking-[0.4px] md:text-[24px] md:tracking-[0.48px] mb-4 md:mb-6 font-medium">
                            Rent Cost Summary
                        </h1>
                        {products && products.length > 0 ? products.map((product, index) => (
                            <div key={product._id || index} className="border-b  border-[#34658C] ">
                                <div
                                    className="flex justify-between my-4 md:my-6  "
                                    onClick={() => toggleAccordion(index)}
                                >
                                    <h1 className="text-[#34658C] text-[16px] tracking-[0.32px] md:text-[20px] md:tracking-[0.4px] font-medium">
                                        {product.productname || product.details?.equipmentName || "N/A"}
                                    </h1>
                                    <div className="flex gap-3">
                                        <p className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]">
                                            ({product.cartquantity || product.productquantity || 1})
                                        </p>
                                        {openIndex === index ? (
                                            <IoMdArrowDropdown className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] text-[#3D3D3D]" />
                                        ) : (
                                            <IoMdArrowDropup className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] text-[#3D3D3D]" />
                                        )}
                                    </div>
                                </div>

                                {openIndex === index && (
                                    <div className="my-2 md:my-6 flex flex-col gap-2 text-[12px] leading-[22px] tracking-[0.48px] md:text-[14px] md:leading-[26px] md:tracking-[0.48px]">
                                        <p className="flex justify-between">
                                            <span className="font-bold">Rental Cost:</span>
                                            <span className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]">
                                                ₹{product.productprice?.toFixed(2) || "0.00"}
                                            </span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span className="font-bold">Rental Duration:</span>
                                            <span className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]">
                                                {formatDate(rentalPeriod?.start)} - {formatDate(rentalPeriod?.end)}
                                            </span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span className="font-bold">Tax:</span>
                                            <span className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]">
                                                {product.taxpercentage || 0}%
                                            </span>
                                        </p>
                                        <p className="flex justify-between">
                                            <span className="font-bold">Shipping:</span>
                                            <span className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]">
                                                ₹{product.shippingcost?.toFixed(2) || "0.00"}
                                            </span>
                                        </p>
                                        <p className="flex justify-between ">
                                            <span className="font-bold">
                                                Refundable Security Deposit:
                                            </span>
                                            <span className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]">
                                                ₹{product.securityDeposit?.toFixed(2) || "0.00"}
                                            </span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        )) : <p className="text-gray-500">No products found</p>}

                        <div className="py-3 flex flex-col gap-4 md:gap-6">
                            <div className="flex justify-between font-outfit">
                                <p className="text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px] font-semibold">
                                    Total Amount :
                                </p>
                                <p className="text-[16px] tracking-[0.32px] md:text-[20px] md:tracking-[0.4px] font-semibold">
                                    ₹{(payment?.amount || orderamount || 0).toFixed(2)}/-
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button className="font-outfit bg-[#34658C] px-6 py-3 rounded-[12px] text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px] font-semibold text-white">
                            Download Invoice
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Thankyou;
