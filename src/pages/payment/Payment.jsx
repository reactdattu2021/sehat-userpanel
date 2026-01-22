import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { IoCheckmarkSharp } from "react-icons/io5";
import { toast } from "react-toastify";
import Stepper from "../commonComponents/Stepper";
import { buyNowApi, cartBookingApi, verifyPaymentApi } from "../../apis/authapis";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { isDirectBooking, bookingData, addressId, orderSummary, appliedCoupon } = location.state || {};

  const [paymentMode, setPaymentMode] = useState("online");
  const [processing, setProcessing] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    // Validate required data
    if (!bookingData || !addressId || !orderSummary) {
      toast.error("Missing booking information. Redirecting to checkout...");
      navigate("/checkout");
      return;
    }

    // Set address for display
    setSelectedAddress(location.state.selectedAddress);
  }, [bookingData, addressId, orderSummary, navigate, location.state]);

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // Check if Razorpay is already loaded
      if (window.Razorpay) {
        console.log("✅ Razorpay already loaded");
        resolve(true);
        return;
      }

      const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
      if (existingScript) {
        console.log("⏳ Razorpay script tag exists, waiting for load...");
        existingScript.onload = () => {
          console.log("✅ Razorpay loaded from existing script");
          resolve(true);
        };
        existingScript.onerror = () => {
          console.error("❌ Razorpay script failed to load");
          resolve(false);
        };
        return;
      }

      // Create new script tag
      console.log("📥 Loading Razorpay script...");
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        console.log("✅ Razorpay script loaded successfully");
        resolve(true);
      };
      script.onerror = () => {
        console.error("❌ Failed to load Razorpay script");
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleBookingError = (error) => {
    console.error("❌ Payment Error:", error);
    console.error("❌ Error Details:", {
      message: error.message,
      response: error.response?.data,
      stack: error.stack
    });

    const errorMessage = error.response?.data?.message
      || error.response?.data?.error
      || error.message
      || "Payment initiation failed";

    // Handle "Past Dates" error specifically
    if (errorMessage === "Cannot book items with past dates. Please update your cart." ||
      errorMessage.toLowerCase().includes("past date") ||
      errorMessage.toLowerCase().includes("cannot book items with past dates")) {

      if (isDirectBooking) {
        toast.error("The selected date is in the past. Redirecting to update your booking date...", {
          autoClose: 2000
        });

        // Delay redirect slightly to let user see the toast
        setTimeout(() => {
          if (bookingData.productType === 'services' || bookingData.productType === 'service') {
            navigate(`/nurse-detail/${bookingData.productId}`);
          } else {
            navigate(`/equipment/${bookingData.productId}`);
          }
        }, 1500);
      } else {
        toast.error("One or more items in your cart have past dates. Redirecting to cart to update...", {
          autoClose: 2000
        });

        // Delay redirect slightly to let user see the toast
        setTimeout(() => {
          navigate('/cart');
        }, 1500);
      }
      return;
    }

    toast.error(errorMessage);
  };

  // Handle Online Payment (Razorpay)
  const handleOnlinePayment = async () => {
    try {
      setProcessing(true);

      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load Razorpay. Please try again.");
        setProcessing(false);
        return;
      }

      let response;

      // DIRECT BOOKING (Buy Now)
      if (isDirectBooking) {
        const buyNowPayload = {
          productId: bookingData.productId,
          productType: bookingData.productType,
          rentalDuration: bookingData.rentalDuration,
          rentalValue: bookingData.rentalValue,
          quantity: bookingData.quantity,
          startDate: bookingData.startDate,
          addressId: addressId,
          paymentMode: "online",
          couponCode: appliedCoupon?.code || null,
          visitTimings: bookingData.visitTimings || [],
          amount: orderSummary.totalAmount,
        };

        console.log("📤 Buy Now Payload:", buyNowPayload);
        console.log("💰 Order Summary:", orderSummary);

        console.log("📤 Buy Now Payload:", buyNowPayload);
        console.log("💰 Order Summary:", orderSummary);

        response = await buyNowApi(buyNowPayload);
        console.log("✅ Backend Response:", response);
      }
      // CART BOOKING
      else {
        const cartPayload = {
          paymentMode: "online",
          addressId: addressId,
          selectedItems: bookingData.selectedCartIds || [],
        };

        console.log("📤 Cart Booking Payload:", cartPayload);
        response = await cartBookingApi(cartPayload);
      }

      console.log("✅ Razorpay Order Response:", response.data);
      console.log("🔍 STEP 1: Backend response received successfully");

      if (!response.data.success) {
        console.error("❌ Backend returned success: false");
        toast.error(response.data.message || "Failed to create order");
        setProcessing(false);
        return;
      }

      console.log("🔍 STEP 2: Backend success validated");

      const { razorpay_order_id, amount, razorpay_key_id } = response.data;

      console.log("🔍 STEP 3: Extracted Razorpay details:", {
        razorpay_order_id,
        amount,
        razorpay_key_id: razorpay_key_id ? "Present" : "Missing"
      });

      if (!razorpay_order_id || !amount) {
        console.error("❌ Missing order details:", {
          razorpay_order_id: razorpay_order_id ? "Present" : "Missing",
          amount: amount ? "Present" : "Missing"
        });
        toast.error("Invalid response from server. Missing order details.");
        console.error("❌ Full response:", response.data);
        setProcessing(false);
        return;
      }

      console.log("🔍 STEP 4: All required fields validated, proceeding to Razorpay checkout...");

      console.log("🎫 Creating Razorpay checkout with:", {
        order_id: razorpay_order_id,
        amount: amount,
        amount_in_paise: amount * 100
      });

      console.log("🔍 STEP 5: Checking if Razorpay script is loaded...");

      // Check if Razorpay is available
      if (!window.Razorpay) {
        console.error("❌ Razorpay not loaded! window.Razorpay is undefined");
        toast.error("Payment gateway not loaded. Please refresh the page and try again.");
        setProcessing(false);
        return;
      }

      console.log("✅ Razorpay script loaded successfully");
      console.log("🔍 STEP 6: Creating Razorpay options...");

      // Razorpay Options
      const options = {
        key: razorpay_key_id || process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: amount * 100, // Amount in paise
        currency: "INR",
        name: "SehatMitra",
        description: isDirectBooking ? "Direct Booking Payment" : "Cart Booking Payment",
        order_id: razorpay_order_id,
        handler: async function (razorpayResponse) {
          console.log("💳 Razorpay Payment Success:", razorpayResponse);
          await verifyPayment(razorpayResponse, razorpay_order_id, amount);
        },
        prefill: {
          name: selectedAddress?.fullname || "",
          email: selectedAddress?.emailAddress || "",
          contact: selectedAddress?.mobilenumber || "",
        },
        theme: {
          color: "#A2CD48",
        },
        modal: {
          ondismiss: function () {
            console.log("⚠️ User dismissed Razorpay modal");
            toast.info("Payment cancelled");
            setProcessing(false);
          },
        },
      };

      console.log("🔧 Razorpay options configured:", {
        key: options.key ? "✅ Present" : "❌ Missing",
        amount: options.amount,
        order_id: options.order_id,
        currency: options.currency
      });

      console.log("🔍 STEP 7: Creating Razorpay instance and opening modal...");

      try {
        const razorpay = new window.Razorpay(options);
        console.log("✅ Razorpay instance created successfully");
        console.log("🔍 STEP 8: Opening Razorpay modal...");
        razorpay.open();
        console.log("✅ Razorpay modal opened successfully");
        console.log("🔍 STEP 9: Waiting for user to complete payment...");
        console.log("⏳ After payment, verifyPayment will be called automatically");
      } catch (razorpayError) {
        console.error("❌ Error creating/opening Razorpay modal:", razorpayError);
        toast.error("Failed to open payment gateway. Please try again.");
        setProcessing(false);
        return;
      }
    } catch (error) {
      handleBookingError(error);
      setProcessing(false);
    }
  };

  // Verify Payment with Backend
  const verifyPayment = async (razorpayResponse, orderId, amount) => {
    try {
      setProcessing(true);

      const verifyPayload = {
        razorpay_order_id: orderId,
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_signature: razorpayResponse.razorpay_signature,
        addressId: addressId,
      };

      // Add booking-specific data
      if (isDirectBooking) {
        verifyPayload.productId = bookingData.productId;
        verifyPayload.productType = bookingData.productType;
        verifyPayload.rentalDuration = bookingData.rentalDuration;
        verifyPayload.rentalValue = bookingData.rentalValue;
        verifyPayload.quantity = bookingData.quantity;
        verifyPayload.startDate = bookingData.startDate;
        verifyPayload.couponCode = appliedCoupon?.code || null;
        verifyPayload.visitTimings = bookingData.visitTimings || [];
        verifyPayload.amount = amount;
      } else {
        verifyPayload.selectedItems = bookingData.selectedCartIds || [];
        verifyPayload.amount = amount; // Add amount for cart bookings
      }

      console.log("📤 Verify Payment Payload:", verifyPayload);

      const response = await verifyPaymentApi(verifyPayload);

      console.log("✅ Payment Verified:", response.data);

      if (response.data.success) {
        toast.success("Payment successful! Booking confirmed.");
        navigate("/thankyou", {
          state: {
            booking: response.data.booking,
            paymentMode: "online",
          },
        });
      } else {
        console.error("❌ Backend returned success: false");
        console.error("❌ Backend message:", response.data.message);
        console.error("❌ Full backend response:", response.data);
        toast.error(response.data.message || "Payment verification failed");
        setProcessing(false);
      }
    } catch (error) {
      console.error("❌ Payment Verification Error:", error);
      console.error("❌ Error Response Data:", error.response?.data);
      console.error("❌ Error Response Status:", error.response?.status);
      console.error("❌ Error Message:", error.message);

      // Log the full error object for debugging
      if (error.response?.data) {
        console.error("❌ Backend Error Details:", {
          message: error.response.data.message,
          error: error.response.data.error,
          statuscode: error.response.data.statuscode,
          fullResponse: error.response.data
        });
      }

      const errorMessage = error.response?.data?.message
        || error.response?.data?.error
        || error.message
        || "Payment verification failed";

      toast.error(errorMessage);
      setProcessing(false);
    }
  };

  // Handle COD Payment
  const handleCODPayment = async () => {
    try {
      setProcessing(true);

      let response;

      // DIRECT BOOKING (Buy Now)
      if (isDirectBooking) {
        const buyNowPayload = {
          productId: bookingData.productId,
          productType: bookingData.productType,
          rentalDuration: bookingData.rentalDuration,
          rentalValue: bookingData.rentalValue,
          quantity: bookingData.quantity,
          startDate: bookingData.startDate,
          addressId: addressId,
          paymentMode: "COD",
          couponCode: appliedCoupon?.code || null,
          visitTimings: bookingData.visitTimings || [],
          amount: orderSummary.totalAmount,
        };

        console.log("📤 COD Buy Now Payload:", buyNowPayload);
        response = await buyNowApi(buyNowPayload);
      }
      // CART BOOKING
      else {
        const cartPayload = {
          paymentMode: "COD",
          addressId: addressId,
          selectedItems: bookingData.selectedCartIds || [],
        };

        console.log("📤 COD Cart Booking Payload:", cartPayload);
        response = await cartBookingApi(cartPayload);
      }

      console.log("✅ COD Booking Response:", response.data);

      if (response.data.success) {
        toast.success("Booking confirmed! Pay on delivery.");
        navigate("/thankyou", {
          state: {
            booking: response.data.booking,
            paymentMode: "COD",
          },
        });
      }
    } catch (error) {
      handleBookingError(error);
    } finally {
      setProcessing(false);
    }
  };

  // Handle Payment Button Click
  const handleProceedToPay = () => {
    if (paymentMode === "online") {
      handleOnlinePayment();
    } else {
      handleCODPayment();
    }
  };

  if (!bookingData || !orderSummary) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Loading payment details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-5 md:px-8 xl:px-[120px]">
      <Stepper currentStep="payment" />
      <div className="grid grid-cols-12 gap-6 pb-[60px] md:pb-[80px] xl:pb-[120px]">
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
          <div
            className="p-4 md:p-[32px] rounded-[24px]"
            style={{
              boxShadow: "0px 0px 4px 0px #00000040",
            }}
          >
            {/* Online Payment Option */}
            <div className="flex gap-3 items-center mb-2">
              <input
                type="radio"
                name="paymentMode"
                value="online"
                checked={paymentMode === "online"}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-[16px] h-[16px] accent-[#34658C] cursor-pointer"
              />
              <p className="text-[16px] tracking-[0.32px] md:text-[20px] md:tracking-[0.4px] font-bold font-outfit">
                Online Payment
              </p>
            </div>
            <div className="flex flex-col gap-2 mb-[22px]">
              <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
                UPI / Net Banking / Debit / Credit Card
              </p>
              <div className="flex gap-2">
                <IoCheckmarkSharp className="w-[24px] h-[24px] text-[#109C19]" />
                <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
                  Instant Confirmation
                </p>
              </div>
              <div className="flex gap-2">
                <IoCheckmarkSharp className="w-[24px] h-[24px] text-[#109C19]" />
                <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
                  Secure & Fast
                </p>
              </div>
            </div>

            {/* COD Option */}
            <div className="flex gap-3 items-center mb-2">
              <input
                type="radio"
                name="paymentMode"
                value="COD"
                checked={paymentMode === "COD"}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-[16px] h-[16px] cursor-pointer"
              />
              <p className="text-[16px] tracking-[0.32px] md:text-[20px] md:tracking-[0.4px] font-bold font-outfit">
                Cash on Delivery
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
                Pay at time of service / product delivery
              </p>
            </div>
          </div>

          {/* Payment Icons */}
          <div className="flex gap-6 md:gap-8">
            <img
              src="/assets/paymentImages/Gpay.png"
              alt="gpay"
              className="h-[22px]"
            />
            <img
              src="/assets/paymentImages/paytm.png"
              alt="paytm"
              className="h-[22px]"
            />
            <img
              src="/assets/paymentImages/phonepay.png"
              alt="ppay"
              className="h-[22px]"
            />
            <img
              src="/assets/paymentImages/amazonpay.png"
              alt="amazonpay"
              className="h-[22px]"
            />
          </div>

          {/* Payment Button */}
          <button
            onClick={handleProceedToPay}
            disabled={processing}
            className="font-outfit bg-[#A2CD48] px-6 py-3 rounded-[8px] text-[16px] tracking-[0.32px] md:text-[20px] md:tracking-[0.4px] font-bold w-fit text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#8fb83d] transition-colors"
          >
            {processing
              ? "Processing..."
              : paymentMode === "online"
                ? `Pay ₹${orderSummary.totalAmount.toFixed(2)}`
                : "Place Order (COD)"}
          </button>
        </div>

        {/* Delivery Address & Order Summary */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
          {/* Delivery Address */}
          {selectedAddress && (
            <div className="bg-[#EBF0F4] p-[24px] rounded-[12px] flex flex-col gap-1">
              <h1 className="text-[20px] leading-[30px] tracking-[0.4px] md:text-[24px] md:leading-[32px] md:tracking-[0.96px] font-bold">
                Delivering To
              </h1>
              <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
                {selectedAddress.fullname}
                <br />
                {selectedAddress.streetAddress}, {selectedAddress.city},{" "}
                {selectedAddress.state}, {selectedAddress.pincode},{" "}
                {selectedAddress.country}
              </p>
              <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
                Contact: {selectedAddress.mobilenumber}
              </p>
              {selectedAddress.emailAddress && (
                <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
                  Email: {selectedAddress.emailAddress}
                </p>
              )}
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-[#EBF0F4] p-[24px] rounded-[12px] flex flex-col gap-3">
            <h1 className="text-[20px] leading-[30px] tracking-[0.4px] md:text-[24px] md:leading-[32px] md:tracking-[0.96px] font-bold">
              Order Summary
            </h1>

            {isDirectBooking ? (
              <div className="flex flex-col gap-2 text-[14px] md:text-[16px]">
                <p className="font-semibold">{orderSummary.productName}</p>
                <div className="flex justify-between">
                  <span>Base Amount:</span>
                  <span>₹{orderSummary.baseAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({orderSummary.taxPercentage}%):</span>
                  <span>₹{orderSummary.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>₹{orderSummary.shippingCost.toFixed(2)}</span>
                </div>
                {orderSummary.securityDeposit > 0 && (
                  <div className="flex justify-between">
                    <span>Security Deposit:</span>
                    <span>₹{orderSummary.securityDeposit.toFixed(2)}</span>
                  </div>
                )}
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon.code}):</span>
                    <span>-₹{appliedCoupon.discount.toFixed(2)}</span>
                  </div>
                )}
                <hr className="my-2" />
                <div className="flex justify-between font-bold text-[16px] md:text-[20px] text-[#34658C]">
                  <span>Total:</span>
                  <span>₹{orderSummary.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 text-[14px] md:text-[16px]">
                <p className="font-semibold">Cart Items ({orderSummary.itemCount || 0})</p>
                <div className="flex justify-between">
                  <span>Base Amount:</span>
                  <span>₹{(orderSummary.baseAmount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>₹{(orderSummary.taxAmount || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>₹{(orderSummary.shippingCost || 0).toFixed(2)}</span>
                </div>
                {(orderSummary.securityDeposit || 0) > 0 && (
                  <div className="flex justify-between">
                    <span>Security Deposit:</span>
                    <span>₹{(orderSummary.securityDeposit || 0).toFixed(2)}</span>
                  </div>
                )}
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon.code}):</span>
                    <span>-₹{appliedCoupon.discount.toFixed(2)}</span>
                  </div>
                )}
                <hr className="my-2" />
                <div className="flex justify-between font-bold text-[16px] md:text-[20px] text-[#34658C]">
                  <span>Total:</span>
                  <span>₹{(orderSummary.totalAmount || 0).toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
