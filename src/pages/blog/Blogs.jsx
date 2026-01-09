import React from "react";
import { TbAdjustmentsHorizontal } from "react-icons/tb";
import { BlogData } from "../../utils/Data";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Blogs = () => {
  return (
    <div className="space-y-[60px] md:space-y-[80px] xl:space-y-[120px]">
      {/* Hero section  */}
      <div className="h-[240px] md:h-[320px] xl:h-[502px] bg-[url('/assets/AboutImages/banner.png')] bg-center bg-cover bg-no-repeat">
        <div className="max-w-[1440px] mx-auto px-5 md:px-[32px]  xl:px-[120px] flex flex-col justify-center h-full">
          <h1 className=" text-[32px] md:text-[48px]  xl:text-[64px] font-semibold text-white ">Our Blogs</h1>
        </div>
      </div>

      {/* Health Tips & Wellness Insights */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-[32px]  xl:px-[120px]">
        <div className="flex flex-col items-end   md:flex-row md:justify-between md:items-center mb-4 md:mb-6 xl:mb-[32px]">
          <div className="flex flex-col gap-1">
            <h1 className="text-[#34658C] text-[28px] tracking-[0.56px] md:text-[36px] md:tracking-[0.72px] xl:text-[48px] xl:leading-[100%] xl:tracking-[0.96px] font-bold">
              Health Tips & Wellness Insights
            </h1>
            <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
              Explore expert advice, medical guidance, and simple everyday
              habits to stay healthy and informed.
            </p>
          </div>
          
          <button className="bg-[#34658C] flex px-3 py-2 text-white  text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px]  xl:text-[20px] xl:tracking-[0.04px] gap-10 rounded-[12px] font-outfit">
            All
            <TbAdjustmentsHorizontal className="w-[16px] h-[16px] md:w-[20px] md:h-[20px] xl:w-[24px] xl: h-[24px] text-white " />
          </button>
          
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 gap-5">
          {BlogData.map((data, index) => (
            <div
              key={index}
              className="shadow-md rounded-[16px] group bg-white hover:bg-[#34658C] "
            >
              <div className="overflow-hidden rounded-t-[16px]">
                <img
                  src={data.image}
                  alt={data.title}
                  className="h-[220px] md:h-[260px] w-full rounded-t-[16px] transform transition-all duration-500 group-hover:scale-125"
                />
              </div>
              <div className="p-[20px] flex flex-col gap-1">
                <p className="bg-[#E2F0C6] text-[#739233] text-[10px] leading-[14px] tracking-[0.04px] font-bold px-2 py-1 w-fit rounded-[8px]">
                  {data.category}
                </p>
                <h1 className="text-[16px] leading-[24px] md:text-[20px] md:leading-[30px]  font-medium  group-hover:text-white line-clamp-1 ">
                  {data.title}
                </h1>
                <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.04px]  group-hover:text-white line-clamp-2">
                  {data.description}
                </p>
                <Link to="/blog-detail">
                <button className="flex bg-[#34658C] text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px] font-semibold px-6 py-2 text-white items-center gap-1 w-fit rounded-[12px] group-hover:bg-white group-hover:text-[#34658C] mt-2 md:mt-3 font-outfit">
                  View Details
                  <FaArrowRightLong className="w-[16px] h-[16px] md:w-[20px] md:h-[20px] text-white group-hover:text-[#34658C]" />
                </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
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

export default Blogs;
