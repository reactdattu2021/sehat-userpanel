import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { toast } from "react-toastify";
import { getEquipmentByIdApi } from "../../apis/authapis";

const EquipmentDetail = () => {
  const { equipmentId } = useParams();
  const navigate = useNavigate();

  // Equipment data state
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);

  // UI state
  const [selectedImg, setSelectedImg] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [days, setDays] = useState(1);
  const [rentalType, setRentalType] = useState('perDay');
  const [selectedDate, setSelectedDate] = useState('');

  // Fetch equipment details
  useEffect(() => {
    const fetchEquipmentDetails = async () => {
      try {
        setLoading(true);
        console.log('Fetching equipment with ID:', equipmentId);
        const response = await getEquipmentByIdApi(equipmentId);
        console.log('API Response:', response.data);

        if (response.data.success) {
          const equipmentData = response.data.data;
          setEquipment(equipmentData);
          setSelectedImg(equipmentData.profileImage);
        }
      } catch (error) {
        console.error('Error fetching equipment details:', error);
        navigate('/equipments');
      } finally {
        setLoading(false);
      }
    };

    if (equipmentId) {
      fetchEquipmentDetails();
    }
  }, [equipmentId, navigate]);

  const handleDecrease = (type) => {
    if (type === 'quantity' && quantity > 1) {
      setQuantity(quantity - 1);
    } else if (type === 'days' && days > 1) {
      setDays(days - 1);
    }
  };

  const handleIncrease = (type) => {
    if (type === 'quantity') {
      setQuantity(quantity + 1);
    } else if (type === 'days') {
      setDays(days + 1);
    }
  };

  const calculateTotalRent = () => {
    if (!equipment) return 0;
    const basePrice = equipment.pricings[rentalType];
    return basePrice * quantity * days;
  };

  const handleRentNow = () => {
    // Validation
    if (!equipment) {
      toast.error('Equipment data not loaded');
      return;
    }

    if (!selectedDate) {
      toast.error('Please select a start date');
      return;
    }

    if (!rentalType) {
      toast.error('Please select rental duration');
      return;
    }

    if (days <= 0) {
      toast.error('Please select valid number of days');
      return;
    }

    if (quantity <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }

    // Check if pricing is available for selected rental type
    if (!equipment.pricings[rentalType]) {
      toast.error(`${rentalType} pricing not available for this equipment`);
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
          productId: equipment._id,
          productType: 'equipment',
          productName: equipment.equipmentName,
          productImage: equipment.profileImage,
          rentalDuration: rentalType,
          rentalValue: days,
          quantity: quantity,
          startDate: selectedDateTime.toISOString(),
          pricing: {
            unitPrice: equipment.pricings[rentalType],
            shippingCost: equipment.pricings.shippingCost || 0,
            taxPercentage: equipment.pricings.taxPercentage || 0,
            securityDeposit: equipment.pricings.securityDeposit || 0
          }
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl font-semibold text-[#34658C]">Loading equipment details...</div>
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl font-semibold text-gray-500">Equipment not found</div>
      </div>
    );
  }

  const allImages = [equipment.profileImage, ...equipment.images];

  return (
    <>
      <div className="max-w-[1440px] mx-auto px-5 md:px-8 xl:px-[120px] pt-[40px] md:pt-[60px]  pb-[60px] md:pb-[80px] xl:pb-[120px]">
        <div className="grid grid-cols-12 lg:grid-cols-12 gap-6 md:gap-[40px] xl:gap-[60px] pb-[60px] md:pb-[80px] xl:pb-[120px] ">
          <div className=" col-span-12 lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-[100px] self-start">
            <img
              src={selectedImg}
              alt="equipmentPic"
              className="w-[300px] h-[300px] md:w-[386px] md:h-[386px] border-[1px] border-[#000000] rounded-[12px]"
            />

            <div className="flex gap-4 ">
              {allImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="equipmentPics"
                  className={`w-[87px] h-[87px] object-cover rounded-[12px] cursor-pointer border ${selectedImg === img
                    ? "border-[#000000]"
                    : "border-transparent"
                    }`}
                  style={{ boxShadow: "0px 0px 4px 0px #00000040" }}
                  onClick={() => setSelectedImg(img)}
                />
              ))}
            </div>
            <button
              className="bg-[#34658C] text-white px-[64px] py-4 rounded-[12px] text-[14px] tracking-[0.28px] md:text-[20px] md:tracking-[0.4px] font-semibold w-full md:w-fit font-outfit"
              onClick={() => navigate('/cart')}
            >
              Add To Cart
            </button>
          </div>
          <div className="col-span-12 lg:col-span-7">
            <div className="flex flex-col gap-2 md:gap-4 xl:gap-6">
              <h1 className="text-[24px] tracking-[0.48px] md:text-[36px] md:tracking-[0.72px] font-bold text-[#34658C]">
                {equipment.equipmentName}
              </h1>
              <p className="text-[16px] text-gray-600">
                {/* <span className="font-semibold">Brand:</span> {equipment.brand} |
                <span className="font-semibold"> Model:</span> {equipment.model} */}
              </p>
              <div>
                <h1 className="text-[16px] tracking-[0.32px] md:text-[20px] md:tracking-[0.4px] font-semibold mb-3 ">
                  Select Duration
                </h1>
                <div className="flex flex-col md:flex-row gap-3 mb-2">
                  <label className="accent-[#93BB42] flex items-center gap-2 text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px] font-semibold">
                    <input
                      type="radio"
                      name="rentalType"
                      value="perDay"
                      checked={rentalType === 'perDay'}
                      onChange={(e) => setRentalType(e.target.value)}
                    />
                    Daily Rent
                  </label>
                  <label className="accent-[#93BB42] flex items-center gap-2 text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px] font-semibold">
                    <input
                      type="radio"
                      name="rentalType"
                      value="perWeek"
                      checked={rentalType === 'perWeek'}
                      onChange={(e) => setRentalType(e.target.value)}
                    />
                    Weekly Rent
                  </label>
                  <label className="accent-[#93BB42] flex items-center gap-2 text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px] font-semibold">
                    <input
                      type="radio"
                      name="rentalType"
                      value="perMonth"
                      checked={rentalType === 'perMonth'}
                      onChange={(e) => setRentalType(e.target.value)}
                    />
                    Monthly Rent
                  </label>
                </div>
                <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px] font-semibold">
                  {rentalType === 'perDay' && 'Daily: '}
                  {rentalType === 'perWeek' && 'Weekly: '}
                  {rentalType === 'perMonth' && 'Monthly: '}
                  <span className="text-[16px] leading-[32px] tracking-[0.64px] md:text-[20px] md:leading-[32px] md:tracking-[0.8px] text-[#34658C] font-bold">
                    ₹{equipment.pricings[rentalType]}/
                    {rentalType === 'perDay' ? 'Day' : rentalType === 'perWeek' ? 'Week' : 'Month'}
                  </span>
                </p>
              </div>
              <div className="max-w-[310px] md:max-w-[420px]">
                <div className="flex justify-between mb-5">
                  <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px] font-semibold">
                    Choose Days
                  </p>
                  <div className="flex gap-1 md:gap-2 justify-center items-center ">
                    <button
                      className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] bg-[#A2CD48]  rounded-full flex justify-center items-center p-3"
                      onClick={() => handleDecrease('days')}
                    >
                      <FaMinus className="text-[20px] text-[#333333] " />
                    </button>
                    <span className="text-sm md:text-xl font-semibold px-2">
                      {days}
                    </span>
                    <button
                      className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] bg-[#A2CD48]  rounded-full flex justify-center items-center p-3"
                      onClick={() => handleIncrease('days')}
                    >
                      <FaPlus className="text-[20px] text-[#333333]" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between mb-4">
                  <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px] font-semibold">
                    Quantity
                  </p>
                  <div className="flex gap-1 md:gap-2 justify-center items-center  ">
                    <button
                      className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] bg-[#A2CD48]  rounded-full flex justify-center items-center p-3"
                      onClick={() => handleDecrease('quantity')}
                    >
                      <FaMinus className="text-[20px] text-[#333333] " />
                    </button>
                    <span className="text-sm md:text-xl font-semibold px-2">
                      {quantity}
                    </span>
                    <button
                      className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] bg-[#A2CD48]  rounded-full flex justify-center items-center p-3"
                      onClick={() => handleIncrease('quantity')}
                    >
                      <FaPlus className="text-[20px] text-[#333333]" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px] font-semibold">
                    Select Date
                  </p>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="border-[1px] border-[#3D3D3D] px-3 py-2 rounded-[8px] text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px]"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px] font-semibold">
                  Total Rent Amount:{" "}
                  <span className="text-[16px] leading-[32px] tracking-[0.64px] md:text-[20px] md:leading-[32px] md:tracking-[0.8px] font-bold text-[#34658C]">
                    ₹{calculateTotalRent().toLocaleString()}
                  </span>
                </p>
                <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px] font-semibold">
                  Shipping Cost:
                  <span className="text-[#666666]">
                    {" "}
                    ₹{equipment.pricings.shippingCost}
                  </span>
                </p>
              </div>
              <button
                className="font-outfit bg-[#A2CD48] text-[14px] tracking-[0.28px] md:text-[20px] md:tracking-[0.4px] text-white px-[44px] py-3 rounded-[12px] w-full md:w-fit"
                onClick={handleRentNow}
              >
                Rent Now
              </button>
            </div>
            <hr className="my-[40px] border border-[#000000]" />
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-2">
                <h1 className="text-[20px] tracking-[0.4px] md:text-[28px] md:tracking-[0.56px] text-[#34658C] font-bold">
                  Product Details
                </h1>
                <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px]">
                  <span className="font-bold">Name:</span> {equipment.equipmentName}
                  <br />
                  {/* <span className="font-bold">Serial Number:</span> {equipment.serialNumber} */}
                  <br />
                  {/* <span className="font-bold">Location:</span> {equipment.statecity.city}, {equipment.statecity.state} */}
                  <br />
                  <span className="font-bold">Status:</span> {equipment.status}
                  <br />
                  <span className="font-bold">Security</span> to be submitted as
                  Post Dated Cheque
                  <br />
                  <span className="font-bold">Documents required for KYC </span>
                  - Identity proof and Address proof
                  <br />
                  <span className="font-bold">
                    Cancelling an order or a part of an order:
                  </span>{" "}
                  We allow you to cancel your order until it reaches your
                  door-step, for all our rental products. Please check your
                  products thoroughly before accepting delivery.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-[20px] tracking-[0.4px] md:text-[28px] md:tracking-[0.56px] text-[#34658C] font-bold">
                  Description
                </h1>
                <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px]">
                  {equipment.description}
                </p>

                {equipment.features && equipment.features.length > 0 && (
                  <>
                    <h1 className="text-[20px] font-semibold mt-4">Key Features:</h1>
                    <div className="space-y-2">
                      {equipment.features.map((feature) => (
                        <p key={feature._id} className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] tracking-[0.64px]">
                          <span className="font-bold">{feature.key}:</span> {feature.value}
                        </p>
                      ))}
                    </div>
                  </>
                )}
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
              Local & fast delivery
            </h1>
          </div>
          <div className="flex flex-col gap-2 md:gap-3 items-center justify-center text-center">
            <img
              src="/assets/EquipmentImages/medicalkit.png"
              className="w-[60px] h-[60px] md:w-[100px] md:h-[100px] xl:w-[120px] xl:h-[120px] "
            />
            <h1 className="text-[16px] tracking-[0.32px] md:text-[20px] md:tracking-[0.4px] font-semibold ">
              Medical assistance
            </h1>
          </div>
          <div className="flex flex-col gap-2 md:gap-3 items-center justify-center text-center">
            <img
              src="/assets/EquipmentImages/refund.png"
              className="w-[60px] h-[60px] md:w-[100px] md:h-[100px] xl:w-[120px] xl:h-[120px] "
            />
            <h1 className="text-[16px] tracking-[0.32px] md:text-[20px] md:tracking-[0.4px] font-semibold">
              Smooth return process
            </h1>
          </div>
        </div>
      </div>
    </>
  );
};

export default EquipmentDetail;
