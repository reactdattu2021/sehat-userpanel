import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="bg-[#34658C]">
      <div className="max-w-[1440px] mx-auto px-5 py-[40px] md:px-[32px] xl:px-[120px] md:py-[60px] text-white">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-[60px]">
          <div className="col-span-12 xl:col-span-4 flex flex-col gap-3">
            <img
              src="/assets/FooterImages/footerLogo.png"
              alt="footer-Logo"
              className="w-[140px] h-[106px] md:w-[175px] md:h-[132px]"
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
              <Link to="/services">
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
              <p>Oxygen Concentrators</p>
              <p>Patient Monitors</p>
              <p>Wheelchairs</p>
              <p>Medical Beds</p>
              <p>View All Products</p>
            </div>
          </div>
          <div className=" col-span-12 xl:col-span-3 flex flex-col gap-5">
            <h1 className="text-[#A2CD48] text-[24px] font-semibold">
              Book Nurse Service
            </h1>
            <div className="flex flex-col gap-3 text-[16px] leading-[26px] tracking-[0.64px] font-semibold">
              <p>Elderly Care</p>
              <p>ICU Trained Nurse</p>
              <p>Physiotherapy Support</p>
              <p>Post-Surgery Care</p>
              <p>View All Services</p>
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
