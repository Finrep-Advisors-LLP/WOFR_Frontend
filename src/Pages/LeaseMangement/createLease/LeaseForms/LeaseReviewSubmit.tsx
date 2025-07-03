import React from "react";
import { AlertCircle } from "lucide-react";
import { LeaseFormData } from "../../../../types";
import axios from "../../../../helper/axios";
import { useAuth } from "../../../../context/AuthContext";

interface LeaseReviewSubmitProps {
  formData: LeaseFormData;
  onPrevious: () => void;
  onSubmit: () => void;
}

const LeaseReviewSubmit: React.FC<LeaseReviewSubmitProps> = ({
  formData,
  onPrevious,
  onSubmit,
}) => {
  const formatCurrency = (value?: string | number): string => {
    if (value === null || value === undefined || value === "") return "$0.00";
    return `$${Number(value).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const displayValue = (
    value: any,
    fallback: string = "Not specified"
  ): string => {
    if (value === null || value === undefined || value === "") {
      return fallback;
    }
    return String(value);
  };

  const isEmpty = (value: any): boolean => {
    if (value === null || value === undefined || value === "") return true;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === "object") return Object.keys(value).length === 0;
    return false;
  };

  // Helper function to get unique departments from entity-department percentages
  const getUniqueDepartments = () => {
    if (!formData.entityDepartmentPercentages) return [];

    const deptSet = new Set<string>();
    Object.values(formData.entityDepartmentPercentages).forEach(
      (entityDepts) => {
        if (entityDepts && typeof entityDepts === "object") {
          Object.keys(entityDepts).forEach((dept) => deptSet.add(dept));
        }
      }
    );

    return Array.from(deptSet).map((deptValue) => {
      return { value: deptValue, label: deptValue };
    });
  };
  const { authState } = useAuth();

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${authState.token}`,
    Accept: "application/json",
  });



const submitLeaseToAPI = async (formData:any) => {
  const apiPayload = {
    organization_id: "T00015", // Map from your form
    lease_identifier: formData.propertyName || "string",
    asset_group_id: parseInt(formData.propertyId) || 0,
    department_id: parseInt(formData.department?.[0]) || 0, // First department if array
    short_term_lease: formData.isShortTerm ? "yes" : "no",
    low_value_lease: formData.isLowValue ? "yes" : "no",
    lease_start_date: formData.startDate,
    lease_end_date: formData.endDate,
    lease_term_years: formData.duration?.years || 0,
    lease_term_months: formData.duration?.months || 0,
    lease_term_days: formData.duration?.days || 0,
    custom_cashflows: formData.hasCashflow ? "yes" : "no",
    monthly_lease_payment: parseFloat(formData.annualPayment) / 12 || 0, // Convert annual to monthly
    incremental_borrowing_rate: parseFloat(formData.incrementalBorrowingRate) || 0,
    payment_frequency: formData.paymentFrequency || "monthly",
    payment_timing: formData.paymentTiming || "beginning",
    payment_delay_months: parseInt(formData.paymentDelay) || 0,
    initial_direct_costs: parseFloat(formData.initialDirectCosts) || 0,
    termination_date: formData.endDate, // Using end date as termination date
    status: "active"
  };

  try {
    const response = await axios.post('api/v1/leases', apiPayload, {
      // headers: {
      //   'accept': 'application/json',
      //   'Content-Type': 'application/json',
      // }

        headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
      
    });

    return response.data;
  } catch (error:any) {
    console.error('Error submitting lease:', error);
    if (error.response) {
      // Server responded with error status
      throw new Error(`API Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('Network error: No response from server');
    } else {
      // Something else happened
      throw new Error(`Error: ${error.message}`);
    }
  }
};





  // Check if this is multi-entity mode
  const isMultiEntityMode = formData.hasMultiEntityAllocation;
  const selectedEntities = Array.isArray(formData.entityMaster)
    ? formData.entityMaster
    : formData.entityMaster
    ? [formData.entityMaster]
    : ([] as string[]);
  const selectedLessors = Array.isArray(formData.leaserMaster)
    ? formData.leaserMaster
    : formData.leaserMaster
    ? [formData.leaserMaster]
    : ([] as string[]);

  // Updated validation logic: if cashflow exists, only check basic required fields
  // If no cashflow, check all required fields
  const checkRequiredFields = (): boolean => {
    const hasCashflow =
      formData.hasCashflow &&
      formData.cashflowEntries &&
      formData.cashflowEntries.length > 0;

    // Basic required fields that are always needed
    const basicRequiredFields = [formData.startDate, formData.endDate];

    const basicFieldsValid = basicRequiredFields.every(
      (field) => field !== undefined && field !== "" && field !== null
    );

    if (hasCashflow) {
      // If we have cashflow data, only basic fields are required
      return basicFieldsValid;
    } else {
      // If no cashflow, require payment information as well
      const paymentRequiredFields = [
        formData.annualPayment,
        formData.paymentFrequency,
      ];

      const paymentFieldsValid = paymentRequiredFields.every(
        (field) => field !== undefined && field !== "" && field !== null
      );

      return basicFieldsValid && paymentFieldsValid;
    }
  };

  const isFormValid = checkRequiredFields();

  // Check if we have cashflow data
  const hasCashflowData =
    formData.hasCashflow &&
    formData.cashflowEntries &&
    formData.cashflowEntries.length > 0;

  // Check if basic lease information has any data
  const hasBasicLeaseInfo =
    !isEmpty(formData.propertyId) ||
    !isEmpty(formData.propertyName) ||
    !isEmpty(formData.startDate) ||
    !isEmpty(formData.endDate) ||
    formData.duration;

  // Check if entity & lessor information has any data
  const hasEntityLessorInfo =
    selectedEntities.length > 0 ||
    selectedLessors.length > 0 ||
    (!isEmpty(formData.department) && formData.department.length > 0);

  // Check if financial details have any data
  const hasFinancialDetails =
    !isEmpty(formData.annualPayment) ||
    !isEmpty(formData.incrementalBorrowingRate) ||
    !isEmpty(formData.initialDirectCosts) ||
    !isEmpty(formData.paymentFrequency) ||
    !isEmpty(formData.paymentTiming) ||
    !isEmpty(formData.paymentDelay);

  // Check if multi-entity allocation has data
  const hasMultiEntityAllocation =
    isMultiEntityMode &&
    formData.entityDepartmentPercentages &&
    Object.keys(formData.entityDepartmentPercentages).length > 0;

  // Check if lessor allocation has data
  const hasLessorAllocation =
    isMultiEntityMode &&
    formData.lessorPercentages &&
    Object.keys(formData.lessorPercentages).length > 0;

  // Check if rent revisions have data
  const hasRentRevisions =
    formData.rentRevisions && formData.rentRevisions.length > 0;

  // Check if security deposits have data
  const hasSecurityDeposits =
    formData.securityDeposits && formData.securityDeposits.length > 0;

  // Calculate overall entity grand total
  const getOverallEntityGrandTotal = (): number => {
    if (!formData.overallEntityPercentages) return 0;
    return Object.values(formData.overallEntityPercentages).reduce(
      (sum: number, val: any) => sum + (Number(val) || 0),
      0
    );
  };

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-sm mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          Review & Submit Lease
        </h2>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          Please review all lease details before submission
        </p>
      </div>

      {!isFormValid && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md flex items-start">
          <AlertCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-red-800">
              Missing Required Information
            </p>
            <p className="text-red-700 mt-1 text-sm">
              {hasCashflowData
                ? "Please provide at least the start date and end date."
                : "Please go back and complete all required fields (dates and payment information) before submitting."}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* Lease Basic Information - Only show if has data */}
        {hasBasicLeaseInfo && (
          <section className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Lease Basic Information
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {!isEmpty(formData.propertyId) && (
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100 shadow-xs">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class ID
                  </p>
                  <p className="mt-1 font-medium text-gray-900">
                    {displayValue(formData.propertyId)}
                  </p>
                </div>
              )}

              {!isEmpty(formData.propertyName) && (
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100 shadow-xs">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lease ID
                  </p>
                  <p className="mt-1 font-medium text-gray-900">
                    {displayValue(formData.propertyName)}
                  </p>
                </div>
              )}

              {!isEmpty(formData.startDate) && (
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100 shadow-xs">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lease Start Date
                  </p>
                  <p className="mt-1 font-medium text-gray-900">
                    {displayValue(formData.startDate)}
                  </p>
                </div>
              )}

              {!isEmpty(formData.endDate) && (
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100 shadow-xs">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lease End Date
                  </p>
                  <p className="mt-1 font-medium text-gray-900">
                    {displayValue(formData.endDate)}
                  </p>
                </div>
              )}

              {formData.duration && (
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100 shadow-xs">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </p>
                  <p className="mt-1 font-medium text-gray-900">
                    {formData.duration?.years || 0} years,{" "}
                    {formData.duration?.months || 0} months,{" "}
                    {formData.duration?.days || 0} days
                  </p>
                </div>
              )}

              {(formData.isShortTerm || formData.isLowValue) && (
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100 shadow-xs">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lease Type
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {formData.isShortTerm && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Short Term
                      </span>
                    )}
                    {formData.isLowValue && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Low Value
                      </span>
                    )}
                    {!formData.isShortTerm && !formData.isLowValue && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        Standard
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Entity & Lessor Information - Only show if has data */}
        {hasEntityLessorInfo && (
          <section className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Entity & Lessor Information
              </h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {selectedEntities.length > 0 && (
                  <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100 shadow-xs">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entity Master
                    </p>
                    <div className="mt-1">
                      <div className="flex flex-wrap gap-2">
                        {selectedEntities.map((entityId) => (
                          <span
                            key={entityId}
                            className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full"
                          >
                            {entityId}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedLessors.length > 0 && (
                  <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100 shadow-xs">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lessor(s)
                    </p>
                    <div className="mt-1">
                      <div className="flex flex-wrap gap-2">
                        {selectedLessors.map((lessor) => (
                          <span
                            key={lessor}
                            className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                          >
                            {lessor}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Single Entity Department Display */}
              {!isMultiEntityMode && 
  formData.department && 
  (Array.isArray(formData.department) ? formData.department.length > 0 : formData.department) && ( 
    <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100 shadow-xs"> 
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider"> 
        Department(s) 
      </p> 
      <div className="mt-1"> 
        <div className="flex flex-wrap gap-2"> 
          {(Array.isArray(formData.department) ? formData.department : [formData.department]).map( 
            (dept: string, index: number) => ( 
              <span 
                key={dept || index} 
                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full" 
              > 
                {dept} 
              </span> 
            ) 
          )} 
        </div> 
      </div> 
    </div> 
  )}
            </div>
          </section>
        )}

        {/* Multi-Entity Department Allocation Matrix - Only show if has data */}
        {hasMultiEntityAllocation && (
          <section className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Entity-Department Allocation Matrix
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-200"
                    >
                      Overall Allocation (%)
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Entity
                    </th>
                    {getUniqueDepartments().map((dept, index) => (
                      <th
                        key={dept.value || `dept-${index}`}
                        scope="col"
                        className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px]"
                      >
                        {dept.label}
                      </th>
                    ))}
                    <th
                      scope="col"
                      className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider bg-gray-200"
                    >
                      Entity Total (%)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedEntities.map((entityId, entityIndex) => {
                    const entityPercentages =
                      formData.entityDepartmentPercentages?.[entityId] || {};
                      const entityTotal = Object.values(entityPercentages).reduce(
                        (sum: number, val: any) => sum + (Number(val) || 0),
                        0
                      );
                      
                    const overallPercentage =
                      formData.overallEntityPercentages?.[entityId] || 0;

                    return (
                      <tr
                        key={entityId}
                        className={
                          entityIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-300 bg-gray-100 text-center">
                          {overallPercentage.toFixed(2)}%
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 border-r bg-gray-100 border-gray-300">
                          {entityId}
                        </td>
                        {getUniqueDepartments().map((dept, deptIndex) => {
                          const percentage = entityPercentages[dept.value];
                          return (
                            <td
                              key={dept.value || `dept-${deptIndex}`}
                              className="px-4 py-3 border-r border-gray-300 text-center text-sm"
                            >
                              {percentage !== undefined && percentage !== null
                                ? `${percentage.toFixed(2)}%`
                                : "—"}
                            </td>
                          );
                        })}
                        <td className="px-4 py-3 text-center bg-gray-100 border-l">
                          <span
                            className={`text-sm font-semibold ${
                              Math.abs(entityTotal - 100) < 0.01
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {entityTotal.toFixed(2)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900  bg-gray-200 text-center">
                      Grand Total:{" "}
                      <span
                        className={`text-sm font-semibold ${
                          Math.abs(getOverallEntityGrandTotal() - 100) < 0.01
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {Number(getOverallEntityGrandTotal()).toFixed(2)}%{" "}
                      </span>
                    </td>
                    <td className="px-4 py-3 bg-gray-100"></td>
                    {getUniqueDepartments().map((dept, index) => (
                      <td
                        key={`empty-dept-footer-${dept.value || index}`}
                        className="px-4 py-3 bg-gray-100 "
                      ></td>
                    ))}
                    <td className="px-4 py-3 text-center bg-gray-200">
                      <span
                        className={`text-sm font-semibold ${
                          Math.abs(getOverallEntityGrandTotal() - 100) < 0.01
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {/* {getOverallEntityGrandTotal().toFixed(2)}% */}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        )}

        {/* Multi-Entity Lessor Allocation - Only show if has data */}
        {hasLessorAllocation && (
          <section className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Lessor Allocation
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Lessor
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Percentage (%)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {selectedLessors.map((lessorId: string, index: number) => {
  const percentage = Number(
    (formData.lessorPercentages as any)?.[lessorId] || 0
  );
                    return (
                      <tr
                        key={lessorId || `lessor-${index}`}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 border-r">
                          {lessorId}
                        </td>
                        <td className="px-4 py-3 text-center text-sm font-medium">
                          {percentage.toFixed(2)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Financial Details - Only show if not using cashflow or if financial data exists */}
        {!hasCashflowData && hasFinancialDetails && (
          <section className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Financial Details
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {!isEmpty(formData.annualPayment) && (
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100 shadow-xs">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Annual Lease Payment
                  </p>
                  <p className="mt-1 font-medium text-gray-900">
                    {formatCurrency(formData.annualPayment)}
                  </p>
                </div>
              )}

              {!isEmpty(formData.incrementalBorrowingRate) && (
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100 shadow-xs">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Incremental Borrowing Rate
                  </p>
                  <p className="mt-1 font-medium text-gray-900">
                    {displayValue(formData.incrementalBorrowingRate, "0")}%
                  </p>
                </div>
              )}

              {!isEmpty(formData.initialDirectCosts) && (
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100 shadow-xs">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Initial Direct Costs
                  </p>
                  <p className="mt-1 font-medium text-gray-900">
                    {formatCurrency(formData.initialDirectCosts)}
                  </p>
                </div>
              )}

              {!isEmpty(formData.paymentFrequency) && (
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100 shadow-xs">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Frequency
                  </p>
                  <p className="mt-1 font-medium text-gray-900 capitalize">
                    {displayValue(formData.paymentFrequency)}
                  </p>
                </div>
              )}

              {!isEmpty(formData.paymentTiming) && (
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100 shadow-xs">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Timing
                  </p>
                  <p className="mt-1 font-medium text-gray-900 capitalize">
                    {displayValue(formData.paymentTiming)}
                  </p>
                </div>
              )}

              {!isEmpty(formData.paymentDelay) && (
                <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-100 shadow-xs">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Delay
                  </p>
                  <p className="mt-1 font-medium text-gray-900">
                    {displayValue(formData.paymentDelay, "0")} days
                  </p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Custom Cashflow - Only show if has data */}
        {hasCashflowData && (
          <section className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Custom Cashflow
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Lease ID
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.cashflowEntries?.map((entry, index) => (
                    <tr
                      key={entry.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {displayValue(entry.leaseId, "—")}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {displayValue(entry.date, "—")}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {entry.amount ? formatCurrency(entry.amount) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Rent Revisions & Initial Costs - Only show if has data */}
        {hasRentRevisions && (
          <section className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Rent Revisions
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      #
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Revision Date
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Revised Payment
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.rentRevisions?.map((revision, index) => (
                    <tr
                      key={revision.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {displayValue(revision.revisionDate, "—")}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {revision.revisedPayment
                          ? formatCurrency(revision.revisedPayment)
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Security Deposits - Only show if has data */}
        {hasSecurityDeposits && (
          <section className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center mb-4">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                Security Deposits
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Deposit Number
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Rate
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Period
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Remark
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {formData.securityDeposits?.map((deposit, index) => (
                    <tr
                      key={deposit.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {deposit.depositNumber || "—"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {deposit.amount ? formatCurrency(deposit.amount) : "—"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {deposit.rate ? `${deposit.rate}%` : "—"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {deposit.startDate && deposit.endDate
                          ? `${deposit.startDate} to ${deposit.endDate}`
                          : "—"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {deposit.remark || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onPrevious}
          className="bg-white cursor-pointer text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>

        <button
          type="button"
          className="bg-white cursor-pointer text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
        >
          Save
        </button>

        {/* <button
          type="button"
          onClick={onSubmit}
          disabled={!isFormValid}
          className={`px-4 py-2 cursor-pointer rounded-md ${
            isFormValid
              ? "bg-[#008F98] text-white hover:bg-[#007A82]"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          } transition-colors`}
        >
          Submit Lease
        </button> */}
        <button
  type="button"
  onClick={async () => {
    try {
      await submitLeaseToAPI(formData);
      alert('Lease submitted successfully!');
      onSubmit(); // Call original onSubmit if needed
    } catch (error) {
      alert('Error submitting lease. Please try again.');
    }
  }}
  disabled={!isFormValid}
  className={`px-4 py-2 cursor-pointer rounded-md ${
    isFormValid
      ? "bg-[#008F98] text-white hover:bg-[#007A82]"
      : "bg-gray-300 text-gray-500 cursor-not-allowed"
  } transition-colors`}
>
  Submit Lease
</button>
      </div>
    </div>
  );
};

export default LeaseReviewSubmit;
