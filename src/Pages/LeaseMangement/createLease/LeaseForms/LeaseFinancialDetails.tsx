// import React, { useState, useEffect } from "react";
// import { Trash2, Plus } from "lucide-react";
// import { v4 as uuidv4 } from "uuid";
// import { LeaseFormLabels } from "./LeaseFormLabel";
// import { LeaseFormData, RentRevision } from "../../../../types";

// interface LeaseFinancialDetailsProps {
//   formData: LeaseFormData;
//   updateFormData: (data: Partial<LeaseFormData>) => void;
//   onPrevious: () => void;
//   onNext: () => void;
//   isSaving?: boolean;
//   readOnly?: boolean;
//   disabled?: boolean;
// }

// interface FormErrors {
//   annualPayment?: string;
//   incrementalBorrowingRate?: string;
//   paymentFrequency?: string;
//   paymentTiming?: string;
//   rentRevisions?: string;
// }

// const LeaseFinancialDetails: React.FC<LeaseFinancialDetailsProps> = ({
//   formData,
//   updateFormData,
//   onPrevious,
//   onNext,
//   readOnly = false,
//   disabled = false,
// }) => {
//   const [showExcelFormat, setShowExcelFormat] = useState(
//     (formData.rentRevisions && formData.rentRevisions.length > 1) || false
//   );

//   const [rentRevisions, setRentRevisions] = useState<RentRevision[]>(
//     formData.rentRevisions || [
//       {
//         id: uuidv4(),
//         revisionDate: "",
//         revisedPayment: "",
//       },
//     ]
//   );

//   const [errors, setErrors] = useState<FormErrors>({});

//   useEffect(() => {
//     if (!readOnly) {
//       updateFormData({ rentRevisions });
//     }
//   }, [rentRevisions, readOnly]);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     if (readOnly) return;
    
//     const { name, value } = e.target;
//     updateFormData({ [name]: value });
//     // Clear error when user starts typing
//     if (errors[name as keyof FormErrors]) {
//       setErrors({ ...errors, [name]: undefined });
//     }
//   };

//   const getMinDateForRevision = (index: number) => {
//     if (index === 0) return ""; // No restriction for first revision
    
//     // Get the previous revision's date
//     const prevRevisionDate = rentRevisions[index - 1]?.revisionDate;
//     if (!prevRevisionDate) return "";
    
//     // Return the day after the previous revision's date
//     const prevDate = new Date(prevRevisionDate);
//     prevDate.setDate(prevDate.getDate() + 1);
//     return prevDate.toISOString().split('T')[0];
//   };

//   const handleRentRevisionChange = (
//     id: string,
//     field: keyof RentRevision,
//     value: string
//   ) => {
//     if (readOnly) return;
    
//     const revisionIndex = rentRevisions.findIndex(rev => rev.id === id);
    
//     setRentRevisions((prevRevisions) => {
//       const newRevisions = prevRevisions.map((revision) =>
//         revision.id === id ? { ...revision, [field]: value } : revision
//       );
      
//       // If we're changing a date, we need to clear all subsequent dates
//       if (field === 'revisionDate' && value) {
//         for (let i = revisionIndex + 1; i < newRevisions.length; i++) {
//           newRevisions[i].revisionDate = "";
//         }
//       }
      
//       return newRevisions;
//     });
    
//     // Clear rent revisions error if any field is updated
//     if (errors.rentRevisions) {
//       setErrors({ ...errors, rentRevisions: undefined });
//     }
//   };

//   const addRentRevision = () => {
//     if (readOnly) return;
    
//     if (!showExcelFormat) {
//       setShowExcelFormat(true);
//     }

//     const newRevision: RentRevision = {
//       id: uuidv4(),
//       revisionDate: "",
//       revisedPayment: "",
//     };

//     setRentRevisions((prev) => [...prev, newRevision]);
//   };

//   const removeRentRevision = (id: string) => {
//     if (readOnly) return;
    
//     setRentRevisions((prev) => {
//       const newRevisions = prev.filter((revision) => revision.id !== id);
//       if (newRevisions.length <= 1) {
//         setShowExcelFormat(false);
//       }
//       return newRevisions;
//     });
//   };

//   const validateForm = () => {
//     if (readOnly) return true;
    
//     const newErrors: FormErrors = {};

//     if (!formData.annualPayment) {
//       newErrors.annualPayment = "Monthly lease payment is required";
//     }

//     if (!formData.incrementalBorrowingRate) {
//       newErrors.incrementalBorrowingRate = "Incremental borrowing rate is required";
//     }

//     if (!formData.paymentFrequency) {
//       newErrors.paymentFrequency = "Payment frequency is required";
//     }

//     if (!formData.paymentTiming) {
//       newErrors.paymentTiming = "Payment timing is required";
//     }

//     // Only validate rent revisions if they have been partially filled
//     const hasPartialRevision = rentRevisions.some(
//       (revision) => (revision.revisionDate && !revision.revisedPayment) || 
//                    (!revision.revisionDate && revision.revisedPayment)
//     );

//     if (hasPartialRevision) {
//       newErrors.rentRevisions = "If filling rent revisions, both date and payment amount are required";
//     }

//     // Validate date order only for filled revisions
//     const filledRevisions = rentRevisions.filter(
//       (revision) => revision.revisionDate && revision.revisedPayment
//     );
    
//     for (let i = 1; i < filledRevisions.length; i++) {
//       const currentDate = filledRevisions[i].revisionDate;
//       const prevDate = filledRevisions[i - 1].revisionDate;
      
//       if (new Date(currentDate) <= new Date(prevDate)) {
//         newErrors.rentRevisions = "Each revision date must be after the previous one";
//         break;
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleNext = () => {
//     if (readOnly || validateForm()) {
//       onNext();
//     }
//   };

//   return (
//     <div className="bg-white p-6 rounded-lg shadow-sm">
//       <h2 className="text-xl font-semibold mb-6">Lease Payment Details</h2>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         <div>
//           <label
//             htmlFor="annualPayment"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             {LeaseFormLabels.paymentDetails.monthlyPayment} <span className="text-red-600">*</span>
//           </label>
//           <div className="relative">
//             <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 text-sm h-full pointer-events-none">
//               $
//             </span>

//             <input
//               type="number"
//               id="annualPayment"
//               name="annualPayment"
//               className={`w-full rounded-md border ${errors.annualPayment ? "border-red-300" : "border-gray-300"
//                 } pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                 disabled ? "bg-gray-100 cursor-not-allowed" : ""
//               }`}
//               placeholder="0.00"
//               step="0.01"
//               value={formData.annualPayment || ""}
//               onChange={handleInputChange}
//               min={0}
//               disabled={disabled}
//               readOnly={readOnly}
//               onKeyDown={(e) => {
//                 if (e.key === "-" || e.key === "e") {
//                   e.preventDefault();
//                 }
//               }}
//             />
//             {errors.annualPayment && (
//               <p className="mt-1 text-sm text-red-600">{errors.annualPayment}</p>
//             )}
//           </div>
//         </div>

//         <div>
//           <label
//             htmlFor="incrementalBorrowingRate"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             {LeaseFormLabels.paymentDetails.borrowingRate} <span className="text-red-600">*</span>
//           </label>
//           <div className="relative">
//             <input
//               type="number"
//               id="incrementalBorrowingRate"
//               name="incrementalBorrowingRate"
//               className={`w-full rounded-md border ${errors.incrementalBorrowingRate ? "border-red-300" : "border-gray-300"
//                 } pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                 disabled ? "bg-gray-100 cursor-not-allowed" : ""
//               }`}
//               placeholder="0.00"
//               step="0.01"
//               value={formData.incrementalBorrowingRate || ""}
//               onChange={handleInputChange}
//               min={0}
//               disabled={disabled}
//               readOnly={readOnly}
//               onKeyDown={(e) => {
//                 if (e.key === "-" || e.key === "e") {
//                   e.preventDefault();
//                 }
//               }}
//             />
//             <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 text-sm h-full pointer-events-none">
//               %
//             </span>

//             {errors.incrementalBorrowingRate && (
//               <p className="mt-1 text-sm text-red-600">{errors.incrementalBorrowingRate}</p>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         <div>
//           <label
//             htmlFor="paymentFrequency"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             {LeaseFormLabels.paymentDetails.paymentFrequency} <span className="text-red-600">*</span>
//           </label>
//           <select
//             id="paymentFrequency"
//             name="paymentFrequency"
//             className={`w-full rounded-md border ${errors.paymentFrequency ? "border-red-300" : "border-gray-300"
//               } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//               disabled ? "bg-gray-100 cursor-not-allowed" : ""
//             }`}
//             value={formData.paymentFrequency || ""}
//             onChange={handleInputChange}
//             disabled={disabled}
//           >
//             <option value="">Select frequency</option>
//             <option value="monthly">Monthly</option>
//             <option value="quarterly">Quarterly</option>
//             <option value="semiannual">Semi-annual</option>
//             <option value="annual">Annual</option>
//           </select>
//           {errors.paymentFrequency && (
//             <p className="mt-1 text-sm text-red-600">{errors.paymentFrequency}</p>
//           )}
//         </div>

//         <div>
//           <label
//             htmlFor="paymentTiming"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             {LeaseFormLabels.paymentDetails.paymentTiming} <span className="text-red-600">*</span>
//           </label>
//           <select
//             id="paymentTiming"
//             name="paymentTiming"
//             className={`w-full rounded-md border ${errors.paymentTiming ? "border-red-300" : "border-gray-300"
//               } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//               disabled ? "bg-gray-100 cursor-not-allowed" : ""
//             }`}
//             value={formData.paymentTiming || ""}
//             onChange={handleInputChange}
//             disabled={disabled}
//           >
//             <option value="">Select timing</option>
//             <option value="beginning">Beginning of period</option>
//             <option value="end">End of period</option>
//           </select>
//           {errors.paymentTiming && (
//             <p className="mt-1 text-sm text-red-600">{errors.paymentTiming}</p>
//           )}
//         </div>

//         <div>
//           <label
//             htmlFor="paymentDelay"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             {LeaseFormLabels.paymentDetails.fitoutPeriod}
//           </label>
//           <input
//             type="number"
//             id="paymentDelay"
//             name="paymentDelay"
//             className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//               disabled ? "bg-gray-100 cursor-not-allowed" : ""
//             }`}
//             placeholder="0"
//             min={0}
//             onKeyDown={(e) => {
//               if (e.key === "-" || e.key === "e") {
//                 e.preventDefault();
//               }
//             }}
//             value={formData.paymentDelay || ""}
//             onChange={handleInputChange}
//             disabled={disabled}
//             readOnly={readOnly}
//           />
//         </div>
//       </div>

//       <div className="bg-white mt-10">
//         <div className="flex justify-between items-center mb-4">
//           <div>
//             <h3 className="text-lg font-medium text-gray-800">
//               Future Rent Revisions
//             </h3>
//             <p className="text-sm text-gray-600 mt-1">
//               Optional - Fill only if you have planned rent increases
//             </p>
//           </div>
//           {!readOnly && (
//             <button
//               type="button"
//               onClick={addRentRevision}
//               className="bg-[#008F98] text-white px-4 py-2 rounded-md hover:bg-[#007a82] transition-colors flex items-center gap-2"
//             >
//               <Plus size={16} />
//               Add
//             </button>
//           )}
//         </div>

//         {/* Initial Direct Costs */}
//         <div className="mb-8">
//           <label
//             htmlFor="initialDirectCosts"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             {LeaseFormLabels.paymentDetails.initialDirectCosts}
//           </label>
//           <div className="relative max-w-md">
//             <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
//               $
//             </span>
//             <input
//               type="number"
//               id="initialDirectCosts"
//               name="initialDirectCosts"
//               className={`w-full rounded-md border border-gray-300 pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                 disabled ? "bg-gray-100 cursor-not-allowed" : ""
//               }`}
//               placeholder="0.00"
//               step="0.01"
//               min={0}
//               onKeyDown={(e) => {
//                 if (e.key === "-" || e.key === "e") {
//                   e.preventDefault();
//                 }
//               }}
//               value={formData.initialDirectCosts || ""}
//               onChange={handleInputChange}
//               disabled={disabled}
//               readOnly={readOnly}
//             />
//           </div>
//         </div>

//         {errors.rentRevisions && (
//           <p className="text-sm text-red-600 mb-2">{errors.rentRevisions}</p>
//         )}

//         {!showExcelFormat ? (
//           // Single entry format
//           rentRevisions.slice(0, 1).map((revision) => (
//             <div
//               key={revision.id}
//               className={`border ${errors.rentRevisions ? "border-red-300" : "border-gray-200"
//                 } rounded-md p-4`}
//             >
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//                 <div>
//                   <label
//                     htmlFor={`revisionDate-${revision.id}`}
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     {LeaseFormLabels.paymentDetails.futureRentRevisions.revisionDate} 
//                   </label>
//                   <input
//                     type="date"
//                     id={`revisionDate-${revision.id}`}
//                     className={`w-full rounded-md border ${errors.rentRevisions ? "border-red-300" : "border-gray-300"
//                       } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                       disabled ? "bg-gray-100 cursor-not-allowed" : ""
//                     }`}
//                     value={revision.revisionDate}
//                     onFocus={(e) => !disabled && e.target.showPicker && e.target.showPicker()}
//                     onChange={(e) =>
//                       handleRentRevisionChange(
//                         revision.id,
//                         "revisionDate",
//                         e.target.value
//                       )
//                     }
//                     disabled={disabled}
//                     readOnly={readOnly}
//                   />
//                 </div>

//                 <div>
//                   <label
//                     htmlFor={`revisedPayment-${revision.id}`}
//                     className="block text-sm font-medium text-gray-700 mb-1"
//                   >
//                     {LeaseFormLabels.paymentDetails.futureRentRevisions.revisedPayment}
//                   </label>
//                   <div className="relative">
//                     <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
//                       $
//                     </span>
//                     <input
//                       type="number"
//                       id={`revisedPayment-${revision.id}`}
//                       className={`w-full rounded-md border ${errors.rentRevisions ? "border-red-300" : "border-gray-300"
//                         } pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                         disabled ? "bg-gray-100 cursor-not-allowed" : ""
//                       }`}
//                       placeholder="0.00"
//                       step="0.01"
//                       value={revision.revisedPayment}
//                       onChange={(e) =>
//                         handleRentRevisionChange(
//                           revision.id,
//                           "revisedPayment",
//                           e.target.value
//                         )
//                       }
//                       min={0}
//                       disabled={disabled}
//                       readOnly={readOnly}
//                       onKeyDown={(e) => {
//                         if (e.key === "-" || e.key === "e") {
//                           e.preventDefault();
//                         }
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           // Excel-like table format
//           <div className="overflow-x-auto">
//             <table className={`w-full border-collapse ${errors.rentRevisions ? "border-red-300" : "border-gray-300"
//               } border`}>
//               <thead>
//                 <tr className="bg-gray-50">
//                   <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
//                     #
//                   </th>
//                   <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
//                     Future Rent Revision Date
//                   </th>
//                   <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
//                     Revised Monthly Lease Payment ($)
//                   </th>
//                   {!readOnly && (
//                     <th className="border border-gray-300 px-4 py-3 text-center text-sm font-medium text-gray-700">
//                       Actions
//                     </th>
//                   )}
//                 </tr>
//               </thead>
//               <tbody>
//                 {rentRevisions.map((revision, index) => (
//                   <tr key={revision.id} className="hover:bg-gray-50">
//                     <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
//                       {index + 1}
//                     </td>
//                     <td className="border border-gray-300 p-0">
//                       <input
//                         type="date"
//                         className={`w-full border-0 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
//                           (!revision.revisionDate && revision.revisedPayment && errors.rentRevisions) ? "bg-red-50" : ""
//                         } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
//                         value={revision.revisionDate}
//                         min={getMinDateForRevision(index)}
//                         onChange={(e) =>
//                           handleRentRevisionChange(
//                             revision.id,
//                             "revisionDate",
//                             e.target.value
//                           )
//                         }
//                         disabled={disabled}
//                         readOnly={readOnly}
//                       />
//                     </td>
//                     <td className="border border-gray-300 p-0">
//                       <input
//                         type="number"
//                         className={`w-full border-0 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
//                           (!revision.revisedPayment && revision.revisionDate && errors.rentRevisions) ? "bg-red-50" : ""
//                         } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
//                         placeholder="0.00"
//                         step="0.01"
//                         value={revision.revisedPayment}
//                         onChange={(e) =>
//                           handleRentRevisionChange(
//                             revision.id,
//                             "revisedPayment",
//                             e.target.value
//                           )
//                         }
//                         min={0}
//                         disabled={disabled}
//                         readOnly={readOnly}
//                         onKeyDown={(e) => {
//                           if (e.key === "-" || e.key === "e") {
//                             e.preventDefault();
//                           }
//                         }}
//                       />
//                     </td>
//                     {!readOnly && (
//                       <td className="border border-gray-300 px-4 py-2 text-center">
//                         <div className="flex justify-center gap-2">
//                           {rentRevisions.length > 1 && (
//                             <button
//                               type="button"
//                               onClick={() => removeRentRevision(revision.id)}
//                               className="p-1 text-red-600 hover:text-red-800 focus:outline-none"
//                               aria-label="Delete row"
//                             >
//                               <Trash2 size={16} />
//                             </button>
//                           )}
//                         </div>
//                       </td>
//                     )}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>

// {!readOnly && (
//   <div className="mt-8 flex justify-between">
//     <button
//       type="button"
//       onClick={onPrevious}
//       className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
//     >
//       Previous
//     </button>
//     <div className="flex gap-2">
//       <button
//         type="button"
//         className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
//       >
//         Save
//       </button>
//       <button
//         type="button"
//         onClick={handleNext}
//         className="bg-[#008F98] text-white px-4 py-2 rounded-md hover:bg-[#007A82] transition-colors"
//       >
//         Next
//       </button>
//     </div>
//   </div>
// )}

// {/* READ-ONLY MODE NAVIGATION */}
// {readOnly && (
//   <div className="mt-8 flex justify-between">
//     <button
//       type="button"
//       onClick={onPrevious}
//       className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
//     >
//       Previous
//     </button>
//     <button
//       type="button"
//       onClick={onNext}
//       className="bg-[#008F98] text-white px-4 py-2 rounded-md hover:bg-[#007A82] transition-colors"
//     >
//       Next
//     </button>
//   </div>
// )}

//     </div>
//   );
// };

// export default LeaseFinancialDetails;


import React, { useState, useEffect } from "react";
import { Trash2, Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { LeaseFormLabels } from "./LeaseFormLabel";
import { LeaseFormData, RentRevision } from "../../../../types";

interface LeaseFinancialDetailsProps {
  formData: LeaseFormData;
  updateFormData: (data: Partial<LeaseFormData>) => void;
  onPrevious: () => void;
  onNext: () => void;
  isSaving?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
}

interface FormErrors {
  annualPayment?: string;
  incrementalBorrowingRate?: string;
  paymentFrequency?: string;
  paymentTiming?: string;
  rentRevisions?: string;
}

const LeaseFinancialDetails: React.FC<LeaseFinancialDetailsProps> = ({
  formData,
  updateFormData,
  onPrevious,
  onNext,
  readOnly = false,
  disabled = false,
}) => {
  const [showExcelFormat, setShowExcelFormat] = useState(
    (formData.rentRevisions && formData.rentRevisions.length > 1) || false
  );

  const [rentRevisions, setRentRevisions] = useState<RentRevision[]>(
    formData.rentRevisions || [
      {
        id: uuidv4(),
        revisionDate: "",
        revisedPayment: "",
      },
    ]
  );

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!readOnly) {
      updateFormData({ rentRevisions });
    }
  }, [rentRevisions, readOnly]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (readOnly) return;
    
    const { name, value } = e.target;
    updateFormData({ [name]: value });
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const getMinDateForRevision = (index: number) => {
    if (index === 0) return ""; // No restriction for first revision
    
    // Get the previous revision's date
    const prevRevisionDate = rentRevisions[index - 1]?.revisionDate;
    if (!prevRevisionDate) return "";
    
    // Return the day after the previous revision's date
    const prevDate = new Date(prevRevisionDate);
    prevDate.setDate(prevDate.getDate() + 1);
    return prevDate.toISOString().split('T')[0];
  };

  const handleRentRevisionChange = (
    id: string,
    field: keyof RentRevision,
    value: string
  ) => {
    if (readOnly) return;
    
    const revisionIndex = rentRevisions.findIndex(rev => rev.id === id);
    
    setRentRevisions((prevRevisions) => {
      const newRevisions = prevRevisions.map((revision) =>
        revision.id === id ? { ...revision, [field]: value } : revision
      );
      
      // If we're changing a date, we need to clear all subsequent dates
      if (field === 'revisionDate' && value) {
        for (let i = revisionIndex + 1; i < newRevisions.length; i++) {
          newRevisions[i].revisionDate = "";
        }
      }
      
      return newRevisions;
    });
    
    // Clear rent revisions error if any field is updated
    if (errors.rentRevisions) {
      setErrors({ ...errors, rentRevisions: undefined });
    }
  };

  const addRentRevision = () => {
    if (readOnly) return;
    
    if (!showExcelFormat) {
      setShowExcelFormat(true);
    }

    const newRevision: RentRevision = {
      id: uuidv4(),
      revisionDate: "",
      revisedPayment: "",
    };

    setRentRevisions((prev) => [...prev, newRevision]);
  };

  const removeRentRevision = (id: string) => {
    if (readOnly) return;
    
    setRentRevisions((prev) => {
      const newRevisions = prev.filter((revision) => revision.id !== id);
      if (newRevisions.length <= 1) {
        setShowExcelFormat(false);
      }
      return newRevisions;
    });
  };

  const validateForm = () => {
    if (readOnly) return true;
    
    const newErrors: FormErrors = {};

    if (!formData.annualPayment) {
      newErrors.annualPayment = "Monthly lease payment is required";
    }

    if (!formData.incrementalBorrowingRate) {
      newErrors.incrementalBorrowingRate = "Incremental borrowing rate is required";
    }

    if (!formData.paymentFrequency) {
      newErrors.paymentFrequency = "Payment frequency is required";
    }

    if (!formData.paymentTiming) {
      newErrors.paymentTiming = "Payment timing is required";
    }

    // Only validate rent revisions if they have been partially filled
    const hasPartialRevision = rentRevisions.some(
      (revision) => (revision.revisionDate && !revision.revisedPayment) || 
                   (!revision.revisionDate && revision.revisedPayment)
    );

    if (hasPartialRevision) {
      newErrors.rentRevisions = "If filling rent revisions, both date and payment amount are required";
    }

    // Validate date order only for filled revisions
    const filledRevisions = rentRevisions.filter(
      (revision) => revision.revisionDate && revision.revisedPayment
    );
    
    for (let i = 1; i < filledRevisions.length; i++) {
      const currentDate = filledRevisions[i].revisionDate;
      const prevDate = filledRevisions[i - 1].revisionDate;
      
      if (new Date(currentDate) <= new Date(prevDate)) {
        newErrors.rentRevisions = "Each revision date must be after the previous one";
        break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (readOnly || validateForm()) {
      onNext();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Lease Payment Details</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <label
            htmlFor="annualPayment"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {LeaseFormLabels.paymentDetails.monthlyPayment} <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 text-sm h-full pointer-events-none">
              ₹
            </span>

            <input
              type="number"
              id="annualPayment"
              name="annualPayment"
              className={`w-full rounded-md border ${errors.annualPayment ? "border-red-300" : "border-gray-300"
                } pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                disabled ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              placeholder="0.00"
              step="0.01"
              value={formData.annualPayment || ""}
              onChange={handleInputChange}
              min={0}
              disabled={disabled}
              readOnly={readOnly}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") {
                  e.preventDefault();
                }
              }}
            />
            {errors.annualPayment && (
              <p className="mt-1 text-sm text-red-600">{errors.annualPayment}</p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="incrementalBorrowingRate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {LeaseFormLabels.paymentDetails.borrowingRate} <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              id="incrementalBorrowingRate"
              name="incrementalBorrowingRate"
              className={`w-full rounded-md border ${errors.incrementalBorrowingRate ? "border-red-300" : "border-gray-300"
                } pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                disabled ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              placeholder="0.00"
              step="0.01"
              value={formData.incrementalBorrowingRate || ""}
              onChange={handleInputChange}
              min={0}
              disabled={disabled}
              readOnly={readOnly}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") {
                  e.preventDefault();
                }
              }}
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 text-sm h-full pointer-events-none">
              %
            </span>

            {errors.incrementalBorrowingRate && (
              <p className="mt-1 text-sm text-red-600">{errors.incrementalBorrowingRate}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <label
            htmlFor="paymentFrequency"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {LeaseFormLabels.paymentDetails.paymentFrequency} <span className="text-red-600">*</span>
          </label>
          <select
            id="paymentFrequency"
            name="paymentFrequency"
            className={`w-full rounded-md border ${errors.paymentFrequency ? "border-red-300" : "border-gray-300"
              } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              disabled ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            value={formData.paymentFrequency || ""}
            onChange={handleInputChange}
            disabled={disabled}
          >
            <option value="">Select frequency</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="semiannual">Semi-annual</option>
            <option value="annual">Annual</option>
          </select>
          {errors.paymentFrequency && (
            <p className="mt-1 text-sm text-red-600">{errors.paymentFrequency}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="paymentTiming"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {LeaseFormLabels.paymentDetails.paymentTiming} <span className="text-red-600">*</span>
          </label>
          <select
            id="paymentTiming"
            name="paymentTiming"
            className={`w-full rounded-md border ${errors.paymentTiming ? "border-red-300" : "border-gray-300"
              } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              disabled ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            value={formData.paymentTiming || ""}
            onChange={handleInputChange}
            disabled={disabled}
          >
            <option value="">Select timing</option>
            <option value="beginning">Beginning of period</option>
            <option value="end">End of period</option>
          </select>
          {errors.paymentTiming && (
            <p className="mt-1 text-sm text-red-600">{errors.paymentTiming}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="paymentDelay"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {LeaseFormLabels.paymentDetails.fitoutPeriod}
          </label>
          <input
            type="number"
            id="paymentDelay"
            name="paymentDelay"
            className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              disabled ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
            placeholder="0"
            min={0}
            onKeyDown={(e) => {
              if (e.key === "-" || e.key === "e") {
                e.preventDefault();
              }
            }}
            value={formData.paymentDelay || ""}
            onChange={handleInputChange}
            disabled={disabled}
            readOnly={readOnly}
          />
        </div>
      </div>

      <div className="bg-white mt-10">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-800">
              Future Rent Revisions
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Optional - Fill only if you have planned rent increases
            </p>
          </div>
          {!readOnly && (
            <button
              type="button"
              onClick={addRentRevision}
              className="bg-[#008F98] text-white px-4 py-2 rounded-md hover:bg-[#007a82] transition-colors flex items-center gap-2"
            >
              <Plus size={16} />
              Add
            </button>
          )}
        </div>

        {/* Initial Direct Costs */}
        <div className="mb-8">
          <label
            htmlFor="initialDirectCosts"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {LeaseFormLabels.paymentDetails.initialDirectCosts}
          </label>
          <div className="relative max-w-md">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              ₹
            </span>
            <input
              type="number"
              id="initialDirectCosts"
              name="initialDirectCosts"
              className={`w-full rounded-md border border-gray-300 pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                disabled ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              placeholder="0.00"
              step="0.01"
              min={0}
              onKeyDown={(e) => {
                if (e.key === "-" || e.key === "e") {
                  e.preventDefault();
                }
              }}
              value={formData.initialDirectCosts || ""}
              onChange={handleInputChange}
              disabled={disabled}
              readOnly={readOnly}
            />
          </div>
        </div>

        {errors.rentRevisions && (
          <p className="text-sm text-red-600 mb-2">{errors.rentRevisions}</p>
        )}

        {!showExcelFormat ? (
          // Single entry format
          rentRevisions.slice(0, 1).map((revision) => (
            <div
              key={revision.id}
              className={`border ${errors.rentRevisions ? "border-red-300" : "border-gray-200"
                } rounded-md p-4`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div>
                  <label
                    htmlFor={`revisionDate-${revision.id}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {LeaseFormLabels.paymentDetails.futureRentRevisions.revisionDate} 
                  </label>
                  <input
                    type="date"
                    id={`revisionDate-${revision.id}`}
                    className={`w-full rounded-md border ${errors.rentRevisions ? "border-red-300" : "border-gray-300"
                      } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      disabled ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                    value={revision.revisionDate}
                    onFocus={(e) => !disabled && e.target.showPicker && e.target.showPicker()}
                    onChange={(e) =>
                      handleRentRevisionChange(
                        revision.id,
                        "revisionDate",
                        e.target.value
                      )
                    }
                    disabled={disabled}
                    readOnly={readOnly}
                  />
                </div>

                <div>
                  <label
                    htmlFor={`revisedPayment-${revision.id}`}
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {LeaseFormLabels.paymentDetails.futureRentRevisions.revisedPayment}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      ₹
                    </span>
                    <input
                      type="number"
                      id={`revisedPayment-${revision.id}`}
                      className={`w-full rounded-md border ${errors.rentRevisions ? "border-red-300" : "border-gray-300"
                        } pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        disabled ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
                      placeholder="0.00"
                      step="0.01"
                      value={revision.revisedPayment}
                      onChange={(e) =>
                        handleRentRevisionChange(
                          revision.id,
                          "revisedPayment",
                          e.target.value
                        )
                      }
                      min={0}
                      disabled={disabled}
                      readOnly={readOnly}
                      onKeyDown={(e) => {
                        if (e.key === "-" || e.key === "e") {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          // Excel-like table format
          <div className="overflow-x-auto">
            <table className={`w-full border-collapse ${errors.rentRevisions ? "border-red-300" : "border-gray-300"
              } border`}>
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                    #
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Future Rent Revision Date
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Revised Monthly Lease Payment (₹)
                  </th>
                  {!readOnly && (
                    <th className="border border-gray-300 px-4 py-3 text-center text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {rentRevisions.map((revision, index) => (
                  <tr key={revision.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                      {index + 1}
                    </td>
                    <td className="border border-gray-300 p-0">
                      <input
                        type="date"
                        className={`w-full border-0 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
                          (!revision.revisionDate && revision.revisedPayment && errors.rentRevisions) ? "bg-red-50" : ""
                        } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                        value={revision.revisionDate}
                        min={getMinDateForRevision(index)}
                        onChange={(e) =>
                          handleRentRevisionChange(
                            revision.id,
                            "revisionDate",
                            e.target.value
                          )
                        }
                        disabled={disabled}
                        readOnly={readOnly}
                      />
                    </td>
                    <td className="border border-gray-300 p-0">
                      <input
                        type="number"
                        className={`w-full border-0 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
                          (!revision.revisedPayment && revision.revisionDate && errors.rentRevisions) ? "bg-red-50" : ""
                        } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                        placeholder="0.00"
                        step="0.01"
                        value={revision.revisedPayment}
                        onChange={(e) =>
                          handleRentRevisionChange(
                            revision.id,
                            "revisedPayment",
                            e.target.value
                          )
                        }
                        min={0}
                        disabled={disabled}
                        readOnly={readOnly}
                        onKeyDown={(e) => {
                          if (e.key === "-" || e.key === "e") {
                            e.preventDefault();
                          }
                        }}
                      />
                    </td>
                    {!readOnly && (
                      <td className="border border-gray-300 px-4 py-2 text-center">
                        <div className="flex justify-center gap-2">
                          {rentRevisions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeRentRevision(revision.id)}
                              className="p-1 text-red-600 hover:text-red-800 focus:outline-none"
                              aria-label="Delete row"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

{!readOnly && (
  <div className="mt-8 flex justify-between">
    <button
      type="button"
      onClick={onPrevious}
      className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
    >
      Previous
    </button>
    <div className="flex gap-2">
      <button
        type="button"
        className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
      >
        Save
      </button>
      <button
        type="button"
        onClick={handleNext}
        className="bg-[#008F98] text-white px-4 py-2 rounded-md hover:bg-[#007A82] transition-colors"
      >
        Next
      </button>
    </div>
  </div>
)}

{/* READ-ONLY MODE NAVIGATION */}
{readOnly && (
  <div className="mt-8 flex justify-between">
    <button
      type="button"
      onClick={onPrevious}
      className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
    >
      Previous
    </button>
    <button
      type="button"
      onClick={onNext}
      className="bg-[#008F98] text-white px-4 py-2 rounded-md hover:bg-[#007A82] transition-colors"
    >
      Next
    </button>
  </div>
)}

    </div>
  );
};

export default LeaseFinancialDetails;