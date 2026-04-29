import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAllEquipmentsApi, getAllNursesApi } from "../apis/authapis";

const Footer = () => {
  const navigate = useNavigate();
  const [equipments, setEquipments] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        // Fetch more equipments to find unique subcategories
        const equipmentResponse = await getAllEquipmentsApi(1, 20);
        if (equipmentResponse.data.success) {
          const uniqueEquipments = equipmentResponse.data.data
            .filter((item, index, self) =>
              index === self.findIndex((t) => t.subCategory === item.subCategory)
            )
            .slice(0, 5);
          setEquipments(uniqueEquipments);
        }

        // Fetch top 5 nurse services
        const nurseResponse = await getAllNursesApi(1, 5);
        if (nurseResponse.data.success) {
          setNurses(nurseResponse.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching footer data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  // Log state changes for debugging
  useEffect(() => {
    // console.log("Footer State - Equipments:", equipments);
    // console.log("Footer State - Nurses:", nurses);
    // console.log("Footer State - Loading:", loading);
  }, [equipments, nurses, loading]);

  const handleEquipmentClick = (equipmentId) => {
    navigate(`/equipment/${equipmentId}`);
  };

  const handleNurseClick = (nurseId) => {
    navigate(`/nurse-detail/${nurseId}`);
  };

  return (
    <div className="bg-[#34658C]">
      <div className="max-w-[1440px] mx-auto px-5 py-[40px] md:px-[32px] xl:px-[120px] md:py-[60px] text-white">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-[60px]">
          <div className="col-span-12 xl:col-span-4 flex flex-col gap-3">
            <img
              src="/assets/FooterImages/footerLogo.png"
              alt="footer-Logo"
              className="w-[140px] h-[106px] md:w-[175px] md:h-[132px] cursor-pointer"
              onClick={() => navigate("/")}
            />
            <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
              Your trusted health partner, connecting you with nearby medical
              services and certified care providers.
            </p>
            <div className="flex  gap-3">
              <img
                src="/assets/FooterImages/fb.png"
                alt="facebook"
                className="w-[40px] h-[40px]"
              />
              <img
                src="/assets/FooterImages/insta.png"
                alt="insta"
                className="w-[40px] h-[40px]"
              />
              <img
                src="/assets/FooterImages/linkedin.png"
                alt="linkedin"
                className="w-[40px] h-[40px]"
              />
              <img
                src="/assets/FooterImages/twitter.png"
                alt="twitter"
                className="w-[40px] h-[40px]"
              />
            </div>
          </div>

          <div className="col-span-12 xl:col-span-2 flex flex-col gap-5">
            <h1 className="text-[#A2CD48] text-[24px] font-semibold">
              Company
            </h1>
            <div className="flex flex-col gap-3 text-[16px] leading-[26px] tracking-[0.64px] font-semibold">
              <Link to="/">
                <p>Home</p>
              </Link>
              <Link to="/about">
                <p>About Us</p>
              </Link>
              <Link to="/contact">
                <p>Contact Us</p>
              </Link>
              <Link to="/book-nurse">
                <p>Privacy Policy</p>
              </Link>

              <Link to="/contact">
                <p>Terms & Conditions</p>
              </Link>
            </div>
          </div>
          <div className="col-span-12 xl:col-span-3 flex flex-col gap-5 ">
            <h1 className="text-[#A2CD48] text-[24px] font-semibold">
              Rent Products
            </h1>
            <div className="flex flex-col  gap-3 text-[16px] leading-[26px] tracking-[0.64px] font-semibold">
              {loading ? (
                <p>Loading...</p>
              ) : equipments.length > 0 ? (
                <>
                  {equipments.map((equipment) => (
                    <p
                      key={equipment._id}
                      onClick={() => handleEquipmentClick(equipment._id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {equipment.subCategory}
                    </p>
                  ))}
                  <p
                    onClick={() => navigate("/equipments")}
                    style={{ cursor: 'pointer' }}
                  >
                    View All Products
                  </p>
                </>
              ) : (
                <p>No products available</p>
              )}
            </div>
          </div>
          <div className=" col-span-12 xl:col-span-3 flex flex-col gap-5">
            <h1 className="text-[#A2CD48] text-[24px] font-semibold">
              Book Nurse Service
            </h1>
            <div className="flex flex-col gap-3 text-[16px] leading-[26px] tracking-[0.64px] font-semibold">
              {loading ? (
                <p>Loading...</p>
              ) : nurses.length > 0 ? (
                <>
                  {nurses.map((nurse) => (
                    <p
                      key={nurse._id}
                      onClick={() => handleNurseClick(nurse._id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {nurse.fullName}
                    </p>
                  ))}
                  <p
                    onClick={() => navigate("/book-nurse")}
                    style={{ cursor: 'pointer' }}
                  >
                    View All Services
                  </p>
                </>
              ) : (
                <p>No services available</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <hr className="border-[1px] border-dashed border-[#FFFFFF] " />
      <div className="max-w-[1440px] mx-auto px-[32px] xl:px-[120px] py-[20px]  text-white flex flex-col gap-3 md:flex-row  md:gap-0 justify-between">
        <p className="text-[16px] font-outfit font-semibold">
          © 2025 Sehatmitra. All Rights Reserved.
        </p>
        <p className="text-[16px] font-outfit font-semibold">
          Designed and Developed By Techpixe
        </p>
      </div>
    </div>
  );
};

export default Footer;
