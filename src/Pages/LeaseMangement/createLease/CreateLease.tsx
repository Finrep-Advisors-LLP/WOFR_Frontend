import React, { useMemo, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { LeaseFormData } from "../../../types";
import MultiStepIndicator from "./LeaseForms/MultistepIndicator";
import LeaseBasicInfo from "./LeaseForms/LeaseBasicInfo";
import LeaseFinancialDetails from "./LeaseForms/LeaseFinancialDetails";
import LeaseRentRevision from "./LeaseForms/LeaseRentRevision";
import LeaseReviewSubmit from "./LeaseForms/LeaseReviewSubmit";
import { v4 as uuidv4 } from 'uuid';
import { LessorDetails } from "./LeaseForms/LessorDetails";
import toast from "react-hot-toast";
import LeaseSummary from "./LeaseForms/LeaseSummary";

const initialFormData: LeaseFormData = {
  leaseId: "",
  leaseClass: "",
  isShortTerm: false,
  isLowValue: false,
  startDate: "",
  endDate: "",
  terminationDate: "",
  duration: {
    years: 0,
    months: 0,
    days: 0,
  },
  hasCashflow: false,
  annualPayment: "",
  incrementalBorrowingRate: "",
  initialDirectCosts: "",
  paymentFrequency: "",
  paymentTiming: "",
  paymentDelay: "",
  depositNumber: "",
  depositAmount: "",
  depositRate: "",
  depositStartDate: "",
  depositEndDate: "",
  documents: [],
  notes: "",
  clientContact: "",
  clientName: "",
  propertyAddress: "",
  propertyName: "",
  propertyId: "",
  leaseType: "",
  cashflowAmount: "",
  cashflowType: "",
  cashflowEntries: [
    { id: uuidv4(), leaseId: "", date: "", amount: "" }
  ],
  securityDeposits: [
    {
      id: uuidv4(),
      depositNumber: "",
      amount: "",
      rate: "",
      startDate: "",
      endDate: "",
      remark: "",
    }
  ],
  rentRevisions: [
    {
      id: uuidv4(),
      revisionDate: "",
      revisedPayment: "",
      // remark: "",
    }
  ],
entityMaster: [] as string[],
leaserMaster: [] as string[],
department: [],
  entityDepartmentPercentages: undefined,
  lessorPercentages: undefined,
  hasMultiEntityAllocation: false,
  overallEntityPercentages: undefined,
  shortTermValue: "",
  hasLessorAllocation: false
};

const CreateLease: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<LeaseFormData>(initialFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Create filtered steps and step mapping
  const { filteredSteps, displayCurrentStep } = useMemo(() => {
    const allSteps = [
      {
        id: 1,
        name: "Lease Terms",
        status: currentStep === 1 ? "current" : currentStep > 1 ? "complete" : "upcoming",
      },
      {
        id: 2,
        name: "Lessor & Lessee Details",
        status: currentStep === 2 ? "current" : currentStep > 2 ? "complete" : "upcoming",
        skip: formData.hasCashflow,
      },
      {
        id: 3,
        name: "Lease Payment Details",
        status: currentStep === 3 ? "current" : currentStep > 3 ? "complete" : "upcoming",
        skip: formData.hasCashflow,
      },
      {
        id: 4,
        name: "Security Deposit",
        status: currentStep === 4 ? "current" : currentStep > 4 ? "complete" : "upcoming",
        skip: formData.hasCashflow,
      },
      {
        id: 5,
        name: "Lease Summary",
        status: currentStep === 5 ? "current" : "upcoming",
      },
      {
        id: 6,
        name: "Review & Submit",
        status: currentStep === 6 ? "current" : "upcoming",
      }
    ];

    // Filter out skipped steps
    const filtered = allSteps.filter(step => !step.skip);
    
    // Map the current step to display step for indicator
    let displayStep = currentStep;
    if (formData.hasCashflow && currentStep === 5) {
      // show it as step 2 in the indicator
      displayStep = 2;
    }
    const updatedFilteredSteps = filtered.map((step, index) => ({
      ...step,
      id: index + 1,
      status:
        index + 1 === displayStep
          ? ("current" as const)
          : index + 1 < displayStep
            ? ("complete" as const)
            : ("upcoming" as const),
    }));
    

    return {
      filteredSteps: updatedFilteredSteps,
      displayCurrentStep: displayStep
    };
  }, [currentStep, formData.hasCashflow]);
  
  const updateFormData = useCallback((data: Partial<LeaseFormData>) => {
    setFormData((prevData) => ({ ...prevData, ...data }));
  }, []);

  const handleNext = () => {
    if (formData.hasCashflow && currentStep === 1) {
      setCurrentStep(5);
    } else if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
    window.scrollTo(0, 0);
  };

  const handlePrevious = () => {
    if (formData.hasCashflow && currentStep === 5) {
      setCurrentStep(1);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
    window.scrollTo(0, 0);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      
      // Show success message
      alert("Changes saved successfully!");
    } catch (error) {
      setSaveError("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = () => {

    // Simulate submission and redirect
    setTimeout(() => {
      toast.success("Lease created successfully!");
      navigate("/dashboard/Lease");
    }, 1000);
  };

  return (
    <div className="container mx-auto px-2 py-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
        {/* Left Section */}
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
            Create New Lease
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            Fill in the details to create a new lease agreement
          </p>
        </div>

        {/* Right Section */}
        <div className="mt-2 md:mt-0">
          <Link
            to="/dashboard/Lease"
            className="text-blue-600 hover:text-blue-800 flex items-center text-sm sm:text-base whitespace-nowrap"
          >
            <ArrowLeft size={18} className="mr-1" />
            Back to Leases
          </Link>
        </div>
      </div>
      
      <MultiStepIndicator steps={filteredSteps} currentStep={displayCurrentStep} />

      {saveError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {saveError}
        </div>
      )}

      {currentStep === 1 && (
        <LeaseBasicInfo
          formData={formData}
          updateFormData={updateFormData}
          onNext={handleNext}
          onSave={handleSave}
          isSaving={isSaving}
        />
      )}

      {currentStep === 2 && !formData.hasCashflow && (
        <LessorDetails
          formData={formData}
          updateFormData={updateFormData}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSave={handleSave}
          isSaving={false}
        />
      )}

      {currentStep === 3 && !formData.hasCashflow && (
        <LeaseFinancialDetails
          formData={formData}
          updateFormData={updateFormData}
          onPrevious={handlePrevious}
          onNext={handleNext}
          isSaving={isSaving}
        />
      )}

      {currentStep === 4 && !formData.hasCashflow && (
        <LeaseRentRevision
          formData={formData}
          updateFormData={updateFormData}
          onPrevious={handlePrevious}
          onNext={handleNext}
          isSaving={isSaving}
        />
      )}
          {/* {currentStep === 5 && !formData.hasCashflow && (
        <LeaseSummary
          formData={formData}
          onPrevious={handlePrevious}
          onNext={handleNext}
          isSaving={isSaving}
        />
      )} */}

{currentStep === 5  && (
        <LeaseSummary
          formData={formData}
          onPrevious={handlePrevious}
          onNext={handleNext}
          isSaving={isSaving}
        />
      )}

      {currentStep === 6 && (
        <LeaseReviewSubmit
          formData={formData}
          onPrevious={handlePrevious}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

 export default CreateLease;

