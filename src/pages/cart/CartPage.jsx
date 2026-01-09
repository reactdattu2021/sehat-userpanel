import React, { useEffect, useRef, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { Products, Services, Summary } from "../../utils/Data";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropup } from "react-icons/io";
import { Link } from "react-router-dom";
import CartStepper from "../commonComponents/Stepper";
import Stepper from "../commonComponents/Stepper";

const CartPage = () => {
  const [openEditIndex, setOpenEditIndex] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);

  const modalRef = useRef(null);
  // Close modal if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setOpenEditIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-[1440px]  mx-auto px-5 md:px-8 xl:px-[120px]">
      
      <Stepper currentStep="cart"/>
      {/* Your Products */}
      <div className="grid grid-cols-12 lg:grid-cols-12 gap-6  pb-[60px] md:pb-[80px] xl:pb-[120px]">
        <div className="col-span-12 lg:col-span-7">
          <div>
            <h1 className="text-[20px] tracking-[0.4px] md:text-[24px] md:tracking-[0.48px] font-semibold my-3">
              Your Products
            </h1>
            {Products.map((data, index) => (
              <div key={index} className="p-3 md:p-5 xl:p-[24px] border-b border-[#3D3D3D]">
                <div className="grid  grid-cols-12 gap-2">
                  <div className=" col-span-1 md:col-span-2 flex justify-start items-center">
                    <input type="checkbox" />
                  </div>

                  <div className="col-span-4 md:col-span-3">
                    <img src={data.image} className="w-[100px] h-[100px] md:w-[140px] md:h-[140px]" />
                  </div>
                  <div className="col-span-6 md:col-span-5">
                    <h1 className="text-[16px] tracking-[0.32px] md:text-[20px] md:tracking-[0.4px] font-semibold text-[#34658C] mb-[6px]">
                      {data.name}
                    </h1>
                    <div className="flex flex-col gap-[2px]">
                      <p className="text-[12px] leading-[20px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-bold">
                        Rental Duration:{" "}
                        <span className="font-normal">{data.duration}</span>
                      </p>
                      <p className="text-[12px] leading-[20px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-bold">
                        Start Date:{" "}
                        <span className="font-normal">{data.date}</span>
                      </p>
                      <p className="text-[12px] leading-[20px] tracking-[0.48px] md:text-[14px] md:leading-[26px] md:tracking-[0.56px] font-bold">
                        Qty:{" "}
                        <span className="font-normal">{data.quantity}</span>
                      </p>
                    </div>
                  </div>
                  <div
                    className="col-span-1 md:col-span-2 flex justify-end relative"
                    onClick={() => setOpenEditIndex(index)}
                  >
                    <HiOutlineDotsVertical className="w-[16px] h-[16px] md:w-[24px] md:h-[24px] cursor-pointer" />
                    {openEditIndex === index && (
                      <div
                        ref={modalRef}
                        className="absolute  right-[-50%] top-[25%] bg-white w-[70px] md:w-[105px] p-2 md:p-3   flex flex-col gap-2 rounded-[12px] z-50 items-start"
                        style={{ boxShadow: "0px 0px 4px 0px #00000040" }}
                      >
                        <button className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]  text-[#3D3D3D] font-semibold  ">
                          Edit
                        </button>
                        <button className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]  text-[#3D3D3D] font-semibold  ">
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div>
            <h1 className="text-[20px] tracking-[0.4px] md:text-[24px] md:tracking-[0.48px] font-semibold my-3">
              Your Services
            </h1>
            {Services.map((data, index) => (
              <div key={index} className="p-3 md:p-5 xl:p-[24px] border-b border-[#3D3D3D]">
                <div className="grid grid-cols-12 gap-2">
                  <div className="col-span-1 md:col-span-2 flex justify-start items-center">
                    <input type="checkbox" />
                  </div>

                  <div className="col-span-4 md:col-span-3">
                    <img src={data.image} className="w-[100px] h-[100px] md:w-[140px] md:h-[140px]" />
                  </div>
                  <div className="col-span-6 md:col-span-5">
                    <h1 className="text-[20px] tracking-[0.4px] font-semibold text-[#34658C] mb-[6px]">
                      {data.name}
                    </h1>
                    <div className="flex flex-col gap-[2px]">
                      <p className="text-[12px] leading-[20px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-bold">
                        Rental Duration:{" "}
                        <span className="font-normal">{data.duration}</span>
                      </p>
                      <p className="text-[12px] leading-[20px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-bold">
                        Start Date:{" "}
                        <span className="font-normal">{data.date}</span>
                      </p>
                      <p className="text-[12px] leading-[20px] tracking-[0.48px] md:text-[14px] md:leading-[26px] md:tracking-[0.56px] font-bold">
                        Time: <span className="font-normal">{data.time}</span>
                      </p>
                    </div>
                  </div>
                  <div
                    className="col-span-1 md:col-span-2  flex justify-end relative"
                    onClick={() => setOpenEditIndex(index)}
                  >
                    <HiOutlineDotsVertical className="w-[16px] h-[16px] md:w-[24px] md:h-[24px] cursor-pointer" />
                    {openEditIndex === index && (
                      <div
                        ref={modalRef}
                        className="absolute right-[-50%] top-[25%] bg-white w-[70px] md:w-[105px] p-2 md:p-3  flex flex-col gap-2 rounded-[12px] z-50 items-start"
                        style={{ boxShadow: "0px 0px 4px 0px #00000040" }}
                      >
                        <button className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]  text-[#3D3D3D] font-semibold  ">
                          Edit
                        </button>
                        <button className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]  text-[#3D3D3D] font-semibold  ">
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5 flex flex-col h-full justify-center">
          <div
            className="p-4 md:p-[32px] rounded-[32px]"
            style={{ boxShadow: "0px 0px 4px 0px #00000040" }}
          >
            <h1 className="text-[20px] tracking-[0.4px] md:text-[24px] md:tracking-[0.48px] mb-6 font-medium">
              Rent Cost Summary
            </h1>
            {Summary.map((data, index) => (
              <div key={index} className="border-b  border-[#34658C] ">
                <div
                  className="flex justify-between my-6"
                  onClick={() => toggleAccordion(index)}
                >
                  <h1 className="text-[#34658C] text-[16px] tracking-[0.32px] md:text-[20px] md:tracking-[0.4px] font-medium">{data.name}</h1>
                  <div className="flex gap-3">
                    <p className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]">({data.quantity})</p>
                    {openIndex === index ? (
                      <IoMdArrowDropdown className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] text-[#3D3D3D]" />
                    ) : (
                      <IoMdArrowDropup className="w-[20px] h-[20px] md:w-[24px] md:h-[24px] text-[#3D3D3D]" />
                    )}
                  </div>
                </div>
               
                {openIndex === index && (
                  <div className="my-6 flex flex-col gap-2 text-[12px] leading-[22px] tracking-[0.48px] md:text-[14px] leading-[26px] tracking-[0.48px]">
                    <p className="flex justify-between">
                      <span className="font-bold">Rental Cost:</span>
                      <span className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]">{data.cost}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-bold">Rental Duration:</span>
                      <span className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]">{data.duration}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-bold">Tax:</span>
                      <span className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]">{data.tax}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-bold">Shipping:</span>
                      <span className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]">{data.shipping}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-bold">
                        Refundable Security Deposit:
                      </span>
                      <span className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]">{data.deposit}</span>
                    </p>
                  </div>
                )}
               
              </div>
            ))}

            <div className="py-3 flex flex-col gap-4 md:gap-6">

            <p className="text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px] font-medium font-outfit ">Have a Coupons? <span className="text-[#A2CD48]">Apply Here</span></p>
            <div className="flex justify-between font-outfit">
              <p className="text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px] font-semibold">Total Amount :</p>
              <p className="text-[16px] tracking-[0.32px] md:text-[20px] md:tracking-[0.4px] font-semibold">₹4,800.00/-</p>
              
            </div>

           </div>
           <Link to="/checkout">
           <button className="text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px] font-semibold bg-[#34658C] w-full px-6 py-3 rounded-[12px] text-white font-outfit">
            Proceed to Checkout
           </button>
           </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
