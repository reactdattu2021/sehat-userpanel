import React, { useRef, useState, useEffect } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { MdOutlineMyLocation } from "react-icons/md";
import { faqData } from "../../utils/Data";
import { Link } from "react-router-dom";
import { getAllEquipmentsApi, getEquipmentFiltersApi, getFilterDropdownDataApi } from "../../apis/authapis";

const Equipment = () => {
  const selectRef = useRef(null);

  // State for API data
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // State for dropdown data
  const [dropdownData, setDropdownData] = useState({
    equipmentSubCategories: [],
    serviceSubCategories: [],
    experiences: [],
    minPrice: 0,
    maxPrice: 0
  });

  // State for filters
  const [filters, setFilters] = useState({
    subCategory: "",
    location: "",
    date: "",
    rentalDuration: "",
    priceRange: ""
  });
  const [isFilterActive, setIsFilterActive] = useState(false);

  // Fetch dropdown data on mount
  useEffect(() => {
    fetchDropdownData();
  }, []);

  // Fetch equipments on mount and page change
  useEffect(() => {
    fetchEquipments(currentPage);
  }, [currentPage, isFilterActive]);

  // Fetch dropdown data from API
  const fetchDropdownData = async () => {
    try {
      console.log('Fetching dropdown data...');
      const response = await getFilterDropdownDataApi();
      console.log('Dropdown API Response:', response);

      if (response.data.success) {
        const data = response.data.data;
        console.log('Dropdown data received:', data);

        const newDropdownData = {
          equipmentSubCategories: data.subCategories.equipment || [],
          serviceSubCategories: data.subCategories.service || [],
          experiences: data.experiences || [],
          minPrice: data.pricing.min || 0,
          maxPrice: data.pricing.max || 0
        };

        console.log('Setting dropdown data:', newDropdownData);
        setDropdownData(newDropdownData);
      } else {
        console.warn('API returned success: false');
      }
    } catch (error) {
      console.error('Error fetching dropdown data:', error);
      console.error('Error details:', error.response?.data || error.message);
    }
  };

  // Check if any filter has a value
  const hasActiveFilters = () => {
    return Object.values(filters).some(value => value !== "");
  };

  const fetchEquipments = async (page) => {
    try {
      setLoading(true);
      let response;

      // Only use filter API if there are actual filter values
      if (isFilterActive && hasActiveFilters()) {
        // Use filter API when filters are active and have values
        const filterPayload = {
          ...filters,
          page,
          limit
        };

        console.log('🔍 Sending filters to backend:', filterPayload);
        response = await getEquipmentFiltersApi(filterPayload);
      } else {
        // Use regular API when no filters or all filters are empty
        console.log('📋 Fetching all equipment (no filters)');
        response = await getAllEquipmentsApi(page, limit);
      }

      if (response.data.success) {
        console.log('✅ API Response:', response.data);
        console.log(`📊 Found ${response.data.total} items, showing page ${response.data.currentPage} of ${response.data.totalPages}`);
        if (response.data.data.length > 0) {
          console.log('📦 First item sample:', response.data.data[0]);
        } else {
          console.warn('⚠️ No equipment found with current filters:', filters);
        }
        setEquipments(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotal(response.data.total);
      }
    } catch (error) {
      console.error('❌ Error fetching equipments:', error);
      console.error('Error details:', error.response?.data || error.message);
      // Show error message to user
      setEquipments([]);
      setTotalPages(1);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle filter input changes
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle search button click
  const handleSearch = () => {
    // Check if there are any filter values
    if (hasActiveFilters()) {
      setIsFilterActive(true);
      setCurrentPage(1); // Reset to first page when searching
    } else {
      // If no filters, just show regular data
      setIsFilterActive(false);
      setCurrentPage(1);
    }
  };

  // Handle clear/reset filters
  const handleClearFilters = () => {
    setFilters({
      subCategory: "",
      location: "",
      date: "",
      rentalDuration: "",
      priceRange: ""
    });
    setIsFilterActive(false);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-[60px] md:space-y-[80px] xl:space-y-[120px] ">
      {/* Hero Banner  */}
      <div className="h-[240px] md:h-[320px] xl:h-[502px] bg-[url('/assets/AboutImages/banner.png')] bg-center bg-cover bg-no-repeat">
        <div className="max-w-[1440px] mx-auto  px-5 md:px-[32px]  xl:px-[120px] flex flex-col justify-center h-full">
          <h1 className=" text-[32px] md:text-[48px]  xl:text-[64px] font-semibold text-white ">
            Rent Medical Equipment Near You
          </h1>
        </div>
      </div>
      {/* Find Health Services Near You */}
      <div className="w-full">
        {/* Blue Section */}
        <div className="bg-[#34658C]">
          <div className="max-w-[1440px] mx-auto px-5 md:px-[32px] xl:px-[120px] py-[60px] md:py-[80px] xl:py-[120px] flex flex-col items-center text-white">
            <h1 className="text-[28px] tracking-[0.56px] md:text-[36px] md:tracking-[0.72px] xl:text-[48px] xl:tracking-[0.96px] leading-[100%] font-semibold  text-center mb-2">
              Find Medical Equipment Near You
            </h1>

            <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] text-center  mb-[44px]">
              Rent sanitized and reliable medical equipment for home care.
              <br />
              Choose your location, select rental duration, and get quick
              doorstep delivery.
            </p>
          </div>
        </div>

        {/* White Search Box*/}
        <div className="max-w-[300px] md:max-w-[704px] xl:max-w-[1280px] mx-auto w-full bg-white rounded-[12px] shadow-md -mt-[100px] p-[20px] md:p-[24px] xl:p-[32px] font-outfit">
          <div className="flex flex-col gap-3  ">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="col-span-12 md:col-span-4 xl:col-span-5">
                <div className="relative">
                  <select
                    ref={selectRef}
                    value={filters.subCategory}
                    onChange={(e) => handleFilterChange('subCategory', e.target.value)}
                    className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold border-[1px] text-[#3D3D3D] border-[#3D3D3D] rounded-[8px] w-full p-3 appearance-none"
                  >
                    <option value="">Select Equipment</option>
                    {dropdownData.equipmentSubCategories.length > 0 ? (
                      dropdownData.equipmentSubCategories.map((equipment, index) => (
                        <option key={index} value={equipment}>
                          {equipment}
                        </option>
                      ))
                    ) : (
                      // Fallback static options if API data is not available
                      <>
                        <option value="Wheelchair">Wheelchair</option>
                        <option value="Suction Machine">Suction Machine</option>
                        <option value="Oxygen Concentrator">Oxygen Concentrator</option>
                        <option value="Hospital Bed">Hospital Bed</option>
                        <option value="Bp checkup machine">CPAP/BiPAP Machine</option>
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
              <div className="col-span-12 md:col-span-4 xl:col-span-5">
                <input
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold border-[1px] border-[#3D3D3D] rounded-[8px] w-full p-3 placeholder:text-[#3D3D3D] "
                  placeholder="Enter Your Location"
                />
              </div>
              <div className="col-span-12 md:col-span-4 xl:col-span-2">
                <div>
                  <button className="bg-[#A2CD48] text-white p-3 rounded-[12px] flex gap-2 items-center md:w-full">
                    <MdOutlineMyLocation className="text-white w-[22px] h-[22px]" />
                    <span className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold ">
                      Use My Location
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-12 md:grid-cols-12 gap-3">
              <div className="col-span-12 md:col-span-4">
                <div>
                  <input
                    type="date"
                    value={filters.date}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                    className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold border-[1px] text-[#3D3D3D] border-[#3D3D3D] rounded-[8px] w-full p-3 appearance-none"
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-4">
                <div className="relative">
                  <select
                    value={filters.rentalDuration}
                    onChange={(e) => handleFilterChange('rentalDuration', e.target.value)}
                    className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold border-[1px] text-[#3D3D3D] border-[#3D3D3D] rounded-[8px] w-full p-3 appearance-none"
                  >
                    <option value="">Rental Duration</option>
                    <option value="perDay">Per Day</option>
                    <option value="perWeek">Per Week</option>
                    <option value="perMonth">Per Month</option>
                  </select>
                  <MdKeyboardArrowDown
                    className="absolute right-3 top-1/2 w-[20px] h-[20px] -translate-y-1/2"
                    onClick={() =>
                      selectRef.current.focus() || selectRef.current?.click()
                    }
                  />
                </div>
              </div>
              <div className="col-span-12 md:col-span-4">
                <div className="relative">
                  <select
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold border-[1px] text-[#3D3D3D] border-[#3D3D3D] rounded-[8px] w-full p-3 appearance-none"
                  >
                    <option value="">Price Range</option>
                    {dropdownData.minPrice > 0 && dropdownData.maxPrice > 0 ? (
                      <>
                        <option value={dropdownData.minPrice}>From ₹{dropdownData.minPrice}</option>
                        <option value={dropdownData.maxPrice}>Up to ₹{dropdownData.maxPrice}</option>
                      </>
                    ) : (
                      // Fallback static options if API data is not available
                      <>
                        <option value="100">From ₹100</option>
                        <option value="500">Up to ₹500</option>
                        <option value="1000">Up to ₹1000</option>
                        <option value="1500">Up to ₹1500</option>
                        <option value="2500">Up to ₹2500</option>
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
            </div>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleSearch}
                className="bg-[#A2CD48] px-8 py-3 rounded-[12px] text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px] xl:text-[20px] xl:tracking-[0.04px] text-white font-semibold w-fit "
              >
                Search Providers
              </button>
              {isFilterActive && (
                <button
                  onClick={handleClearFilters}
                  className="bg-gray-500 px-8 py-3 rounded-[12px] text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px] xl:text-[20px] xl:tracking-[0.04px] text-white font-semibold w-fit "
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Equipments */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-[32px]  xl:px-[120px]">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-xl font-semibold text-[#34658C]">Loading equipments...</div>
          </div>
        ) : equipments.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-xl font-semibold text-gray-500">No equipments found</div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {equipments.map((equipment) => (
                <div
                  key={equipment._id}
                  className="p-4 rounded-[16px]"
                  style={{ boxShadow: "0px 0px 4px 0px #00000040" }}
                >
                  <div className="grid grid-cols-12 md:grid-cols-12 gap-6 ">
                    <div className="col-span-12 md:col-span-5 rounded-[12px] flex justify-center md:block">
                      <img
                        src={equipment.profileImage}
                        alt={equipment.equipmentName}
                        className="rounded-[12px] w-[200px] h-[200px] object-cover "
                      />
                    </div>
                    <div className="col-span-12 md:col-span-7">
                      <div className="flex flex-col justify-center h-full gap-[6px]">
                        <h1 className="text-[20px] tracking-[0.4px] md:text-[24px] md:tracking-[0.48px] text-[#34658C] font-semibold">
                          {equipment.equipmentName}
                        </h1>
                        <p className="text-[14px] leading-[22px] tracking-[0.56px]  md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold ">
                          {equipment.subCategory}
                        </p>
                        <p className="text-[12px] text-gray-600">
                          {equipment.advantages}
                        </p>
                        <div>
                          <p className="text-[14px] leading-[22px] tracking-[0.56px] font-semibold">
                            Rental Price:{" "}
                            <span className="text-[14px] leading-[22px] tracking-[0.56px]  md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold ">
                              {equipment.pricings?.perDay ? (
                                <>₹{equipment.pricings.perDay}/day | ₹{equipment.pricings.perWeek}/week</>
                              ) : (
                                "Contact for pricing"
                              )}
                            </span>
                          </p>
                          <div className="flex gap-2 mt-[6px]">
                            <button className="bg-[#34658C] text-white px-4 md:px-8 py-2 rounded-[12px] text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px] font-semibold font-outfit">
                              Add To Cart
                            </button>
                            <Link to={`/equipment/${equipment._id}`}>
                              <button className="bg-[#A2CD48] text-white  px-4 md:px-8 py-2 rounded-[12px] text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px] font-semibold font-outfit">
                                Rent Now
                              </button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-10">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-3 rounded-lg font-semibold flex items-center justify-center ${currentPage === 1
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#34658C] text-white hover:bg-[#2a5270]'
                    }`}
                >
                  <MdKeyboardArrowLeft className="w-6 h-6" />
                </button>

                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`px-4 py-2 rounded-lg font-semibold ${currentPage === index + 1
                        ? 'bg-[#A2CD48] text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-3 rounded-lg font-semibold flex items-center justify-center ${currentPage === totalPages
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[#34658C] text-white hover:bg-[#2a5270]'
                    }`}
                >
                  <MdKeyboardArrowRight className="w-6 h-6" />
                </button>
              </div>
            )}

            {/* Results Info */}
            {/* <div className="text-center mt-4 text-gray-600">
              Showing {equipments.length} of {total} equipments (Page {currentPage} of {totalPages})
            </div> */}
          </>
        )}
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
    </div>
  );
};

export default Equipment;
