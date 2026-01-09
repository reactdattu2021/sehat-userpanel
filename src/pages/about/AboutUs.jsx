import React, { useState } from "react";

import {
  CountData,
  HowItWorksData,
  ReviewsData,
  TopHealthServices,
  whySehatMitra,
} from "../../utils/Data";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { MdKeyboardArrowRight } from "react-icons/md";
import { TiStarFullOutline } from "react-icons/ti";

const AboutUs = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const slidesPerView = 3;

  // const lastIndex = ReviewsData.length - slidesPerView;
  const lastIndexReview = ReviewsData.length - slidesPerView;

  return (
    <div className="space-y-[60px] md:space-y-[80px] xl:space-y-[120px]">
      {/* About Sehat Metra */}

      <div className="h-[240px] md:h-[320px] xl:h-[502px] bg-[url('/assets/AboutImages/banner.png')] bg-center bg-cover bg-no-repeat">
        <div className="max-w-[1440px] mx-auto px-5 md:px-[32px]  xl:px-[120px] flex flex-col justify-center h-full">
          <h1 className=" text-[32px] md:text-[48px]  xl:text-[64px] font-semibold text-white ">
            About Sehat Metra
          </h1>
        </div>
      </div>

      {/* Our Story */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-[32px]  xl:px-[120px]">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 xl:gap-8">
          <div className="flex flex-col justify-center h-full">
            <h1 className="text-[28px] tracking-[0.56px] md:text-[36px] md:tracking-[0.72px] xl:text-[48px] xl:leading-[100%] xl:tracking-[0.96px] font-bold text-[#34658C] mb-2  md:mb-3">
              Our Story
            </h1>
            <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
              Sehat Metra is a healthcare platform built to make quality medical
              services accessible to everyone, no matter where they are.
            </p>
            <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
              From a simple sugar or BP checkup to home nurse bookings and lab
              tests, we bring trusted care right to your doorstep.
            </p>
            <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
              Our mission is to remove the stress from finding reliable health
              services.
            </p>
            <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
              {" "}
              With just a few clicks, you can search, compare, and book from
              verified clinics, diagnostic centers, or professional caregivers —
              all near your location.
            </p>
          </div>
          <div>
            
            <img src="/assets/AboutImages/ourStoryImages/ourstoryImage.png" alt="ourStoryImage" className="w-full h-full object-cover"/>
          </div>
        </div>
      </div>

      {/* Why Sehatmitra? */}
      <div className="">
        <div className="bg-[#34658C] ">
          <div className="max-w-[1440px] mx-auto mx-auto px-5 md:px-8   xl:px-[120px] pt-[40px] md:pt-[60px] pb-[120px] md:pb-[180px] ">
            <h1 className="text-[28px] tracking-[0.56px] md:text-[36px] md:tracking-[0.72px] xl:text-[48px] xl:leading-[100%] xl:tracking-[0.96px] font-bold text-white text-center">
              Why Sehatmitra?
            </h1>
          </div>
        </div>
        <div className="max-w-[1440px] mx-auto px-5 md:px-8   xl:px-[120px] grid grid-cols-1 md:grid-cols-2  xl:grid-cols-4 gap-5 -mt-[100px]">
          {whySehatMitra.map((data, index) => (
            <div
              key={index}
              className={`bg-white rounded-[24px] border-[1px] p-[24px] flex flex-col items-center`}
              style={{ borderColor: data.color }}
            >
              <img
                src={data.image}
                alt={data.title}
                className="w-[40px] h-[40px] md:w-[52px] md:h-[52px] xl:w-[66px] xl:h-[66px] mb-4"
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
      </div>

      {/* What We Stand For */}
      <div className="max-w-[1440px] mx-auto  px-5 md:px-8   xl:px-[120px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <img
              src="/assets/AboutImages/whatWeStandForImages/image 19.png"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-3 md:gap-4  xl:gap-6">
            <div className="flex flex-col gap-2 xl:gap-3">
              <h1 className="text-[#34658C] text-[28px] tracking-[0.56px] md:text-[36px] md:tracking-[0.72px] xl:text-[48px] xl:leading-[100%] xl:tracking-[0.96px] font-bold">
                What We Stand For
              </h1>
              <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px]  font-semibold">
                At Sehat Metra, we believe that healthcare should be simple,
                transparent, and compassionate.
                <br /> We’re not just a platform — we’re your companion in
                staying healthy and informed.
                <br />
                Our goal is to bridge the gap between patients and healthcare
                providers, using technology to make every experience smooth,
                safe, and trustworthy.
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-[#34658C] text-[28px] tracking-[0.56px] md:text-[36px] md:tracking-[0.72px] xl:text-[48px] xl:leading-[100%] xl:tracking-[0.96px] font-bold">
                Our Vision
              </h1>
              <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
                To become India’s most trusted healthcare connection — where
                anyone can find, book, and receive medical care quickly,
                affordably, and comfortably from home.
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-[#34658C] text-[28px] tracking-[0.56px] md:text-[36px] md:tracking-[0.72px] xl:text-[48px] xl:leading-[100%] xl:tracking-[0.96px] font-bold">
                Our Mission
              </h1>
              <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
                To make quality healthcare available anytime, anywhere, through
                verified professionals, reliable clinics, and doorstep services
                powered by modern technology.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Promise */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-8   xl:px-[120px]  ">
        <div
          className="rounded-[16px]"
          style={{
            background: "linear-gradient(180deg, #5D84A3 0%, #1D384D 95.04%)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-12  xl:pr-[32px]">
            <div className="order-2 md:order-1 col-span-12 md:col-span-4 md:-mt-[60px] md:-mt-[80px]">
              <img
                src="/assets/AboutImages/OurPromiseImages/image 29 1.png"
                alt="image"
                className="w-[161px]  h-[161px] md:w-[322px] md:h-[322px] xl:w-[467px]  xl:h-[367px]"
              />
            </div>
            <div className="order-1 md:order-2 col-span-12 md:col-span-8 flex flex-col justify-center text-white p-[24px] ">
              <h1 className="text-[28px] tracking-[0.56px] md:text-[36px] md:tracking-[0.72px] xl:text-[48px] xl:leading-[100%] xl:tracking-[0.96px] font-bold">
                Our Promise
              </h1>
              <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px]  font-semibold">
                We’re committed to building a healthier community — one
                connection at a time.
                <br />
                Whether you’re checking your sugar levels, consulting a doctor,
                or caring for a loved one, Sehat Metra ensures trusted
                healthcare is always within reach.
              </p>
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
             <div className="relative  max-w-[250px] md:max-w-[604px] lg:max-w-[704px] xl:max-w-[1200px] mx-auto -mt-[170px] md:-mt-[210px]">
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
                             )
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
            <div className="max-w-[1440px] mx-auto px-5 md:px-[32px] xl:px-[120px] grid grid-cols-2  xl:grid-cols-4 gap-6 pb-[60px] md:pb-[80px] xl:pb-[120px] ">
              {CountData.map((data) => (
                <div key={data.id} className="flex flex-col items-center gap-4 xl:gap-[26px]">
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
    </div>
  );
};

export default AboutUs;
