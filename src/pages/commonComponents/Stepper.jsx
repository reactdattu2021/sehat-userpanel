// CartStepper.jsx
import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const Stepper = ({ currentStep }) => {
  const steps = ["cart", "checkout", "payment"];

  // Function to check step status
  const isCompleted = (step) => steps.indexOf(step) < steps.indexOf(currentStep);
  const isActive = (step) => step === currentStep;

  return (
    <div className="flex items-center font-outfit py-[40px] md:py-[60px] xl:py-[80px]">
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <div className="w-[300px] flex gap-2 justify-center items-center">
            {(isCompleted(step) || isActive(step)) && (
              <FaCheckCircle className="w-[16px] h-[16px] xl::w-[24px] xl:h-[24px] text-[#A2CD48]" />
            )}
            <p
              className={`text-[14px] tracking-[0.28px] md:text-[16px] md:tracking-[0.32px] xl:text-[20px] xl:  tracking-[0.4px] leading-[100%] font-semibold ${
                isCompleted(step) || isActive(step)
                  ? "text-[#A2CD48]"
                  : "text-black"
              }`}
            >
              {step === "cart"
                ? "Cart"
                : step === "checkout"
                ? "Checkout"
                : "Payment"}
            </p>
          </div>

          {/* Show dashed separator only between steps */}
          {index < steps.length - 1 && (
            <hr className="border border-dashed border-[#000000] w-[50px] md:w-[177px] xl:w-[280px]" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Stepper;
