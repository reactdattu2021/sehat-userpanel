import React, { useRef, useState, useEffect } from "react";
import { ContactInfo } from "../../utils/Data";
import { MdKeyboardArrowDown } from "react-icons/md";
import { PiPhoneCallFill } from "react-icons/pi";
import { IoLogoWhatsapp } from "react-icons/io";
import { getAllNursesApi, contactUsApi } from "../../apis/authapis";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Contact = () => {
  const selectRef = useRef(null);
  const hasFetchedDropdownData = useRef(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // State for all services
  const [allServices, setAllServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);

  // State for form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    subCategory: "",
  });

  // State for loading and submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch all services on mount (only once)
  useEffect(() => {
    if (!hasFetchedDropdownData.current) {
      console.log("📥 Fetching all services for contact form...");
      hasFetchedDropdownData.current = true;
      fetchAllServices();
    }
  }, []);

  // Fetch all services from API
  const fetchAllServices = async () => {
    try {
      setLoadingServices(true);
      console.log("🌐 Calling getAllNursesApi to fetch all services...");
      // Fetch with a large limit to get all services
      const response = await getAllNursesApi(1, 100);
      if (response.data.success) {
        const services = response.data.data;
        console.log("✅ All services fetched successfully:", services.length);

        // Extract unique subcategories
        const uniqueSubCategories = [
          ...new Set(services.map((service) => service.subCategory)),
        ];
        console.log("✅ Unique subcategories extracted:", uniqueSubCategories);

        setAllServices(uniqueSubCategories);
      }
    } catch (error) {
      console.error("❌ Error fetching services:", error);
      toast.error("Failed to load services");
    } finally {
      setLoadingServices(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle select change
  const handleSelectChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      subCategory: e.target.value,
    }));
  };

  // Validate form
  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error("Please enter your mobile number");
      return false;
    }
    // Phone number validation (10 digits)
    if (formData.phone.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return false;
    }
    if (!formData.subCategory) {
      toast.error("Please select a service category");
      return false;
    }
    if (!formData.message.trim()) {
      toast.error("Please enter your message");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
    toast.error("Please login to send a message");
    navigate("/"); // optional but recommended
    return;
  }

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("📤 Submitting contact form:", formData);

      const response = await contactUsApi({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        subCategory: formData.subCategory,
      });

      if (response.data.success) {
        console.log("✅ Contact form submitted successfully");
        toast.success(
          "Your message has been sent successfully! We'll get back to you soon.",
        );

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          subCategory: "",
        });
      } else {
        toast.error(response.data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("❌ Error submitting contact form:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to send message. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-[60px] md:space-y-[80px] xl:space-y-[120px] ">
      {/* hero section  */}
      <div className="h-[240px] md:h-[320px] xl:h-[502px] bg-[url('/assets/AboutImages/banner.png')] bg-center bg-cover bg-no-repeat">
        <div className="max-w-[1440px] mx-auto px-5 md:px-[32px]  xl:px-[120px]  flex flex-col justify-center h-full">
          <h1 className=" text-[32px] md:text-[48px]  xl:text-[64px] font-semibold text-white ">
            Get in Touch with Us
          </h1>
        </div>
      </div>
      {/* Reach Us Directly */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-[32px]  xl:px-[120px]">
        <h1 className="text-[#34658C] text-[28px] tracking-[0.56px] md:text-[36px] md:tracking-[0.72px] xl:text-[48px] xl:tracking-[0.96px] leading-[100%] font-bold text-center mb-4 md:mb-6 xl:mb-[32px]">
          Reach Us Directly
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-4 gap-5 mb-[32px]">
          {ContactInfo.map((data, index) => (
            <div
              key={index}
              className={`bg-white rounded-[24px] border-[1px] p-4  md:p-[24px] flex flex-col items-center`}
              style={{ borderColor: data.color }}
            >
              <img
                src={data.image}
                alt={data.title}
                className="w-[36px] h-[36px] md:w-[44px] md:h-[44px]  xl:w-[60px] xl:h-[60px] mb-3 md:mb-4"
              />
              <h1
                className="text-[20px] tracking-[0.4px] md:text-[24px]  md:tracking-[0.48px] font-semibold mb-1 text-center"
                style={{ color: data.color }}
              >
                {data.title}
              </h1>
              <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold text-center">
                {data.subtitle}
              </p>
            </div>
          ))}
        </div>
        <div className="flex gap-3 justify-center">
          <img
            src="/assets/ContactImages/fb.png"
            className="w-[32px] h-[32px] md:w-[40px] md:h-[40px]"
          />
          <img
            src="/assets/ContactImages/insta.png"
            className="w-[32px] h-[32px] md:w-[40px] md:h-[40px]"
          />

          <img
            src="/assets/ContactImages/linkedin.png"
            className="w-[32px] h-[32px] md:w-[40px] md:h-[40px]"
          />

          <img
            src="/assets/ContactImages/twitter.png"
            className="w-[32px] h-[32px] md:w-[40px] md:h-[40px]"
          />
        </div>
      </div>
      {/* Send Us a Message */}
      <div className="grid grid-cols-12">
        <div className=" col-span-12 xl:col-span-7 bg-[#34658C] px-5 py-[40px] md:px-[32px]  xl:px-[120px]  flex flex-col h-full justify-center xl:items-end ">
          <h1 className="text-[28px] tracking-[0.56px] md:text-[36px] md:tracking-[0.72px] xl:text-[48px] xl:tracking-[0.96px] leading-[100%] font-bold text-white mb-4 md:mb-6 flex justify-center">
            Send Us a Message
          </h1>
          <div className="bg-[#A2B8CA] p-4 md:p-8 rounded-[24px] ">
            <form className="space-y-3" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-white px-4 py-3 rounded-[8px] placeholder:text-[#6D6D6D] text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold w-full"
                    placeholder="Name"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-white px-4 py-3 rounded-[8px] placeholder:text-[#6D6D6D] text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold w-full"
                    placeholder="Mobile Number"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-white px-4 py-3 rounded-[8px] placeholder:text-[#6D6D6D] text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold"
                  placeholder="Email"
                />
              </div>
              <div className="grid grid-cols-1">
                <div className="relative">
                  <select
                    ref={selectRef}
                    value={formData.subCategory}
                    onChange={handleSelectChange}
                    className="bg-white px-4 py-3 rounded-[8px] text-[#6D6D6D]  text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold appearance-none w-full"
                  >
                    <option value="">Select Service Category</option>
                    {loadingServices ? (
                      <option disabled>Loading services...</option>
                    ) : allServices.length > 0 ? (
                      allServices.map((subCategory, index) => (
                        <option key={index} value={subCategory}>
                          {subCategory}
                        </option>
                      ))
                    ) : (
                      // Fallback static options if API data is not available
                      <>
                        <option value="Elderly Care Nurse">
                          Elderly Care Nurse
                        </option>
                        <option value="Post-Surgery Care">
                          Post-Surgery Care
                        </option>
                        <option value="Bedridden Care">Bedridden Care</option>
                      </>
                    )}
                  </select>
                  <MdKeyboardArrowDown
                    className="absolute right-3 top-1/2 w-[20px] h-[20px] -translate-y-1/2"
                    onClick={() =>
                      selectRef.current.focus() || selectRef.current?.click()
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-1">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="bg-white px-4 py-3 rounded-[8px] placeholder:text-[#6D6D6D] text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold "
                  placeholder="Message"
                  rows={4}
                ></textarea>
              </div>
              <div className="grid grid-cols-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`font-outfit bg-[#A2CD48] px-6 py-3 text-white text-[14px] leading-[22px] tracking-[0.56px] md:text-[20px] md:leading-[100%] md:tracking-[0.04px] font-semibold rounded-[8px] mt-2 ${
                    isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-[#8fb83d]"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="hidden xl:block xl:col-span-5">
          <img
            src="/assets/ContactImages/sidebg.png"
            className="w-full h-[638px] object-cover"
          />
        </div>
      </div>

      {/* Location  */}
      <div className="w-full h-[267px] md:h-[420px] xl:h-[639px]">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.600147069886!2d78.42595207594059!3d17.430966501546607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb91007c271547%3A0x8f1ad1b5a8262ea8!2sTechpixe%20India!5e0!3m2!1sen!2sin!4v1764137154952!5m2!1sen!2sin"
          width="100%"
          height="100%"
          allowfullscreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      {/* Need Quick Assistance? */}
      <div className="max-w-[1440px] mx-auto  px-5 md:px-8 xl:px-[120px] pb-[60px] md:pb-[80px]  xl:pb-[120px] ">
        <div
          className="rounded-[16px]"
          style={{
            background: "linear-gradient(180deg, #5D84A3 0%, #1D384D 95.04%)",
          }}
        >
          <div className="grid grid-cols-12">
            <div className="col-span-9 flex flex-col justify-center text-white p-4 gap-[22px] ">
              <div className="flex flex-col gap-2 items-center">
                <h1 className="text-[28px] tracking-[0.56px] md:text-[36px] md:tracking-[0.72px] xl:text-[48px] xl:tracking-[0.96px] leading-[100%] font-bold font-outfit ">
                  Need Quick Assistance?
                </h1>
                <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold text-start md:text-center">
                  Call our helpline or chat with our support team for instant
                  help.
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-3 justify-center items-center">
                <button className="flex gap-2 text-[10px] tracking-[0.28px] md:text-[14px]  md:tracking-[0.32px] font-semibold text-white border-[1px] border-[#FFFFFF] px-6 md:px-8 py-3 rounded-[16px] w-fit ">
                  <PiPhoneCallFill className="w-[16px] h-[16px] md:w-[24px] md:h-[24px] text-white " />
                  Call Now
                </button>
                <button className="flex gap-2 text-[#34658C] text-[10px] tracking-[0.28px] md:text-[14px]  md:tracking-[0.32px] font-semibold bg-white items-center px-6 md:px-8 py-3 rounded-[16px] w-fit ">
                  <IoLogoWhatsapp className="w-[16px] h-[16px] md:w-[24px] md:h-[24px] text-[#34658C]" />
                  Chat on WhatsApp
                </button>
              </div>
            </div>
            <div className="col-span-3 -mt-[50px] md:mt-0 xl:-mt-[100px]">
              <img
                src="/assets/ContactImages/heartbeatchecking.png"
                alt="image"
                className="w-[148px] h-[148px] md:w-[246px] md:h-[246px] xl:w-[433px] xl:h-[433px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
