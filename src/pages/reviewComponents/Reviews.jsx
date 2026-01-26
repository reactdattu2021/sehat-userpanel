import { useState, useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { toast } from "react-toastify";
// import NOREVIEWS from "../../../assets/9583842.png";
import RatingBreakdown from "./RatingBreakdown";
import ReviewItem from "./ReviewItem";
import { getReviewsApi } from "../../apis/authapis";

function Reviews({ productId, productType, onWriteReview }) {
  // State for reviews data
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Rating statistics from API
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [ratingBreakdown, setRatingBreakdown] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });
  const [ratingPercentages, setRatingPercentages] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  // Fetch reviews when component mounts or productId/productType changes
  useEffect(() => {
    const fetchReviews = async () => {
      if (!productId || !productType) {
        console.log("Missing productId or productType");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log("Fetching reviews for:", { productId, productType, currentPage, limit });

        const response = await getReviewsApi(productId, productType, currentPage, limit);

        console.log("Reviews API Response:", response.data);

        if (response.data.success) {
          const { reviews, averageRating, count, totalRatings, fiveStar, fourStar, threeStar, twoStar, oneStar } = response.data.data;

          setReviews(reviews || []);
          setAverageRating(averageRating || 0);
          setTotalReviews(totalRatings || 0);

          // Set rating breakdown
          const breakdown = {
            5: fiveStar || 0,
            4: fourStar || 0,
            3: threeStar || 0,
            2: twoStar || 0,
            1: oneStar || 0,
          };
          setRatingBreakdown(breakdown);

          // Calculate percentages
          const total = totalRatings || 1; // Avoid division by zero
          const percentages = {
            5: Math.round((fiveStar / total) * 100) || 0,
            4: Math.round((fourStar / total) * 100) || 0,
            3: Math.round((threeStar / total) * 100) || 0,
            2: Math.round((twoStar / total) * 100) || 0,
            1: Math.round((oneStar / total) * 100) || 0,
          };
          setRatingPercentages(percentages);
        } else {
          setError(response.data.message || "Failed to fetch reviews");
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError(err.response?.data?.message || "Failed to load reviews");
        // Don't show toast for no reviews, just set empty state
        // if (err.response?.status !== 404) {
        //   toast.error("Failed to load reviews");
        // }
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [productId, productType, currentPage, limit]);

  const totalReviewsWithText = reviews.length;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-center inter font-semibold text-[20px] text-gray-500">
          Loading reviews...
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* CUSTOMER REVIEW HEADER */}
      {reviews.length >= 0 && (
        <div>
          <h2 className="lg:text-[32px] md:text-[28px] text-[24px] inter font-bold">
            Customer Reviews
          </h2>

          <div className="lg:flex items-center justify-between">
            <div className="md:flex items-center gap-9 mt-5">
              <div>
                <div className="flex items-center gap-4">
                  {/* STARS */}
                  <div className="flex gap-2 items-center">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <FaStar
                        key={n}
                        className={
                          n <= Math.round(averageRating)
                            ? "text-[#A5C63B]"
                            : "text-gray-300"
                        }
                      />
                    ))}
                  </div>

                  {/* AVERAGE RATING */}
                  <p className="text-[#1F4E78] font-bold lg:text-[48px] md:text-[32px] text-[24px]">
                    {averageRating.toFixed(1)}
                  </p>
                </div>

                {/* TOTALS */}
                <p className="text-[#4D5358] inter lg:text-[16px] md:text-[14px] text-[12px] lg:mt-3">
                  {totalReviews} Ratings | {totalReviewsWithText} Reviews
                </p>
              </div>

              {/* RATING BREAKDOWN */}
              <RatingBreakdown
                ratingPercentages={ratingPercentages}
                ratingBreakdown={ratingBreakdown}
              />
            </div>

            <button
              onClick={onWriteReview}
              className="lg:mt-0 mt-4 rounded-[8px] border border-[#1F4E78] text-[#1F4E78] text-[16px] font-semibold lg:px-[32px] px-[28px] lg:py-[10px] py-[8px] hover:bg-[#1F4E78] hover:text-white transition-colors duration-300"
            >
              Write a Review
            </button>
          </div>
        </div>
      )}

      {/* REVIEW LIST */}
      <div className="mt-6">
        {reviews.length === 0 && (
          <div className="flex flex-col justify-center items-center py-12">
            {/* <img
              src={NOREVIEWS}
              alt="reviews"
              className="w-[200px] h-[200px]"
            /> */}

            <p className="text-center inter font-bold text-[28px] mt-8">
              No reviews found for this product
            </p>
          </div>
        )}

        {reviews.map((item) => (
          <ReviewItem key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
}

export default Reviews;
