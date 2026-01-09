import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import Stepper from "../commonComponents/Stepper";
import { IoCheckmarkSharp } from "react-icons/io5";
import { Link } from "react-router-dom";

const Payment = () => {
  return (
    <div className="max-w-[1440px] mx-auto px-5 md:px-8 xl:px-[120px] ">
      <Stepper currentStep="payment" />
      <div className="grid grid-cols-12 gap-6 pb-[60px] md:pb-[80px] xl:pb-[120px]">
        <div className=" col-span-12 lg:col-span-7 flex flex-col gap-6">
          <div
            className="p-4 md:p-[32px] rounded-[24px] "
            style={{
              boxShadow: "0px 0px 4px 0px #00000040",
            }}
          >
            <div className="flex gap-3 items-center mb-2">
              <input
                type="radio"
                className="w-[16px] h-[16px] accent-[#34658C]"
              />
              <p className="text-[16px] tracking-[0.32px] md:text-[20px] md:tracking-[0.4px] font-bold font-outfit">
                Online Payment
              </p>
            </div>
            <div className="flex flex-col gap-2 mb-[22px]">
              <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold ">
                UPI / Net Banking / Debit / Credit Card
              </p>
              <div className="flex gap-2">
                <IoCheckmarkSharp className="w-[24px] h-[24px] text-[#109C19]" />
                <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
                  Instant Confirmation
                </p>
              </div>
              <div className="flex gap-2">
                <IoCheckmarkSharp className="w-[24px] h-[24px] text-[#109C19]" />
                <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
                  Secure & Fast
                </p>
              </div>
            </div>

            <div className="flex gap-3 items-center mb-2">
              <input
                type="radio"
                className="w-[16px] h-[16px] border-[#C5C5C5]"
              />
              <p className="text-[16px] tracking-[0.32px] md:text-[20px] md:tracking-[0.4px] font-bold font-outfit">
                Cash on Delivery
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
                Pay at time of service / product delivery
              </p>
              <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
                Extra ₹xxx handing charges
              </p>
            </div>
          </div>
          <div className="flex gap-6 md:gap-8">
            <img
              src="/assets/paymentImages/Gpay.png"
              alt="gpay"
              className="h-[22px]"
            />
            <img
              src="/assets/paymentImages/paytm.png"
              alt="paytm"
              className="h-[22px]"
            />
            <img
              src="/assets/paymentImages/phonepay.png"
              alt="ppay"
              className="h-[22px]"
            />
            <img
              src="/assets/paymentImages/amazonpay.png"
              alt="amazonpay"
              className="h-[22px]"
            />
          </div>
          <Link to='/thankyou'>
          <button className="font-outfit bg-[#A2CD48] px-6 py-3 rounded-[8px] text-[16px] tracking-[0.32px] md:text-[20px] md:tracking-[0.4px] font-bold w-fit text-white">
            Continue to Pay
          </button>
          </Link>
        </div>
        <div className="col-span-12 lg:col-span-5">
          <div className="bg-[#EBF0F4] p-[24px] rounded-[12px] flex flex-col gap-1">
            <h1 className="text-[20px] leading-[30px] tracking-[0.4px] md:text-[24px]  md:leading-[32px] md:tracking-[0.96px] font-bold ">
              Delivering To
            </h1>
            <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
              Ramya Sree
              <br />
              Prestige Enclave, Yousufguda, Labour Adda Road, Ameerpet,
              Hyderabad <br /> District, Hyderabad1
            </p>
            <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
              {" "}
              Contact Number 7995642691
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
