import React, { useRef, useState } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";

const MyAddress = () => {
  const [openEditIndex, setOpenEditIndex] = useState(null);
  const modalRef = useRef(null);

  return (
    <>
      <div>
        <div>
          <h1 className="text-[20px] tracking-[0.4px] md:text-[24px] md:tracking-[0.48px] xl:text-[28px] xl:tracking-[0.56px] font-semibold mb-4">
            My Address
          </h1>
          <button className="font-outfit bg-[#A2CD48]  text-white px-6 py-3 text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px] font-semibold rounded-[8px] mb-[22px]">
            + Add New Address
          </button>
          <div >
            <div className="flex justify-between">
              <h1 className="text-[16px] leading-[32px] tracking-[0.64px]  md:text-[20px] md:leading-[32px] md:tracking-[0.8px] font-bold">
                Ramya Sree
              </h1>
              <HiOutlineDotsVertical className="w-[20px] h-[20px]  md:w-[24px] md:h-[24px] cursor-pointer" />
            </div>
            <p className="text-[12px] leading-[20px] tracking-[0.48px] md:text-[14px] md:leading-[22px] md:tracking-[0.56px] font-semibold ">
              Prestige Enclave, Yousufguda, Labour Adda Road, Ameerpet,
              Hyderabad District, Hyderabad
            </p>
          </div>
          <hr className=" border-b-[1px] border-[#3D3D3D] my-4 md:my-6"/>
          
           <div className="">
            <div className="flex justify-between">
              <h1 className="text-[16px] leading-[32px] tracking-[0.64px]  md:text-[20px] md:leading-[32px] md:tracking-[0.8px] font-bold">
                Ramya Sree
              </h1>
              <HiOutlineDotsVertical className="w-[20px] h-[20px]  md:w-[24px] md:h-[24px] cursor-pointer" />
            </div>
            <p className="text-[12px] leading-[20px] tracking-[0.48px] md:text-[14px] md:leading-[22px] md:tracking-[0.56px] font-semibold ">
              Prestige Enclave, Yousufguda, Labour Adda Road, Ameerpet,
              Hyderabad District, Hyderabad
            </p>
          </div>
          <hr className=" border-b-[1px] border-[#3D3D3D] my-6"/>
        </div>
      </div>
    </>
  );
};

export default MyAddress;
