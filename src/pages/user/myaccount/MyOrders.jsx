import React from 'react'
import { Orders } from '../../../utils/Data'

const MyOrders = () => {
  return (
    <div>
      <h1 className="text-[28px] tracking-[0.56px] md:text-[36px] md:tracking-[0.72px] font-bold text-[#34658C]">
                  Your Orders
                </h1>
                {Orders.map((data, index) => (
                  <div key={index} className="border-b border-[#000000]">
                    <h1 className="text-[16px] tracking-[0.32px] md:text-[20px] md:tracking-[0.4px] font-bold text-[#34658C] mb-3">
                      {data.name}
                    </h1>
                    <div className="flex flex-col md:flex-row gap-1 md:gap-6 mb-3">
                      <p className="text-[12px] leading-[20px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
                        Shipment ID:{" "}
                        <span className="text-[12px] leading-[20px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-normal">
                          {data.orderId}
                        </span>
                      </p>
                      <p className="text-[12px] leading-[20px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold ">
                        Est. Delivery:{" "}
                        <span className="text-[12px] leading-[20px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-normal">
                          {data.estDelivery}
                        </span>
                      </p>
                    </div>
                    <div className="grid grid-cols-12 gap-5 mb-5">
                      <div className=" col-span-4">
                        <img
                          src={data.image}
                          alt={data.name}
                          className="w-[100px] h-[100px] md:w-[120px] md:h-[120px]"
                        />
                      </div>
                      <div className="col-span-8 flex flex-col gap-2 text-[12px] leading-[20px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px]">
                        <p className="font-semibold">
                          Rental Cost:{" "}
                          <span className="font-normal">{data.cost}</span>
                        </p>
                        <p className="font-semibold">
                          Rental Duration:{" "}
                          <span className="font-normal">{data.duration}</span>
                        </p>
                        <p className="font-semibold">
                          Security Deposit:{" "}
                          <span className="font-normal">{data.deposit}</span>
                        </p>
                        <p className="font-semibold">
                          Qty: <span className="font-normal">{data.qty}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
    </div>
  )
}

export default MyOrders