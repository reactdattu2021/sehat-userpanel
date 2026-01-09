import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Profile from "./Profile";
import MyAddress from "./MyAddress";
import MyOrders from "./MyOrders";
import ChangePassword from "./ChangePassword";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { useAuth } from "../../../context/AuthContext";

const MyAccount = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [mobileView, setMobileView] = useState(false);
  const { logout } = useAuth();
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile />;
      case "address":
        return <MyAddress />;
      case "orders":
        return <MyOrders />;
      case "password":
        return <ChangePassword />;
      default:
        return <Profile />;
    }
  };

  const handleLogOut = async () => {
    const result = await logout();
    if (result.success) {
      // Optional: Show success message or redirect
      navigate("/"); // If you want to redirect to home
    } else {
      // Optional: Show error message
      console.error("Logout error:", result.error);
    }
  };
  return (
    <div className="space-y-[60px]  md:space-y-[80px] xl:space-y-[120px]">
      {/* Hero section  */}
      <div className="h-[240px] md:h-[320px] xl:h-[502px] bg-[url('/assets/AboutImages/banner.png')] bg-center bg-cover bg-no-repeat">
        <div className="max-w-[1440px] mx-auto px-5 md:px-[32px]  xl:px-[120px] flex flex-col justify-center h-full">
          <h1 className="text-[32px] md:text-[48px]  xl:text-[64px] font-semibold text-white ">
            My Account
          </h1>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-5 md:px-[32px] xl:px-[120px]">
        <div className="grid grid-cols-12 gap-6 md:gap-8">
          <div
            className={`col-span-12 md:col-span-5 lg:col-span-3 rounded-[12px] 
      ${mobileView ? "hidden md:block" : "block"}`}
          >
            <div
              className="shadow-lg rounded-[12px]"
              style={{ boxShadow: "0px 0px 8px 0px #00000040" }}
            >
              <ul className="flex flex-col text-[20px] font-medium font-outfit">
                {[
                  { id: "profile", label: "My Profile" },
                  { id: "address", label: "Address" },
                  { id: "orders", label: "My Orders" },
                  { id: "password", label: "Password Manager" },
                ].map((item, i) => (
                  <li
                    key={item.id}
                    className={`cursor-pointer px-4 py-5 ${
                      activeTab === item.id
                        ? "bg-[#34658C] text-white"
                        : "text-black"
                    } ${i === 0 ? "rounded-t-[12px]" : ""}`}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileView(true);
                    }}
                  >
                    {item.label}
                  </li>
                ))}

                <li
                  className="cursor-pointer px-4 py-5 hover:bg-[#34658C] hover:text-white hover:rounded-b-[12px]"
                  onClick={() => setLogoutOpen(true)}
                >
                  Logout
                </li>
              </ul>
            </div>
          </div>

          <div
            className={`col-span-12 md:col-span-7 lg:col-span-9 
      ${mobileView ? "block" : "hidden md:block"}`}
          >
            <button
              className="md:hidden flex items-center gap-2 text-[#34658C] mb-4"
              onClick={() => setMobileView(false)}
            >
              <FaArrowLeftLong className="text-[24px] text-black " />
            </button>

            {renderContent()}
          </div>
        </div>
        {logoutOpen && (
          <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center px-4">
            <div className="bg-white max-w-[300px] md:max-w-[600px] w-full rounded-[24px] p-[24px] relative">
              <IoClose
                className="absolute top-6 right-6 text-[24px] cursor-pointer"
                onClick={() => setLogoutOpen(false)}
              />

              <div className="flex justify-center mb-6">
                <img
                  src="/assets/userImages/image 28 (2).png"
                  className="w-[137px] h-[137px] md:w-[220px] md:h-[220px]"
                />
              </div>

              <div className="flex flex-col gap-6 items-center">
                <h1 className="text-[28px] md:text-[48px] font-bold">
                  Log Out?
                </h1>

                <p className="text-[14px] md:text-[16px] text-center font-semibold">
                  Are you sure you want to log out? You’ll need to sign in again
                  to continue using your account.
                </p>

                <div className="flex flex-col md:flex-row gap-2 w-full">
                  <button
                    onClick={handleLogOut}
                    className="bg-[#34658C] text-white px-8 py-3 rounded-[8px] text-[14px] tracking-[0.28px] md:text-[20px] md:tracking-[0.4px] font-outfit font-semibold w-full md:w-fit"
                  >
                    Yes, Logout
                  </button>
                  <button
                    onClick={() => setLogoutOpen(false)}
                    className="bg-[#A2CD48] text-white px-8 py-3 rounded-[8px] text-[14px] tracking-[0.28px] md:text-[20px] md:tracking-[0.4px] font-outfit font-semibold w-full md:w-fit"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Subscribe to Our Newsletter */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-[32px] xl:px-[120px] pb-[60px] md:pb-[80px] xl:pb-[120px] ">
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
                  type="text"
                  placeholder="Enter your Email Address"
                  className="font-semibold text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px]  border-[1px] border-[#FFFFFF] w-full md:w-[386px] bg-transparent px-6 py-3 rounded-[16px]"
                />
                <button className="bg-[#FFFFFF] font-semibold text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] text-[#34658C] px-6 py-3 rounded-[16px] w-full md:w-fit">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
