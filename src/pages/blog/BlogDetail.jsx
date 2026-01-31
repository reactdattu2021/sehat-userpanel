import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { IoCalendarClear } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { getBlogByIdApi, subscribeApi } from "../../apis/authapis";
import { toast } from "react-toastify";

const BlogDetail = () => {
  const { blogId } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUseOfProduct, setShowUseOfProduct] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    if (blogId) {
      fetchBlogDetails();
    }
  }, [blogId]);

  const fetchBlogDetails = async () => {
    try {
      setLoading(true);
      const response = await getBlogByIdApi(blogId);
      if (response.data.success) {
        setBlog(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching blog details:", err);
      setError("Failed to load blog details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: "2-digit", month: "short", year: "numeric" };
    return date.toLocaleDateString("en-GB", options);
  };

  const handleSubscribe = async () => {
    if (!subscribeEmail.trim()) {
      toast.error("Please enter your email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(subscribeEmail)) {
      toast.error("Please enter a valid email");
      return;
    }

    try {
      const res = await subscribeApi(subscribeEmail);

      if (res?.data?.success) {
        toast.success("Subscribed successfully 🎉");
        setIsSubscribed(true);
      }
      // ✅ HANDLE ALREADY SUBSCRIBED
      else if (res?.data?.statuscode === 409) {
        toast.info(res.data.message);
        setIsSubscribed(true);
      } else {
        toast.error(res?.data?.message || "Subscription failed");
      }
    } catch (error) {
      console.error("Subscribe error:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-5 md:px-[32px] xl:px-[120px] py-[60px] text-center">
        <p className="text-[16px] text-gray-600">Loading blog details...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-[1440px] mx-auto px-5 md:px-[32px] xl:px-[120px] py-[60px] text-center">
        <p className="text-[16px] text-red-600">{error || "Blog not found"}</p>
      </div>
    );
  }
  return (
    <div className="space-y-[60px] md:space-y-[80px] xl:space-y-[120px]">
      {/* blog detail  */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-[32px] xl:px-[120px] py-[20px] md:py-[40px]">
        <h1 className="text-[28px] tracking-[0.56px] md:text-[36px] md:tracking-[0.72px] xl:text-[48px] leading-[100%] xl:tracking-[0.96px] font-bold text-[#34658C] mb-3">
          {blog.title}
        </h1>
        <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] xl:text-[20px] xl:leading-[32px] xl:tracking-[0.4px] font-semibold mb-4 md:mb-6">
          {blog.description}
        </p>
        {/* image  */}
        <img
          src={blog.blogimage}
          alt={blog.title}
          className="w-full h-[250px] md:h-[380px] xl:h-[460px] mb-4 md:mb-6 object-cover"
        />
        {/* publish  */}
        <div className="flex flex-col md:flex-row gap-1 md:gap-2 mb-4 md:mb-6 ">
          <div className="flex gap-2 items-center">
            <IoCalendarClear className="w-[16px] h-[16px] md:w-[24px] md:h-[24px] text-[#34658C]" />
            <p className="text-[12px] leading-[20px] tracking-[0.48px] md:text-[16px] md:leading-[26px] md:tracking-[0.04px]  font-semibold">
              Published on: {formatDate(blog.createdAt)}
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
          <button
            onClick={() => setShowUseOfProduct((prev) => !prev)}
            className="bg-[#E2F0C6] text-[12px] leading-[18px] tracking-[0.48px] font-bold px-3 py-2 text-[#739233] rounded-[8px] w-fit cursor-pointer"
          >
            {blog.category}
          </button>
          {showUseOfProduct && blog.useofproduct && (
            <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold whitespace-pre-line">
              {blog.useofproduct}
            </p>
          )}
        </div>

        {/* content  */}
        <div className="flex flex-col gap-3">
          {blog.sections &&
            blog.sections.map((section, index) => (
              <div key={section._id || index}>
                <h1 className="text-[20px] tracking-[0.4px] md:text-[28px]  md:tracking-[0.56px] font-bold text-[#34658C] mb-2">
                  {section.heading}
                </h1>
                <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
                  {section.description}
                </p>
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold list-disc px-6">
                    {section.bullets.map((bullet, bulletIndex) => (
                      <li key={bulletIndex}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

          {/* Conclusion / Recommended Products */}
          {blog.recommendedProducts && (
            <div>
              <h1 className="text-[20px] tracking-[0.4px] md:text-[28px]  md:tracking-[0.56px] font-bold text-[#34658C] mb-2">
                Conclusion
              </h1>
              <p className="text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] font-semibold">
                {blog.recommendedProducts}
              </p>
            </div>
          )}
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
                  and special service offers â€” straight to your inbox.
                </p>
              </div>
              <div className="flex flex-col md:flex-row gap-3 justify-center">
                <input
                  type="email"
                  placeholder="Enter your Email Address"
                  value={subscribeEmail}
                  disabled={isSubscribed}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  className="font-semibold text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px]  border-[1px] border-[#FFFFFF] w-full md:w-[386px] bg-transparent px-6 py-3 rounded-[16px] disabled:opacity-60"
                />
                <button
                  onClick={handleSubscribe}
                  disabled={isSubscribed}
                  className="bg-[#FFFFFF] font-semibold text-[14px] leading-[22px] tracking-[0.56px] md:text-[16px] md:leading-[26px] md:tracking-[0.64px] text-[#34658C] px-6 py-3 rounded-[16px] w-full md:w-fit disabled:opacity-60"
                >
                  {isSubscribed ? "Subscribed ✓" : "Subscribe"}
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
