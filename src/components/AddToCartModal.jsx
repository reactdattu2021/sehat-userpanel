import React, { useState, useEffect } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { addToCartApi, getEquipmentByIdApi, getNurseByIdApi } from "../apis/authapis";

const AddToCartModal = ({ isOpen, onClose, itemData, itemType }) => {
  // UI state
  const [quantity, setQuantity] = useState(1);
  const [rentalType, setRentalType] = useState(
    itemType === "equipment" ? "perDay" : "perHour",
  );
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("09:00");
  const [visitTime, setVisitTime] = useState("morning");
  const [loading, setLoading] = useState(false);
  const [fullItemData, setFullItemData] = useState(null);
  const [fetchingDetails, setFetchingDetails] = useState(false);

  // Reset form when modal opens with new item
  useEffect(() => {
    if (isOpen && itemData) {
      setQuantity(itemType === "equipment" ? 1 : 1);
      setRentalType(itemType === "equipment" ? "perDay" : "perHour");
      setSelectedDate("");
      setSelectedTime("09:00");
      setEndDate("");
      setEndTime("09:00");
      setVisitTime("morning");
      setFullItemData(null);
    }
  }, [isOpen, itemData, itemType]);

  // Fetch full item details if pricings are missing (global search results)
  useEffect(() => {
    const fetchFullDetails = async () => {
      if (isOpen && itemData && !itemData.pricings) {
        // console.log('⚠️ Pricings missing, fetching full details for:', itemData._id);
        setFetchingDetails(true);
        try {
          let response;
          if (itemType === "equipment") {
            response = await getEquipmentByIdApi(itemData._id);
          } else {
            response = await getNurseByIdApi(itemData._id);
          }

          if (response.data.success) {
            if (itemType === "equipment") {
              setFullItemData(response.data.data);
              // console.log('✅ Fetched equipment details with pricings:', response.data.data.pricings);
            } else {
              // For services, combine service and pricings
              const serviceData = {
                ...response.data.data.service,
                pricings: response.data.data.pricings
              };
              setFullItemData(serviceData);
              // console.log('✅ Fetched service details with pricings:', response.data.data.pricings);
            }
          }
        } catch (error) {
          console.error('❌ Error fetching full details:', error);
          toast.error('Failed to load pricing information');
        } finally {
          setFetchingDetails(false);
        }
      } else if (isOpen && itemData && itemData.pricings) {
        // Item already has pricings, use it directly
        setFullItemData(itemData);
      }
    };

    fetchFullDetails();
  }, [isOpen, itemData, itemType]);

  if (!isOpen || !itemData) return null;

  // Use fullItemData if available, otherwise use itemData
  const displayData = fullItemData || itemData;

  const calculateRentalValue = () => {
    if (!selectedDate || !selectedTime || !endDate || !endTime) return 1;

    const fromDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const toDateTime = new Date(`${endDate}T${endTime}`);

    if (toDateTime <= fromDateTime) return 1;

    const diffMs = toDateTime - fromDateTime;

    if (rentalType === "perHour") {
      return Math.ceil(diffMs / (1000 * 60 * 60));
    } else if (rentalType === "perDay") {
      return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    } else if (rentalType === "perWeek") {
      return Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 7));
    } else if (rentalType === "perMonth") {
      return Math.ceil(diffMs / (1000 * 60 * 60 * 24 * 30));
    }
    return 1;
  };

  const handleDecrease = (type) => {
    if (type === "quantity" && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = (type) => {
    if (type === "quantity") {
      setQuantity(quantity + 1);
    }
  };

  const calculateTotalAmount = () => {
    if (!displayData || !displayData.pricings) return 0;
    const rentalValue = calculateRentalValue();

    const baseAmount = (displayData.pricings[rentalType] || 0) * quantity * rentalValue;

    const taxAmount = (baseAmount * (displayData.pricings.taxPercentage || 0)) / 100;

    const safeShipping = itemType === "services" ? 0 : (displayData.pricings.shippingCost || 0);
    const shippingCost = safeShipping * quantity;

    const securityDeposit = (displayData.pricings.securityDeposit || 0) * quantity;

    const totalAmount = baseAmount + taxAmount + shippingCost + securityDeposit;

    return totalAmount;
  };

  const handleAddToCart = async () => {
    // Validation
    if (!selectedDate) {
      toast.error("Please select a start date");
      return;
    }

    // console.log("Selected Date:", selectedDate);

    if (!selectedTime) {
      toast.error("Please select a start time");
      return;
    }
    // console.log("Selected Time:", selectedTime);

    if (!endDate) {
      toast.error("Please select an end date");
      return;
    }

    if (!endTime) {
      toast.error("Please select an end time");
      return;
    }

    if (!rentalType) {
      toast.error(
        `Please select ${itemType === "equipment" ? "rental" : "service"} duration`,
      );
      return;
    }

    if (itemType === "equipment" && quantity <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    // Check if pricing is available for selected rental type
    if (!displayData.pricings[rentalType]) {
      toast.error(`${rentalType} pricing not available for this ${itemType}`);
      return;
    }

    // Check if visit time is required and selected for services
    if (
      itemType === "service" &&
      displayData.availableVisitTimings &&
      !visitTime
    ) {
      toast.error("Please select visit time");
      return;
    }

    // Prepare start and end dates
    const startDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    if (endDateTime <= startDateTime) {
      toast.error("End date/time must be after start date/time");
      return;
    }

    const now = new Date();
    if (startDateTime < now) {
      toast.error("Please select a future date and time");
      return;
    }

    const diffMs = endDateTime - startDateTime;
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (rentalType === "perWeek") {
      if (diffDays % 7 !== 0 || diffDays > 28) {
        toast.error("This is not valid dates you choosed for week");
        return;
      }
    } else if (rentalType === "perMonth") {
      if (diffDays % 30 !== 0) {
        toast.error("This is not valid dates you choosed for month");
        return;
      }
    }

    const rentalValue = calculateRentalValue();

    if (!displayData.pricings[rentalType]) {
      toast.error(`${rentalType === 'perDay' ? 'Daily' : rentalType === 'perWeek' ? 'Weekly' : 'Monthly'} pricing not available for this ${itemType}`);
      return;
    }

    const cartPayload = {
      rentalDuration: rentalType,
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
      rentalValue: rentalValue,
      cartquantity: quantity,
    };
    // console.log("Cart Payload before item ID:", cartPayload);

    // Add equipment or service specific fields
    if (itemType === "equipment") {
      cartPayload.equipmentId = itemData._id;
    } else {
      cartPayload.servicesId = itemData._id; // Backend expects 'servicesId' not 'serviceId'
      // Add visit timings for services
      if (visitTime) {
        cartPayload.visitTimings = [visitTime];
      }
    }

    try {
      setLoading(true);

      // Call the Add to Cart API
      const response = await addToCartApi(cartPayload);

      if (response.data.success) {
        toast.success(
          response.data.message ||
          `${itemType === "equipment" ? "Equipment" : "Service"} added to cart!`,
        );
        onClose();
      } else {
        toast.error(response.data.message || "Failed to add item to cart");
      }
    } catch (error) {
      console.error("Add to cart error:", error);

      // Handle specific error messages from backend
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 401) {
        toast.error("Please login to add items to cart");
      } else {
        toast.error("Failed to add item to cart. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-3">
      <div className="bg-white rounded-[13px] w-full max-w-[730px] max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
          <h2 className="text-[19px] font-semibold text-[#34658C]">
            Add to Cart
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Logical flow */}
        <div className="p-4 overflow-y-auto">
          {/* Show loading state while fetching pricing details */}
          {fetchingDetails && (
            <div className="flex justify-center items-center py-10">
              <div className="text-[#34658C] font-semibold">Loading pricing details...</div>
            </div>
          )}

          {/* Show content only when not fetching or when displayData is available */}
          {!fetchingDetails && displayData && (
            <>
              {/* 1. Item Information */}
              <div className="flex gap-3 mb-3.5 pb-3.5 border-b border-gray-200">
                <img
                  src={displayData.profileImage}
                  alt={
                    itemType === "equipment"
                      ? displayData.equipmentName
                      : displayData.fullName
                  }
                  className="w-[66px] h-[66px] rounded-[9px] object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-[16px] font-semibold text-[#34658C] mb-1">
                    {itemType === "equipment"
                      ? displayData.equipmentName
                      : displayData.fullName}
                  </h3>
                  <p className="text-[13px] text-gray-600">
                    {displayData.subCategory}
                  </p>
                  {itemType === "service" && (
                    <p className="text-[12px] text-gray-500">
                      {displayData.experience} years experience
                    </p>
                  )}
                </div>
              </div>

              {/* 2. Duration Selection (First Decision) */}
              <div className="mb-3.5">
                <h4 className="text-[14px] font-semibold mb-2 text-[#34658C]">
                  Select Duration
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {itemType === "service" && displayData.pricings?.perHour && (
                    <label className="accent-[#93BB42] flex items-center gap-2 text-[13px] font-medium cursor-pointer">
                      <input
                        type="radio"
                        name="rentalType"
                        value="perHour"
                        checked={rentalType === "perHour"}
                        onChange={(e) => setRentalType(e.target.value)}
                        className="w-3.5 h-3.5"
                      />
                      Hourly
                    </label>
                  )}
                  {displayData.pricings?.perDay && (
                    <label className="accent-[#93BB42] flex items-center gap-2 text-[13px] font-medium cursor-pointer">
                      <input
                        type="radio"
                        name="rentalType"
                        value="perDay"
                        checked={rentalType === "perDay"}
                        onChange={(e) => setRentalType(e.target.value)}
                        className="w-3.5 h-3.5"
                      />
                      Daily
                    </label>
                  )}
                  {displayData.pricings?.perWeek && (
                    <label className="accent-[#93BB42] flex items-center gap-2 text-[13px] font-medium cursor-pointer">
                      <input
                        type="radio"
                        name="rentalType"
                        value="perWeek"
                        checked={rentalType === "perWeek"}
                        onChange={(e) => setRentalType(e.target.value)}
                        className="w-3.5 h-3.5"
                      />
                      Weekly
                    </label>
                  )}
                  {displayData.pricings?.perMonth && (
                    <label className="accent-[#93BB42] flex items-center gap-2 text-[13px] font-medium cursor-pointer">
                      <input
                        type="radio"
                        name="rentalType"
                        value="perMonth"
                        checked={rentalType === "perMonth"}
                        onChange={(e) => setRentalType(e.target.value)}
                        className="w-3.5 h-3.5"
                      />
                      Monthly
                    </label>
                  )}
                </div>
                <p className="text-[14px] font-semibold text-[#34658C] mt-2">
                  Rate: ₹{displayData.pricings?.[rentalType] || 0}/
                  {rentalType === "perHour"
                    ? "Hour"
                    : rentalType === "perDay"
                      ? "Day"
                      : rentalType === "perWeek"
                        ? "Week"
                        : "Month"}
                </p>
              </div>

              {/* 3. Date & Time Selection */}
              <div className="grid grid-cols-2 gap-3.5 mb-3.5">
                <div>
                  <label className="text-[13px] font-semibold block mb-1.5 text-[#34658C]">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="border border-[#3D3D3D] px-2.5 py-2 rounded-[8px] text-[13px] w-full"
                  />
                </div>
                <div>
                  <label className="text-[13px] font-semibold block mb-1.5 text-[#34658C]">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="border border-[#3D3D3D] px-2.5 py-2 rounded-[8px] text-[13px] w-full"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3.5 mb-3.5">
                <div>
                  <label className="text-[13px] font-semibold block mb-1.5 text-[#34658C]">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={selectedDate || new Date().toISOString().split("T")[0]}
                    className="border border-[#3D3D3D] px-2.5 py-2 rounded-[8px] text-[13px] w-full"
                  />
                </div>
                <div>
                  <label className="text-[13px] font-semibold block mb-1.5 text-[#34658C]">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="border border-[#3D3D3D] px-2.5 py-2 rounded-[8px] text-[13px] w-full"
                  />
                </div>
              </div>

              {/* 4. Quantity Selection */}
              {itemType === "equipment" && (
                <div className="mb-3.5">
                  <div className="flex justify-between items-center bg-gray-50 px-3 py-2 rounded-[8px]">
                    <span className="text-[13px] font-semibold text-[#34658C]">
                      Quantity
                    </span>
                    <div className="flex gap-2 items-center">
                      <button
                        className="w-[28px] h-[28px] bg-[#A2CD48] rounded-full flex justify-center items-center hover:bg-[#8fb83d] transition-colors"
                        onClick={() => handleDecrease("quantity")}
                      >
                        <FaMinus className="text-[12px] text-[#333333]" />
                      </button>
                      <span className="text-[16px] font-semibold w-9 text-center">
                        {quantity}
                      </span>
                      <button
                        className="w-[28px] h-[28px] bg-[#A2CD48] rounded-full flex justify-center items-center hover:bg-[#8fb83d] transition-colors"
                        onClick={() => handleIncrease("quantity")}
                      >
                        <FaPlus className="text-[12px] text-[#333333]" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. Visit Time (Services only) */}
              {/* {itemType === "service" && displayData.availableVisitTimings && (
                <div className="mb-3.5">
                  <h4 className="text-[14px] font-semibold mb-2 text-[#34658C]">
                    Preferred Visit Time
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {displayData.availableVisitTimings.morning && (
                      <label className="accent-[#93BB42] flex items-center gap-2 text-[13px] font-medium cursor-pointer">
                        <input
                          type="radio"
                          name="visitTime"
                          value="morning"
                          checked={visitTime === "morning"}
                          onChange={(e) => setVisitTime(e.target.value)}
                          className="w-3.5 h-3.5"
                        />
                        Morning
                      </label>
                    )}
                    {displayData.availableVisitTimings.afternoon && (
                      <label className="accent-[#93BB42] flex items-center gap-2 text-[13px] font-medium cursor-pointer">
                        <input
                          type="radio"
                          name="visitTime"
                          value="afternoon"
                          checked={visitTime === "afternoon"}
                          onChange={(e) => setVisitTime(e.target.value)}
                          className="w-3.5 h-3.5"
                        />
                        Afternoon
                      </label>
                    )}
                    {displayData.availableVisitTimings.evening && (
                      <label className="accent-[#93BB42] flex items-center gap-2 text-[13px] font-medium cursor-pointer">
                        <input
                          type="radio"
                          name="visitTime"
                          value="evening"
                          checked={visitTime === "evening"}
                          onChange={(e) => setVisitTime(e.target.value)}
                          className="w-3.5 h-3.5"
                        />
                        Evening
                      </label>
                    )}
                    {displayData.availableVisitTimings.night && (
                      <label className="accent-[#93BB42] flex items-center gap-2 text-[13px] font-medium cursor-pointer">
                        <input
                          type="radio"
                          name="visitTime"
                          value="night"
                          checked={visitTime === "night"}
                          onChange={(e) => setVisitTime(e.target.value)}
                          className="w-3.5 h-3.5"
                        />
                        Night
                      </label>
                    )}
                  </div>
                </div>
              )} */}

              {/* 6. Total Amount Summary */}
              <div className="bg-gradient-to-br from-[#34658C] to-[#2a5270] p-3.5 rounded-[9px] text-white mb-3.5">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-[13px] font-medium">Total Amount</p>
                  <p className="text-[23px] font-bold">
                    ₹{calculateTotalAmount().toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col gap-1 text-[11px] opacity-90">
                  {displayData.pricings?.taxPercentage > 0 && (
                    <div className="flex justify-between">
                      <span>Tax ({displayData.pricings.taxPercentage}%):</span>
                      <span>+ ₹{(((displayData.pricings[rentalType] || 0) * quantity * calculateRentalValue() * (displayData.pricings.taxPercentage || 0)) / 100).toLocaleString()}</span>
                    </div>
                  )}
                  {displayData.pricings?.securityDeposit > 0 && (
                    <div className="flex justify-between">
                      <span>Security Deposit (Refundable):</span>
                      <span>+ ₹{((displayData.pricings.securityDeposit || 0) * quantity).toLocaleString()}</span>
                    </div>
                  )}
                  {itemType === "equipment" &&
                    displayData.pricings?.shippingCost > 0 && (
                      <div className="flex justify-between">
                        <span>Shipping Cost:</span>
                        <span>+ ₹{((displayData.pricings.shippingCost || 0) * quantity).toLocaleString()}</span>
                      </div>
                    )}
                </div>
              </div>

              {/* 7. Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-[9px] text-[14px] font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={loading}
                  className="flex-1 bg-[#34658C] text-white py-2 rounded-[9px] text-[14px] font-semibold hover:bg-[#2a5270] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Adding..." : "Add to Cart"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;
