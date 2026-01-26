import React, { useState, useEffect } from "react";
import AddToCartModal from "../../components/AddToCartModal";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { subscribeApi } from "../../apis/authapis";
import { toast } from "react-toastify";
import {
  Slides,
  TopHealthServices,
  HowItWorksData,
  ReviewsData,
  CountData,
  faqData,
} from "../../utils/Data";
import { getAllEquipmentsApi } from "../../apis/authapis";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { TiStarFullOutline } from "react-icons/ti";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const slidesPerView = 3;

  // Home page search states
  const [serviceQuery, setServiceQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");

  // Equipment data states
  const [equipments, setEquipments] = useState([]);
  const [loadingEquipments, setLoadingEquipments] = useState(true);
  const [equipmentError, setEquipmentError] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const lastIndex = TopHealthServices.length - slidesPerView;
  const lastIndexReview = ReviewsData.length - slidesPerView;

  // Handle home page search - Navigate to BookNurse with filter parameters
  const handleHomeSearch = () => {
    const trimmedService = serviceQuery.trim();
    const trimmedLocation = locationQuery.trim();

    // Need at least service query or location to search
    if (!trimmedService && !trimmedLocation) {
      return;
    }

    // Build URL parameters for BookNurse page filters
    const params = new URLSearchParams();

    // Add service as search filter if provided (searches across serviceName, description, category, subCategory)
    if (trimmedService) {
      params.append("search", trimmedService);
    }

    // Add location as city filter if provided
    if (trimmedLocation) {
      params.append("location", trimmedLocation);
    }

    // Navigate to BookNurse page with filter parameters
    navigate(`/book-nurse?${params.toString()}`);

    // Clear input fields
    setServiceQuery("");
    setLocationQuery("");
  };

  // Handle Enter key press in search inputs
  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      handleHomeSearch();
    }
  };

  // Fetch equipment data on component mount
  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        setLoadingEquipments(true);
        setEquipmentError(null);
        const response = await getAllEquipmentsApi(1, 5); // Fetch 5 items for home page

        if (response.data && response.data.data) {
          setEquipments(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching equipments:", error);

        // Handle 401 errors gracefully - don't show error, just hide the section
        if (error.response?.status === 401) {
          console.log(
            "⚠️ Equipment endpoint requires authentication - hiding section",
          );
          setEquipments([]); // Set empty array to hide the section
          setEquipmentError(null); // Don't show error message
        } else {
          setEquipmentError("Failed to load equipments");
        }
      } finally {
        setLoadingEquipments(false);
      }
    };

    fetchEquipments();
  }, []);

  const handleSubscribe = async () => {
    if (!subscribeEmail.trim()) {
      toast.error("Please enter your email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(subscribeEmail)) {
      toast.error("Please enter a valid email");
      return;
    }

    try {
      const res = await subscribeApi(subscribeEmail);

      if (res?.data?.success) {
        toast.success("Subscribed successfully 🎉");
        setIsSubscribed(true);
      }
      // ✅ HANDLE ALREADY SUBSCRIBED
      else if (res?.data?.statuscode === 409) {
        toast.info(res.data.message);
        setIsSubscribed(true);
      } else {
        toast.error(res?.data?.message || "Subscription failed");
      }
    } catch (error) {
      console.error("Subscribe error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="space-y-[60px] md:space-y-[80px] xl:space-y-[120px]">
      {/* hero section  */}
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3000 }}
        loop={true}
        pagination={{ clickable: true }}
      >
        {Slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative">
              <img
                src={slide.image}
                alt={`Slide ${slide.id}`}
                className="w-full h-[420px] md:h-[560px] xl:h-[720px] object-cover"
              />
              <div className="absolute inset-0 ">
                <div className="max-w-[1440px] mx-auto px-5 md:px-[32px] xl:px-[80px]  flex flex-col justify-center items-start h-full gap-3">
                  <h1 className="text-[36px] md:text-[48px]  xl:text-[64px] font-semibold font-outfit text-white max-w-[1079px] ">
                    Find Health Services & Home Care Near You
                  </h1>
                  <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] text-white font-semibold  max-w-[637px] ">
                    Check your sugar, BP, or book a certified nurse right from
                    your home.
                    <br />
                    Sehat Metra connects you with trusted healthcare
                    professionals and clinics nearby.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => navigate("/equipments")}
                      className="bg-[#34658C] px-6 py-2 md:py-3 rounded-[12px] text-white text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px] xl:text-[20px] xl:tracking-[0.4px] font-semibold  font-outfit"
                    >
                      Rent Equipment
                    </button>
                    <button
                      onClick={() => navigate("/book-nurse")}
                      className="bg-[#A2CD48] px-6 py-2 md:py-3 rounded-[12px] text-white text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px] xl:text-[20px] xl:tracking-[0.4px] font-semibold  font-outfit"
                    >
                      Book a Nurse
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Find Health Services Near You */}
      <div className="w-full">
        {/* Blue Section */}
        <div className="bg-[#34658C]">
          <div className="max-w-[1440px] mx-auto px-[20px] pt-[32px] pb-[100px] md:px-[32px] md:py-[40px] xl:px-[120px] xl:py-[80px] flex flex-col items-center text-white">
            <h1 className="text-[28px] tracking-[0.56px] md:text-[36px] md:tracking-[0.72px] xl:text-[48px] xl:tracking-[0.96px] leading-[100%]  text-center mb-2 font-bold">
              Find Nurse Care Services Near You
            </h1>

            <p className="text-[14px] leading-[22px] tracking-[0.56px] text-[16px] leading-[26px] tracking-[0.64px] text-center  mb-[44px]">
              Get trained and certified nursing support delivered to your
              doorstep. Choose the right caregiver based on your location,
              service needs, and availability.
            </p>
          </div>
        </div>

        {/* White Search Box*/}
        <div className="max-w-[300px] md:max-w-[704px] xl:max-w-[1200px] mx-auto w-full h-auto bg-white rounded-[12px] shadow-md -mt-[110px]  md:-mt-[70px] p-5 md:p-[24px] xl:p-[32px] font-outfit">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 h-full items-center">
            <div className="col-span-12 md:col-span-4">
              <div className="flex flex-col gap-[9px]">
                <p className="text-[16px] md:text-[20px] text-[#333333] font-medium ">
                  Search by service
                </p>
                <div className="flex gap-2 items-center bg-[#EBEBEB] border-[1px] border-[#2E86C1] px-4 py-2 rounded-[12px]">
                  <img
                    src="/assets/headerImages/search-icon.png"
                    alt="search icon"
                    className="w-[20px] h-[20px]"
                  />
                  <input
                    type="text"
                    placeholder="Search Service"
                    className="bg-transparent text-[14px] leading-[22px] tracking-[0.56px]  md:text-[16px] md:leading-[26px] md:tracking-[0.64px] placeholder:text-[#333333] font-semibold outline-none w-full"
                    value={serviceQuery}
                    onChange={(e) => setServiceQuery(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                  />
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-2 flex justify-center items-center">
              <img
                src="/assets/homeImages/findservicenearyousection/arrow.png"
                alt="arrow"
                className="w-[32px] h-[13px] md:w-[44px] h-[17px] xl:w-[82px] xl:h-[32px] rotate-90 md:rotate-0"
              />
            </div>
            <div className="col-span-12 md:col-span-4">
              <div className="flex flex-col gap-[9px]">
                <p className="text-[16px] md:text-[20px] text-[#333333] font-medium ">
                  Enter your location
                </p>

                <div className="flex gap-2 items-center bg-[#EBEBEB] border-[1px] border-[#2E86C1] px-4 py-2 rounded-[12px]">
                  <img
                    src="/assets/headerImages/search-icon.png"
                    alt="search icon"
                    className="w-[20px] h-[20px]"
                  />
                  <input
                    type="text"
                    placeholder="Search Location "
                    className="bg-transparent text-[14px] leading-[22px] tracking-[0.56px]  md:text-[16px] md:leading-[26px] md:tracking-[0.64px] placeholder:text-[#333333]  font-semibold outline-none w-full"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                  />
                </div>
              </div>
            </div>
            <div className="col-span-12 md:col-span-2 flex justify-start md:justify-center md:items-end h-full">
              <button
                onClick={handleHomeSearch}
                className="bg-[#A2CD48] px-8 py-2  md:py-3 rounded-[12px] text-white text-[16px] font-semibold tracking-[0.4px] font-outfit hover:bg-[#8fb83d] transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Our Top Equipments */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-[32px] xl:px-[120px] pb-[200px] md:pb-[60px]">
        <h1 className="font-outfit font-bold text-[28px] tracking-[0.56px] md:text-[36px] md:tracking-[0.72px] xl:text-[48px] leading-[100%] xl:tracking-[0.96px] text-[#34658C] mb-2 text-center">
          Our Top Equipments
        </h1>
        <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] text-center text-[#475569] mb-[44px]">
          Rent high-quality medical equipment at affordable prices. Delivered to
          your home with quick setup and reliable support.
        </p>
        <div className="relative max-w-[1200px] mx-auto ">
          <div className="absolute bottom-[-50px] left-1/2 -translate-x-1/2 flex gap-4">
            {/* left chervon  */}
            <div
              className={`custom-prev
    bg-[#A2CD48] w-[32px] h-[32px] rounded-full flex items-center justify-center
    ${activeIndex === 0 ? "opacity-40 pointer-events-none" : ""}`}
            >
              <MdKeyboardArrowLeft className="text-white text-xl" />
            </div>
            {/* right chervon  */}
            <div
              className={`custom-next 
    bg-[#A2CD48] w-[32px] h-[32px] rounded-full flex items-center justify-center
    ${activeIndex === lastIndex ? "opacity-40 pointer-events-none" : ""}`}
            >
              <MdKeyboardArrowRight className="text-white text-xl" />
            </div>
          </div>
          <Swiper
            modules={[Pagination, Navigation]}
            spaceBetween={20}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            onSwiper={(swiper) => setActiveIndex(swiper.realIndex)}
            // className="px-[20px]"
            breakpoints={{
              0: {
                slidesPerView: 1, // mobile
              },
              768: {
                slidesPerView: 1, // md screen
              },
              1024: {
                slidesPerView: 2, // lg and above
              },
            }}
          >
            {loadingEquipments ? (
              // Loading state
              <SwiperSlide className="p-1">
                <div
                  className="p-4 rounded-[16px] flex items-center justify-center h-[250px]"
                  style={{ boxShadow: "0px 0px 4px 0px #00000040" }}
                >
                  <p className="text-[16px] text-[#34658C] font-semibold">
                    Loading equipments...
                  </p>
                </div>
              </SwiperSlide>
            ) : equipmentError ? (
              // Error state
              <SwiperSlide className="p-1">
                <div
                  className="p-4 rounded-[16px] flex items-center justify-center h-[250px]"
                  style={{ boxShadow: "0px 0px 4px 0px #00000040" }}
                >
                  <p className="text-[16px] text-red-500 font-semibold">
                    {equipmentError}
                  </p>
                </div>
              </SwiperSlide>
            ) : equipments.length === 0 ? (
              // No data state
              <SwiperSlide className="p-1">
                <div
                  className="p-4 rounded-[16px] flex items-center justify-center h-[250px]"
                  style={{ boxShadow: "0px 0px 4px 0px #00000040" }}
                >
                  <p className="text-[16px] text-[#34658C] font-semibold">
                    No equipments available
                  </p>
                </div>
              </SwiperSlide>
            ) : (
              // Data loaded successfully
              equipments.map((data, index) => {
                // Extract pricing information
                const getPriceDisplay = () => {
                  if (data.pricings) {
                    const prices = [];
                    if (data.pricings.perDay)
                      prices.push(`₹${data.pricings.perDay}/day`);
                    if (data.pricings.perWeek)
                      prices.push(`₹${data.pricings.perWeek}/week`);
                    if (data.pricings.perMonth)
                      prices.push(`₹${data.pricings.perMonth}/month`);
                    return prices.join(" | ") || "Price on request";
                  }
                  return "Price on request";
                };

                return (
                  <SwiperSlide key={data._id || index} className="p-1">
                    <div
                      className="p-4 rounded-[16px]"
                      style={{ boxShadow: "0px 0px 4px 0px #00000040" }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <div className="col-span-12 md:col-span-5 rounded-[12px] flex justify-center md:block">
                          <img
                            src={
                              data.profileImage ||
                              data.images?.[0] ||
                              "/assets/EquipmentImages/default-equipment.png"
                            }
                            alt={data.equipmentName}
                            className="rounded-[12px] w-[200px] h-[200px] object-cover"
                          />
                        </div>
                        <div className="col-span-12 md:col-span-7">
                          <div className="flex flex-col justify-center h-full gap-[6px]">
                            <h1 className="text-[20px] tracking-[0.4px] md:text-[24px] md:tracking-[0.48px] text-[#34658C] font-semibold">
                              {data.equipmentName}
                            </h1>
                            <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold line-clamp-2">
                              {data.advantages}
                            </p>
                            <div>
                              <p className="text-[14px] leading-[22px] tracking-[0.56px] font-semibold">
                                Rental Price:{" "}
                                <span className="text-[16px] leading-[26px] tracking-[0.64px] font-semibold">
                                  {getPriceDisplay()}
                                </span>
                              </p>
                              <div className="flex gap-2 mt-[6px]">
                                <button
                                  className="bg-[#34658C] text-white px-4 md:px-8 py-2 rounded-[12px] text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px] font-semibold font-outfit"
                                  onClick={() => {
                                    setSelectedEquipment(data);
                                    setIsModalOpen(true);
                                  }}
                                >
                                  Add To Cart
                                </button>
                                <Link to={`/equipment/${data._id}`}>
                                  <button className="bg-[#A2CD48] text-white px-4 md:px-8 py-2 rounded-[12px] text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px] font-semibold font-outfit">
                                    Rent Now
                                  </button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })
            )}
          </Swiper>
        </div>
      </div>

      {/* Book a Certified Nurse for Home Care */}
      <div className="bg-[#34658C]">
        <div className="max-w-[1440px] mx-auto  px-5 md:px-[32px] xl:px-[120px] py-[40px] md:pt-[60px] xl:pt-[120px]">
          <div className="grid md:grid-cols-2 text-white gap-4 md:gap-0">
            <div className="order-2 md:order-1">
              <h1 className="text-[28px] tracking-[0.56px] md:text-[36px] md:tracking-[0.72px] xl:text-[48px] xl:tracking-[0.96px] leading-[100%] font-bold mb-3">
                Book a Certified Nurse for Home Care
              </h1>
              <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] mb-4  md:mb-6">
                Need regular medical support or post-surgery care? Sehat Metra
                connects you with trained and verified nurses who bring
                professional healthcare right to your doorstep.
              </p>
              <button
                onClick={() => navigate("/book-nurse")}
                className="bg-[#A2CD48] text-white px-8 py-3 text-[16px] tracking-[0.96px] font-semibold rounded-[12px] font-outfit"
              >
                Book a Nurse{" "}
              </button>
            </div>
            <div className="order-1 md:order-2  mt-[-200px] md:mt-0 xl:-mt-[200px]">
              <img
                src="/assets/homeImages/BookANurseSection/img (48).png"
                alt="Book a Nurse"
                className="w-[400px] h-[400px] xl:w-[600px] xl:h-[600px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* How Sehatmitra Works */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-[32px] xl:px-[120px]">
        <h1 className="text-[28px] tracking-[0.56px] md:text-[36px] md:tracking-[0.72px] xl:text-[48px] xl:tracking-[0.96px] leading-[100%] font-bold mb-3 text-[#34658C] text-center">
          How Sehatmitra Works
        </h1>
        <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] text-center mb-4 md:mb-6 xl:mb-[44px]">
          Your health services, simplified. Book a test, nurse, or checkup in
          just a few easy steps.
        </p>
        <div className="w-full flex flex-col items-center mt-10">
          <div
            className="
    grid grid-cols-1 
    md:grid-cols-2 
    xl:grid-cols-4 
   md:gap-8
    relative
  "
          >
            {HowItWorksData.map((item, index) => {
              const isLast = index === HowItWorksData.length - 1;

              return (
                <div
                  key={item.id}
                  className="relative flex flex-col items-center"
                >
                  {/* CARD */}
                  <div
                    className="flex flex-col items-center text-center gap-3 md:gap-4 px-6 py-6 rounded-[12px] bg-white"
                    style={{ boxShadow: "0px 0px 6px 0px #00000040" }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-[48px] h-[48px] md:w-[60px] md:h-[60px]"
                    />

                    <h2 className="text-[20px] font-outfit font-semibold text-black">
                      {item.title}
                    </h2>

                    <p className="text-[14px] leading-[22px] tracking-[0.56px] text-[#3D3D3D] font-semibold">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* -------- MOBILE ARROWS (vertical) -------- */}
                  {!isLast && (
                    <img
                      src="/assets/homeImages/howsehatmitraworksection/arrow.png"
                      className="md:hidden w-[32px] h-[12px] rotate-90 my-4"
                    />
                  )}

                  {/* -------- MD ARROW LOGIC (2x2) -------- */}
                  {/* 1 → 2 */}
                  {index === 0 && (
                    <img
                      src="/assets/homeImages/howsehatmitraworksection/arrow.png"
                      className="hidden md:block xl:hidden absolute top-1/2 -right-8 -translate-y-1/2 w-[32px]"
                    />
                  )}

                  {/* 2 ↓ 3 */}
                  {index === 1 && (
                    <img
                      src="/assets/homeImages/howsehatmitraworksection/arrow.png"
                      className="hidden md:block xl:hidden absolute bottom-[-20px] left-1/2 -translate-x-1/2 rotate-90 w-[32px]"
                    />
                  )}

                  {/* 3 ← 4 */}
                  {index === 3 && (
                    <img
                      src="/assets/homeImages/howsehatmitraworksection/arrow.png"
                      className="hidden md:block xl:hidden absolute top-1/2 -left-8 -translate-y-1/2 rotate-180 w-[32px]"
                    />
                  )}

                  {/* 4 ↑ 1 */}
                  {index === 2 && (
                    <img
                      src="/assets/homeImages/howsehatmitraworksection/arrow.png"
                      className="hidden md:block xl:hidden absolute top-[-20px] left-1/2 -translate-x-1/2 rotate-[270deg] w-[32px]"
                    />
                  )}

                  {/* -------- XL ARROWS: 1 → 2 → 3 → 4 -------- */}
                  {!isLast && (
                    <img
                      src="/assets/homeImages/howsehatmitraworksection/arrow.png"
                      className="hidden xl:block absolute top-1/2 -right-8 -translate-y-1/2 w-[32px]"
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* What Our Users Say */}
      <div>
        <div className="bg-[#34658C]">
          <div className="max-w-[1440px] mx-auto px-5 md:px-[32px] xl:px-[120px] pt-[40px] md:pt-[80px] pb-[200px] md:pb-[280px]">
            <h1 className="text-[28px] tracking-[0.56px] md:text-[36px] md:tracking-[0.72px] xl:text-[48px] xl:tracking-[0.96px] leading-[100%] leading-[100%] font-bold text-white text-center mb-2">
              What Our Users Say
            </h1>
            <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] text-center text-white ">
              Real stories from people who found trusted healthcare services
              through Sehat Metra.
            </p>
          </div>
        </div>
        <div className="relative max-w-[250px] md:max-w-[604px] lg:max-w-[704px] xl:max-w-[1200px] mx-auto -mt-[170px] md:-mt-[210px]">
          {/* left chervon  */}
          <div
            className={`custom-prev absolute left-[-30px] md:left-[-50px] top-1/2 -translate-y-1/2 
    bg-[#A2CD48] w-[24px] h-[24px] md:w-[32px] md:h-[32px] rounded-full flex items-center justify-center
    ${activeIndex === 0 ? "opacity-40 pointer-events-none" : ""}`}
          >
            <MdKeyboardArrowLeft className="text-white text-xl" />
          </div>
          {/* right chervon  */}
          <div
            className={`custom-next absolute right-[-30px] md:right-[-50px] top-1/2 -translate-y-1/2 
    bg-[#A2CD48] w-[24px] h-[24px] md:w-[32px] md:h-[32px] rounded-full flex items-center justify-center
    ${activeIndex === lastIndexReview ? "opacity-40 pointer-events-none" : ""}`}
          >
            <MdKeyboardArrowRight className="text-white text-xl" />
          </div>
          <Swiper
            modules={[Pagination, Navigation]}
            spaceBetween={2}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            onSwiper={(swiper) => setActiveIndex(swiper.realIndex)}
            // className="px-[20px]"
            breakpoints={{
              0: {
                slidesPerView: 1, // mobile
              },
              768: {
                slidesPerView: 2,
              },
              1280: {
                slidesPerView: 3,
              },
            }}
          >
            {ReviewsData.map((data, index) => (
              <SwiperSlide key={index} className="p-1">
                <div
                  className="shadow-md rounded-[12px]  bg-white p-4 md:p-[24px] flex flex-col gap-4"
                  style={{ boxShadow: "0px 0px 4px 0px #00000040" }}
                >
                  <div className="  ">
                    <div className="flex justify-start">
                      <img
                        src="/assets/homeImages/WhatOurUserSaySection/start-quote.png"
                        alt="start quote"
                        className="w-[24px] h-[24px] md:w-[32px] md:h-[32px]"
                      />
                    </div>
                    <div className="font-sans text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] italic">
                      {data.content}
                    </div>
                    <div className="flex justify-end">
                      <img
                        src="/assets/homeImages/WhatOurUserSaySection/end-quote.png"
                        alt="end quote"
                        className="w-[24px] h-[24px] md:w-[32px] md:h-[32px]"
                      />
                    </div>
                    <div className="flex gap-1">
                      {Array.from({ length: Number(data.rating) }).map(
                        (_, i) => (
                          <TiStarFullOutline
                            key={i}
                            className="text-[16px] md:text-[24px] text-[#ED3237]"
                          />
                        ),
                      )}
                    </div>
                    <div className="flex gap-3 mt-3">
                      <img
                        src={data.image}
                        alt={data.name}
                        className="w-[60px] h-[60px] rounded-full"
                      />
                      <div className="flex flex-col">
                        <h1 className="font-outfit text-[16px]  md:text-[20px] font-semibold tracking-[0.4px]">
                          {data.name}
                        </h1>
                        <p className="font-sans  italic  text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px]">
                          {data.place}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Count section */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-[32px] xl:px-[120px] grid grid-cols-2  xl:grid-cols-4 gap-6">
        {CountData.map((data) => (
          <div
            key={data.id}
            className="flex flex-col items-center gap-4 xl:gap-[26px]"
          >
            <div
              className="rounded-full w-[100px] h-[100px] md:w-[140px] md:h-[140px] flex justify-center items-center "
              style={{
                background:
                  "linear-gradient(180deg, #5D84A3 0%, #1D384D 95.04%)",
              }}
            >
              <h1 className="text-[28px] md:text-[40px] font-semibold text-white font-outfit">
                {data.count}
              </h1>
            </div>
            <p className="text-[16px] md:text-[20px] font-medium text-[#1D384D] font-outfit text-center">
              {data.title}
            </p>
          </div>
        ))}
      </div>

      {/* Subscribe to Our Newsletter */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-[32px] xl:px-[120px]  ">
        <div
          className="rounded-[16px]"
          style={{
            background: "linear-gradient(180deg, #5D84A3 0%, #1D384D 95.04%)",
          }}
        >
          <div className="grid grid-cols-12 p-4 md:p-[32px] xl:p-0">
            <div className=" hidden xl:block xl:col-span-3 xl:-mt-[40px]">
              <img
                src="/assets/homeImages/subscribeOurSection/image 18.png"
                alt="image"
                className="w-[315px] h-[371px]"
              />
            </div>
            <div className="col-span-12 xl:col-span-9 flex flex-col justify-center text-white gap-[22px] ">
              <div className="flex flex-col gap-2 items-center">
                <h1 className="text-[28px] tracking-[0.56px] md:text-[36px] md:tracking-[0.72px] xl:text-[48px] xl:tracking-[0.96px] leading-[100%] leading-[100%] font-bold font-outfit text-center md:text-start ">
                  Subscribe to Our Newsletter
                </h1>
                <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold text-center">
                  Stay informed with the latest health tips, wellness updates,
                  and special service offers — straight to your inbox.
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-3 justify-center">
                <input
                  type="email"
                  placeholder="Enter your Email Address"
                  value={subscribeEmail}
                  disabled={isSubscribed}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  className="font-semibold text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px]  border-[1px] border-[#FFFFFF] w-full md:w-[386px] bg-transparent px-6 py-3 rounded-[16px] disabled:opacity-60 "
                />
                <button
                  onClick={handleSubscribe}
                  disabled={isSubscribed}
                  className="bg-[#FFFFFF] font-semibold text-[14px] md:text-[16px] text-[#34658C] px-6 py-3 rounded-[16px] disabled:opacity-60"
                >
                  {isSubscribed ? "Subscribed ✓" : "Subscribe"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Got Questions? We’ve Got Answers! */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-[32px] xl:px-[120px] flex flex-col gap-4 pb-[60px] md:pb-[80px] xl:pb-[120px]">
        <h1 className="text-[28px] tracking-[0.56px] md:text-[36px] md:tracking-[0.72px] xl:text-[48px] xl:tracking-[0.96px] leading-[100%] leading-[100%] text-[#34658C] font-outfit font-bold">
          Got Questions? We’ve Got Answers!
        </h1>
        <div>
          {faqData.map((data, index) => (
            <div key={index} className=" mb-[18px]">
              <div className="flex flex-col gap-2">
                <h1 className="text-[16px] leading-[22px] md:text-[20px]  font-outfit font-semibold ">
                  {data.question}
                </h1>
                <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
                  {" "}
                  {data.Answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && (
        <AddToCartModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEquipment(null);
          }}
          itemData={selectedEquipment}
          itemType="equipment"
        />
      )}
    </div>
  );
};

export default Home;
