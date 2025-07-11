
// import React, { useState, useEffect } from "react";
// import { Trash2, Plus } from "lucide-react";
// import { v4 as uuidv4 } from "uuid";
// import { LeaseFormLabels } from "./LeaseFormLabel";
// import { LeaseFormData, SecurityDeposit } from "../../../../types";

// interface LeaseRentRevisionProps {
//   formData: LeaseFormData;
//   updateFormData: (data: Partial<LeaseFormData>) => void;
//   onPrevious: () => void;
//   onNext: () => void;
//   isSaving?: boolean;
//   readOnly?: boolean;
//   disabled?: boolean;
// }

// interface FormErrors {
//   [key: string]: string | undefined;
// }

// const LeaseRentRevision: React.FC<LeaseRentRevisionProps> = ({
//   formData,
//   updateFormData,
//   onPrevious,
//   onNext,
//   readOnly = false,
//   disabled = false,
// }) => {
//   const [showExcelFormat, setShowExcelFormat] = useState(
//     (formData.securityDeposits && formData.securityDeposits.length > 1) || false
//   );

//   const [securityDeposits, setSecurityDeposits] = useState<SecurityDeposit[]>(
//     formData.securityDeposits || [
//       {
//         id: uuidv4(),
//         depositNumber: "",
//         amount: "",
//         rate: "",
//         startDate: "",
//         endDate: "",
//         remark: "",
//       },
//     ]
//   );

//   const [errors, setErrors] = useState<FormErrors>({});

//   useEffect(() => {
//     if (!readOnly) {
//       updateFormData({ securityDeposits });
//     }
//   }, [securityDeposits, readOnly]);

//   const handleSecurityDepositChange = (
//     id: string,
//     field: keyof SecurityDeposit,
//     value: string,
//     index: number
//   ) => {
//     if (readOnly) return;
    
//     setSecurityDeposits((prevDeposits) => {
//       const newDeposits = [...prevDeposits];
//       newDeposits[index] = { ...newDeposits[index], [field]: value };

//       // If start date is changed, ensure end date is still valid
//       if (
//         field === "startDate" &&
//         newDeposits[index].endDate &&
//         value > newDeposits[index].endDate
//       ) {
//         newDeposits[index].endDate = "";
//       }

//       return newDeposits;
//     });

//     // Clear error when user starts typing
//     if (errors[`${id}-${field}`]) {
//       const newErrors = { ...errors };
//       delete newErrors[`${id}-${field}`];
//       setErrors(newErrors);
//     }
//   };

//   const addSecurityDeposit = () => {
//     if (readOnly) return;
    
//     if (!showExcelFormat) {
//       setShowExcelFormat(true);
//     }

//     const newDeposit: SecurityDeposit = {
//       id: uuidv4(),
//       depositNumber: "",
//       amount: "",
//       rate: "",
//       startDate: "",
//       endDate: "",
//       remark: "",
//     };

//     setSecurityDeposits((prev) => [...prev, newDeposit]);
//   };

//   const removeSecurityDeposit = (id: string) => {
//     if (readOnly) return;
    
//     setSecurityDeposits((prev) => {
//       const newDeposits = prev.filter((deposit) => deposit.id !== id);
//       if (newDeposits.length <= 1) {
//         setShowExcelFormat(false);
//       }
//       return newDeposits;
//     });

//     // Remove any errors associated with this deposit
//     const newErrors = { ...errors };
//     Object.keys(newErrors).forEach((key) => {
//       if (key.startsWith(`${id}-`)) {
//         delete newErrors[key];
//       }
//     });
//     setErrors(newErrors);
//   };

//   const validateForm = () => {
//     if (readOnly) return true;
    
//     const newErrors: FormErrors = {};
//     let isValid = true;

//     // Only validate fields that have been filled out
//     securityDeposits.forEach((deposit, index) => {
//       // Only validate if any field is filled - partial validation
//       const hasAnyData =
//         deposit.depositNumber ||
//         deposit.amount ||
//         deposit.rate ||
//         deposit.startDate ||
//         deposit.endDate ||
//         deposit.remark;

//       if (hasAnyData) {
//         // If user started filling the deposit, validate date sequence only
//         if (deposit.startDate && deposit.endDate) {
//           if (deposit.startDate > deposit.endDate) {
//             newErrors[`${deposit.id}-endDate`] =
//               "End date must be after start date";
//             isValid = false;
//           }

//           // For deposits after the first one, check if start date is after previous end date
//           if (index > 0) {
//             const prevDeposit = securityDeposits[index - 1];
//             if (
//               prevDeposit.endDate &&
//               deposit.startDate <= prevDeposit.endDate
//             ) {
//               newErrors[
//                 `${deposit.id}-startDate`
//               ] = `Start date must be after previous deposit's end date (${prevDeposit.endDate})`;
//               isValid = false;
//             }
//           }
//         }
//       }
//     });

//     setErrors(newErrors);
//     return isValid;
//   };

//   const handleNext = () => {
//     if (readOnly || validateForm()) {
//       onNext();
//     }
//   };

//   return (
//     <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
//       {/* Security Deposits Section */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
//         <div>
//           <h3 className="text-lg font-medium text-gray-800">
//             Security Deposit
//           </h3>
//         </div>
//         {!readOnly && (
//           <button
//             type="button"
//             onClick={addSecurityDeposit}
//             className="bg-[#008F98] text-white px-4 py-2 rounded-md hover:bg-[#007a82] transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
//           >
//             <Plus size={16} />
//             <span>Add Deposit</span>
//           </button>
//         )}
//       </div>

//       {!showExcelFormat ? (
//         // Single entry format - optimized for mobile
//         securityDeposits.slice(0, 1).map((deposit, index) => (
//           <div
//             key={deposit.id}
//             className="border border-gray-200 rounded-md p-4 mb-6"
//           >
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4">
//               <div>
//                 <label
//                   htmlFor={`depositNumber-${deposit.id}`}
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   {LeaseFormLabels.securityDeposits.depositName}
//                 </label>
//                 <input
//                   type="text"
//                   id={`depositNumber-${deposit.id}`}
//                   className={`w-full rounded-md border ${
//                     errors[`${deposit.id}-depositNumber`]
//                       ? "border-red-300"
//                       : "border-gray-300"
//                   } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     disabled ? "bg-gray-100 cursor-not-allowed" : ""
//                   }`}
//                   placeholder="Enter deposit name"
//                   value={deposit.depositNumber}
//                   onChange={(e) =>
//                     handleSecurityDepositChange(
//                       deposit.id,
//                       "depositNumber",
//                       e.target.value,
//                       index
//                     )
//                   }
//                   disabled={disabled}
//                   readOnly={readOnly}
//                 />
//                 {errors[`${deposit.id}-depositNumber`] && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors[`${deposit.id}-depositNumber`]}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label
//                   htmlFor={`amount-${deposit.id}`}
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   {LeaseFormLabels.securityDeposits.amount}
//                 </label>
//                 <div className="relative">
//                   <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
//                     $
//                   </span>
//                   <input
//                     type="number"
//                     id={`amount-${deposit.id}`}
//                     className={`w-full rounded-md border ${
//                       errors[`${deposit.id}-amount`]
//                         ? "border-red-300"
//                         : "border-gray-300"
//                     } pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                       disabled ? "bg-gray-100 cursor-not-allowed" : ""
//                     }`}
//                     placeholder="0.00"
//                     step="0.01"
//                     value={deposit.amount}
//                     min={0}
//                     onKeyDown={(e) => {
//                       if (e.key === "-" || e.key === "e") {
//                         e.preventDefault();
//                       }
//                     }}
//                     onChange={(e) =>
//                       handleSecurityDepositChange(
//                         deposit.id,
//                         "amount",
//                         e.target.value,
//                         index
//                       )
//                     }
//                     disabled={disabled}
//                     readOnly={readOnly}
//                   />
//                 </div>
//                 {errors[`${deposit.id}-amount`] && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors[`${deposit.id}-amount`]}
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4">
//               <div>
//                 <label
//                   htmlFor={`rate-${deposit.id}`}
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   {LeaseFormLabels.securityDeposits.discountRate}
//                 </label>
//                 <div className="relative">
//                   <input
//                     type="number"
//                     id={`rate-${deposit.id}`}
//                     className={`w-full rounded-md border ${
//                       errors[`${deposit.id}-rate`]
//                         ? "border-red-300"
//                         : "border-gray-300"
//                     } pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                       disabled ? "bg-gray-100 cursor-not-allowed" : ""
//                     }`}
//                     placeholder="0.00"
//                     step="0.01"
//                     value={deposit.rate}
//                     min={0}
//                     onKeyDown={(e) => {
//                       if (e.key === "-" || e.key === "e") {
//                         e.preventDefault();
//                       }
//                     }}
//                     onChange={(e) =>
//                       handleSecurityDepositChange(
//                         deposit.id,
//                         "rate",
//                         e.target.value,
//                         index
//                       )
//                     }
//                     disabled={disabled}
//                     readOnly={readOnly}
//                   />
//                   <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
//                     %
//                   </span>
//                 </div>
//                 {errors[`${deposit.id}-rate`] && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors[`${deposit.id}-rate`]}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label
//                   htmlFor={`startDate-${deposit.id}`}
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   {LeaseFormLabels.securityDeposits.startDate}
//                 </label>
//                 <input
//                   type="date"
//                   id={`startDate-${deposit.id}`}
//                   className={`w-full rounded-md border ${
//                     errors[`${deposit.id}-startDate`]
//                       ? "border-red-300"
//                       : "border-gray-300"
//                   } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     disabled ? "bg-gray-100 cursor-not-allowed" : ""
//                   }`}
//                   value={deposit.startDate || ""}
//                   onFocus={(e) => !disabled && e.target.showPicker && e.target.showPicker()}
//                   onChange={(e) =>
//                     handleSecurityDepositChange(
//                       deposit.id,
//                       "startDate",
//                       e.target.value,
//                       index
//                     )
//                   }
//                   disabled={disabled}
//                   readOnly={readOnly}
//                 />
//                 {errors[`${deposit.id}-startDate`] && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors[`${deposit.id}-startDate`]}
//                   </p>
//                 )}
//               </div>

//               <div>
//                 <label
//                   htmlFor={`endDate-${deposit.id}`}
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   {LeaseFormLabels.securityDeposits.endDate}
//                 </label>
//                 <input
//                   type="date"
//                   id={`endDate-${deposit.id}`}
//                   className={`w-full rounded-md border ${
//                     errors[`${deposit.id}-endDate`]
//                       ? "border-red-300"
//                       : "border-gray-300"
//                   } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     disabled ? "bg-gray-100 cursor-not-allowed" : ""
//                   }`}
//                   value={deposit.endDate}
//                   min={deposit.startDate || undefined}
//                   onFocus={(e) => !disabled && e.target.showPicker && e.target.showPicker()}
//                   onChange={(e) =>
//                     handleSecurityDepositChange(
//                       deposit.id,
//                       "endDate",
//                       e.target.value,
//                       index
//                     )
//                   }
//                   disabled={disabled}
//                   readOnly={readOnly}
//                 />
//                 {errors[`${deposit.id}-endDate`] && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors[`${deposit.id}-endDate`]}
//                   </p>
//                 )}
//               </div>
//             </div>

//             <div className="mt-4">
//               <label
//                 htmlFor={`remark-${deposit.id}`}
//                 className="block text-sm font-semibold text-gray-800 mb-1 sm:mb-2"
//               >
//               {LeaseFormLabels.securityDeposits.remark}
//               </label>
//               <textarea
//                 id={`remark-${deposit.id}`}
//                 name="remark"
//                 value={deposit.remark || ""}
//                 rows={3}
//                 placeholder="Enter remark"
//                 onChange={(e) =>
//                   handleSecurityDepositChange(
//                     deposit.id,
//                     "remark",
//                     e.target.value,
//                     index
//                   )
//                 }
//                 className={`w-full rounded-md border ${
//                   errors[`${deposit.id}-remark`]
//                     ? "border-red-300"
//                     : "border-gray-300"
//                 } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                   disabled ? "bg-gray-100 cursor-not-allowed" : ""
//                 }`}
//                 disabled={disabled}
//                 readOnly={readOnly}
//               ></textarea>
//               {errors[`${deposit.id}-remark`] && (
//                 <p className="mt-1 text-sm text-red-600">
//                   {errors[`${deposit.id}-remark`]}
//                 </p>
//               )}
//             </div>
//           </div>
//         ))
//       ) : (
//         // Excel-like table format - responsive with horizontal scroll on small devices
//         <div className="overflow-x-auto">
//           <div className="min-w-[800px]">
//             <table className="w-full border-collapse border-gray-300 border">
//               <thead>
//                 <tr className="bg-gray-50">
//                   <th className="border border-gray-300 px-3 py-2 sm:px-4 sm:py-3 text-left text-sm font-medium text-gray-700">
//                     Deposit Name
//                   </th>
//                   <th className="border border-gray-300 px-3 py-2 sm:px-4 sm:py-3 text-left text-sm font-medium text-gray-700">
//                     Amount ($)
//                   </th>
//                   <th className="border border-gray-300 px-3 py-2 sm:px-4 sm:py-3 text-left text-sm font-medium text-gray-700">
//                     Rate (%)
//                   </th>
//                   <th className="border border-gray-300 px-3 py-2 sm:px-4 sm:py-3 text-left text-sm font-medium text-gray-700">
//                     Start Date
//                   </th>
//                   <th className="border border-gray-300 px-3 py-2 sm:px-4 sm:py-3 text-left text-sm font-medium text-gray-700">
//                     End Date
//                   </th>
//                   <th className="border border-gray-300 px-3 py-2 sm:px-4 sm:py-3 text-left text-sm font-medium text-gray-700">
//                     Remark
//                   </th>
//                   {!readOnly && (
//                     <th className="border border-gray-300 px-3 py-2 sm:px-4 sm:py-3 text-center text-sm font-medium text-gray-700">
//                       Actions
//                     </th>
//                   )}
//                 </tr>
//               </thead>
//               <tbody>
//                 {securityDeposits.map((deposit, index) => (
//                   <tr key={deposit.id} className="hover:bg-gray-50">
//                     <td className="border border-gray-300 p-0">
//                       <div className="flex flex-col">
//                         <input
//                           type="text"
//                           className={`w-full border-0 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
//                             errors[`${deposit.id}-depositNumber`]
//                               ? "bg-red-50"
//                               : ""
//                           } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
//                           placeholder="Enter deposit name"
//                           value={deposit.depositNumber}
//                           onChange={(e) =>
//                             handleSecurityDepositChange(
//                               deposit.id,
//                               "depositNumber",
//                               e.target.value,
//                               index
//                             )
//                           }
//                           disabled={disabled}
//                           readOnly={readOnly}
//                         />
//                         {errors[`${deposit.id}-depositNumber`] && (
//                           <span className="text-xs text-red-600 px-3 pb-1">
//                             {errors[`${deposit.id}-depositNumber`]}
//                           </span>
//                         )}
//                       </div>
//                     </td>
//                     <td className="border border-gray-300 p-0">
//                       <div className="flex flex-col">
//                         <input
//                           type="number"
//                           className={`w-full border-0 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
//                             errors[`${deposit.id}-amount`] ? "bg-red-50" : ""
//                           } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
//                           placeholder="0.00"
//                           step="0.01"
//                           value={deposit.amount}
//                           onChange={(e) =>
//                             handleSecurityDepositChange(
//                               deposit.id,
//                               "amount",
//                               e.target.value,
//                               index
//                             )
//                           }
//                           disabled={disabled}
//                           readOnly={readOnly}
//                         />
//                         {errors[`${deposit.id}-amount`] && (
//                           <span className="text-xs text-red-600 px-3 pb-1">
//                             {errors[`${deposit.id}-amount`]}
//                           </span>
//                         )}
//                       </div>
//                     </td>
//                     <td className="border border-gray-300 p-0">
//                       <div className="flex flex-col">
//                         <input
//                           type="number"
//                           className={`w-full border-0 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
//                             errors[`${deposit.id}-rate`] ? "bg-red-50" : ""
//                           } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
//                           placeholder="0.00"
//                           step="0.01"
//                           value={deposit.rate}
//                           onChange={(e) =>
//                             handleSecurityDepositChange(
//                               deposit.id,
//                               "rate",
//                               e.target.value,
//                               index
//                             )
//                           }
//                           disabled={disabled}
//                           readOnly={readOnly}
//                         />
//                         {errors[`${deposit.id}-rate`] && (
//                           <span className="text-xs text-red-600 px-3 pb-1">
//                             {errors[`${deposit.id}-rate`]}
//                           </span>
//                         )}
//                       </div>
//                     </td>
//                     <td className="border border-gray-300 p-0">
//                       <div className="flex flex-col">
//                         <input
//                           type="date"
//                           className={`w-full border-0 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
//                             errors[`${deposit.id}-startDate`] ? "bg-red-50" : ""
//                           } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
//                           value={deposit.startDate}
//                           min={
//                             index > 0
//                               ? securityDeposits[index - 1].endDate
//                               : undefined
//                           }
//                           onChange={(e) =>
//                             handleSecurityDepositChange(
//                               deposit.id,
//                               "startDate",
//                               e.target.value,
//                               index
//                             )
//                           }
//                           disabled={disabled}
//                           readOnly={readOnly}
//                         />
//                         {errors[`${deposit.id}-startDate`] && (
//                           <span className="text-xs text-red-600 px-3 pb-1">
//                             {errors[`${deposit.id}-startDate`]}
//                           </span>
//                         )}
//                       </div>
//                     </td>
//                     <td className="border border-gray-300 p-0">
//                       <div className="flex flex-col">
//                         <input
//                           type="date"
//                           className={`w-full border-0 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
//                             errors[`${deposit.id}-endDate`] ? "bg-red-50" : ""
//                           } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
//                           value={deposit.endDate}
//                           min={deposit.startDate || undefined}
//                           onChange={(e) =>
//                             handleSecurityDepositChange(
//                               deposit.id,
//                               "endDate",
//                               e.target.value,
//                               index
//                             )
//                           }
//                           disabled={disabled}
//                           readOnly={readOnly}
//                         />
//                         {errors[`${deposit.id}-endDate`] && (
//                           <span className="text-xs text-red-600 px-3 pb-1">
//                             {errors[`${deposit.id}-endDate`]}
//                           </span>
//                         )}
//                       </div>
//                     </td>
//                     <td className="border border-gray-300 p-0">
//                       <div className="flex flex-col">
//                         <input
//                           type="text"
//                           className={`w-full border-0 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
//                             errors[`${deposit.id}-remark`] ? "bg-red-50" : ""
//                           } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
//                           placeholder="Enter remark"
//                           value={deposit.remark}
//                           onChange={(e) =>
//                             handleSecurityDepositChange(
//                               deposit.id,
//                               "remark",
//                               e.target.value,
//                               index
//                             )
//                           }
//                           disabled={disabled}
//                           readOnly={readOnly}
//                         />
//                         {errors[`${deposit.id}-remark`] && (
//                           <span className="text-xs text-red-600 px-3 pb-1">
//                             {errors[`${deposit.id}-remark`]}
//                           </span>
//                         )}
//                       </div>
//                     </td>
//                     {!readOnly && (
//                       <td className="border border-gray-300 px-3 py-2 text-center">
//                         <div className="flex justify-center gap-2">
//                           {securityDeposits.length > 1 && (
//                             <button
//                               type="button"
//                               onClick={() => removeSecurityDeposit(deposit.id)}
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
//         </div>
//       )}

// {!readOnly && (
//   <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row justify-between gap-4">
//     <button
//       type="button"
//       onClick={onPrevious}
//       className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors w-full sm:w-auto"
//     >
//       Previous
//     </button>
//     <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
//       <button
//         type="button"
//         className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors w-full sm:w-auto"
//       >
//         Save
//       </button>
//       <button
//         type="button"
//         onClick={handleNext}
//         className="bg-[#008F98] text-white px-4 py-2 rounded-md hover:bg-[#007A82] transition-colors w-full sm:w-auto"
//       >
//         Next
//       </button>
//     </div>
//   </div>
// )}

// {/* READ-ONLY MODE NAVIGATION */}
// {readOnly && (
//   <div className="mt-6 sm:mt-8 flex justify-between">
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

// export default LeaseRentRevision;

import React, { useState, useEffect } from "react";
import { Trash2, Plus } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { LeaseFormLabels } from "./LeaseFormLabel";
import { LeaseFormData, SecurityDeposit } from "../../../../types";

interface LeaseRentRevisionProps {
  formData: LeaseFormData;
  updateFormData: (data: Partial<LeaseFormData>) => void;
  onPrevious: () => void;
  onNext: () => void;
  isSaving?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
}

interface FormErrors {
  [key: string]: string | undefined;
}

const LeaseRentRevision: React.FC<LeaseRentRevisionProps> = ({
  formData,
  updateFormData,
  onPrevious,
  onNext,
  readOnly = false,
  disabled = false,
}) => {
  const [showExcelFormat, setShowExcelFormat] = useState(
    (formData.securityDeposits && formData.securityDeposits.length > 1) || false
  );

  const [securityDeposits, setSecurityDeposits] = useState<SecurityDeposit[]>(
    formData.securityDeposits || [
      {
        id: uuidv4(),
        depositNumber: "",
        amount: "",
        rate: "",
        startDate: "",
        endDate: "",
        remark: "",
      },
    ]
  );

  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!readOnly) {
      updateFormData({ securityDeposits });
    }
  }, [securityDeposits, readOnly]);

  const handleSecurityDepositChange = (
    id: string,
    field: keyof SecurityDeposit,
    value: string,
    index: number
  ) => {
    if (readOnly) return;
    
    setSecurityDeposits((prevDeposits) => {
      const newDeposits = [...prevDeposits];
      newDeposits[index] = { ...newDeposits[index], [field]: value };

      // If start date is changed, ensure end date is still valid
      if (
        field === "startDate" &&
        newDeposits[index].endDate &&
        value > newDeposits[index].endDate
      ) {
        newDeposits[index].endDate = "";
      }

      return newDeposits;
    });

    // Clear error when user starts typing
    if (errors[`${id}-${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`${id}-${field}`];
      setErrors(newErrors);
    }
  };

  const addSecurityDeposit = () => {
    if (readOnly) return;
    
    if (!showExcelFormat) {
      setShowExcelFormat(true);
    }

    const newDeposit: SecurityDeposit = {
      id: uuidv4(),
      depositNumber: "",
      amount: "",
      rate: "",
      startDate: "",
      endDate: "",
      remark: "",
    };

    setSecurityDeposits((prev) => [...prev, newDeposit]);
  };

  const removeSecurityDeposit = (id: string) => {
    if (readOnly) return;
    
    setSecurityDeposits((prev) => {
      const newDeposits = prev.filter((deposit) => deposit.id !== id);
      if (newDeposits.length <= 1) {
        setShowExcelFormat(false);
      }
      return newDeposits;
    });

    // Remove any errors associated with this deposit
    const newErrors = { ...errors };
    Object.keys(newErrors).forEach((key) => {
      if (key.startsWith(`${id}-`)) {
        delete newErrors[key];
      }
    });
    setErrors(newErrors);
  };

  const validateForm = () => {
    if (readOnly) return true;
    
    const newErrors: FormErrors = {};
    let isValid = true;

    // Only validate fields that have been filled out
    securityDeposits.forEach((deposit, index) => {
      // Only validate if any field is filled - partial validation
      const hasAnyData =
        deposit.depositNumber ||
        deposit.amount ||
        deposit.rate ||
        deposit.startDate ||
        deposit.endDate ||
        deposit.remark;

      if (hasAnyData) {
        // If user started filling the deposit, validate date sequence only
        if (deposit.startDate && deposit.endDate) {
          if (deposit.startDate > deposit.endDate) {
            newErrors[`${deposit.id}-endDate`] =
              "End date must be after start date";
            isValid = false;
          }

          // For deposits after the first one, check if start date is after previous end date
          if (index > 0) {
            const prevDeposit = securityDeposits[index - 1];
            if (
              prevDeposit.endDate &&
              deposit.startDate <= prevDeposit.endDate
            ) {
              newErrors[
                `${deposit.id}-startDate`
              ] = `Start date must be after previous deposit's end date (${prevDeposit.endDate})`;
              isValid = false;
            }
          }
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (readOnly || validateForm()) {
      onNext();
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
      {/* Security Deposits Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <div>
          <h3 className="text-lg font-medium text-gray-800">
            Security Deposit
          </h3>
        </div>
        {!readOnly && (
          <button
            type="button"
            onClick={addSecurityDeposit}
            className="bg-[#008F98] text-white px-4 py-2 rounded-md hover:bg-[#007a82] transition-colors flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <Plus size={16} />
            <span>Add Deposit</span>
          </button>
        )}
      </div>

      {!showExcelFormat ? (
        // Single entry format - optimized for mobile
        securityDeposits.slice(0, 1).map((deposit, index) => (
          <div
            key={deposit.id}
            className="border border-gray-200 rounded-md p-4 mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4">
              <div>
                <label
                  htmlFor={`depositNumber-${deposit.id}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {LeaseFormLabels.securityDeposits.depositName}
                </label>
                <input
                  type="text"
                  id={`depositNumber-${deposit.id}`}
                  className={`w-full rounded-md border ${
                    errors[`${deposit.id}-depositNumber`]
                      ? "border-red-300"
                      : "border-gray-300"
                  } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    disabled ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  placeholder="Enter deposit name"
                  value={deposit.depositNumber}
                  onChange={(e) =>
                    handleSecurityDepositChange(
                      deposit.id,
                      "depositNumber",
                      e.target.value,
                      index
                    )
                  }
                  disabled={disabled}
                  readOnly={readOnly}
                />
                {errors[`${deposit.id}-depositNumber`] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors[`${deposit.id}-depositNumber`]}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor={`amount-${deposit.id}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {LeaseFormLabels.securityDeposits.amount}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                    ₹
                  </span>
                  <input
                    type="number"
                    id={`amount-${deposit.id}`}
                    className={`w-full rounded-md border ${
                      errors[`${deposit.id}-amount`]
                        ? "border-red-300"
                        : "border-gray-300"
                    } pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      disabled ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                    placeholder="0.00"
                    step="0.01"
                    value={deposit.amount}
                    min={0}
                    onKeyDown={(e) => {
                      if (e.key === "-" || e.key === "e") {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) =>
                      handleSecurityDepositChange(
                        deposit.id,
                        "amount",
                        e.target.value,
                        index
                      )
                    }
                    disabled={disabled}
                    readOnly={readOnly}
                  />
                </div>
                {errors[`${deposit.id}-amount`] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors[`${deposit.id}-amount`]}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4">
              <div>
                <label
                  htmlFor={`rate-${deposit.id}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {LeaseFormLabels.securityDeposits.discountRate}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id={`rate-${deposit.id}`}
                    className={`w-full rounded-md border ${
                      errors[`${deposit.id}-rate`]
                        ? "border-red-300"
                        : "border-gray-300"
                    } pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      disabled ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                    placeholder="0.00"
                    step="0.01"
                    value={deposit.rate}
                    min={0}
                    onKeyDown={(e) => {
                      if (e.key === "-" || e.key === "e") {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) =>
                      handleSecurityDepositChange(
                        deposit.id,
                        "rate",
                        e.target.value,
                        index
                      )
                    }
                    disabled={disabled}
                    readOnly={readOnly}
                  />
                  <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
                    %
                  </span>
                </div>
                {errors[`${deposit.id}-rate`] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors[`${deposit.id}-rate`]}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor={`startDate-${deposit.id}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {LeaseFormLabels.securityDeposits.startDate}
                </label>
                <input
                  type="date"
                  id={`startDate-${deposit.id}`}
                  className={`w-full rounded-md border ${
                    errors[`${deposit.id}-startDate`]
                      ? "border-red-300"
                      : "border-gray-300"
                  } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    disabled ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  value={deposit.startDate || ""}
                  onFocus={(e) => !disabled && e.target.showPicker && e.target.showPicker()}
                  onChange={(e) =>
                    handleSecurityDepositChange(
                      deposit.id,
                      "startDate",
                      e.target.value,
                      index
                    )
                  }
                  disabled={disabled}
                  readOnly={readOnly}
                />
                {errors[`${deposit.id}-startDate`] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors[`${deposit.id}-startDate`]}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor={`endDate-${deposit.id}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {LeaseFormLabels.securityDeposits.endDate}
                </label>
                <input
                  type="date"
                  id={`endDate-${deposit.id}`}
                  className={`w-full rounded-md border ${
                    errors[`${deposit.id}-endDate`]
                      ? "border-red-300"
                      : "border-gray-300"
                  } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    disabled ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  value={deposit.endDate}
                  min={deposit.startDate || undefined}
                  onFocus={(e) => !disabled && e.target.showPicker && e.target.showPicker()}
                  onChange={(e) =>
                    handleSecurityDepositChange(
                      deposit.id,
                      "endDate",
                      e.target.value,
                      index
                    )
                  }
                  disabled={disabled}
                  readOnly={readOnly}
                />
                {errors[`${deposit.id}-endDate`] && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors[`${deposit.id}-endDate`]}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label
                htmlFor={`remark-${deposit.id}`}
                className="block text-sm font-semibold text-gray-800 mb-1 sm:mb-2"
              >
              {LeaseFormLabels.securityDeposits.remark}
              </label>
              <textarea
                id={`remark-${deposit.id}`}
                name="remark"
                value={deposit.remark || ""}
                rows={3}
                placeholder="Enter remark"
                onChange={(e) =>
                  handleSecurityDepositChange(
                    deposit.id,
                    "remark",
                    e.target.value,
                    index
                  )
                }
                className={`w-full rounded-md border ${
                  errors[`${deposit.id}-remark`]
                    ? "border-red-300"
                    : "border-gray-300"
                } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  disabled ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                disabled={disabled}
                readOnly={readOnly}
              ></textarea>
              {errors[`${deposit.id}-remark`] && (
                <p className="mt-1 text-sm text-red-600">
                  {errors[`${deposit.id}-remark`]}
                </p>
              )}
            </div>
          </div>
        ))
      ) : (
        // Excel-like table format - responsive with horizontal scroll on small devices
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <table className="w-full border-collapse border-gray-300 border">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-3 py-2 sm:px-4 sm:py-3 text-left text-sm font-medium text-gray-700">
                    Deposit Name
                  </th>
                  <th className="border border-gray-300 px-3 py-2 sm:px-4 sm:py-3 text-left text-sm font-medium text-gray-700">
                    Amount (₹)
                  </th>
                  <th className="border border-gray-300 px-3 py-2 sm:px-4 sm:py-3 text-left text-sm font-medium text-gray-700">
                    Rate (%)
                  </th>
                  <th className="border border-gray-300 px-3 py-2 sm:px-4 sm:py-3 text-left text-sm font-medium text-gray-700">
                    Start Date
                  </th>
                  <th className="border border-gray-300 px-3 py-2 sm:px-4 sm:py-3 text-left text-sm font-medium text-gray-700">
                    End Date
                  </th>
                  <th className="border border-gray-300 px-3 py-2 sm:px-4 sm:py-3 text-left text-sm font-medium text-gray-700">
                    Remark
                  </th>
                  {!readOnly && (
                    <th className="border border-gray-300 px-3 py-2 sm:px-4 sm:py-3 text-center text-sm font-medium text-gray-700">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {securityDeposits.map((deposit, index) => (
                  <tr key={deposit.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-0">
                      <div className="flex flex-col">
                        <input
                          type="text"
                          className={`w-full border-0 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
                            errors[`${deposit.id}-depositNumber`]
                              ? "bg-red-50"
                              : ""
                          } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                          placeholder="Enter deposit name"
                          value={deposit.depositNumber}
                          onChange={(e) =>
                            handleSecurityDepositChange(
                              deposit.id,
                              "depositNumber",
                              e.target.value,
                              index
                            )
                          }
                          disabled={disabled}
                          readOnly={readOnly}
                        />
                        {errors[`${deposit.id}-depositNumber`] && (
                          <span className="text-xs text-red-600 px-3 pb-1">
                            {errors[`${deposit.id}-depositNumber`]}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="border border-gray-300 p-0">
                      <div className="flex flex-col">
                        <input
                          type="number"
                          className={`w-full border-0 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
                            errors[`${deposit.id}-amount`] ? "bg-red-50" : ""
                          } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                          placeholder="0.00"
                          step="0.01"
                          value={deposit.amount}
                          onChange={(e) =>
                            handleSecurityDepositChange(
                              deposit.id,
                              "amount",
                              e.target.value,
                              index
                            )
                          }
                          disabled={disabled}
                          readOnly={readOnly}
                        />
                        {errors[`${deposit.id}-amount`] && (
                          <span className="text-xs text-red-600 px-3 pb-1">
                            {errors[`${deposit.id}-amount`]}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="border border-gray-300 p-0">
                      <div className="flex flex-col">
                        <input
                          type="number"
                          className={`w-full border-0 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
                            errors[`${deposit.id}-rate`] ? "bg-red-50" : ""
                          } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                          placeholder="0.00"
                          step="0.01"
                          value={deposit.rate}
                          onChange={(e) =>
                            handleSecurityDepositChange(
                              deposit.id,
                              "rate",
                              e.target.value,
                              index
                            )
                          }
                          disabled={disabled}
                          readOnly={readOnly}
                        />
                        {errors[`${deposit.id}-rate`] && (
                          <span className="text-xs text-red-600 px-3 pb-1">
                            {errors[`${deposit.id}-rate`]}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="border border-gray-300 p-0">
                      <div className="flex flex-col">
                        <input
                          type="date"
                          className={`w-full border-0 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
                            errors[`${deposit.id}-startDate`] ? "bg-red-50" : ""
                          } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                          value={deposit.startDate}
                          min={
                            index > 0
                              ? securityDeposits[index - 1].endDate
                              : undefined
                          }
                          onChange={(e) =>
                            handleSecurityDepositChange(
                              deposit.id,
                              "startDate",
                              e.target.value,
                              index
                            )
                          }
                          disabled={disabled}
                          readOnly={readOnly}
                        />
                        {errors[`${deposit.id}-startDate`] && (
                          <span className="text-xs text-red-600 px-3 pb-1">
                            {errors[`${deposit.id}-startDate`]}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="border border-gray-300 p-0">
                      <div className="flex flex-col">
                        <input
                          type="date"
                          className={`w-full border-0 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
                            errors[`${deposit.id}-endDate`] ? "bg-red-50" : ""
                          } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                          value={deposit.endDate}
                          min={deposit.startDate || undefined}
                          onChange={(e) =>
                            handleSecurityDepositChange(
                              deposit.id,
                              "endDate",
                              e.target.value,
                              index
                            )
                          }
                          disabled={disabled}
                          readOnly={readOnly}
                        />
                        {errors[`${deposit.id}-endDate`] && (
                          <span className="text-xs text-red-600 px-3 pb-1">
                            {errors[`${deposit.id}-endDate`]}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="border border-gray-300 p-0">
                      <div className="flex flex-col">
                        <input
                          type="text"
                          className={`w-full border-0 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:ring-inset ${
                            errors[`${deposit.id}-remark`] ? "bg-red-50" : ""
                          } ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}`}
                          placeholder="Enter remark"
                          value={deposit.remark}
                          onChange={(e) =>
                            handleSecurityDepositChange(
                              deposit.id,
                              "remark",
                              e.target.value,
                              index
                            )
                          }
                          disabled={disabled}
                          readOnly={readOnly}
                        />
                        {errors[`${deposit.id}-remark`] && (
                          <span className="text-xs text-red-600 px-3 pb-1">
                            {errors[`${deposit.id}-remark`]}
                          </span>
                        )}
                      </div>
                    </td>
                    {!readOnly && (
                      <td className="border border-gray-300 px-3 py-2 text-center">
                        <div className="flex justify-center gap-2">
                          {securityDeposits.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSecurityDeposit(deposit.id)}
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
        </div>
      )}

{!readOnly && (
  <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row justify-between gap-4">
    <button
      type="button"
      onClick={onPrevious}
      className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors w-full sm:w-auto"
    >
      Previous
    </button>
    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
      <button
        type="button"
        className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors w-full sm:w-auto"
      >
        Save
      </button>
      <button
        type="button"
        onClick={handleNext}
        className="bg-[#008F98] text-white px-4 py-2 rounded-md hover:bg-[#007A82] transition-colors w-full sm:w-auto"
      >
        Next
      </button>
    </div>
  </div>
)}

{/* READ-ONLY MODE NAVIGATION */}
{readOnly && (
  <div className="mt-6 sm:mt-8 flex justify-between">
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

export default LeaseRentRevision;