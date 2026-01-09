import React from "react";
import { IoCalendarClear } from "react-icons/io5";
import { FaUser } from "react-icons/fa";

const BlogDetail = () => {
  return (
    <div className="space-y-[60px] md:space-y-[80px] xl:space-y-[120px]">
      {/* blog detail  */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-[32px] xl:px-[120px] py-[20px] md:py-[40px]">
        <h1 className="text-[28px] tracking-[0.56px] md:text-[36px] md:tracking-[0.72px] xl:text-[48px] leading-[100%] xl:tracking-[0.96px] font-bold text-[#34658C] mb-3">
          Why Regular Sugar Checkups Matter
        </h1>
        <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] xl:text-[20px] xl:leading-[32px] xl:tracking-[0.4px] font-semibold mb-4 md:mb-6">
          Early detection can help prevent diabetes and long-term health
          complications. Here’s why monitoring your sugar levels is important
          for everyone.
        </p>
        {/* image  */}
        <img
          src="/assets/BlogImages/blogdetail.png"
          className="w-full h-[250px] md:h-[380px] xl:h-[460px] mb-4 md:mb-6"
        />
        {/* publish  */}
        <div className="flex flex-col md:flex-row gap-1 md:gap-2 mb-4 md:mb-6 ">
          <div className="flex gap-2 items-center">
            <IoCalendarClear className="w-[16px] h-[16px] md:w-[24px] md:h-[24px] text-[#34658C]" />
            <p className="text-[12px] leading-[20px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.04px]  font-semibold">
              Published on: 12 Nov 2025
            </p>
          </div>
          <span className="hidden md:block">|</span>
          <div className="flex gap-2 items-center">
            <FaUser className="w-[16px] h-[16px] md:w-[24px] md:h-[24px] text-[#34658C]" />
            <p className="text-[12px] leading-[20px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.04px] font-semibold">
              Sehat Mitra Health Team
            </p>
          </div>
        </div>
        {/* homecare btn  */}

        <div className="flex flex-col gap-2 mb-3">
          <button className="bg-[#E2F0C6] text-[12px] leading-[18px] tracking-[0.48px] font-bold px-3 py-2 text-[#739233] rounded-[8px] w-fit">
            Home Care
          </button>
          <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
            Regular sugar monitoring isn’t just for people with diabetes. It
            helps identify early signs of health issues, keeps you aware of
            lifestyle impacts, and supports long-term wellness.
            <br />
            Here’s why these small tests can make a big difference.
          </p>
        </div>

        {/* content  */}
        <div className="flex flex-col gap-3">
          <div className="">
            <h1 className="text-[20px] tracking-[0.4px] md:text-[28px]  md:tracking-[0.56px] font-bold text-[#34658C] mb-2">
              Helps Detect Diabetes Early
            </h1>
            <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
              Diabetes often develops silently. Regular sugar checkups can help
              identify abnormal glucose levels before symptoms appear. Early
              detection allows for:
            </p>
            <ul className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold list-disc px-6">
              <li>Lifestyle changes</li>
              <li>Timely medication</li>
              <li>
                Preventing severe health risks like nerve damage, kidney issues,
                and vision problems
              </li>
            </ul>
          </div>
          <div className="">
            <h1 className="text-[20px] tracking-[0.4px] md:text-[28px]  md:tracking-[0.56px] font-bold text-[#34658C] mb-2">
              Tracks the Impact of Your Daily Habits
            </h1>
            <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
              Food, stress, sleep, and exercise all influence your blood sugar
              levels.
              <br />
              Frequent checkups help you understand how your body responds, so
              you can adjust your routine for better health.
              <br />
              Example insights you may notice:
            </p>

            <ul className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold list-disc px-6">
              <li>High sugar after certain foods</li>
              <li>Drops in sugar after exercise</li>
              <li>Increased sugar during stressful days</li>
            </ul>
          </div>
          <div className="">
            <h1 className="text-[20px] tracking-[0.4px] md:text-[28px]  md:tracking-[0.56px] font-bold text-[#34658C] mb-2">
              Prevents Long-Term Health Complications
            </h1>

            <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
              Uncontrolled sugar levels can affect major organs. Regular
              checkups help avoid:
            </p>

            <ul className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold list-disc px-6">
              <li>Heart disease</li>
              <li>Nerve damage</li>
              <li>Kidney failure</li>
              <li>Eye damage</li>
            </ul>
            <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
              Tracking your sugar levels ensures early action before problems
              become serious.
            </p>
          </div>
          <div className="">
            <h1 className="text-[20px] tracking-[0.4px] md:text-[28px]  md:tracking-[0.56px] font-bold text-[#34658C] mb-2">
              Makes Treatment More Accurate & Effective
            </h1>

            <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
              For people already diagnosed with diabetes, regular monitoring
              helps doctors adjust:
            </p>

            <ul className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold list-disc px-6">
              <li>Medication</li>
              <li>Diet plans</li>
              <li>Insulin dosage</li>
              <li>Lifestyle recommendations</li>
            </ul>
            <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
              It improves treatment accuracy and keeps your health stable.
            </p>
          </div>
          <div className="">
            <h1 className="text-[20px] tracking-[0.4px] md:text-[28px]  md:tracking-[0.56px] font-bold text-[#34658C] mb-2">
              Conclusion
            </h1>

            <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
              Regular sugar checkups are simple, quick, and extremely valuable.
              <br />
              Whether you're monitoring your health or caring for a loved one,
              staying informed makes all the difference.
            </p>
          </div>
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

export default BlogDetail;
