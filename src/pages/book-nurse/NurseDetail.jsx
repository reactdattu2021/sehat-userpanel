import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { FaUser } from "react-icons/fa6";
import { IoMdFemale, IoMdMale } from "react-icons/io";
import { toast } from "react-toastify";
import { getNurseByIdApi } from "../../apis/authapis";

const NurseDetail = () => {
  const { nurseId } = useParams();
  const navigate = useNavigate();

  // Nurse data state
  const [nurse, setNurse] = useState(null);
  const [loading, setLoading] = useState(true);

  // UI state
  const [selectedImg, setSelectedImg] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [days, setDays] = useState(1);
  const [rentalType, setRentalType] = useState("perHour");
  const [selectedDate, setSelectedDate] = useState("");
  const [visitTime, setVisitTime] = useState("morning");

  // Fetch nurse details
  useEffect(() => {
    const fetchNurseDetails = async () => {
      try {
        setLoading(true);
        console.log("Fetching nurse with ID:", nurseId);
        const response = await getNurseByIdApi(nurseId);
        console.log("API Response:", response.data);

        if (response.data.success) {
          // API returns data.service and data.pricings separately
          const serviceData = response.data.data.service;
          const pricingsData = response.data.data.pricings;

          // Combine service and pricings data
          const nurseData = {
            ...serviceData,
            pricings: pricingsData,
          };

          setNurse(nurseData);
          setSelectedImg(
            serviceData.profileImage ||
            "/assets/BookANurseImages/doctor img (10).png"
          );
        }
      } catch (error) {
        console.error("Error fetching nurse details:", error);
        navigate("/book-nurse");
      } finally {
        setLoading(false);
      }
    };

    if (nurseId) {
      fetchNurseDetails();
    }
  }, [nurseId, navigate]);

  const handleDecrease = (type) => {
    if (type === "quantity" && quantity > 1) {
      setQuantity(quantity - 1);
    } else if (type === "days" && days > 1) {
      setDays(days - 1);
    }
  };

  const handleIncrease = (type) => {
    if (type === "quantity") {
      setQuantity(quantity + 1);
    } else if (type === "days") {
      setDays(days + 1);
    }
  };

  const calculateTotalAmount = () => {
    if (!nurse || !nurse.pricings) return 0;
    const basePrice = nurse.pricings[rentalType] || 0;
    return basePrice * quantity * days;
  };

  const handleBookNow = () => {
    // Validation
    if (!nurse) {
      toast.error('Nurse data not loaded');
      return;
    }

    if (!selectedDate) {
      toast.error('Please select a start date');
      return;
    }

    if (!rentalType) {
      toast.error('Please select service duration');
      return;
    }

    if (days <= 0) {
      toast.error('Please select valid number of days');
      return;
    }

    // Check if visit time is required and selected
    if (nurse.availableVisitTimings && !visitTime) {
      toast.error('Please select visit time');
      return;
    }

    // Check if pricing is available for selected rental type
    if (!nurse.pricings[rentalType]) {
      toast.error(`${rentalType} pricing not available for this service`);
      return;
    }

    // Navigate to checkout with booking data
    // Create a date object that combines the selected date with current time
    const selectedDateTime = new Date(selectedDate);
    const now = new Date();

    // Set the time to current time + 5 minutes buffer to avoid "past date" errors
    // This accounts for time spent in checkout/payment process
    selectedDateTime.setHours(now.getHours(), now.getMinutes() + 5, now.getSeconds(), now.getMilliseconds());

    navigate('/checkout', {
      state: {
        isDirectBooking: true,
        bookingData: {
          productId: nurse._id,
          productType: 'services',
          productName: nurse.fullName,
          productImage: nurse.profileImage,
          rentalDuration: rentalType,
          rentalValue: days,
          quantity: 1, // Services typically don't have quantity
          startDate: selectedDateTime.toISOString(),
          visitTimings: visitTime ? [visitTime] : [],
          pricing: {
            unitPrice: nurse.pricings[rentalType],
            shippingCost: 0, // Services don't have shipping
            taxPercentage: 0,
            securityDeposit: nurse.pricings.securityDeposit || 0
          }
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl font-semibold text-[#34658C]">
          Loading nurse details...
        </div>
      </div>
    );
  }

  if (!nurse) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl font-semibold text-gray-500">
          Nurse not found
        </div>
      </div>
    );
  }

  // Prepare images array
  const allImages =
    nurse.certificates && nurse.certificates.length > 0
      ? [
        nurse.profileImage,
        ...nurse.certificates.map((cert) => cert.url),
      ].filter(Boolean)
      : [nurse.profileImage].filter(Boolean);

  return (
    <>
      <div className="max-w-[1440px] mx-auto  px-5 md:px-[32px]  xl:px-[120px] pt-[40px] md:pt-[60px] pb-[60px] md:pb-[80px] xl:pb-[120px]">
        <div className="grid grid-cols-12 lg:grid-cols-12 gap-6 md:gap-[40px] xl:gap-[60px] pb-[60px] md:pb-[80px] xl:pb-[120px] ">
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-[100px] self-start">
            <img
              src={selectedImg}
              alt={nurse.fullName}
              className="w-[300px] h-[300px] md:w-[386px] md:h-[386px] border-[1px] border-[#000000] rounded-[12px]"
            />

            <div className="flex gap-4 flex-wrap">
              {allImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`${nurse.fullName} certificate ${index}`}
                  className={`w-[87px] h-[87px] object-cover rounded-[12px] cursor-pointer border ${selectedImg === img
                    ? "border-[#000000]"
                    : "border-transparent"
                    }`}
                  style={{ boxShadow: "0px 0px 4px 0px #00000040" }}
                  onClick={() => setSelectedImg(img)}
                />
              ))}
            </div>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <div className="flex flex-col gap-2 md:gap-4 xl:gap-6">
              <div className="flex flex-col gap-3">
                <h1 className="text-[24px] tracking-[0.48px] md:text-[36px] md:tracking-[0.72px] font-bold text-[#34658C]">
                  {nurse.fullName}
                </h1>
                <div className="flex flex-col gap-2">
                  <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px] font-semibold">
                    {nurse.subCategory}
                  </p>
                  <div className="flex items-center gap-1">
                    <FaUser className="w-[12px] h-[12px] md:w-[16px] md:h-[16px]" />
                    <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px] font-semibold">
                      {nurse.age} Years old
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {nurse.gender === "female" ? (
                      <IoMdFemale className="w-[14px] h-[14px] md:w-[16px] md:h-[16px]" />
                    ) : (
                      <IoMdMale className="w-[14px] h-[14px] md:w-[16px] md:h-[16px]" />
                    )}
                    <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px] font-semibold capitalize">
                      {nurse.gender}
                    </p>
                  </div>
                  <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px] font-semibold">
                    Experience: {nurse.experience} years
                  </p>
                </div>
              </div>
              <div>
                <h1 className="text-[16px] tracking-[0.32px] md:text-[20px] md:tracking-[0.4px] font-semibold mb-3 ">
                  Select Duration
                </h1>
                <div className=" flex flex-col md:flex-row gap-3 mb-2">
                  {nurse.pricings?.perHour && (
                    <label className="accent-[#93BB42] flex items-center gap-2 text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px] font-semibold">
                      <input
                        type="radio"
                        name="rentalType"
                        value="perHour"
                        checked={rentalType === "perHour"}
                        onChange={(e) => setRentalType(e.target.value)}
                      />
                      Hour
                    </label>
                  )}
                  {nurse.pricings?.perDay && (
                    <label className="accent-[#93BB42] flex items-center gap-2 text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px] font-semibold">
                      <input
                        type="radio"
                        name="rentalType"
                        value="perDay"
                        checked={rentalType === "perDay"}
                        onChange={(e) => setRentalType(e.target.value)}
                      />
                      Day
                    </label>
                  )}
                  {nurse.pricings?.perWeek && (
                    <label className="accent-[#93BB42] flex items-center gap-2 text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px] font-semibold">
                      <input
                        type="radio"
                        name="rentalType"
                        value="perWeek"
                        checked={rentalType === "perWeek"}
                        onChange={(e) => setRentalType(e.target.value)}
                      />
                      Week
                    </label>
                  )}
                  {nurse.pricings?.perMonth && (
                    <label className="accent-[#93BB42] flex items-center gap-2 text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px] font-semibold">
                      <input
                        type="radio"
                        name="rentalType"
                        value="perMonth"
                        checked={rentalType === "perMonth"}
                        onChange={(e) => setRentalType(e.target.value)}
                      />
                      Month
                    </label>
                  )}
                </div>
                <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px] font-semibold">
                  {rentalType === "perHour" && "Hourly: "}
                  {rentalType === "perDay" && "Daily: "}
                  {rentalType === "perWeek" && "Weekly: "}
                  {rentalType === "perMonth" && "Monthly: "}
                  <span className="text-[16px] leading-[32px] tracking-[0.64px] md:text-[20px] md:leading-[32px] md:tracking-[0.8px] text-[#34658C] font-bold">
                    ₹{nurse.pricings?.[rentalType] || 0}/
                    {rentalType === "perHour"
                      ? "Hour"
                      : rentalType === "perDay"
                        ? "Day"
                        : rentalType === "perWeek"
                          ? "Week"
                          : "Month"}
                  </span>
                </p>
              </div>

              {/* Visit Time Selection */}
              {nurse.availableVisitTimings && (
                <div>
                  <h1 className="text-[16px] tracking-[0.32px] md:text-[20px] md:tracking-[0.4px] font-semibold mb-3 ">
                    Select Visit Time
                  </h1>
                  <div className="flex flex-col gap-3 mb-2">
                    {nurse.availableVisitTimings.morning && (
                      <label className="accent-[#93BB42] flex items-center gap-2 text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px] font-semibold">
                        <input
                          type="radio"
                          name="visitTime"
                          value="morning"
                          checked={visitTime === "morning"}
                          onChange={(e) => setVisitTime(e.target.value)}
                        />
                        Morning ({nurse.availableVisitTimings.morning})
                      </label>
                    )}
                    {nurse.availableVisitTimings.afternoon && (
                      <label className="accent-[#93BB42] flex items-center gap-2 text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px] font-semibold">
                        <input
                          type="radio"
                          name="visitTime"
                          value="afternoon"
                          checked={visitTime === "afternoon"}
                          onChange={(e) => setVisitTime(e.target.value)}
                        />
                        Afternoon ({nurse.availableVisitTimings.afternoon})
                      </label>
                    )}
                    {nurse.availableVisitTimings.evening && (
                      <label className="accent-[#93BB42] flex items-center gap-2 text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px] font-semibold">
                        <input
                          type="radio"
                          name="visitTime"
                          value="evening"
                          checked={visitTime === "evening"}
                          onChange={(e) => setVisitTime(e.target.value)}
                        />
                        Evening ({nurse.availableVisitTimings.evening})
                      </label>
                    )}
                    {nurse.availableVisitTimings.night && (
                      <label className="accent-[#93BB42] flex items-center gap-2 text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px] font-semibold">
                        <input
                          type="radio"
                          name="visitTime"
                          value="night"
                          checked={visitTime === "night"}
                          onChange={(e) => setVisitTime(e.target.value)}
                        />
                        Night ({nurse.availableVisitTimings.night})
                      </label>
                    )}
                  </div>
                </div>
              )}

              <div className="max-w-[310px] md:max-w-[420px]">
                <div className="flex justify-between mb-5">
                  <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px] font-semibold">
                    Choose Days
                  </p>
                  <div className="flex gap-1 md:gap-2 justify-center items-center  ">
                    <button
                      className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] bg-[#A2CD48]  rounded-full flex justify-center items-center p-3"
                      onClick={() => handleDecrease("days")}
                    >
                      <FaMinus className="text-[20px] text-[#333333] " />
                    </button>
                    <span className="text-sm md:text-xl font-semibold px-2">
                      {days}
                    </span>
                    <button
                      className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] bg-[#A2CD48]  rounded-full flex justify-center items-center p-3"
                      onClick={() => handleIncrease("days")}
                    >
                      <FaPlus className="text-[20px] text-[#333333]" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px]  font-semibold">
                    Select Date
                  </p>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="border-[1px] border-[#3D3D3D] px-3 py-2 rounded-[8px] text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px]"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px] font-semibold">
                  Total Amount:{" "}
                  <span className="text-[16px] leading-[32px] tracking-[0.64px] md:text-[20px] md:leading-[32px] md:tracking-[0.8px] font-bold text-[#34658C]">
                    ₹{calculateTotalAmount().toLocaleString()}
                  </span>
                </p>
                {nurse.pricings?.securityDeposit && (
                  <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px]  font-semibold">
                    Security Deposit:
                    <span className="text-[#666666]">
                      {" "}
                      ₹{nurse.pricings.securityDeposit} (refundable)
                    </span>
                  </p>
                )}
              </div>
              <button
                className="font-outfit bg-[#A2CD48] text-[14px] tracking-[0.28px] md:text-[20px] md:tracking-[0.4px] text-white px-[44px] py-3 rounded-[12px] w-full md:w-fit"
                onClick={handleBookNow}
              >
                Book Nurse
              </button>
            </div>
            <hr className="my-[40px] border border-[#000000]" />
            <div className="flex flex-col gap-3">
              <h1 className="text-[20px] tracking-[0.4px] md:text-[28px] md:tracking-[0.56px] text-[#34658C] font-bold">
                Nurse Details
              </h1>
              <div className="flex flex-col gap-2">
                <h1 className="text-[16px] md:text-[20px] font-semibold">
                  About
                </h1>
                <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px] font-semibold">
                  {nurse.about ||
                    "Experienced healthcare professional dedicated to providing quality care."}
                </p>
              </div>

              {nurse.specialised && (
                <div className="flex flex-col gap-2">
                  <h1 className="text-[16px] md:text-[20px]  font-semibold">
                    Specializations
                  </h1>
                  <div className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px]">
                    <p className="">{nurse.specialised}</p>
                  </div>
                </div>
              )}

              {nurse.certificates && nurse.certificates.length > 0 && (
                <div className="flex flex-col gap-2">
                  <h1 className="text-[16px] md:text-[20px] font-semibold">
                    Certifications
                  </h1>
                  <ul className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px] font-semibold list-disc px-6">
                    {nurse.certificates.map((cert, index) => (
                      <li key={cert._id || index}>{cert.name}</li>
                    ))}
                  </ul>
                </div>
              )}

              {nurse.tags && nurse.tags.length > 0 && (
                <div className="flex flex-col gap-2">
                  <h1 className="text-[16px] md:text-[20px] font-semibold">
                    Tags
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    {nurse.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-[#34658C] text-white px-3 py-1 rounded-full text-[12px] md:text-[14px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <h1 className="text-[16px] md:text-[20px] font-semibold">
                  Location
                </h1>
                <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px] font-semibold">
                  {nurse.statecity?.city}, {nurse.statecity?.state}
                </p>
                <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px] font-semibold">
                  Service Area: {nurse.serviceArea}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-8">
          <div className="flex flex-col gap-2 md:gap-3 items-center justify-center text-center ">
            <img
              src="/assets/EquipmentImages/rewards.png"
              className="w-[60px] h-[60px] md:w-[100px] md:h-[100px] xl:w-[120px] xl:h-[120px] "
            />
            <h1 className="text-[16px] tracking-[0.32px] md:text-[20px] md:tracking-[0.4px] font-semibold">
              Hygiene assurance
            </h1>
          </div>
          <div className="flex flex-col gap-2 md:gap-3 items-center justify-center text-center">
            <img
              src="/assets/EquipmentImages/fastdelivery.png"
              className="w-[60px] h-[60px] md:w-[100px] md:h-[100px] xl:w-[120px] xl:h-[120px] "
            />
            <h1 className="text-[16px] tracking-[0.32px] md:text-[20px] md:tracking-[0.4px] font-semibold">
              Quick Response
            </h1>
          </div>
          <div className="flex flex-col gap-2 md:gap-3 items-center justify-center text-center">
            <img
              src="/assets/EquipmentImages/medicalkit.png"
              className="w-[60px] h-[60px] md:w-[100px] md:h-[100px] xl:w-[120px] xl:h-[120px] "
            />
            <h1 className="text-[16px] tracking-[0.32px] md:text-[20px] md:tracking-[0.4px] font-semibold ">
              Professional Care
            </h1>
          </div>
          <div className="flex flex-col gap-2 md:gap-3 items-center justify-center text-center">
            <img
              src="/assets/EquipmentImages/refund.png"
              className="w-[60px] h-[60px] md:w-[100px] md:h-[100px] xl:w-[120px] xl:h-[120px] "
            />
            <h1 className="text-[16px] tracking-[0.32px] md:text-[20px] md:tracking-[0.4px] font-semibold">
              Verified Professionals
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default NurseDetail;
