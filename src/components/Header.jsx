import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { HiUser } from "react-icons/hi2";
import { toast } from "react-toastify";

import Login from "../pages/authentication/Login";
import Signup from "../pages/authentication/Signup";
import { useAuth } from "../context/AuthContext";
import { globalSearchApi, getAllAddressesApi } from "../apis/authapis";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [signInOpen, setSignInOpen] = useState(false);
  const [signUpOpen, setSignUpOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [userCity, setUserCity] = useState("Select City");
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch user's city from their address
  useEffect(() => {
    const fetchUserCity = async () => {
      if (!isAuthenticated) {
        setUserCity("Select City");
        return;
      }

      try {
        const response = await getAllAddressesApi();

        // Get current user ID from localStorage
        const userData = JSON.parse(localStorage.getItem("userData"));
        const currentUserId = userData?.userId;

        // Handle different possible response structures
        let addressList = [];
        if (response.data.data) {
          addressList = response.data.data;
        } else if (response.data.addresses) {
          addressList = response.data.addresses;
        } else if (Array.isArray(response.data)) {
          addressList = response.data;
        }

        // Filter addresses for current user only
        const userAddresses = addressList.filter(
          (address) => address.userId === currentUserId
        );

        // Get city from the first address
        if (userAddresses.length > 0 && userAddresses[0].city) {
          setUserCity(userAddresses[0].city);
        } else {
          setUserCity("Select City");
        }
      } catch (error) {
        console.error("Error fetching user city:", error);
        setUserCity("Select City");
      }
    };

    fetchUserCity();
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  const handleProfileClick = () => {
    navigate('/myaccount');
  };

  const handleSearch = async () => {
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      return; // Don't search if empty
    }

    try {
      setIsSearching(true);

      // Call global search API to determine result type
      const response = await globalSearchApi(trimmedQuery, 1, 10);

      if (response.data.success && response.data.data.length > 0) {
        // Get the first result's type
        const firstResult = response.data.data[0];
        const resultType = firstResult.resultType;

        // Route based on result type
        if (resultType === 'service') {
          navigate(`/book-nurse?search=${encodeURIComponent(trimmedQuery)}`);
        } else if (resultType === 'equipment') {
          navigate(`/equipments?search=${encodeURIComponent(trimmedQuery)}`);
        } else {
          // Fallback to equipment page if resultType is unknown
          navigate(`/equipments?search=${encodeURIComponent(trimmedQuery)}`);
        }

        setSearchQuery(""); // Clear search after navigation
      } else {
        // No results found - default to equipment page
        console.log('No results found, defaulting to equipment page');
        navigate(`/equipments?search=${encodeURIComponent(trimmedQuery)}`);
        setSearchQuery("");
      }
    } catch (error) {
      console.error('Search error:', error);
      // On error, fallback to equipment page
      navigate(`/equipments?search=${encodeURIComponent(trimmedQuery)}`);
      setSearchQuery("");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter' && !isSearching) {
      handleSearch();
    }
  };

  const navLinks = [
    { name: "Home", link: "/" },
    { name: "About Us", link: "/about" },
    { name: "Equipments", link: "/equipments" },
    { name: "Book a Nurse", link: "/book-nurse" },
    { name: "Blogs", link: "/blogs" },
    { name: "Contact", link: "/contact" },
  ];
  return (
    <>
      <div className="max-w-[1440px] mx-auto px-5 py-4 md:px-[32px]  xl:px-[80px] xl:py-[12px] font-outfit">
        {/* topheader */}
        <div className="xl:flex xl:justify-between">
          {/* logo  */}
          <div className=" flex flex-col gap-2 xl:flex-row xl:gap-[32px] ">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 ">
                {/* logo  */}
                <Link to="/">
                  <div className="w-[48px] h-[36px] md:w-[69px] md:h-[52px]">
                    <img
                      src="/assets/Logo.png"
                      alt="Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Link>
                {/* location  */}
                <div className="flex flex-col gap-2">
                  <div className="flex gap-1">
                    <img
                      src="/assets/headerImages/Location.png"
                      alt="Location"
                      className="w-[16px] h-[16px] md:w-[20px] md:h-[20px] "
                    />
                    <p className=" text-[#666666] text-[10px]  md:text-[12px]">
                      MY LOCATION
                    </p>
                  </div>
                  <div className="flex justify-end gap-2 items-center ">
                    <p className=" text-[#333333] text-[12px] md:text-[14px]">
                      {userCity}
                    </p>
                    <img
                      src="/assets/headerImages/chervon-up.png"
                      alt="chervon"
                      className="w-[16px] h-[16px]"
                    />
                  </div>
                </div>
              </div>

              {/* hamberger  */}
              <div className="xl:hidden">
                <IoMenu
                  className="w-[32px] h-[32px]"
                  onClick={() => setMenuOpen(true)}
                />
              </div>

              {menuOpen && (
                <div
                  className="fixed top-0 right-0 h-screen w-[320px] md:w-[568px] bg-[#34658C] z-10 p-[16px] md:p-[32px]
               transform translate-x-full animate-slideIn overflow-hidden"
                >
                  <div className="relative w-full h-[64px]">
                    <IoClose
                      className="w-[32px] h-[32px] text-white absolute right-8 top-2 cursor-pointer"
                      onClick={() => setMenuOpen(false)}
                    />
                  </div>

                  <div className="flex flex-col gap-6">
                    <img
                      src="/assets/Logo.png"
                      alt="Logo"
                      className="w-[132px] h-[100px] md:w-[182px] md:h-[138px]"
                    />

                    <div className="flex gap-3">
                      {isAuthenticated ? (
                        <div
                          className="bg-white px-6 py-2 rounded-[12px] flex gap-2 items-center cursor-pointer"
                          onClick={() => {
                            setMenuOpen(false);
                            navigate('/profile');
                          }}
                        >
                          <HiUser className="w-[20px] h-[20px] text-[#34658C]" />
                          <p className="text-[16px] text-[#34658C] font-semibold">
                            {user?.firstname || 'Profile'}
                          </p>
                        </div>
                      ) : (
                        <div
                          className="bg-white px-6 py-2 rounded-[12px] flex gap-2 items-center cursor-pointer"
                          onClick={() => {
                            setMenuOpen(false);
                            setSignInOpen(true);
                          }}
                        >
                          <HiUser className="w-[20px] h-[20px] text-[#34658C]" />
                          <p className="text-[16px] text-[#34658C] font-semibold">
                            Login
                          </p>
                        </div>
                      )}

                      <div
                        className="bg-[#A2CD48] px-6 py-2 rounded-[12px] flex gap-2 items-center cursor-pointer hover:bg-[#8fb83d] transition-colors"
                        onClick={() => {
                          setMenuOpen(false);
                          if (!isAuthenticated) {
                            toast.error('Please login to view your cart');
                            setSignInOpen(true);
                          } else {
                            navigate('/cart');
                          }
                        }}
                      >
                        <img
                          src="/assets/headerImages/cart.png"
                          alt="cart"
                          className="w-[20px] h-[20px]"
                        />
                        <p className="text-[16px] text-white font-semibold">
                          Cart
                        </p>
                      </div>
                    </div>

                    <div className="font-outfit flex flex-col items-start gap-4 md:gap-6">
                      {navLinks.map((item, index) => (
                        <NavLink
                          key={index}
                          to={item.link}
                          onClick={() => setMenuOpen(false)}
                          className={({ isActive }) =>
                            `text-[16px] text-white px-4 py-2 ${isActive ? "bg-[#A2CD48] rounded-[8px] w-fit" : ""
                            }`
                          }
                        >
                          {item.name}
                        </NavLink>
                      ))}

                      {/* Logout button - only show when authenticated */}
                      {isAuthenticated && (
                        <button
                          onClick={handleLogout}
                          className="text-[16px] text-white px-4 py-2 bg-red-500 rounded-[8px] w-fit hover:bg-red-600 transition-colors"
                        >
                          Logout
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* search icon  */}
            <div className="flex justify-between border-[1px] border-[#2E86C1] rounded-[12px] px-4 py-3  w-full xl:w-[384px]">
              <input
                className="text-[#333333] text-[16px] outline-none flex-1"
                placeholder={isSearching ? "Searching..." : "Search for the services"}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                disabled={isSearching}
              />
              {isSearching ? (
                <div className="w-[20px] h-[20px] border-2 border-[#2E86C1] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <img
                  src="/assets/headerImages/search-icon.png"
                  alt="search icon"
                  className="w-[20px] h-[20px] cursor-pointer"
                  onClick={handleSearch}
                />
              )}
            </div>
          </div>

          {/* Login/Profile and cart btns */}
          <div className="hidden xl:flex gap-3 items-center">
            {isAuthenticated ? (
              /* Profile Button - Navigates to /profile */
              <div
                className="bg-[#34658C] px-6 py-2 rounded-[12px] flex gap-2 items-center cursor-pointer hover:bg-[#2a5270] transition-colors"
                onClick={handleProfileClick}
              >
                <img
                  src="/assets/headerImages/user.png"
                  alt="user"
                  className="w-[20px] h-[20px]"
                />
                <p className="text-[16px] text-white font-semibold">
                  {user?.firstname || 'Profile'}
                </p>
              </div>
            ) : (
              /* Login Button */
              <div
                className="bg-[#34658C] px-6 py-2 rounded-[12px] flex gap-2 items-center cursor-pointer hover:bg-[#2a5270] transition-colors"
                onClick={() => setSignInOpen(true)}
              >
                <img
                  src="/assets/headerImages/user.png"
                  alt="user"
                  className="w-[20px] h-[20px]"
                />
                <p className="text-[16px] text-white font-semibold">
                  Login
                </p>
              </div>
            )}

            {/* Cart Button */}
            <div
              className=" bg-[#A2CD48] px-6 py-2 rounded-[12px] flex gap-2 items-center cursor-pointer hover:bg-[#8fb83d] transition-colors"
              onClick={() => {
                if (!isAuthenticated) {
                  toast.error('Please login to view your cart');
                  setSignInOpen(true);
                } else {
                  navigate('/cart');
                }
              }}
            >
              <img
                src="/assets/headerImages/cart.png"
                alt="cart"
                className="w-[20px] h-[20px]"
              />
              <p className="text-[16px] text-white font-semibold">Cart </p>
            </div>
            <div></div>
          </div>
        </div>
      </div>
      <div className=" hidden xl:block bg-[#34658C] ">
        <div className="max-w-[1440px] mx-auto px-[80px] py-[12px] font-outfit flex gap-6 items-center">
          {navLinks.map((item, index) => (
            <NavLink
              key={index}
              to={item.link}
              className={({ isActive }) =>
                `text-[16px] text-white px-4 py-2 ${isActive ? "bg-[#A2CD48] rounded-[8px]" : ""
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>

      {signInOpen && (
        <Login setSignInOpen={setSignInOpen} setSignUpOpen={setSignUpOpen} />
      )}
      {signUpOpen && (
        <Signup setSignUpOpen={setSignUpOpen} setSignInOpen={setSignInOpen} />
      )}
    </>
  );
};

export default Header;
