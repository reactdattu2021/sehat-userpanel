import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Summary } from "../../utils/Data";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropup } from "react-icons/io";
import { BiEdit } from "react-icons/bi";
import Stepper from "../commonComponents/Stepper";

const CheckOut = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address1: "",
    address2: "",
    pincode: "",
    city: "",
    state: "",
    country: "",
  });

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const renderForm = () => {
    return (
      <div>
        <h1 className="text-[24px] tracking-[0.48px] font-semibold">
          Add Address{" "}
        </h1>

        <form className="space-y-3" onSubmit={handleSaveAddress}>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="px-4 py-3 rounded-[8px] border border-black w-full text-[16px] leading-[26px] tracking-[0.64px] text-[#6D6D6D] font-semibold"
              placeholder="Name*"
            />

            <input
              type="number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="px-4 py-3 rounded-[8px] border border-black w-full text-[16px] leading-[26px] tracking-[0.64px] text-[#6D6D6D] font-semibold"
              placeholder="Mobile Number*"
            />
          </div>
          <div className="grid grid-cols-1">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="px-4 py-3 rounded-[8px] border border-black w-full text-[16px] leading-[26px] tracking-[0.64px] text-[#6D6D6D] font-semibold"
              placeholder="Email*"
            />
          </div>
          <div className="grid grid-cols-1">
            <input
              type="text"
              name="address1"
              value={formData.address1}
              onChange={handleChange}
              className="px-4 py-3 rounded-[8px] border border-black w-full text-[16px] leading-[26px] tracking-[0.64px] text-[#6D6D6D] font-semibold"
              placeholder="Address1*"
            />
          </div>
          <div className="grid grid-cols-1 ">
            <input
              type="text"
              name="address2"
              value={formData.address2}
              onChange={handleChange}
              className="px-4 py-3 rounded-[8px] border border-black w-full text-[16px] leading-[26px] tracking-[0.64px] text-[#6D6D6D] font-semibold"
              placeholder="Address2*"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              className="px-4 py-3 rounded-[8px] border border-black w-full text-[16px] leading-[26px] tracking-[0.64px] text-[#6D6D6D] font-semibold"
              placeholder="Pincode*"
            />
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="px-4 py-3 rounded-[8px] border border-black w-full text-[16px] leading-[26px] tracking-[0.64px] text-[#6D6D6D] font-semibold"
              placeholder="City*"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="px-4 py-3 rounded-[8px] border border-black w-full text-[16px] leading-[26px] tracking-[0.64px] text-[#6D6D6D] font-semibold"
              placeholder="State*"
            />

            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="px-4 py-3 rounded-[8px] border border-black w-full text-[16px] leading-[26px] tracking-[0.64px] text-[#6D6D6D] font-semibold"
              placeholder="Country*"
            />
          </div>
          <button
            type="submit"
            className="bg-[#A2CD48] w-full px-6 py-3 rounded-[8px] text-white text-[20px] tracking-[0.04px] font-semibold"
          >
            Save Address
          </button>
        </form>
      </div>
    );
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSaveAddress = (e) => {
    e.preventDefault();
    const newAddress = { id: Date.now(), ...formData };
    setAddresses([...addresses, newAddress]);
    setShowModal(false); // close modal
    setFormData({
      // clear form
      name: "",
      phone: "",
      email: "",
      address1: "",
      address2: "",
      pincode: "",
      city: "",
      state: "",
      country: "",
    });
  };

  return (
    <div className="max-w-[1440px] mx-auto px-5 md:px-8 xl:px-[120px]">
      <Stepper currentStep="checkout" />

      <div className="grid grid-cols-12 gap-6  pb-[60px] md:pb-[80px] xl:pb-[120px]">
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-4 md:gap-6 xl:gap-8">
          <h1 className="text-[20px] tracking-[0.4px] md:text-[24px] md:tracking-[0.28px] font-semibold font-outfit">
            Select Delivery Address
          </h1>
          {addresses.length === 0 ? (
            <> {renderForm()} </>
          ) : (
            <>
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-[#34658C] text-white rounded-[12px] text-[16px] tracking-[0.32px] font-semibold w-fit md:w-[290px] font-outfit"
              >
                + Add New Address
              </button>

              {/* saved address  */}
              <div>
                {addresses.map((addr, index) => (
                  <div
                    key={index}
                    className={`bg-[#EBF0F4] grid  grid-cols-12 gap-4 rounded-[12px] p-[24px] `}
                  >
                    <div className="col-span-1 flex items-center">
                      <input
                        type="radio"
                        name="selectedAddress"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="w-[12px] h-[12px]  md:w-[16px] md:h-[16px]"
                      />
                    </div>
                    <div className="col-span-9 md:col-span-8 flex flex-col gap-1 md:gap-2 w-full h-full">
                      <p className="text-[16px] leading-[26px] tracking-[0.64px] md:text-[24px] md:leading-[32px] md:tracking-[0.96px] font-bold">
                        {addr.name}
                      </p>
                      <p className="text-[14px] leading-[22px] tracking-[0.56px] font-semibold   ">
                        {addr.address1},{addr.address2}, {addr.city},{" "}
                        {addr.state}, {addr.pincode},{addr.country}
                      </p>
                      <p className="text-[14px] leading-[26px] tracking-[0.28px] md:text-[20px] md:leading-[32px] md:tracking-[0.8px] font-semibold w-full ">
                        Contact Number {addr.phone}
                      </p>
                    </div>
                    <div className="col-span-2 md:col-span-3 flex justify-end items-start h-full">
                      <BiEdit className="w-[20px] h-[20px]  md:w-[24px] md:h-[24px] text-[#A2CD48]" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
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
                  <h1 className="text-[#34658C] text-[16px] tracking-[0.32px] md:text-[20px] md:tracking-[0.4px] font-medium">
                    {data.name}
                  </h1>
                  <div className="flex gap-3">
                    <p className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]">
                      ({data.quantity})
                    </p>
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
                      <span className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]">
                        {data.cost}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-bold">Rental Duration:</span>
                      <span className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]">
                        {data.duration}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-bold">Tax:</span>
                      <span className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]">
                        {data.tax}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-bold">Shipping:</span>
                      <span className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]">
                        {data.shipping}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-bold">
                        Refundable Security Deposit:
                      </span>
                      <span className="text-[14px] leading-[22px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.56px]">
                        {data.deposit}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            ))}

            <div className="py-3 flex flex-col gap-4 md:gap-6">
              <p className="text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px] font-medium font-outfit ">
                Have a Coupons?{" "}
                <span className="text-[#A2CD48]">Apply Here</span>
              </p>
              <div className="flex justify-between font-outfit">
                <p className="text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px] font-semibold">
                  Total Amount :
                </p>
                <p className="text-[16px] tracking-[0.32px] md:text-[20px] md:tracking-[0.4px] font-semibold">
                  ₹4,800.00/-
                </p>
              </div>
            </div>
            <Link to="/payment">
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

export default CheckOut;
