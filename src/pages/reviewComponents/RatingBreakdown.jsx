import { FaStar } from "react-icons/fa";

const RatingBreakdown = ({ ratingPercentages, ratingBreakdown }) => {
  return (
    <div className="mt-4 lg:mt-0">
      {/* Main container */}
      <div className="w-full max-w-full md:w-[495px] h-auto lg:h-[133px] bg-white rounded-lg p-3 lg:p-0">
        <div className="h-full flex flex-col justify-between space-y-2 lg:space-y-0">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center">
              {/* Rating number - responsive sizing */}
              <div className="w-6 lg:w-8 text-right mr-2 lg:mr-3">
                <span className="font-bold text-sm lg:text-base text-gray-800">
                  {rating}
                </span>
              </div>

              {/* Star icon - responsive sizing */}
              <div className="mr-1 lg:mr-2">
                <FaStar className="text-[#A5C63B] text-sm lg:text-base" />
              </div>

              {/* Progress bar - main element */}
              <div className="flex-1 min-w-0 mx-1 lg:mx-0">
                <div className="w-full h-2.5 lg:h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#A5C63B] rounded-full transition-all duration-500"
                    style={{ width: `${ratingPercentages[rating] || 0}%` }}
                  ></div>
                </div>
              </div>

              {/* Percentage - responsive text size */}
              <div className="w-10 lg:w-12 text-right ml-2 lg:ml-3">
                <span className="font-semibold text-sm lg:text-base text-gray-800 whitespace-nowrap">
                  {ratingPercentages[rating] || 0}%
                </span>
              </div>

              {/* Count - hide on small screens, show on medium+ */}
              <div className="w-8 lg:w-10 text-right ml-1 lg:ml-2 hidden md:block">
                <span className="text-gray-600 text-xs lg:text-sm">
                  ({ratingBreakdown[rating] || 0})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RatingBreakdown;
