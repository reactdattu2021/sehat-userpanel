import { FaStar, FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { FaUserLarge } from "react-icons/fa6";
// import CHECK from "../../../assets/mdi_tick-circle-outline1.png";

const ReviewItem = ({ item }) => {
  // Static local flags (UI only)
  const isHelpful = item.is_user_marked_helpful;
  const isNotHelpful = item.is_user_marked_not_helpful;

  const handleHelpfulClick = () => {
    console.log("Helpful clicked for review:", item._id);
  };

  const handleNotHelpfulClick = () => {
    console.log("Not Helpful clicked for review:", item._id);
  };

  // Extract user name from userId object
  const userName = item.userId?.firstname && item.userId?.lastname
    ? `${item.userId.firstname} ${item.userId.lastname}`
    : item.userId?.email?.split("@")[0] || "Anonymous";

  return (
    <div className="my-7 border border-[#E9ECEF] rounded-[12px] p-4 hover:shadow-md transition-shadow duration-300">
      {/* USER INFO */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="rounded-full border p-2 bg-gray-50">
            <FaUserLarge className="text-[28px] text-gray-600" />
          </div>

          <div>
            <h5 className="inter font-semibold text-[16px] text-gray-800">
              {userName}
            </h5>

            {/* VERIFIED - Commented out since CHECK image is not available */}
            {/* <div className="flex items-center bg-[#E9F4D2] rounded-[20px] px-[13px] py-[6px] mt-2">
              <img src={CHECK} alt="check" className="w-[14px] h-[14px]" />
              <p className="text-[12px] font-medium text-gray-700">
                Verified Purchase
              </p>
            </div> */}
          </div>
        </div>

        {/* RATING */}
        <div className="flex gap-1 items-center">
          {[1, 2, 3, 4, 5].map((i) => (
            <FaStar
              key={i}
              className={i <= item.rating ? "text-[#A5C63B]" : "text-gray-300"}
            />
          ))}
        </div>
      </div>

      {/* REVIEW TITLE */}
      {item.reviewtitle && (
        <h4 className="text-[#1F4E78] lg:text-[18px] text-[16px] font-semibold mt-3 inter">
          {item.reviewtitle}
        </h4>
      )}

      {/* REVIEW CONTENT */}
      <p className="text-[#4D5358] lg:text-[16px] text-[14px] font-normal mt-2 inter">
        {item.reviewcontent}
      </p>

      {/* RECOMMEND THIS PRODUCT */}
      {item.recommendthisproduct && (
        <p className="text-[#28a745] lg:text-[14px] text-[12px] font-medium mt-2 inter">
          ✓ Recommends this product
        </p>
      )}

      {/* REVIEW IMAGE */}
      {item.reviewimage && (
        <div className="mt-4 flex gap-6 items-center">
          <img
            src={item.reviewimage}
            alt="review-img"
            className="lg:w-[120px] md:w-[96px] w-[72px] lg:h-[120px] h-auto rounded-lg object-cover border border-gray-200"
          />
        </div>
      )}

      {/* HELPFUL */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-[#6C757D] text-[14px] inter">
          Reviewed on:{" "}
          {item.createdAt
            ? new Date(item.createdAt).toLocaleDateString()
            : "—"}
        </p>

        <div>
          {/* <p className="inter text-[14px] text-[#4D5358] font-normal">
            Was this review helpful?
          </p> */}

          <div className="flex gap-2 items-center">
            {/* 👍 */}
            {/* <button
              onClick={handleHelpfulClick}
              className={`flex items-center px-3 py-1 rounded-md ${isHelpful
                  ? "bg-green-50 border border-green-200"
                  : "hover:bg-gray-100"
                } transition-colors duration-200`}
            >
              <FaThumbsUp
                className={`text-[20px] ${isHelpful ? "text-green-600" : "text-[#1F4E78]"
                  }`}
              />
              <span className="text-[#4D5358] text-[14px] inter font-normal ml-2">
                Yes ({item.is_helpful || 0})
              </span>
            </button> */}

            {/* 👎 */}
            {/* <button
              onClick={handleNotHelpfulClick}
              className={`flex items-center px-3 py-1 rounded-md ${isNotHelpful
                  ? "bg-red-50 border border-red-200"
                  : "hover:bg-gray-100"
                } transition-colors duration-200`}
            >
              <FaThumbsDown
                className={`text-[20px] ${isNotHelpful ? "text-red-600" : "text-[#1F4E78]"
                  }`}
              />
              <span className="text-[#4D5358] text-[14px] inter font-normal ml-2">
                No ({item.is_not_helpful || 0})
              </span>
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewItem;
