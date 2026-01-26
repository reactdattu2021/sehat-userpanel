import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { toast } from "react-toastify";
import { postReviewApi } from "../../apis/authapis";

function ReviewModal({
  productId,
  productType,
  open,
  onClose,
  onReviewSubmitted,
}) {
  // Local states for form inputs
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [headline, setHeadline] = useState("");
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [recommend, setRecommend] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal visibility
  if (!open) return null;

  // Reset form
  const resetForm = () => {
    setRating(0);
    setHover(null);
    setHeadline("");
    setMessage("");
    setImage(null);
    setRecommend(true);
  };

  // Submit handler with API integration
  const submitReview = async () => {
    // Validation
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    // if (!headline.trim()) {
    //   toast.error("Please enter a headline");
    //   return;
    // }

    // if (!message.trim()) {
    //   toast.error("Please enter your review message");
    //   return;
    // }

    if (!productId || !productType) {
      toast.error("Product information is missing");
      return;
    }

    try {
      setIsSubmitting(true);

      // Prepare review data
      const reviewData = {
        rating: rating,
        reviewtitle: headline.trim(),
        reviewcontent: message.trim(),
        recommendthisproduct: recommend,
      };

      // Add image if provided
      if (image) {
        reviewData.reviewimage = image;
      }

      // Call API
      const response = await postReviewApi(productId, productType, reviewData);

      if (response.data.success) {
        toast.success("Review posted successfully!");
        resetForm();
        onClose();

        // Callback to refresh reviews if provided
        if (onReviewSubmitted) {
          onReviewSubmitted();
        }
      } else {
        toast.error(response.data.message || "Failed to post review");
      }
    } catch (error) {
      console.error("Error posting review:", error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 401) {
        toast.error("Please login to post a review");
      } else {
        toast.error("Failed to post review. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[90%] max-w-xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <div className="flex justify-end">
          <IoClose
            className="text-[24px] cursor-pointer shadow-xl"
            onClick={handleClose}
          />
        </div>

        <h2 className="md:text-[28px] text-[24px] inter font-bold mb-4">
          Write a Review
        </h2>

        {/* Rating */}
        <label className="font-medium inter">Rating *</label>
        <div className="flex gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={28}
              className="cursor-pointer transition"
              color={(hover || rating) >= star ? "#facc15" : "#d1d5db"}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(null)}
            />
          ))}
        </div>

        {/* Headline */}
        <label className="font-medium inter">Headline *</label>
        <input
          type="text"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="What's most important to know?"
          className="border border-[#6C757D] rounded-[12px] outline-none p-2 w-full mb-3"
          disabled={isSubmitting}
        />

        {/* Message */}
        <label className="font-medium inter">Message *</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share your experience with this product/service"
          className="border border-[#6C757D] rounded-[12px] outline-none p-2 w-full h-[100px] mb-3"
          disabled={isSubmitting}
        />

        {/* Recommend Checkbox */}
        <div className="mb-4">
          <label className="flex items-center gap-2 font-medium inter cursor-pointer">
            <input
              type="checkbox"
              checked={recommend}
              onChange={(e) => setRecommend(e.target.checked)}
              className="w-4 h-4 accent-[#1F4E78]"
              disabled={isSubmitting}
            />
            I recommend this product/service
          </label>
        </div>

        {/* Image */}
        {productType === "equipment" && (
          <>
            <label className="font-medium inter">Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="mb-4 w-full"
              disabled={isSubmitting}
            />
            {image && (
              <p className="text-sm text-gray-600 mb-3">
                Selected: {image.name}
              </p>
            )}
          </>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
            disabled={isSubmitting}
          >
            Cancel
          </button>

          <button
            onClick={submitReview}
            className="px-4 py-2 bg-[#1F4E78] text-white rounded hover:bg-[#163a5c] transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewModal;
