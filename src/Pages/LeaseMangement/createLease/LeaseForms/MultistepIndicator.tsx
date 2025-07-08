

import React from "react";


interface Step {
  id: number;
  name: string;
  status: "current" | "upcoming" | "complete";
}


interface MultiStepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepId: number) => void;
  completedSteps?: number[];
}


const MultiStepIndicator: React.FC<MultiStepIndicatorProps> = ({
  steps,
  onStepClick,
  completedSteps = []
}) => {
  return (
    <nav aria-label="Progress" className="mb-6 w-full">
      <ol className="flex overflow-x-auto gap-4 md:gap-8 scrollbar-hide items-center">
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const nextStep = steps[index + 1];
          const isClickable = completedSteps.includes(step.id) || step.status === "current";


          const baseCircle =
            "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold";


          const circleStyle =
            step.status === "complete"
              ? "bg-green-500 text-white"
              : step.status === "current"
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-black";


          const labelStyle =
            step.status === "complete"
              ? "text-green-600"
              : step.status === "current"
                ? "text-blue-600 font-semibold"
                : "text-gray-500";


          // Determine arrow color based on current + next step status
          let arrowColor = "text-gray-400";
          if (
            step.status === "complete" &&
            nextStep?.status !== "upcoming"
          ) {
            arrowColor = "text-green-500";
          } else if (
            step.status === "current" ||
            nextStep?.status === "current"
          ) {
            arrowColor = "text-blue-500";
          }


          return (
            <li key={step.name} className="flex items-center space-x-2">
              <div className="flex flex-col items-center text-center min-w-[50px]">
                <div
                  className={`${baseCircle} ${circleStyle} ${
                    isClickable && onStepClick ? "cursor-pointer hover:opacity-80" : ""
                  }`}
                  onClick={() => isClickable && onStepClick && onStepClick(step.id)}
                >
                  {step.status === "complete" ? "✓" : step.id}
                </div>


                {/* Show 'Step {id}' below the check icon when complete */}
                {step.status === "complete" && (
                  <div className="mt-1 text-[10px] sm:text-xs md:text-[9px] lg:text-base xl:text-base text-green-600">
                     {step.name}
                  </div>
                )}


                {/* Show step name only when current */}
                {step.status === "current" && (
                  <div className={`mt-1 text-[10px] sm:text-xs md:text-[9px] lg:text-base xl:text-base ${labelStyle}`}>
                    {step.name}
                  </div>
                )}
              </div>


              {!isLast && (
                <div className={`text-3xl select-none ${arrowColor}`}>
                  →
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};


export default MultiStepIndicator;

