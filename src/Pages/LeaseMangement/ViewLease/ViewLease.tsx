import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Edit3, Save, X } from "lucide-react";
import { LeaseFormData } from "../../../types";

import toast from "react-hot-toast";
import MultiStepIndicator from "../createLease/LeaseForms/MultistepIndicator";
import LeaseBasicInfo from "../createLease/LeaseForms/LeaseBasicInfo";
import { LessorDetails } from "../createLease/LeaseForms/LessorDetails";
import LeaseFinancialDetails from "../createLease/LeaseForms/LeaseFinancialDetails";
import LeaseRentRevision from "../createLease/LeaseForms/LeaseRentRevision";
import LeaseSummary from "../createLease/LeaseForms/LeaseSummary";
import LeaseReviewSubmit from "../createLease/LeaseForms/LeaseReviewSubmit";

// This would typically come from an API call
const mockLeaseData: LeaseFormData = {
  leaseId: "LEASE-001",
  leaseClass: "VEHICLE",
  isShortTerm: false,
  isLowValue: true,
startDate: new Date("2025-01-01"),
endDate: new Date("2025-12-31"),
  terminationDate: "2025-01-01",
  duration: {
    years: 1,
    months: 0,
    days: 0,
  },
  hasCashflow: false,
  annualPayment: "24000",
  incrementalBorrowingRate: "5.5",
  initialDirectCosts: "5000",
  paymentFrequency: "monthly",
  paymentTiming: "beginning",
  paymentDelay: "0",
  depositNumber: "DEP-001",
  depositAmount: "2000",
  depositRate: "3.5",
  depositStartDate: "2024-01-01",
  depositEndDate: "2025-01-01",
  documents: [],
  notes: "Sample lease agreement",
  clientContact: "John Doe",
  clientName: "ABC Company",
  propertyAddress: "123 Main St",
  propertyName: "Sample Lease",
  propertyId: "VEHICLE",
  leaseType: "Standard",
  cashflowAmount: "",
  cashflowType: "",
  cashflowEntries: [],
  securityDeposits: [
    {
      id: "1",
      depositNumber: "DEP-001",
      amount: "2000",
      rate: "3.5",
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      remark: "Security deposit for vehicle lease",
    }
  ],
  rentRevisions: [
    {
      id: "1",
      revisionDate: "2024-07-01",
      revisedPayment: "2100",
    }
  ],
  entityMaster: ["entity1"],
  leaserMaster: ["leaser1"],
  department: ["hr"],
  entityDepartmentPercentages: {},
  lessorPercentages: {},
  hasMultiEntityAllocation: false,
  overallEntityPercentages: {},
  shortTermValue: "",
  hasLessorAllocation: false
};

const ViewLease: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<LeaseFormData>(mockLeaseData);
  const [isSaving, setIsSaving] = useState(false);

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
        status: currentStep === 5 ? "current" : currentStep > 5 ? "complete" : "upcoming",
      },
      {
        id: 6,
        name: "Review & Submit",
        status: currentStep === 6 ? "current" : "upcoming",
      }
    ];

    const filtered = allSteps.filter(step => !step.skip);
    
    let displayStep = currentStep;
    if (formData.hasCashflow && currentStep === 5) {
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

  const updateFormData = (data: Partial<LeaseFormData>) => {
    if (isEditMode) {
      setFormData((prevData) => ({ ...prevData, ...data }));
    }
  };

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
    if (!isEditMode) return;
    
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Changes saved successfully!");
      setIsEditMode(false);
    } catch (error) {
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setFormData(mockLeaseData); // Reset to original data
  };

  const handleSubmit = () => {
    toast.success("Lease updated successfully!");
    setIsEditMode(false);
  };

  // Create read-only props for components
  const readOnlyProps = {
    readOnly: !isEditMode,
    disabled: !isEditMode
  };

  return (
    <div className="container mx-auto px-2 py-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
            {isEditMode ? `Edit Lease ${id}` : `View Lease ${id}`}
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            {isEditMode ? "Edit lease details" : "View lease details"}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {!isEditMode ? (
            <button
              onClick={handleEdit}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Edit3 size={16} />
              Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Save size={16} />
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          )}
          
          <Link
            to="/dashboard/lease"
            className="text-blue-600 hover:text-blue-800 flex items-center text-sm sm:text-base whitespace-nowrap"
          >
            <ArrowLeft size={18} className="mr-1" />
            Back to Leases
          </Link>
        </div>
      </div>
      
      <MultiStepIndicator steps={filteredSteps} currentStep={displayCurrentStep} />

      {currentStep === 1 && (
        <LeaseBasicInfo
          formData={formData}
          updateFormData={updateFormData}
          onNext={handleNext}
          onSave={handleSave}
          isSaving={isSaving}
          {...readOnlyProps}
        />
      )}

      {currentStep === 2 && !formData.hasCashflow && (
        <LessorDetails
          formData={formData}
          updateFormData={updateFormData}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSave={handleSave}
          isSaving={isSaving}
          {...readOnlyProps}
        />
      )}

      {currentStep === 3 && !formData.hasCashflow && (
        <LeaseFinancialDetails
          formData={formData}
          updateFormData={updateFormData}
          onPrevious={handlePrevious}
          onNext={handleNext}
          isSaving={isSaving}
          {...readOnlyProps}
        />
      )}

      {currentStep === 4 && !formData.hasCashflow && (
        <LeaseRentRevision
          formData={formData}
          updateFormData={updateFormData}
          onPrevious={handlePrevious}
          onNext={handleNext}
          isSaving={isSaving}
          {...readOnlyProps}
        />
      )}

      {currentStep === 5 && (
        <LeaseSummary
          formData={formData}
          onPrevious={handlePrevious}
          onNext={handleNext}
          isSaving={isSaving}
          {...readOnlyProps}
        />
      )}

      {currentStep === 6 && (
        <LeaseReviewSubmit
          formData={formData}
          onPrevious={handlePrevious}
          onSubmit={handleSubmit}
          isEditMode={isEditMode}
          readOnly={!isEditMode}
        />
      )}
    </div>
  );
};

export default ViewLease;