import React, { useMemo, useState, useCallback, useEffect } from "react";
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
  startDate: new Date(),
  endDate: new Date(),
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
    {
      id: uuidv4(), leaseId: "", date: "", amount: "",
      type: ""
    }
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
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [savedFormData, setSavedFormData] = useState<LeaseFormData>(initialFormData);


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
        status: currentStep === 5 ? "current" : currentStep > 5 ? "complete" : "upcoming",
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


  // Save data before navigation
  const saveCurrentStep = async () => {
    setIsSaving(true);
    setSaveError(null);
   
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 500));
     
      // Store in component state (not localStorage as requested)
      setSavedFormData({ ...formData });
     
      // Mark current step as completed
      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps(prev => [...prev, currentStep]);
      }
     
      return true;
    } catch (error) {
      setSaveError("Failed to save. Please try again.");
      return false;
    } finally {
      setIsSaving(false);
    }
  };


  const handleNext = async () => {
    const saved = await saveCurrentStep();
    if (!saved) return;


    if (formData.hasCashflow && currentStep === 1) {
      setCurrentStep(5);
    } else if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
    window.scrollTo(0, 0);
  };


  const handlePrevious = async () => {
    const saved = await saveCurrentStep();
    if (!saved) return;


    if (formData.hasCashflow && currentStep === 5) {
      setCurrentStep(1);
    } else if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
    window.scrollTo(0, 0);
  };


  const handleStepClick = async (stepId: number) => {
    // Only allow navigation to completed steps or current step
    if (completedSteps.includes(stepId) || stepId === currentStep) {
      const saved = await saveCurrentStep();
      if (!saved) return;


      // Handle special case for cashflow mode
      if (formData.hasCashflow) {
        if (stepId === 2) {
          setCurrentStep(5); // Summary
        } else if (stepId === 1) {
          setCurrentStep(1); // Lease Terms
        } else if (stepId === 3) {
          setCurrentStep(6); // Review & Submit
        }
      } else {
        setCurrentStep(stepId);
      }
      window.scrollTo(0, 0);
    }
  };


  const handleSave = async () => {
    await saveCurrentStep();
  };


  const handleSubmit = async () => {
    setIsSaving(true);
   
    try {
      // Final API call to create lease
      /*
      const response = await fetch('/api/v1/lease', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
     
      if (!response.ok) {
        throw new Error('Failed to create lease');
      }
     
      const result = await response.json();
      */
     
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
     
      toast.success("Lease created successfully!");
      navigate("/dashboard/lease");
    } catch (error) {
      toast.error("Failed to create lease. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };


  // Load saved data on component mount
  useEffect(() => {
    if (savedFormData !== initialFormData) {
      setFormData(savedFormData);
    }
  }, []);


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
            to="/dashboard/lease"
            className="text-blue-600 hover:text-blue-800 flex items-center text-sm sm:text-base whitespace-nowrap"
          >
            <ArrowLeft size={18} className="mr-1" />
            Back to Leases
          </Link>
        </div>
      </div>
     
      <MultiStepIndicator
        steps={filteredSteps}
        currentStep={displayCurrentStep}
        onStepClick={handleStepClick}
        completedSteps={completedSteps}
      />


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
          isSaving={isSaving}
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

