
// import React, { useState, useEffect } from "react";
// import { Trash2, Plus, AlertCircle } from "lucide-react";
// import { CashflowEntry, LeaseFormData } from "../../../../types";
// import { v4 as uuidv4 } from "uuid";
// import { LeaseFormLabels } from "../LeaseForms/LeaseFormLabel";
// import useMaster from "../../../../hooks/useMaster";

// interface LeaseBasicInfoProps {
//   formData: LeaseFormData;
//   updateFormData: (data: Partial<LeaseFormData>) => void;
//   onNext: () => void;
//   onSave: () => void;
//   isSaving: boolean;
//   readOnly?: boolean;
//   disabled?: boolean;
// }

// const LeaseBasicInfo: React.FC<LeaseBasicInfoProps> = ({
//   formData,
//   updateFormData,
//   onNext,
//   onSave,
//   isSaving,
//   readOnly = false,
//   disabled = false,
// }) => {
//   const { assets, fetchAssets } = useMaster();
//   const [showCashflowDetails, setShowCashflowDetails] = useState(
//     formData.hasCashflow || false
//   );
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [masterDataWarning, setMasterDataWarning] = useState<string[]>([]);


//   // Check for required master data
//   useEffect(() => {
//     fetchAssets();
//   }, []);


//   useEffect(() => {
//     const warnings = [];
//     if (assets.length === 0) warnings.push("Asset Master");
//     // Add other master data checks here based on your requirements
//     setMasterDataWarning(warnings);
//   }, [assets]);


//   // Safe mapping of assets with proper error handling
//   const classOptions = assets.map(asset => ({
//     value: (asset.id || asset.asset_id || asset.asset_group_code || '').toString(),
//     label: asset.asset_group_name || 'Unknown Asset'
//   })).filter(option => option.value !== ''); // Filter out empty values


//   const [cashflowEntries, setCashflowEntries] = useState<CashflowEntry[]>(
//     Array.isArray(formData.cashflowEntries)
//       ? formData.cashflowEntries
//       : [
//           {
//             id: uuidv4(),
//             leaseId: formData.propertyId || "",
//             date: "",
//             amount: "",
//             type: ""
//           },
//         ]
//   );


//   // Auto-calculate lease duration when start/end dates change
//   useEffect(() => {
//     if (formData.startDate && formData.endDate) {
//       const startDate = new Date(formData.startDate);
//       const endDate = new Date(formData.endDate);


//       if (endDate > startDate) {
//         const years = endDate.getFullYear() - startDate.getFullYear();
//         const months = endDate.getMonth() - startDate.getMonth();
//         const days = endDate.getDate() - startDate.getDate();


//         let adjustedYears = years;
//         let adjustedMonths = months;
//         let adjustedDays = days;


//         if (adjustedDays < 0) {
//           const lastMonth = new Date(
//             endDate.getFullYear(),
//             endDate.getMonth(),
//             0
//           );
//           adjustedDays += lastMonth.getDate();
//           adjustedMonths--;
//         }


//         if (adjustedMonths < 0) {
//           adjustedMonths += 12;
//           adjustedYears--;
//         }


//         if (!readOnly) {
//           updateFormData({
//             duration: {
//               years: Math.max(0, adjustedYears),
//               months: Math.max(0, adjustedMonths),
//               days: Math.max(0, adjustedDays),
//             },
//           });
//         }
//       }
//     }
//   }, [formData.startDate, formData.endDate, readOnly]);


//   useEffect(() => {
//     if (formData.propertyId && cashflowEntries.length > 0 && !readOnly) {
//       setCashflowEntries((prevEntries) =>
//         prevEntries.map((entry) => ({
//           ...entry,
//           leaseId: formData.propertyId || "",
//         }))
//       );
//     }
//   }, [formData.propertyId, readOnly]);


//   useEffect(() => {
//     if (Array.isArray(cashflowEntries) && !readOnly) {
//       updateFormData({ cashflowEntries });
//     }
//   }, [cashflowEntries, readOnly]);


//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};


//     if (!formData.propertyId) {
//       newErrors.propertyId = "Class is required";
//     }
//     if (!formData.propertyName) {
//       newErrors.propertyName = "Lease Name is required";
//     }
//     if (!formData.startDate) {
//       newErrors.startDate = "Start date is required";
//     }
//     if (!formData.endDate) {
//       newErrors.endDate = "End date is required";
//     } else if (
//       formData.startDate &&
//       new Date(formData.endDate) <= new Date(formData.startDate)
//     ) {
//       newErrors.endDate = "End date must be after start date";
//     }


//     if (showCashflowDetails) {
//       const invalidEntries = cashflowEntries.some(
//         (entry) => !entry.leaseId || !entry.date || !entry.amount
//       );
//       if (invalidEntries) {
//         newErrors.cashflow = "All cashflow entries must be completed";
//       }
//     }


//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };


//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     if (readOnly) return;
   
//     const { name, value } = e.target;
//     updateFormData({ [name]: value });
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };


//   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (readOnly) return;
   
//     const { name, checked } = e.target;


//     if (name === "hasCashflow") {
//       setShowCashflowDetails(checked);
//       if (
//         checked &&
//         (!formData.cashflowEntries || formData.cashflowEntries.length === 0)
//       ) {
//         setCashflowEntries([
//           {
//             id: uuidv4(),
//             leaseId: formData.propertyId || "",
//             date: "",
//             amount: "",
//             type: ""
//           },
//         ]);
//       }
//     }


//     updateFormData({ [name]: checked });
//   };


//   const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (readOnly) return;
   
//     const { name, value } = e.target;
//     updateFormData({ [name]: value });
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };


//   const handleCashflowEntryChange = (
//     id: string,
//     field: keyof CashflowEntry,
//     value: string
//   ) => {
//     if (readOnly) return;
   
//     setCashflowEntries((prevEntries) =>
//       prevEntries.map((entry) =>
//         entry.id === id ? { ...entry, [field]: value } : entry
//       )
//     );
//     if (errors.cashflow) {
//       setErrors((prev) => ({ ...prev, cashflow: "" }));
//     }
//   };


//   const addCashflowEntry = () => {
//     if (readOnly) return;
   
//     setCashflowEntries((prevEntries) => [
//       ...prevEntries,
//       {
//         id: uuidv4(),
//         leaseId: formData.propertyId || "",
//         date: "",
//         amount: "",
//         type: ""
//       },
//     ]);
//   };


//   const removeCashflowEntry = (id: string) => {
//     if (readOnly) return;
   
//     setCashflowEntries((prevEntries) =>
//       prevEntries.filter((entry) => entry.id !== id)
//     );
//   };


//   const handleNext = () => {
//     if (masterDataWarning.length > 0) {
//       return; // Prevent proceeding if master data is missing
//     }
   
//     if (readOnly || validateForm()) {
//       onNext();
//     }
//   };


//   const handleSave = () => {
//     if (readOnly || validateForm()) {
//       onSave();
//     }
//   };


//   return (
//     <div className="bg-white p-3 rounded-lg shadow-sm">
//       <h2 className="text-xl font-semibold mb-6">Lease Terms</h2>


//       {/* Master Data Warning */}
//       {masterDataWarning.length > 0 && (
//         <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
//           <div className="flex items-start">
//             <AlertCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
//             <div>
//               <h3 className="text-red-800 font-medium">Required Master Data Missing</h3>
//               <p className="text-red-700 mt-1">
//                 Please create the following master data first before proceeding:
//               </p>
//               <ul className="list-disc list-inside mt-2 text-red-700">
//                 {masterDataWarning.map((item) => (
//                   <li key={item}>{item}</li>
//                 ))}
//               </ul>
//               <p className="text-red-700 mt-2 text-sm">
//                 These are essential for creating a lease. Navigate to the respective master sections and create the required data.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}


//       <div className="grid gap-6 p-2">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label
//               htmlFor="propertyId"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               {LeaseFormLabels.leaseTerms.class}{" "}
//               <span className="text-red-600">*</span>
//             </label>
//             <select
//               id="propertyId"
//               name="propertyId"
//               className={`w-full rounded-md border ${
//                 errors.propertyId ? "border-red-300" : "border-gray-300"
//               } px-5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
//                 disabled || masterDataWarning.length > 0 ? "bg-gray-100 cursor-not-allowed" : ""
//               }`}
//               value={formData.propertyId || ""}
//               onChange={handleChange}
//               disabled={disabled || masterDataWarning.length > 0}
//             >
//               <option value="">Select Class</option>
//               {classOptions.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//             {errors.propertyId && (
//               <p className="mt-1 text-sm text-red-600">{errors.propertyId}</p>
//             )}
//           </div>


//           <div>
//             <label
//               htmlFor="propertyName"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               {LeaseFormLabels.leaseTerms.leaseName}{" "}
//               <span className="text-red-600">*</span>
//             </label>
//             <input
//               type="text"
//               id="propertyName"
//               name="propertyName"
//               className={`w-full rounded-md border ${
//                 errors.propertyName ? "border-red-300" : "border-gray-300"
//               } px-5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                 disabled || masterDataWarning.length > 0 ? "bg-gray-100 cursor-not-allowed" : ""
//               }`}
//               placeholder="Enter Lease Name"
//               value={formData.propertyName || ""}
//               onChange={handleChange}
//               disabled={disabled || masterDataWarning.length > 0}
//               readOnly={readOnly}
//             />
//             {errors.propertyName && (
//               <p className="mt-1 text-sm text-red-600">{errors.propertyName}</p>
//             )}
//           </div>
//         </div>


//         <div className="flex flex-wrap gap-8 p-2">
//           <div className="flex items-center">
//             <input
//               id="isShortTerm"
//               name="isShortTerm"
//               type="checkbox"
//               className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//               checked={formData.isShortTerm || false}
//               onChange={handleCheckboxChange}
//               disabled={disabled || masterDataWarning.length > 0}
//             />
//             <label htmlFor="isShortTerm" className="ml-2 text-sm text-gray-700">
//               {LeaseFormLabels.leaseTerms.isShortTerm}
//             </label>
//           </div>


//           <div className="flex items-center">
//             <input
//               id="isLowValue"
//               name="isLowValue"
//               type="checkbox"
//               className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//               checked={formData.isLowValue || false}
//               onChange={handleCheckboxChange}
//               disabled={disabled || masterDataWarning.length > 0}
//             />
//             <label htmlFor="isLowValue" className="ml-2 text-sm text-gray-700">
//               {LeaseFormLabels.leaseTerms.isLowValue}
//             </label>
//           </div>


//           <div className="flex items-center">
//             <input
//               id="hasMultiEntityAllocation"
//               name="hasMultiEntityAllocation"
//               type="checkbox"
//               className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//               checked={formData.hasMultiEntityAllocation || false}
//               onChange={handleCheckboxChange}
//               disabled={disabled || masterDataWarning.length > 0}
//             />
//             <label
//               htmlFor="hasMultiEntityAllocation"
//               className="ml-2 text-sm text-gray-700"
//             >
//               {LeaseFormLabels.leaseTerms.hasMultiEntityAllocation}
//             </label>
//           </div>


//           <div className="flex items-center">
//             <input
//               id="hasLessorAllocation"
//               name="hasLessorAllocation"
//               type="checkbox"
//               className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//               checked={formData.hasLessorAllocation || false}
//               onChange={handleCheckboxChange}
//               disabled={disabled || masterDataWarning.length > 0}
//             />
//             <label
//               htmlFor="hasLessorAllocation"
//               className="ml-2 text-sm text-gray-700"
//             >
//               {LeaseFormLabels.leaseTerms.hasLessorAllocation}
//             </label>
//           </div>
//         </div>


//         {formData.isLowValue && (
//           <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label
//                   htmlFor="shortTermValue"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   {LeaseFormLabels.leaseTerms.isInputLowValue}
//                 </label>
//                 <input
//                   type="number"
//                   id="shortTermValue"
//                   name="shortTermValue"
//                   className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     disabled || masterDataWarning.length > 0 ? "bg-gray-100 cursor-not-allowed" : ""
//                   }`}
//                   placeholder="Enter value"
//                   value={formData.shortTermValue || ""}
//                   onChange={handleChange}
//                   min="0"
//                   disabled={disabled || masterDataWarning.length > 0}
//                   readOnly={readOnly}
//                   onKeyDown={(e) => {
//                     if (e.key === "-" || e.key === "e") {
//                       e.preventDefault();
//                     }
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//         )}


//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:gap-8 p-2">
//           <div>
//             <label
//               htmlFor="startDate"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               {LeaseFormLabels.leaseTerms.startDate}{" "}
//               <span className="text-red-600">*</span>
//             </label>
//             <div className="relative">
//               <input
//                 type="date"
//                 id="startDate"
//                 name="startDate"
//                 className={`w-full rounded-md border ${
//                   errors.startDate ? "border-red-300" : "border-gray-300"
//                 } pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                   disabled || masterDataWarning.length > 0 ? "bg-gray-100 cursor-not-allowed" : ""
//                 }`}
//                 value={formData.startDate instanceof Date ? formData.startDate.toISOString().split('T')[0] : formData.startDate || ""}
//                 onChange={handleDateChange}
//                 disabled={disabled || masterDataWarning.length > 0}
//                 readOnly={readOnly}
//                 onFocus={(e) => !disabled && !masterDataWarning.length && e.target.showPicker && e.target.showPicker()}
//                 style={{ colorScheme: "light" }}
//               />
//             </div>
//             {errors.startDate && (
//               <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
//             )}
//           </div>


//           <div>
//             <label
//               htmlFor="endDate"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               {LeaseFormLabels.leaseTerms.endDate}{" "}
//               <span className="text-red-600">*</span>
//             </label>
//             <div className="relative">
//               <input
//                 type="date"
//                 id="endDate"
//                 name="endDate"
//                 min={formData.startDate ? 
//     (formData.startDate instanceof Date ? 
//       formData.startDate.toISOString().split('T')[0] : 
//       formData.startDate) : 
//     undefined}
//                 className={`w-full rounded-md border ${
//                   errors.endDate ? "border-red-300" : "border-gray-300"
//                 } pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                   disabled || masterDataWarning.length > 0 ? "bg-gray-100 cursor-not-allowed" : ""
//                 }`}
//          value={formData.endDate instanceof Date ? formData.endDate.toISOString().split('T')[0] : formData.endDate || ""}
//                 disabled={disabled || masterDataWarning.length > 0}
//                 readOnly={readOnly}
//                 onFocus={(e) => !disabled && !masterDataWarning.length && e.target.showPicker && e.target.showPicker()}
//                 onChange={handleDateChange}
//               />
//             </div>
//             {errors.endDate && (
//               <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
//             )}
//           </div>
//         </div>


//         <div className="border border-gray-200 rounded-md bg-gray-50 p-4">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Lease Duration
//           </label>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div>
//               <label
//                 htmlFor="years"
//                 className="block text-sm text-gray-500 mb-1"
//               >
//                 {LeaseFormLabels.leaseTerms.leaseDuration.years}
//               </label>
//               <input
//                 type="number"
//                 id="years"
//                 min="0"
//                 className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
//                 value={formData.duration?.years || 0}
//                 readOnly
//                 disabled
//               />
//             </div>


//             <div>
//               <label
//                 htmlFor="months"
//                 className="block text-sm text-gray-500 mb-1"
//               >
//                 {LeaseFormLabels.leaseTerms.leaseDuration.months}
//               </label>
//               <input
//                 type="number"
//                 id="months"
//                 min="0"
//                 max="11"
//                 className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
//                 value={formData.duration?.months || 0}
//                 readOnly
//                 disabled
//               />
//             </div>


//             <div>
//               <label
//                 htmlFor="days"
//                 className="block text-sm text-gray-500 mb-1"
//               >
//                 {LeaseFormLabels.leaseTerms.leaseDuration.days}
//               </label>
//               <input
//                 type="number"
//                 id="days"
//                 min="0"
//                 max="30"
//                 className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
//                 value={formData.duration?.days || 0}
//                 readOnly
//                 disabled
//               />
//             </div>
//           </div>
//           <p className="text-sm text-gray-500 mt-2">
//             Duration is automatically calculated based on start and end dates
//           </p>
//         </div>


//         <div className="mt-4">
//           <div className="flex items-center">
//             <input
//               id="hasCashflow"
//               name="hasCashflow"
//               type="checkbox"
//               className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//               checked={formData.hasCashflow || false}
//               onChange={handleCheckboxChange}
//               disabled={disabled || masterDataWarning.length > 0}
//             />
//             <label
//               htmlFor="hasCashflow"
//               className="ml-2 text-sm font-medium text-gray-700"
//             >
//               {LeaseFormLabels.leaseTerms.customCashflow.checkbox}
//             </label>
//           </div>


//           {showCashflowDetails && (
//             <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50 animate-fadeIn">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-md font-medium">Custom Cashflow</h3>
//                 {!readOnly && !masterDataWarning.length && (
//                   <button
//                     type="button"
//                     className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
//                   >
//                     <span>Cash Flow Import</span>
//                   </button>
//                 )}
//               </div>


//               {cashflowEntries.map((entry) => (
//                 <div
//                   key={entry.id}
//                   className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end relative"
//                 >
//                   <div>
//                     <label
//                       htmlFor={`leaseId-${entry.id}`}
//                       className="block text-sm font-medium text-gray-700 mb-1"
//                     >
//                       {LeaseFormLabels.leaseTerms.customCashflow.leaseId}
//                     </label>
//                     <input
//                       type="text"
//                       id={`leaseId-${entry.id}`}
//                       className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
//                       value={entry.leaseId}
//                       readOnly
//                       disabled
//                     />
//                   </div>
//                   <div>
//                     <label
//                       htmlFor={`date-${entry.id}`}
//                       className="block text-sm font-medium text-gray-700 mb-1"
//                     >
//                       {LeaseFormLabels.leaseTerms.customCashflow.date}
//                     </label>
//                     <input
//                       type="date"
//                       id={`date-${entry.id}`}
//                       min={formData.startDate ? 
//     (formData.startDate instanceof Date ? 
//       formData.startDate.toISOString().split('T')[0] : 
//       formData.startDate) : 
//     undefined}
//                       className={`w-full rounded-md border border-gray-300 pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                         disabled || masterDataWarning.length > 0 ? "bg-gray-100 cursor-not-allowed" : ""
//                       }`}
//                       value={entry.date}
//                       disabled={disabled || masterDataWarning.length > 0}
//                       readOnly={readOnly}
//                       onFocus={(e) =>
//                         !disabled && !masterDataWarning.length && e.target.showPicker && e.target.showPicker()
//                       }
//                       onChange={(e) =>
//                         handleCashflowEntryChange(
//                           entry.id,
//                           "date",
//                           e.target.value
//                         )
//                       }
//                     />
//                   </div>
//                   <div className="flex items-end gap-2">
//                     <div className="flex-grow">
//                       <label
//                         htmlFor={`amount-${entry.id}`}
//                         className="block text-sm font-medium text-gray-700 mb-1"
//                       >
//                         {LeaseFormLabels.leaseTerms.customCashflow.amount}
//                       </label>
//                       <div className="relative">
//                         <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
//                           $
//                         </span>
//                         <input
//                           type="number"
//                           id={`amount-${entry.id}`}
//                           className={`w-full rounded-md border border-gray-300 pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                             disabled || masterDataWarning.length > 0 ? "bg-gray-100 cursor-not-allowed" : ""
//                           }`}
//                           placeholder="0.00"
//                           value={entry.amount}
//                           min={0}
//                           disabled={disabled || masterDataWarning.length > 0}
//                           readOnly={readOnly}
//                           onKeyDown={(e) => {
//                             if (e.key === "-" || e.key === "e") {
//                               e.preventDefault();
//                             }
//                           }}
//                           onChange={(e) =>
//                             handleCashflowEntryChange(
//                               entry.id,
//                               "amount",
//                               e.target.value
//                             )
//                           }
//                         />
//                       </div>
//                     </div>
//                     {cashflowEntries.length > 1 && !readOnly && !masterDataWarning.length && (
//                       <button
//                         type="button"
//                         onClick={() => removeCashflowEntry(entry.id)}
//                         className="p-2 text-gray-500 hover:text-red-500 focus:outline-none"
//                         aria-label="Remove entry"
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))}


//               {errors.cashflow && (
//                 <p className="mt-1 text-sm text-red-600">{errors.cashflow}</p>
//               )}


//               {!readOnly && !masterDataWarning.length && (
//                 <div className="flex justify-end mt-4">
//                   <button
//                     type="button"
//                     onClick={addCashflowEntry}
//                     className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors flex items-center gap-2"
//                   >
//                     <Plus size={16} />
//                     Add Entry
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>


//       <div className="mt-8 flex justify-between">
//         {!readOnly && (
//           <>
//             <button
//               type="button"
//               onClick={handleSave}
//               disabled={isSaving}
//               className={`bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors ${
//                 isSaving ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//             >
//               {isSaving ? "Saving..." : "Save"}
//             </button>
//             <button
//               type="button"
//               onClick={handleNext}
//               disabled={masterDataWarning.length > 0}
//               className={`px-4 py-2 rounded-md transition-colors ${
//                 masterDataWarning.length > 0
//                   ? "bg-gray-400 text-gray-200 cursor-not-allowed"
//                   : "bg-[#008F98] text-white hover:bg-[#007A82]"
//               }`}
//             >
//               Next
//             </button>
//           </>
//         )}
       
//         {readOnly && (
//           <div className="w-full flex justify-end">
//             <button
//               type="button"
//               onClick={onNext}
//               className="bg-[#008F98] text-white px-4 py-2 rounded-md hover:bg-[#007A82] transition-colors"
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };


// export default LeaseBasicInfo;



// import React, { useState, useEffect } from "react";
// import { Trash2, Plus, AlertCircle, Loader2 } from "lucide-react";
// import { CashflowEntry, LeaseFormData } from "../../../../types";
// import { v4 as uuidv4 } from "uuid";
// import { LeaseFormLabels } from "./LeaseFormLabel";
// import useMaster from "../../../../hooks/useMaster";

// interface LeaseBasicInfoProps {
//   formData: LeaseFormData;
//   updateFormData: (data: Partial<LeaseFormData>) => void;
//   onNext: () => void;
//   onSave: () => void;
//   isSaving: boolean;
//   readOnly?: boolean;
//   disabled?: boolean;
// }

// const LeaseBasicInfo: React.FC<LeaseBasicInfoProps> = ({
//   formData,
//   updateFormData,
//   onNext,
//   onSave,
//   isSaving,
//   readOnly = false,
//   disabled = false,
// }) => {
//   const { assets, fetchAssets } = useMaster();
//   const [showCashflowDetails, setShowCashflowDetails] = useState(
//     formData.hasCashflow || false
//   );
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [masterDataWarning, setMasterDataWarning] = useState<string[]>([]);
//   const [rateWarning, setRateWarning] = useState<string>("");
//   const [assetsLoading, setAssetsLoading] = useState(true); // NEW: Loading state for assets
//   const [selectedAssetLowValue, setSelectedAssetLowValue] = useState<number | null>(null); // NEW: Track selected asset's low value

//   // Check for required master data
//   useEffect(() => {
//     const loadAssets = async () => {
//       setAssetsLoading(true);
//       try {
//         await fetchAssets();
//       } finally {
//         setAssetsLoading(false);
//       }
//     };
//     loadAssets();
//   }, []);

//   useEffect(() => {
//     const warnings = [];
//     if (!assetsLoading && assets.length === 0) warnings.push("Asset Master");
//     // Add other master data checks here based on your requirements
//     setMasterDataWarning(warnings);
//   }, [assets, assetsLoading]);

//   // NEW: Track selected asset's low value limit
//   useEffect(() => {
//     if (formData.propertyId) {
//       const selectedAsset = assets.find(
//         asset => (asset.id || asset.asset_id || asset.asset_group_code || '').toString() === formData.propertyId
//       );
//       if (selectedAsset && selectedAsset.low_value_limit) {
//         setSelectedAssetLowValue(parseFloat(selectedAsset.low_value_limit));
//       } else {
//         setSelectedAssetLowValue(null);
//       }
//     }
//   }, [formData.propertyId, assets]);

//   // Safe mapping of assets with proper error handling
//   const classOptions = assets.map(asset => ({
//     value: (asset.id || asset.asset_id || asset.asset_group_code || '').toString(),
//     label: asset.asset_group_name || 'Unknown Asset'
//   })).filter(option => option.value !== ''); // Filter out empty values

//   const [cashflowEntries, setCashflowEntries] = useState<CashflowEntry[]>(
//     Array.isArray(formData.cashflowEntries)
//       ? formData.cashflowEntries
//       : [
//           {
//             id: uuidv4(),
//             leaseId: formData.propertyId || "",
//             date: "",
//             amount: "",
//             type: ""
//           },
//         ]
//   );

//   // Auto-calculate lease duration when start/end dates change
//   useEffect(() => {
//     if (formData.startDate && formData.endDate) {
//       const startDate = new Date(formData.startDate);
//       const endDate = new Date(formData.endDate);

//       if (endDate > startDate) {
//         const years = endDate.getFullYear() - startDate.getFullYear();
//         const months = endDate.getMonth() - startDate.getMonth();
//         const days = endDate.getDate() - startDate.getDate();

//         let adjustedYears = years;
//         let adjustedMonths = months;
//         let adjustedDays = days;

//         if (adjustedDays < 0) {
//           const lastMonth = new Date(
//             endDate.getFullYear(),
//             endDate.getMonth(),
//             0
//           );
//           adjustedDays += lastMonth.getDate();
//           adjustedMonths--;
//         }

//         if (adjustedMonths < 0) {
//           adjustedMonths += 12;
//           adjustedYears--;
//         }

//         if (!readOnly) {
//           updateFormData({
//             duration: {
//               years: Math.max(0, adjustedYears),
//               months: Math.max(0, adjustedMonths),
//               days: Math.max(0, adjustedDays),
//             },
//           });
//         }
//       }
//     }
//   }, [formData.startDate, formData.endDate, readOnly]);

//   useEffect(() => {
//     if (formData.propertyId && cashflowEntries.length > 0 && !readOnly) {
//       setCashflowEntries((prevEntries) =>
//         prevEntries.map((entry) => ({
//           ...entry,
//           leaseId: formData.propertyId || "",
//         }))
//       );
//     }
//   }, [formData.propertyId, readOnly]);

//   useEffect(() => {
//     if (Array.isArray(cashflowEntries) && !readOnly) {
//       updateFormData({ cashflowEntries });
//     }
//   }, [cashflowEntries, readOnly]);

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.propertyId) {
//       newErrors.propertyId = "Class is required";
//     }
//     if (!formData.propertyName) {
//       newErrors.propertyName = "Lease Name is required";
//     }
//     if (!formData.startDate) {
//       newErrors.startDate = "Lease start date is required";
//     }
//     if (!formData.endDate) {
//       newErrors.endDate = "Lease end date is required";
//     }

//     // NEW: Enhanced date validations
//     if (formData.startDate && formData.endDate) {
//       const startDate = new Date(formData.startDate);
//       const endDate = new Date(formData.endDate);
      
//       // Check if start date is after end date
//       if (startDate >= endDate) {
//         newErrors.startDate = "Lease start date cannot be after lease end date";
//         newErrors.endDate = "Lease end date must be after lease start date";
//       }

//       // Calculate duration
//       const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
//       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//       const years = Math.floor(diffDays / 365);
//       const months = Math.floor((diffDays % 365) / 30);

//       // Check if duration is valid (0-100 years, minimum 1 month)
//       if (years > 100) {
//         newErrors.endDate = "Lease duration cannot exceed 100 years";
//       }
//       if (diffDays < 30) {
//         newErrors.endDate = "Lease duration must be at least one month";
//       }
//       if (months === 0 && years === 0 && diffDays > 0) {
//         newErrors.endDate = "Lease duration must be at least one month";
//       }

//       // NEW: Short term validation (exactly 1 year)
//       if (formData.isShortTerm) {
//         const oneYearLater = new Date(startDate);
//         oneYearLater.setFullYear(startDate.getFullYear() + 1);
        
//         if (endDate.getTime() !== oneYearLater.getTime()) {
//           newErrors.endDate = "Short term lease must be exactly one year";
//         }
//       }
//     }

//     // NEW: Low value validation
//     if (formData.isLowValue) {
//       if (selectedAssetLowValue === null) {
//         newErrors.isLowValue = "Please add low value limit for this asset in Asset Master first";
//       } else if (formData.shortTermValue) {
//         const inputValue = parseFloat(formData.shortTermValue);
//         if (inputValue > selectedAssetLowValue) {
//           newErrors.shortTermValue = `Low value cannot exceed ${selectedAssetLowValue} for this asset`;
//         }
//       }
//     }

//     if (showCashflowDetails) {
//       if (!formData.incrementalBorrowingRate) {
//         newErrors.incrementalBorrowingRate = "Incremental borrowing rate is required for custom cashflow";
//       }
      
//       const invalidEntries = cashflowEntries.some(
//         (entry) => !entry.leaseId || !entry.date || !entry.amount
//       );
//       if (invalidEntries) {
//         newErrors.cashflow = "All cashflow entries must be completed";
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     if (readOnly) return;
   
//     const { name, value } = e.target;
//     updateFormData({ [name]: value });
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const handleBorrowingRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (readOnly) return;
    
//     const { name, value } = e.target;
//     const numericValue = parseFloat(value);
    
//     // Check if rate is greater than 15%
//     if (numericValue > 15) {
//       setRateWarning("Rate is greater than 15%. Are you sure you want to proceed?");
//     } else {
//       setRateWarning("");
//     }
    
//     updateFormData({ [name]: value });
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (readOnly) return;
   
//     const { name, checked } = e.target;

//     if (name === "hasCashflow") {
//       setShowCashflowDetails(checked);
//       if (
//         checked &&
//         (!formData.cashflowEntries || formData.cashflowEntries.length === 0)
//       ) {
//         setCashflowEntries([
//           {
//             id: uuidv4(),
//             leaseId: formData.propertyId || "",
//             date: "",
//             amount: "",
//             type: ""
//           },
//         ]);
//       }
//     }

//     updateFormData({ [name]: checked });
//   };

//   const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (readOnly) return;
   
//     const { name, value } = e.target;
//     updateFormData({ [name]: value });
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const handleCashflowEntryChange = (
//     id: string,
//     field: keyof CashflowEntry,
//     value: string
//   ) => {
//     if (readOnly) return;
   
//     setCashflowEntries((prevEntries) =>
//       prevEntries.map((entry) =>
//         entry.id === id ? { ...entry, [field]: value } : entry
//       )
//     );
//     if (errors.cashflow) {
//       setErrors((prev) => ({ ...prev, cashflow: "" }));
//     }
//   };

//   const addCashflowEntry = () => {
//     if (readOnly) return;
   
//     setCashflowEntries((prevEntries) => [
//       ...prevEntries,
//       {
//         id: uuidv4(),
//         leaseId: formData.propertyId || "",
//         date: "",
//         amount: "",
//         type: ""
//       },
//     ]);
//   };

//   const removeCashflowEntry = (id: string) => {
//     if (readOnly) return;
   
//     setCashflowEntries((prevEntries) =>
//       prevEntries.filter((entry) => entry.id !== id)
//     );
//   };

//   const handleNext = () => {
//     if (masterDataWarning.length > 0) {
//       return; // Prevent proceeding if master data is missing
//     }
   
//     if (readOnly || validateForm()) {
//       onNext();
//     }
//   };

//   const handleSave = () => {
//     if (readOnly || validateForm()) {
//       onSave();
//     }
//   };

//   return (
//     <div className="bg-white p-3 rounded-lg shadow-sm">
//       <h2 className="text-xl font-semibold mb-6">Lease Terms</h2>

//       {/* Master Data Warning */}
//       {masterDataWarning.length > 0 && (
//         <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
//           <div className="flex items-start">
//             <AlertCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
//             <div>
//               <h3 className="text-red-800 font-medium">Required Master Data Missing</h3>
//               <p className="text-red-700 mt-1">
//                 Please create the following master data first before proceeding:
//               </p>
//               <ul className="list-disc list-inside mt-2 text-red-700">
//                 {masterDataWarning.map((item) => (
//                   <li key={item}>{item}</li>
//                 ))}
//               </ul>
//               <p className="text-red-700 mt-2 text-sm">
//                 These are essential for creating a lease. Navigate to the respective master sections and create the required data.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* NEW: Assets Loading State */}
//       {assetsLoading && assets.length === 0 && (
//         <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-md">
//           <div className="flex items-start">
//             <Loader2 className="text-blue-500 mr-3 mt-0.5 flex-shrink-0 animate-spin" />
//             <div>
//               <h3 className="text-blue-800 font-medium">Loading Assets...</h3>
//               <p className="text-blue-700 mt-1">Please wait while we load the asset data.</p>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="grid gap-6 p-2">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label
//               htmlFor="propertyId"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               {LeaseFormLabels.leaseTerms.class}{" "}
//               <span className="text-red-600">*</span>
//             </label>
//             <select
//               id="propertyId"
//               name="propertyId"
//               className={`w-full rounded-md border ${
//                 errors.propertyId ? "border-red-300" : "border-gray-300"
//               } px-5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
//                 disabled || masterDataWarning.length > 0 || assetsLoading ? "bg-gray-100 cursor-not-allowed" : ""
//               }`}
//               value={formData.propertyId || ""}
//               onChange={handleChange}
//               disabled={disabled || masterDataWarning.length > 0 || assetsLoading}
//             >
//               <option value="">
//                 {assetsLoading ? "Loading..." : "Select Class"}
//               </option>
//               {classOptions.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//             {errors.propertyId && (
//               <p className="mt-1 text-sm text-red-600">{errors.propertyId}</p>
//             )}
//             {/* NEW: Asset Master Note */}
//             <p className="mt-1 text-xs text-gray-500">
//               Note: You can add more assets in Asset Master
//             </p>
//           </div>

//           <div>
//             <label
//               htmlFor="propertyName"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               {LeaseFormLabels.leaseTerms.leaseName}{" "}
//               <span className="text-red-600">*</span>
//             </label>
//             <input
//               type="text"
//               id="propertyName"
//               name="propertyName"
//               className={`w-full rounded-md border ${
//                 errors.propertyName ? "border-red-300" : "border-gray-300"
//               } px-5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                 disabled || masterDataWarning.length > 0 ? "bg-gray-100 cursor-not-allowed" : ""
//               }`}
//               placeholder="Enter Lease Name"
//               value={formData.propertyName || ""}
//               onChange={handleChange}
//               disabled={disabled || masterDataWarning.length > 0}
//               readOnly={readOnly}
//             />
//             {errors.propertyName && (
//               <p className="mt-1 text-sm text-red-600">{errors.propertyName}</p>
//             )}
//           </div>
//         </div>

//         <div className="flex flex-wrap gap-8 p-2">
//           <div className="flex items-center">
//             <input
//               id="isShortTerm"
//               name="isShortTerm"
//               type="checkbox"
//               className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//               checked={formData.isShortTerm || false}
//               onChange={handleCheckboxChange}
//               disabled={disabled || masterDataWarning.length > 0}
//             />
//             <label htmlFor="isShortTerm" className="ml-2 text-sm text-gray-700">
//               {LeaseFormLabels.leaseTerms.isShortTerm}
//             </label>
//           </div>

//           <div className="flex items-center">
//             <input
//               id="isLowValue"
//               name="isLowValue"
//               type="checkbox"
//               className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//               checked={formData.isLowValue || false}
//               onChange={handleCheckboxChange}
//               disabled={disabled || masterDataWarning.length > 0}
//             />
//             <label htmlFor="isLowValue" className="ml-2 text-sm text-gray-700">
//               {LeaseFormLabels.leaseTerms.isLowValue}
//             </label>
//           </div>

//           <div className="flex items-center">
//             <input
//               id="hasMultiEntityAllocation"
//               name="hasMultiEntityAllocation"
//               type="checkbox"
//               className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//               checked={formData.hasMultiEntityAllocation || false}
//               onChange={handleCheckboxChange}
//               disabled={disabled || masterDataWarning.length > 0}
//             />
//             <label
//               htmlFor="hasMultiEntityAllocation"
//               className="ml-2 text-sm text-gray-700"
//             >
//               {LeaseFormLabels.leaseTerms.hasMultiEntityAllocation}
//             </label>
//           </div>

//           <div className="flex items-center">
//             <input
//               id="hasLessorAllocation"
//               name="hasLessorAllocation"
//               type="checkbox"
//               className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//               checked={formData.hasLessorAllocation || false}
//               onChange={handleCheckboxChange}
//               disabled={disabled || masterDataWarning.length > 0}
//             />
//             <label
//               htmlFor="hasLessorAllocation"
//               className="ml-2 text-sm text-gray-700"
//             >
//               {LeaseFormLabels.leaseTerms.hasLessorAllocation}
//             </label>
//           </div>
//         </div>

//         {/* NEW: Low Value Error Display */}
//         {errors.isLowValue && (
//           <div className="p-3 bg-red-50 border border-red-200 rounded-md">
//             <p className="text-sm text-red-600">{errors.isLowValue}</p>
//           </div>
//         )}

//         {formData.isLowValue && (
//           <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label
//                   htmlFor="shortTermValue"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   {LeaseFormLabels.leaseTerms.isInputLowValue}
//                   {selectedAssetLowValue && (
//                     <span className="text-xs text-gray-500 ml-2">
//                       (Max: {selectedAssetLowValue})
//                     </span>
//                   )}
//                 </label>
//                 <input
//                   type="number"
//                   id="shortTermValue"
//                   name="shortTermValue"
//                   className={`w-full rounded-md border ${
//                     errors.shortTermValue ? "border-red-300" : "border-gray-300"
//                   } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     disabled || masterDataWarning.length > 0 ? "bg-gray-100 cursor-not-allowed" : ""
//                   }`}
//                   placeholder="Enter value"
//                   value={formData.shortTermValue || ""}
//                   onChange={handleChange}
//                   min="0"
//                   max={selectedAssetLowValue || undefined}
//                   disabled={disabled || masterDataWarning.length > 0}
//                   readOnly={readOnly}
//                   onKeyDown={(e) => {
//                     if (e.key === "-" || e.key === "e") {
//                       e.preventDefault();
//                     }
//                   }}
//                 />
//                 {errors.shortTermValue && (
//                   <p className="mt-1 text-sm text-red-600">{errors.shortTermValue}</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:gap-8 p-2">
//           <div>
//             <label
//               htmlFor="startDate"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               {LeaseFormLabels.leaseTerms.startDate}{" "}
//               <span className="text-red-600">*</span>
//             </label>
//             <div className="relative">
//               <input
//                 type="date"
//                 id="startDate"
//                 name="startDate"
//                 className={`w-full rounded-md border ${
//                   errors.startDate ? "border-red-300" : "border-gray-300"
//                 } pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                   disabled || masterDataWarning.length > 0 ? "bg-gray-100 cursor-not-allowed" : ""
//                 }`}
//                 value={formData.startDate instanceof Date ? formData.startDate.toISOString().split('T')[0] : formData.startDate || ""}
//                 onChange={handleDateChange}
//                 disabled={disabled || masterDataWarning.length > 0}
//                 readOnly={readOnly}
//                 onFocus={(e) => !disabled && !masterDataWarning.length && e.target.showPicker && e.target.showPicker()}
//                 style={{ colorScheme: "light" }}
//               />
//             </div>
//             {errors.startDate && (
//               <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
//             )}
//           </div>

//           <div>
//             <label
//               htmlFor="endDate"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               {LeaseFormLabels.leaseTerms.endDate}{" "}
//               <span className="text-red-600">*</span>
//             </label>
//             <div className="relative">
//               <input
//                 type="date"
//                 id="endDate"
//                 name="endDate"
//                 min={formData.startDate ? 
//     (formData.startDate instanceof Date ? 
//       formData.startDate.toISOString().split('T')[0] : 
//       formData.startDate) : 
//     undefined}
//                 className={`w-full rounded-md border ${
//                   errors.endDate ? "border-red-300" : "border-gray-300"
//                 } pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                   disabled || masterDataWarning.length > 0 ? "bg-gray-100 cursor-not-allowed" : ""
//                 }`}
//          value={formData.endDate instanceof Date ? formData.endDate.toISOString().split('T')[0] : formData.endDate || ""}
//                 disabled={disabled || masterDataWarning.length > 0}
//                 readOnly={readOnly}
//                 onFocus={(e) => !disabled && !masterDataWarning.length && e.target.showPicker && e.target.showPicker()}
//                 onChange={handleDateChange}
//               />
//             </div>
//             {errors.endDate && (
//               <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
//             )}
//           </div>
//         </div>

//         <div className="border border-gray-200 rounded-md bg-gray-50 p-4">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Lease Duration
//           </label>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div>
//               <label
//                 htmlFor="years"
//                 className="block text-sm text-gray-500 mb-1"
//               >
//                 {LeaseFormLabels.leaseTerms.leaseDuration.years}
//               </label>
//               <input
//                 type="number"
//                 id="years"
//                 min="0"
//                 className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
//                 value={formData.duration?.years || 0}
//                 readOnly
//                 disabled
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor="months"
//                 className="block text-sm text-gray-500 mb-1"
//               >
//                 {LeaseFormLabels.leaseTerms.leaseDuration.months}
//               </label>
//               <input
//                 type="number"
//                 id="months"
//                 min="0"
//                 max="11"
//                 className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
//                 value={formData.duration?.months || 0}
//                 readOnly
//                 disabled
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor="days"
//                 className="block text-sm text-gray-500 mb-1"
//               >
//                 {LeaseFormLabels.leaseTerms.leaseDuration.days}
//               </label>
//               <input
//                 type="number"
//                 id="days"
//                 min="0"
//                 max="30"
//                 className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
//                 value={formData.duration?.days || 0}
//                 readOnly
//                 disabled
//               />
//             </div>
//           </div>
//           <p className="text-sm text-gray-500 mt-2">
//             Duration is automatically calculated based on start and end dates
//           </p>
//         </div>

//         <div className="mt-4">
//           <div className="flex items-center">
//             <input
//               id="hasCashflow"
//               name="hasCashflow"
//               type="checkbox"
//               className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//               checked={formData.hasCashflow || false}
//               onChange={handleCheckboxChange}
//               disabled={disabled || masterDataWarning.length > 0}
//             />
//             <label
//               htmlFor="hasCashflow"
//               className="ml-2 text-sm font-medium text-gray-700"
//             >
//               {LeaseFormLabels.leaseTerms.customCashflow.checkbox}
//             </label>
//           </div>

//           {showCashflowDetails && (
//             <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50 animate-fadeIn">
//               <div className="mb-6">
//                 <label
//                   htmlFor="incrementalBorrowingRate"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Incremental Borrowing Rate <span className="text-red-600">*</span>
//                 </label>
//                 <div className="relative max-w-md">
//                   <input
//                     type="number"
//                     id="incrementalBorrowingRate"
//                     name="incrementalBorrowingRate"
//                     className={`w-full rounded-md border ${
//                       errors.incrementalBorrowingRate ? "border-red-300" : "border-gray-300"
//                     } pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                       disabled || masterDataWarning.length > 0 ? "bg-gray-100 cursor-not-allowed" : ""
//                     }`}
//                     placeholder="0.00"
//                     step="0.01"
//                     value={formData.incrementalBorrowingRate || ""}
//                     onChange={handleBorrowingRateChange}
//                     min={0}
//                     disabled={disabled || masterDataWarning.length > 0}
//                     readOnly={readOnly}
//                     onKeyDown={(e) => {
//                       if (e.key === "-" || e.key === "e") {
//                         e.preventDefault();
//                       }
//                     }}
//                   />
//                   <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 text-sm h-full pointer-events-none">
//                     %
//                   </span>
//                 </div>
//                 {errors.incrementalBorrowingRate && (
//                   <p className="mt-1 text-sm text-red-600">{errors.incrementalBorrowingRate}</p>
//                 )}
//                 {rateWarning && (
//                   <p className="mt-1 text-sm text-orange-600 flex items-center">
//                     <AlertCircle size={16} className="mr-1" />
//                     {rateWarning}
//                   </p>
//                 )}
//               </div>

//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-md font-medium">Custom Cashflow</h3>
//                 {!readOnly && !masterDataWarning.length && (
//                   <button
//                     type="button"
//                     className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
//                   >
//                     <span>Cash Flow Import</span>
//                   </button>
//                 )}
//               </div>

//               {cashflowEntries.map((entry) => (
//                 <div
//                   key={entry.id}
//                   className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end relative"
//                 >
//                   <div>
//                     <label
//                       htmlFor={`leaseId-${entry.id}`}
//                       className="block text-sm font-medium text-gray-700 mb-1"
//                     >
//                       {LeaseFormLabels.leaseTerms.customCashflow.leaseId}
//                     </label>
//                     <input
//                       type="text"
//                       id={`leaseId-${entry.id}`}
//                       className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
//                       value={entry.leaseId}
//                       readOnly
//                       disabled
//                     />
//                   </div>
//                   <div>
//                     <label
//                       htmlFor={`date-${entry.id}`}
//                       className="block text-sm font-medium text-gray-700 mb-1"
//                     >
//                       {LeaseFormLabels.leaseTerms.customCashflow.date}
//                     </label>
//                     <input
//                       type="date"
//                       id={`date-${entry.id}`}
//                       min={formData.startDate ? 
//     (formData.startDate instanceof Date ? 
//       formData.startDate.toISOString().split('T')[0] : 
//       formData.startDate) : 
//     undefined}
//                       className={`w-full rounded-md border border-gray-300 pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                         disabled || masterDataWarning.length > 0 ? "bg-gray-100 cursor-not-allowed" : ""
//                       }`}
//                       value={entry.date}
//                       disabled={disabled || masterDataWarning.length > 0}
//                       readOnly={readOnly}
//                       onFocus={(e) =>
//                         !disabled && !masterDataWarning.length && e.target.showPicker && e.target.showPicker()
//                       }
//                       onChange={(e) =>
//                         handleCashflowEntryChange(
//                           entry.id,
//                           "date",
//                           e.target.value
//                         )
//                       }
//                     />
//                   </div>
//                   <div className="flex items-end gap-2">
//                     <div className="flex-grow">
//                       <label
//                         htmlFor={`amount-${entry.id}`}
//                         className="block text-sm font-medium text-gray-700 mb-1"
//                       >
//                         {LeaseFormLabels.leaseTerms.customCashflow.amount}
//                       </label>
//                       <div className="relative">
//                         <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
//                           ₹
//                         </span>
//                         <input
//                           type="number"
//                           id={`amount-${entry.id}`}
//                           className={`w-full rounded-md border border-gray-300 pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                             disabled || masterDataWarning.length > 0 ? "bg-gray-100 cursor-not-allowed" : ""
//                           }`}
//                           placeholder="0.00"
//                           value={entry.amount}
//                           min={0}
//                           disabled={disabled || masterDataWarning.length > 0}
//                           readOnly={readOnly}
//                           onKeyDown={(e) => {
//                             if (e.key === "-" || e.key === "e") {
//                               e.preventDefault();
//                             }
//                           }}
//                           onChange={(e) =>
//                             handleCashflowEntryChange(
//                               entry.id,
//                               "amount",
//                               e.target.value
//                             )
//                           }
//                         />
//                       </div>
//                     </div>
//                     {cashflowEntries.length > 1 && !readOnly && !masterDataWarning.length && (
//                       <button
//                         type="button"
//                         onClick={() => removeCashflowEntry(entry.id)}
//                         className="p-2 text-gray-500 hover:text-red-500 focus:outline-none"
//                         aria-label="Remove entry"
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))}

//               {errors.cashflow && (
//                 <p className="mt-1 text-sm text-red-600">{errors.cashflow}</p>
//               )}

//               {!readOnly && !masterDataWarning.length && (
//                 <div className="flex justify-end mt-4">
//                   <button
//                     type="button"
//                     onClick={addCashflowEntry}
//                     className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors flex items-center gap-2"
//                   >
//                     <Plus size={16} />
//                     Add Entry
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="mt-8 flex justify-between">
//         {!readOnly && (
//           <>
//             <button
//               type="button"
//               onClick={handleSave}
//               disabled={isSaving}
//               className={`bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors ${
//                 isSaving ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//             >
//               {isSaving ? "Saving..." : "Save"}
//             </button>
//             <button
//               type="button"
//               onClick={handleNext}
//               disabled={masterDataWarning.length > 0}
//               className={`px-4 py-2 rounded-md transition-colors ${
//                 masterDataWarning.length > 0
//                   ? "bg-gray-400 text-gray-200 cursor-not-allowed"
//                   : "bg-[#008F98] text-white hover:bg-[#007A82]"
//               }`}
//             >
//               Next
//             </button>
//           </>
//         )}
       
//         {readOnly && (
//           <div className="w-full flex justify-end">
//             <button
//               type="button"
//               onClick={onNext}
//               className="bg-[#008F98] text-white px-4 py-2 rounded-md hover:bg-[#007A82] transition-colors"
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LeaseBasicInfo;









import React, { useState, useEffect } from "react";
import { Trash2, Plus, AlertCircle, Loader2 } from "lucide-react";
import { CashflowEntry, LeaseFormData } from "../../../../types";
import { v4 as uuidv4 } from "uuid";
import { LeaseFormLabels } from "./LeaseFormLabel";
import useMaster from "../../../../hooks/useMaster";

interface LeaseBasicInfoProps {
  formData: LeaseFormData;
  updateFormData: (data: Partial<LeaseFormData>) => void;
  onNext: () => void;
  onSave: () => void;
  isSaving: boolean;
  readOnly?: boolean;
  disabled?: boolean;
}

const LeaseBasicInfo: React.FC<LeaseBasicInfoProps> = ({
  formData,
  updateFormData,
  onNext,
  onSave,
  isSaving,
  readOnly = false,
  disabled = false,
}) => {
  const { assets, fetchAssets } = useMaster();
  const [showCashflowDetails, setShowCashflowDetails] = useState(
    formData.hasCashflow || false
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [masterDataWarning, setMasterDataWarning] = useState<string[]>([]);
  const [rateWarning, setRateWarning] = useState<string>("");
  const [assetsLoading, setAssetsLoading] = useState(true);
  const [selectedAssetLowValue, setSelectedAssetLowValue] = useState<number | null>(null);

  // Check for required master data
  useEffect(() => {
    const loadAssets = async () => {
      setAssetsLoading(true);
      try {
        await fetchAssets();
      } finally {
        setAssetsLoading(false);
      }
    };
    loadAssets();
  }, []);

  useEffect(() => {
    const warnings = [];
    if (!assetsLoading && assets.length === 0) warnings.push("Asset Master");
    setMasterDataWarning(warnings);
  }, [assets, assetsLoading]);

  // Track selected asset's low value limit
  useEffect(() => {
    if (formData.propertyId) {
      const selectedAsset = assets.find(
        asset => (asset.id || asset.asset_id || asset.asset_group_code || '').toString() === formData.propertyId
      );
      if (selectedAsset && selectedAsset.low_value_limit) {
        setSelectedAssetLowValue(parseFloat(selectedAsset.low_value_limit));
      } else {
        setSelectedAssetLowValue(null);
      }
    }
  }, [formData.propertyId, assets]);

  // Safe mapping of assets with proper error handling
  const classOptions = assets.map(asset => ({
    value: (asset.id || asset.asset_id || asset.asset_group_code || '').toString(),
    label: asset.asset_group_name || 'Unknown Asset'
  })).filter(option => option.value !== '');

  const [cashflowEntries, setCashflowEntries] = useState<CashflowEntry[]>(
    Array.isArray(formData.cashflowEntries)
      ? formData.cashflowEntries
      : [
          {
            id: uuidv4(),
            leaseId: formData.propertyId || "",
            date: "",
            amount: "",
            type: ""
          },
        ]
  );

  // Real-time validation functions
  const validateDateRange = (startDate: string, endDate: string) => {
    const newErrors: Record<string, string> = {};
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (start >= end) {
        newErrors.startDate = "Lease start date cannot be after lease end date";
        newErrors.endDate = "Lease end date must be after lease start date";
      } else {
        // Calculate duration
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const years = Math.floor(diffDays / 365);
        const months = Math.floor((diffDays % 365) / 30);

        if (years > 100) {
          newErrors.endDate = "Lease duration cannot exceed 100 years";
        }
        if (diffDays < 30) {
          newErrors.endDate = "Lease duration must be at least one month";
        }
        if (months === 0 && years === 0 && diffDays > 0) {
          newErrors.endDate = "Lease duration must be at least one month";
        }

        // Short term validation (exactly 1 year)
        if (formData.isShortTerm) {
          const oneYearLater = new Date(start);
          oneYearLater.setFullYear(start.getFullYear() + 1);
          
          if (end.getTime() !== oneYearLater.getTime()) {
            newErrors.endDate = "Short term lease must be exactly one year";
          }
        }
      }
    }
    
    return newErrors;
  };

  const validateLowValue = (value: string) => {
    const newErrors: Record<string, string> = {};
    
    if (formData.isLowValue) {
      if (selectedAssetLowValue === null) {
        newErrors.isLowValue = "Please add low value limit for this asset in Asset Master first";
      } else if (value) {
        const inputValue = parseFloat(value);
        if (inputValue > selectedAssetLowValue) {
          newErrors.shortTermValue = `Low value cannot exceed ${selectedAssetLowValue} for this asset`;
        }
      }
    }
    
    return newErrors;
  };

  // Auto-calculate lease duration when start/end dates change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (endDate > startDate) {
        const years = endDate.getFullYear() - startDate.getFullYear();
        const months = endDate.getMonth() - startDate.getMonth();
        const days = endDate.getDate() - startDate.getDate();

        let adjustedYears = years;
        let adjustedMonths = months;
        let adjustedDays = days;

        if (adjustedDays < 0) {
          const lastMonth = new Date(
            endDate.getFullYear(),
            endDate.getMonth(),
            0
          );
          adjustedDays += lastMonth.getDate();
          adjustedMonths--;
        }

        if (adjustedMonths < 0) {
          adjustedMonths += 12;
          adjustedYears--;
        }

        if (!readOnly) {
          updateFormData({
            duration: {
              years: Math.max(0, adjustedYears),
              months: Math.max(0, adjustedMonths),
              days: Math.max(0, adjustedDays),
            },
          });
        }
      }
    }
  }, [formData.startDate, formData.endDate, readOnly]);

  useEffect(() => {
    if (formData.propertyId && cashflowEntries.length > 0 && !readOnly) {
      setCashflowEntries((prevEntries) =>
        prevEntries.map((entry) => ({
          ...entry,
          leaseId: formData.propertyId || "",
        }))
      );
    }
  }, [formData.propertyId, readOnly]);

  useEffect(() => {
    if (Array.isArray(cashflowEntries) && !readOnly) {
      updateFormData({ cashflowEntries });
    }
  }, [cashflowEntries, readOnly]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.propertyId) {
      newErrors.propertyId = "Class is required";
    }
    if (!formData.propertyName) {
      newErrors.propertyName = "Lease Name is required";
    }
    if (!formData.startDate) {
      newErrors.startDate = "Lease start date is required";
    }
    if (!formData.endDate) {
      newErrors.endDate = "Lease end date is required";
    }

    // Date range validation
    const dateErrors = validateDateRange(formData.startDate || "", formData.endDate || "");
    Object.assign(newErrors, dateErrors);

    // Low value validation
    const lowValueErrors = validateLowValue(formData.shortTermValue || "");
    Object.assign(newErrors, lowValueErrors);

    if (showCashflowDetails) {
      if (!formData.incrementalBorrowingRate) {
        newErrors.incrementalBorrowingRate = "Incremental borrowing rate is required for custom cashflow";
      }
      
      const invalidEntries = cashflowEntries.some(
        (entry) => !entry.leaseId || !entry.date || !entry.amount
      );
      if (invalidEntries) {
        newErrors.cashflow = "All cashflow entries must be completed";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (readOnly) return;
   
    const { name, value } = e.target;
    updateFormData({ [name]: value });
    
    // Real-time validation
    if (name === "shortTermValue") {
      const lowValueErrors = validateLowValue(value);
      setErrors(prev => ({ ...prev, ...lowValueErrors, shortTermValue: lowValueErrors.shortTermValue || "" }));
    }
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBorrowingRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    
    const { name, value } = e.target;
    const numericValue = parseFloat(value);
    
    // Check if rate is greater than 15%
    if (numericValue > 15) {
      setRateWarning("Rate is greater than 15%. Are you sure you want to proceed?");
    } else {
      setRateWarning("");
    }
    
    updateFormData({ [name]: value });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
   
    const { name, checked } = e.target;

    if (name === "hasCashflow") {
      setShowCashflowDetails(checked);
      if (
        checked &&
        (!formData.cashflowEntries || formData.cashflowEntries.length === 0)
      ) {
        setCashflowEntries([
          {
            id: uuidv4(),
            leaseId: formData.propertyId || "",
            date: "",
            amount: "",
            type: ""
          },
        ]);
      }
    }

    // Real-time validation for low value
    if (name === "isLowValue") {
      if (checked) {
        const lowValueErrors = validateLowValue(formData.shortTermValue || "");
        setErrors(prev => ({ ...prev, ...lowValueErrors }));
      } else {
        setErrors(prev => ({ ...prev, isLowValue: "", shortTermValue: "" }));
      }
    }

    updateFormData({ [name]: checked });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
   
    const { name, value } = e.target;
    updateFormData({ [name]: value });
    
    // Real-time date validation
    let startDate = formData.startDate || "";
    let endDate = formData.endDate || "";
    
    if (name === "startDate") startDate = value;
    if (name === "endDate") endDate = value;
    
    if (startDate && endDate) {
      const dateErrors = validateDateRange(startDate, endDate);
      setErrors(prev => ({ ...prev, ...dateErrors }));
    } else {
      // Clear date errors if one of the dates is empty
      setErrors(prev => ({ ...prev, startDate: "", endDate: "" }));
    }
  };

  const handleCashflowEntryChange = (
    id: string,
    field: keyof CashflowEntry,
    value: string
  ) => {
    if (readOnly) return;
   
    setCashflowEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.id === id ? { ...entry, [field]: value } : entry
      )
    );
    if (errors.cashflow) {
      setErrors((prev) => ({ ...prev, cashflow: "" }));
    }
  };

  const addCashflowEntry = () => {
    if (readOnly) return;
   
    setCashflowEntries((prevEntries) => [
      ...prevEntries,
      {
        id: uuidv4(),
        leaseId: formData.propertyId || "",
        date: "",
        amount: "",
        type: ""
      },
    ]);
  };

  const removeCashflowEntry = (id: string) => {
    if (readOnly) return;
   
    setCashflowEntries((prevEntries) =>
      prevEntries.filter((entry) => entry.id !== id)
    );
  };

  const handleNext = () => {
    if (masterDataWarning.length > 0) {
      return;
    }
   
    if (readOnly || validateForm()) {
      onNext();
    }
  };

  const handleSave = () => {
    if (readOnly || validateForm()) {
      onSave();
    }
  };

  return (
    <div className="bg-white p-3 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Lease Terms</h2>

      {/* Master Data Warning */}
      {masterDataWarning.length > 0 && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
          <div className="flex items-start">
            <AlertCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-red-800 font-medium">Required Master Data Missing</h3>
              <p className="text-red-700 mt-1">
                Please create the following master data first before proceeding:
              </p>
              <ul className="list-disc list-inside mt-2 text-red-700">
                {masterDataWarning.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="text-red-700 mt-2 text-sm">
                These are essential for creating a lease. Navigate to the respective master sections and create the required data.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Assets Loading State */}
      {assetsLoading && assets.length === 0 && (
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-md">
          <div className="flex items-start">
            <Loader2 className="text-blue-500 mr-3 mt-0.5 flex-shrink-0 animate-spin" />
            <div>
              <h3 className="text-blue-800 font-medium">Loading Assets...</h3>
              <p className="text-blue-700 mt-1">Please wait while we load the asset data.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="propertyId"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {LeaseFormLabels.leaseTerms.class}{" "}
              <span className="text-red-600">*</span>
            </label>
            <select
              id="propertyId"
              name="propertyId"
              className={`w-full rounded-md border ${
                errors.propertyId ? "border-red-300" : "border-gray-300"
              } px-5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
                disabled || masterDataWarning.length > 0 || assetsLoading ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              value={formData.propertyId || ""}
              onChange={handleChange}
              disabled={disabled || masterDataWarning.length > 0 || assetsLoading}
            >
              <option value="">
                {assetsLoading ? "Loading..." : "Select Class"}
              </option>
              {classOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.propertyId && (
              <p className="mt-1 text-sm text-red-600">{errors.propertyId}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Note: You can add more assets in Asset Master
            </p>
          </div>

          <div>
            <label
              htmlFor="propertyName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {LeaseFormLabels.leaseTerms.leaseName}{" "}
              <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="propertyName"
              name="propertyName"
              className={`w-full rounded-md border ${
                errors.propertyName ? "border-red-300" : "border-gray-300"
              } px-5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                disabled || masterDataWarning.length > 0 ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              placeholder="Enter Lease Name"
              value={formData.propertyName || ""}
              onChange={handleChange}
              disabled={disabled || masterDataWarning.length > 0}
              readOnly={readOnly}
            />
            {errors.propertyName && (
              <p className="mt-1 text-sm text-red-600">{errors.propertyName}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-8 p-2">
          <div className="flex items-center">
            <input
              id="isShortTerm"
              name="isShortTerm"
              type="checkbox"
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={formData.isShortTerm || false}
              onChange={handleCheckboxChange}
              disabled={disabled || masterDataWarning.length > 0}
            />
            <label htmlFor="isShortTerm" className="ml-2 text-sm text-gray-700">
              {LeaseFormLabels.leaseTerms.isShortTerm}
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="isLowValue"
              name="isLowValue"
              type="checkbox"
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={formData.isLowValue || false}
              onChange={handleCheckboxChange}
              disabled={disabled || masterDataWarning.length > 0}
            />
            <label htmlFor="isLowValue" className="ml-2 text-sm text-gray-700">
              {LeaseFormLabels.leaseTerms.isLowValue}
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="hasMultiEntityAllocation"
              name="hasMultiEntityAllocation"
              type="checkbox"
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={formData.hasMultiEntityAllocation || false}
              onChange={handleCheckboxChange}
              disabled={disabled || masterDataWarning.length > 0}
            />
            <label
              htmlFor="hasMultiEntityAllocation"
              className="ml-2 text-sm text-gray-700"
            >
              {LeaseFormLabels.leaseTerms.hasMultiEntityAllocation}
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="hasLessorAllocation"
              name="hasLessorAllocation"
              type="checkbox"
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={formData.hasLessorAllocation || false}
              onChange={handleCheckboxChange}
              disabled={disabled || masterDataWarning.length > 0}
            />
            <label
              htmlFor="hasLessorAllocation"
              className="ml-2 text-sm text-gray-700"
            >
              {LeaseFormLabels.leaseTerms.hasLessorAllocation}
            </label>
          </div>
        </div>

        {/* Low Value Error Display */}
        {errors.isLowValue && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{errors.isLowValue}</p>
          </div>
        )}

        {formData.isLowValue && (
          <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="shortTermValue"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {LeaseFormLabels.leaseTerms.isInputLowValue}
                  {selectedAssetLowValue && (
                    <span className="text-xs text-gray-500 ml-2">
                      (Max: {selectedAssetLowValue})
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  id="shortTermValue"
                  name="shortTermValue"
                  className={`w-full rounded-md border ${
                    errors.shortTermValue ? "border-red-300" : "border-gray-300"
                  } px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    disabled || masterDataWarning.length > 0 ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                  placeholder="Enter value"
                  value={formData.shortTermValue || ""}
                  onChange={handleChange}
                  min="0"
                  max={selectedAssetLowValue || undefined}
                  disabled={disabled || masterDataWarning.length > 0}
                  readOnly={readOnly}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "e") {
                      e.preventDefault();
                    }
                  }}
                />
                {errors.shortTermValue && (
                  <p className="mt-1 text-sm text-red-600">{errors.shortTermValue}</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:gap-8 p-2">
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {LeaseFormLabels.leaseTerms.startDate}{" "}
              <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                id="startDate"
                name="startDate"
                className={`w-full rounded-md border ${
                  errors.startDate ? "border-red-300" : "border-gray-300"
                } pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  disabled || masterDataWarning.length > 0 ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                value={formData.startDate instanceof Date ? formData.startDate.toISOString().split('T')[0] : formData.startDate || ""}
                onChange={handleDateChange}
                disabled={disabled || masterDataWarning.length > 0}
                readOnly={readOnly}
                onFocus={(e) => !disabled && !masterDataWarning.length && e.target.showPicker && e.target.showPicker()}
                style={{ colorScheme: "light" }}
              />
            </div>
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {LeaseFormLabels.leaseTerms.endDate}{" "}
              <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                id="endDate"
                name="endDate"
                min={formData.startDate ? 
    (formData.startDate instanceof Date ? 
      formData.startDate.toISOString().split('T')[0] : 
      formData.startDate) : 
    undefined}
                className={`w-full rounded-md border ${
                  errors.endDate ? "border-red-300" : "border-gray-300"
                } pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  disabled || masterDataWarning.length > 0 ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
         value={formData.endDate instanceof Date ? formData.endDate.toISOString().split('T')[0] : formData.endDate || ""}
                disabled={disabled || masterDataWarning.length > 0}
                readOnly={readOnly}
                onFocus={(e) => !disabled && !masterDataWarning.length && e.target.showPicker && e.target.showPicker()}
                onChange={handleDateChange}
              />
            </div>
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
            )}
          </div>
        </div>

        <div className="border border-gray-200 rounded-md bg-gray-50 p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lease Duration
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label
                htmlFor="years"
                className="block text-sm text-gray-500 mb-1"
              >
                {LeaseFormLabels.leaseTerms.leaseDuration.years}
              </label>
              <input
                type="number"
                id="years"
                min="0"
                className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                value={formData.duration?.years || 0}
                readOnly
                disabled
              />
            </div>

            <div>
              <label
                htmlFor="months"
                className="block text-sm text-gray-500 mb-1"
              >
                {LeaseFormLabels.leaseTerms.leaseDuration.months}
              </label>
              <input
                type="number"
                id="months"
                min="0"
                max="11"
                className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                value={formData.duration?.months || 0}
                readOnly
                disabled
              />
            </div>

            <div>
              <label
                htmlFor="days"
                className="block text-sm text-gray-500 mb-1"
              >
                {LeaseFormLabels.leaseTerms.leaseDuration.days}
              </label>
              <input
                type="number"
                id="days"
                min="0"
                max="30"
                className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                value={formData.duration?.days || 0}
                readOnly
                disabled
              />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Duration is automatically calculated based on start and end dates
          </p>
        </div>

        <div className="mt-4">
          <div className="flex items-center">
            <input
              id="hasCashflow"
              name="hasCashflow"
              type="checkbox"
              className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              checked={formData.hasCashflow || false}
              onChange={handleCheckboxChange}
              disabled={disabled || masterDataWarning.length > 0}
            />
            <label
              htmlFor="hasCashflow"
              className="ml-2 text-sm font-medium text-gray-700"
            >
              {LeaseFormLabels.leaseTerms.customCashflow.checkbox}
            </label>
          </div>

          {showCashflowDetails && (
            <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50 animate-fadeIn">
              <div className="mb-6">
                <label
                  htmlFor="incrementalBorrowingRate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Incremental Borrowing Rate <span className="text-red-600">*</span>
                </label>
                <div className="relative max-w-md">
                  <input
                    type="number"
                    id="incrementalBorrowingRate"
                    name="incrementalBorrowingRate"
                    className={`w-full rounded-md border ${
                      errors.incrementalBorrowingRate ? "border-red-300" : "border-gray-300"
                    } pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      disabled || masterDataWarning.length > 0 ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                    placeholder="0.00"
                    step="0.01"
                    value={formData.incrementalBorrowingRate || ""}
                    onChange={handleBorrowingRateChange}
                    min={0}
                    disabled={disabled || masterDataWarning.length > 0}
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
                </div>
                {errors.incrementalBorrowingRate && (
                  <p className="mt-1 text-sm text-red-600">{errors.incrementalBorrowingRate}</p>
                )}
                {rateWarning && (
                  <p className="mt-1 text-sm text-orange-600 flex items-center">
                    <AlertCircle size={16} className="mr-1" />
                    {rateWarning}
                  </p>
                )}
              </div>

              <div className="flex justify-between items-center mb-4">
                <h3 className="text-md font-medium">Custom Cashflow</h3>
                {!readOnly && !masterDataWarning.length && (
                  <button
                    type="button"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    <span>Cash Flow Import</span>
                  </button>
                )}
              </div>

              {cashflowEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end relative"
                >
                  <div>
                    <label
                      htmlFor={`leaseId-${entry.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {LeaseFormLabels.leaseTerms.customCashflow.leaseId}
                    </label>
                    <input
                      type="text"
                      id={`leaseId-${entry.id}`}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                      value={entry.leaseId}
                      readOnly
                      disabled
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`date-${entry.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {LeaseFormLabels.leaseTerms.customCashflow.date}
                    </label>
                    <input
                      type="date"
                      id={`date-${entry.id}`}
                      min={formData.startDate ? 
    (formData.startDate instanceof Date ? 
      formData.startDate.toISOString().split('T')[0] : 
      formData.startDate) : 
    undefined}
                      className={`w-full rounded-md border border-gray-300 pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        disabled || masterDataWarning.length > 0 ? "bg-gray-100 cursor-not-allowed" : ""
                      }`}
                      value={entry.date}
                      disabled={disabled || masterDataWarning.length > 0}
                      readOnly={readOnly}
                      onFocus={(e) =>
                        !disabled && !masterDataWarning.length && e.target.showPicker && e.target.showPicker()
                      }
                      onChange={(e) =>
                        handleCashflowEntryChange(
                          entry.id,
                          "date",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="flex-grow">
                      <label
                        htmlFor={`amount-${entry.id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        {LeaseFormLabels.leaseTerms.customCashflow.amount}
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                          ₹
                        </span>
                        <input
                          type="number"
                          id={`amount-${entry.id}`}
                          className={`w-full rounded-md border border-gray-300 pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            disabled || masterDataWarning.length > 0 ? "bg-gray-100 cursor-not-allowed" : ""
                          }`}
                          placeholder="0.00"
                          value={entry.amount}
                          min={0}
                          disabled={disabled || masterDataWarning.length > 0}
                          readOnly={readOnly}
                          onKeyDown={(e) => {
                            if (e.key === "-" || e.key === "e") {
                              e.preventDefault();
                            }
                          }}
                          onChange={(e) =>
                            handleCashflowEntryChange(
                              entry.id,
                              "amount",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                    {cashflowEntries.length > 1 && !readOnly && !masterDataWarning.length && (
                      <button
                        type="button"
                        onClick={() => removeCashflowEntry(entry.id)}
                        className="p-2 text-gray-500 hover:text-red-500 focus:outline-none"
                        aria-label="Remove entry"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {errors.cashflow && (
                <p className="mt-1 text-sm text-red-600">{errors.cashflow}</p>
              )}

              {!readOnly && !masterDataWarning.length && (
                <div className="flex justify-end mt-4">
                  <button
                    type="button"
                    onClick={addCashflowEntry}
                    className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add Entry
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        {!readOnly && (
          <>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className={`bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors ${
                isSaving ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={handleNext}
              disabled={masterDataWarning.length > 0}
              className={`px-4 py-2 rounded-md transition-colors ${
                masterDataWarning.length > 0
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-[#008F98] text-white hover:bg-[#007A82]"
              }`}
            >
              Next
            </button>
          </>
        )}
       
        {readOnly && (
          <div className="w-full flex justify-end">
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
    </div>
  );
};

export default LeaseBasicInfo;





// import React, { useState, useEffect } from "react";
// import { Trash2, Plus, AlertCircle } from "lucide-react";
// import { CashflowEntry, LeaseFormData } from "../../../../types";
// import { v4 as uuidv4 } from "uuid";
// import { LeaseFormLabels } from "./LeaseFormLabel";
// import useMaster from "../../../../hooks/useMaster";

// interface LeaseBasicInfoProps {
//   formData: LeaseFormData;
//   updateFormData: (data: Partial<LeaseFormData>) => void;
//   onNext: () => void;
//   onSave: () => void;
//   isSaving: boolean;
//   readOnly?: boolean;
//   disabled?: boolean;
// }

// const LeaseBasicInfo: React.FC<LeaseBasicInfoProps> = ({
//   formData,
//   updateFormData,
//   onNext,
//   onSave,
//   isSaving,
//   readOnly = false,
//   disabled = false,
// }) => {
//   const { assets, fetchAssets } = useMaster();
//   const [showCashflowDetails, setShowCashflowDetails] = useState(
//     formData.hasCashflow || false
//   );
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [masterDataWarning, setMasterDataWarning] = useState<string[]>([]);
//   const [rateWarning, setRateWarning] = useState<string>("");

//   // Check for required master data
//   useEffect(() => {
//     fetchAssets();
//   }, []);

//   useEffect(() => {
//     const warnings = [];
//     if (assets.length === 0) warnings.push("Asset Master");
//     // Add other master data checks here based on your requirements
//     setMasterDataWarning(warnings);
//   }, [assets]);

//   // Safe mapping of assets with proper error handling
//   const classOptions = assets.map(asset => ({
//     value: (asset.id || asset.asset_id || asset.asset_group_code || '').toString(),
//     label: asset.asset_group_name || 'Unknown Asset'
//   })).filter(option => option.value !== ''); // Filter out empty values

//   const [cashflowEntries, setCashflowEntries] = useState<CashflowEntry[]>(
//     Array.isArray(formData.cashflowEntries)
//       ? formData.cashflowEntries
//       : [
//           {
//             id: uuidv4(),
//             leaseId: formData.propertyId || "",
//             date: "",
//             amount: "",
//             type: ""
//           },
//         ]
//   );

//   // Auto-calculate lease duration when start/end dates change
//   useEffect(() => {
//     if (formData.startDate && formData.endDate) {
//       const startDate = new Date(formData.startDate);
//       const endDate = new Date(formData.endDate);

//       if (endDate > startDate) {
//         const years = endDate.getFullYear() - startDate.getFullYear();
//         const months = endDate.getMonth() - startDate.getMonth();
//         const days = endDate.getDate() - startDate.getDate();

//         let adjustedYears = years;
//         let adjustedMonths = months;
//         let adjustedDays = days;

//         if (adjustedDays < 0) {
//           const lastMonth = new Date(
//             endDate.getFullYear(),
//             endDate.getMonth(),
//             0
//           );
//           adjustedDays += lastMonth.getDate();
//           adjustedMonths--;
//         }

//         if (adjustedMonths < 0) {
//           adjustedMonths += 12;
//           adjustedYears--;
//         }

//         if (!readOnly) {
//           updateFormData({
//             duration: {
//               years: Math.max(0, adjustedYears),
//               months: Math.max(0, adjustedMonths),
//               days: Math.max(0, adjustedDays),
//             },
//           });
//         }
//       }
//     }
//   }, [formData.startDate, formData.endDate, readOnly]);

//   useEffect(() => {
//     if (formData.propertyId && cashflowEntries.length > 0 && !readOnly) {
//       setCashflowEntries((prevEntries) =>
//         prevEntries.map((entry) => ({
//           ...entry,
//           leaseId: formData.propertyId || "",
//         }))
//       );
//     }
//   }, [formData.propertyId, readOnly]);

//   useEffect(() => {
//     if (Array.isArray(cashflowEntries) && !readOnly) {
//       updateFormData({ cashflowEntries });
//     }
//   }, [cashflowEntries, readOnly]);

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.propertyId) {
//       newErrors.propertyId = "Class is required";
//     }
//     if (!formData.propertyName) {
//       newErrors.propertyName = "Lease Name is required";
//     }
//     if (!formData.startDate) {
//       newErrors.startDate = "Start date is required";
//     }
//     if (!formData.endDate) {
//       newErrors.endDate = "End date is required";
//     } else if (
//       formData.startDate &&
//       new Date(formData.endDate) <= new Date(formData.startDate)
//     ) {
//       newErrors.endDate = "End date must be after start date";
//     }

//     if (showCashflowDetails) {
//       if (!formData.incrementalBorrowingRate) {
//         newErrors.incrementalBorrowingRate = "Incremental borrowing rate is required for custom cashflow";
//       }
      
//       const invalidEntries = cashflowEntries.some(
//         (entry) => !entry.leaseId || !entry.date || !entry.amount
//       );
//       if (invalidEntries) {
//         newErrors.cashflow = "All cashflow entries must be completed";
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     if (readOnly) return;
   
//     const { name, value } = e.target;
//     updateFormData({ [name]: value });
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const handleBorrowingRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (readOnly) return;
    
//     const { name, value } = e.target;
//     const numericValue = parseFloat(value);
    
//     // Check if rate is greater than 15%
//     if (numericValue > 15) {
//       setRateWarning("Rate is greater than 15%. Are you sure you want to proceed?");
//     } else {
//       setRateWarning("");
//     }
    
//     updateFormData({ [name]: value });
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (readOnly) return;
   
//     const { name, checked } = e.target;

//     if (name === "hasCashflow") {
//       setShowCashflowDetails(checked);
//       if (
//         checked &&
//         (!formData.cashflowEntries || formData.cashflowEntries.length === 0)
//       ) {
//         setCashflowEntries([
//           {
//             id: uuidv4(),
//             leaseId: formData.propertyId || "",
//             date: "",
//             amount: "",
//             type: ""
//           },
//         ]);
//       }
//     }

//     updateFormData({ [name]: checked });
//   };

//   const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (readOnly) return;
   
//     const { name, value } = e.target;
//     updateFormData({ [name]: value });
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const handleCashflowEntryChange = (
//     id: string,
//     field: keyof CashflowEntry,
//     value: string
//   ) => {
//     if (readOnly) return;
   
//     setCashflowEntries((prevEntries) =>
//       prevEntries.map((entry) =>
//         entry.id === id ? { ...entry, [field]: value } : entry
//       )
//     );
//     if (errors.cashflow) {
//       setErrors((prev) => ({ ...prev, cashflow: "" }));
//     }
//   };

//   const addCashflowEntry = () => {
//     if (readOnly) return;
   
//     setCashflowEntries((prevEntries) => [
//       ...prevEntries,
//       {
//         id: uuidv4(),
//         leaseId: formData.propertyId || "",
//         date: "",
//         amount: "",
//         type: ""
//       },
//     ]);
//   };

//   const removeCashflowEntry = (id: string) => {
//     if (readOnly) return;
   
//     setCashflowEntries((prevEntries) =>
//       prevEntries.filter((entry) => entry.id !== id)
//     );
//   };

//   const handleNext = () => {
//     if (masterDataWarning.length > 0) {
//       return; // Prevent proceeding if master data is missing
//     }
   
//     if (readOnly || validateForm()) {
//       onNext();
//     }
//   };

//   const handleSave = () => {
//     if (readOnly || validateForm()) {
//       onSave();
//     }
//   };

//   return (
//     <div className="bg-white p-3 rounded-lg shadow-sm">
//       <h2 className="text-xl font-semibold mb-6">Lease Terms</h2>

//       {/* Master Data Warning */}
//       {masterDataWarning.length > 0 && (
//         <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
//           <div className="flex items-start">
//             <AlertCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" />
//             <div>
//               <h3 className="text-red-800 font-medium">Required Master Data Missing</h3>
//               <p className="text-red-700 mt-1">
//                 Please create the following master data first before proceeding:
//               </p>
//               <ul className="list-disc list-inside mt-2 text-red-700">
//                 {masterDataWarning.map((item) => (
//                   <li key={item}>{item}</li>
//                 ))}
//               </ul>
//               <p className="text-red-700 mt-2 text-sm">
//                 These are essential for creating a lease. Navigate to the respective master sections and create the required data.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="grid gap-6 p-2">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label
//               htmlFor="propertyId"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               {LeaseFormLabels.leaseTerms.class}{" "}
//               <span className="text-red-600">*</span>
//             </label>
//             <select
//               id="propertyId"
//               name="propertyId"
//               className={`w-full rounded-md border ${
//                 errors.propertyId ? "border-red-300" : "border-gray-300"
//               } px-5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
//                 disabled || masterDataWarning.length > 0 ? "bg-gray-100 cursor-not-allowed" : ""
//               }`}
//               value={formData.propertyId || ""}
//               onChange={handleChange}
//               disabled={disabled || masterDataWarning.length > 0}
//             >
//               <option value="">Select Class</option>
//               {classOptions.map((option) => (
//                 <option key={option.value} value={option.value}>
//                   {option.label}
//                 </option>
//               ))}
//             </select>
//             {errors.propertyId && (
//               <p className="mt-1 text-sm text-red-600">{errors.propertyId}</p>
//             )}
//           </div>

//           <div>
//             <label
//               htmlFor="propertyName"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               {LeaseFormLabels.leaseTerms.leaseName}{" "}
//               <span className="text-red-600">*</span>
//             </label>
//             <input
//               type="text"
//               id="propertyName"
//               name="propertyName"
//               className={`w-full rounded-md border ${
//                 errors.propertyName ? "border-red-300" : "border-gray-300"
//               } px-5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                 disabled || masterDataWarning.length > 0 ? "bg-gray-100 cursor-not-allowed" : ""
//               }`}
//               placeholder="Enter Lease Name"
//               value={formData.propertyName || ""}
//               onChange={handleChange}
//               disabled={disabled || masterDataWarning.length > 0}
//               readOnly={readOnly}
//             />
//             {errors.propertyName && (
//               <p className="mt-1 text-sm text-red-600">{errors.propertyName}</p>
//             )}
//           </div>
//         </div>

//         <div className="flex flex-wrap gap-8 p-2">
//           <div className="flex items-center">
//             <input
//               id="isShortTerm"
//               name="isShortTerm"
//               type="checkbox"
//               className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//               checked={formData.isShortTerm || false}
//               onChange={handleCheckboxChange}
//               disabled={disabled || masterDataWarning.length > 0}
//             />
//             <label htmlFor="isShortTerm" className="ml-2 text-sm text-gray-700">
//               {LeaseFormLabels.leaseTerms.isShortTerm}
//             </label>
//           </div>

//           <div className="flex items-center">
//             <input
//               id="isLowValue"
//               name="isLowValue"
//               type="checkbox"
//               className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//               checked={formData.isLowValue || false}
//               onChange={handleCheckboxChange}
//               disabled={disabled || masterDataWarning.length > 0}
//             />
//             <label htmlFor="isLowValue" className="ml-2 text-sm text-gray-700">
//               {LeaseFormLabels.leaseTerms.isLowValue}
//             </label>
//           </div>

//           <div className="flex items-center">
//             <input
//               id="hasMultiEntityAllocation"
//               name="hasMultiEntityAllocation"
//               type="checkbox"
//               className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//               checked={formData.hasMultiEntityAllocation || false}
//               onChange={handleCheckboxChange}
//               disabled={disabled || masterDataWarning.length > 0}
//             />
//             <label
//               htmlFor="hasMultiEntityAllocation"
//               className="ml-2 text-sm text-gray-700"
//             >
//               {LeaseFormLabels.leaseTerms.hasMultiEntityAllocation}
//             </label>
//           </div>

//           <div className="flex items-center">
//             <input
//               id="hasLessorAllocation"
//               name="hasLessorAllocation"
//               type="checkbox"
//               className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//               checked={formData.hasLessorAllocation || false}
//               onChange={handleCheckboxChange}
//               disabled={disabled || masterDataWarning.length > 0}
//             />
//             <label
//               htmlFor="hasLessorAllocation"
//               className="ml-2 text-sm text-gray-700"
//             >
//               {LeaseFormLabels.leaseTerms.hasLessorAllocation}
//             </label>
//           </div>
//         </div>

//         {formData.isLowValue && (
//           <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label
//                   htmlFor="shortTermValue"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   {LeaseFormLabels.leaseTerms.isInputLowValue}
//                 </label>
//                 <input
//                   type="number"
//                   id="shortTermValue"
//                   name="shortTermValue"
//                   className={`w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     disabled || masterDataWarning.length > 0 ? "bg-gray-100 cursor-not-allowed" : ""
//                   }`}
//                   placeholder="Enter value"
//                   value={formData.shortTermValue || ""}
//                   onChange={handleChange}
//                   min="0"
//                   disabled={disabled || masterDataWarning.length > 0}
//                   readOnly={readOnly}
//                   onKeyDown={(e) => {
//                     if (e.key === "-" || e.key === "e") {
//                       e.preventDefault();
//                     }
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 lg:gap-8 p-2">
//           <div>
//             <label
//               htmlFor="startDate"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               {LeaseFormLabels.leaseTerms.startDate}{" "}
//               <span className="text-red-600">*</span>
//             </label>
//             <div className="relative">
//               <input
//                 type="date"
//                 id="startDate"
//                 name="startDate"
//                 className={`w-full rounded-md border ${
//                   errors.startDate ? "border-red-300" : "border-gray-300"
//                 } pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                   disabled || masterDataWarning.length > 0 ? "bg-gray-100 cursor-not-allowed" : ""
//                 }`}
//                 value={formData.startDate instanceof Date ? formData.startDate.toISOString().split('T')[0] : formData.startDate || ""}
//                 onChange={handleDateChange}
//                 disabled={disabled || masterDataWarning.length > 0}
//                 readOnly={readOnly}
//                 onFocus={(e) => !disabled && !masterDataWarning.length && e.target.showPicker && e.target.showPicker()}
//                 style={{ colorScheme: "light" }}
//               />
//             </div>
//             {errors.startDate && (
//               <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
//             )}
//           </div>

//           <div>
//             <label
//               htmlFor="endDate"
//               className="block text-sm font-medium text-gray-700 mb-1"
//             >
//               {LeaseFormLabels.leaseTerms.endDate}{" "}
//               <span className="text-red-600">*</span>
//             </label>
//             <div className="relative">
//               <input
//                 type="date"
//                 id="endDate"
//                 name="endDate"
//                 min={formData.startDate ? 
//     (formData.startDate instanceof Date ? 
//       formData.startDate.toISOString().split('T')[0] : 
//       formData.startDate) : 
//     undefined}
//                 className={`w-full rounded-md border ${
//                   errors.endDate ? "border-red-300" : "border-gray-300"
//                 } pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                   disabled || masterDataWarning.length > 0 ? "bg-gray-100 cursor-not-allowed" : ""
//                 }`}
//          value={formData.endDate instanceof Date ? formData.endDate.toISOString().split('T')[0] : formData.endDate || ""}
//                 disabled={disabled || masterDataWarning.length > 0}
//                 readOnly={readOnly}
//                 onFocus={(e) => !disabled && !masterDataWarning.length && e.target.showPicker && e.target.showPicker()}
//                 onChange={handleDateChange}
//               />
//             </div>
//             {errors.endDate && (
//               <p className="mt-1 text-sm text-red-600">{errors.endDate}</p>
//             )}
//           </div>
//         </div>

//         <div className="border border-gray-200 rounded-md bg-gray-50 p-4">
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Lease Duration
//           </label>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div>
//               <label
//                 htmlFor="years"
//                 className="block text-sm text-gray-500 mb-1"
//               >
//                 {LeaseFormLabels.leaseTerms.leaseDuration.years}
//               </label>
//               <input
//                 type="number"
//                 id="years"
//                 min="0"
//                 className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
//                 value={formData.duration?.years || 0}
//                 readOnly
//                 disabled
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor="months"
//                 className="block text-sm text-gray-500 mb-1"
//               >
//                 {LeaseFormLabels.leaseTerms.leaseDuration.months}
//               </label>
//               <input
//                 type="number"
//                 id="months"
//                 min="0"
//                 max="11"
//                 className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
//                 value={formData.duration?.months || 0}
//                 readOnly
//                 disabled
//               />
//             </div>

//             <div>
//               <label
//                 htmlFor="days"
//                 className="block text-sm text-gray-500 mb-1"
//               >
//                 {LeaseFormLabels.leaseTerms.leaseDuration.days}
//               </label>
//               <input
//                 type="number"
//                 id="days"
//                 min="0"
//                 max="30"
//                 className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
//                 value={formData.duration?.days || 0}
//                 readOnly
//                 disabled
//               />
//             </div>
//           </div>
//           <p className="text-sm text-gray-500 mt-2">
//             Duration is automatically calculated based on start and end dates
//           </p>
//         </div>

//         <div className="mt-4">
//           <div className="flex items-center">
//             <input
//               id="hasCashflow"
//               name="hasCashflow"
//               type="checkbox"
//               className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//               checked={formData.hasCashflow || false}
//               onChange={handleCheckboxChange}
//               disabled={disabled || masterDataWarning.length > 0}
//             />
//             <label
//               htmlFor="hasCashflow"
//               className="ml-2 text-sm font-medium text-gray-700"
//             >
//               {LeaseFormLabels.leaseTerms.customCashflow.checkbox}
//             </label>
//           </div>

//           {showCashflowDetails && (
//             <div className="mt-4 p-4 border border-gray-200 rounded-md bg-gray-50 animate-fadeIn">
//               <div className="mb-6">
//                 <label
//                   htmlFor="incrementalBorrowingRate"
//                   className="block text-sm font-medium text-gray-700 mb-1"
//                 >
//                   Incremental Borrowing Rate <span className="text-red-600">*</span>
//                 </label>
//                 <div className="relative max-w-md">
//                   <input
//                     type="number"
//                     id="incrementalBorrowingRate"
//                     name="incrementalBorrowingRate"
//                     className={`w-full rounded-md border ${
//                       errors.incrementalBorrowingRate ? "border-red-300" : "border-gray-300"
//                     } pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                       disabled || masterDataWarning.length > 0 ? "bg-gray-100 cursor-not-allowed" : ""
//                     }`}
//                     placeholder="0.00"
//                     step="0.01"
//                     value={formData.incrementalBorrowingRate || ""}
//                     onChange={handleBorrowingRateChange}
//                     min={0}
//                     disabled={disabled || masterDataWarning.length > 0}
//                     readOnly={readOnly}
//                     onKeyDown={(e) => {
//                       if (e.key === "-" || e.key === "e") {
//                         e.preventDefault();
//                       }
//                     }}
//                   />
//                   <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 text-sm h-full pointer-events-none">
//                     %
//                   </span>
//                 </div>
//                 {errors.incrementalBorrowingRate && (
//                   <p className="mt-1 text-sm text-red-600">{errors.incrementalBorrowingRate}</p>
//                 )}
//                 {rateWarning && (
//                   <p className="mt-1 text-sm text-orange-600 flex items-center">
//                     <AlertCircle size={16} className="mr-1" />
//                     {rateWarning}
//                   </p>
//                 )}
//               </div>

//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-md font-medium">Custom Cashflow</h3>
//                 {!readOnly && !masterDataWarning.length && (
//                   <button
//                     type="button"
//                     className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
//                   >
//                     <span>Cash Flow Import</span>
//                   </button>
//                 )}
//               </div>

//               {cashflowEntries.map((entry) => (
//                 <div
//                   key={entry.id}
//                   className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end relative"
//                 >
//                   <div>
//                     <label
//                       htmlFor={`leaseId-${entry.id}`}
//                       className="block text-sm font-medium text-gray-700 mb-1"
//                     >
//                       {LeaseFormLabels.leaseTerms.customCashflow.leaseId}
//                     </label>
//                     <input
//                       type="text"
//                       id={`leaseId-${entry.id}`}
//                       className="w-full rounded-md border border-gray-300 px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
//                       value={entry.leaseId}
//                       readOnly
//                       disabled
//                     />
//                   </div>
//                   <div>
//                     <label
//                       htmlFor={`date-${entry.id}`}
//                       className="block text-sm font-medium text-gray-700 mb-1"
//                     >
//                       {LeaseFormLabels.leaseTerms.customCashflow.date}
//                     </label>
//                     <input
//                       type="date"
//                       id={`date-${entry.id}`}
//                       min={formData.startDate ? 
//     (formData.startDate instanceof Date ? 
//       formData.startDate.toISOString().split('T')[0] : 
//       formData.startDate) : 
//     undefined}
//                       className={`w-full rounded-md border border-gray-300 pl-3 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                         disabled || masterDataWarning.length > 0 ? "bg-gray-100 cursor-not-allowed" : ""
//                       }`}
//                       value={entry.date}
//                       disabled={disabled || masterDataWarning.length > 0}
//                       readOnly={readOnly}
//                       onFocus={(e) =>
//                         !disabled && !masterDataWarning.length && e.target.showPicker && e.target.showPicker()
//                       }
//                       onChange={(e) =>
//                         handleCashflowEntryChange(
//                           entry.id,
//                           "date",
//                           e.target.value
//                         )
//                       }
//                     />
//                   </div>
//                   <div className="flex items-end gap-2">
//                     <div className="flex-grow">
//                       <label
//                         htmlFor={`amount-${entry.id}`}
//                         className="block text-sm font-medium text-gray-700 mb-1"
//                       >
//                         {LeaseFormLabels.leaseTerms.customCashflow.amount}
//                       </label>
//                       <div className="relative">
//                         <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
//                           ₹
//                         </span>
//                         <input
//                           type="number"
//                           id={`amount-${entry.id}`}
//                           className={`w-full rounded-md border border-gray-300 pl-8 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                             disabled || masterDataWarning.length > 0 ? "bg-gray-100 cursor-not-allowed" : ""
//                           }`}
//                           placeholder="0.00"
//                           value={entry.amount}
//                           min={0}
//                           disabled={disabled || masterDataWarning.length > 0}
//                           readOnly={readOnly}
//                           onKeyDown={(e) => {
//                             if (e.key === "-" || e.key === "e") {
//                               e.preventDefault();
//                             }
//                           }}
//                           onChange={(e) =>
//                             handleCashflowEntryChange(
//                               entry.id,
//                               "amount",
//                               e.target.value
//                             )
//                           }
//                         />
//                       </div>
//                     </div>
//                     {cashflowEntries.length > 1 && !readOnly && !masterDataWarning.length && (
//                       <button
//                         type="button"
//                         onClick={() => removeCashflowEntry(entry.id)}
//                         className="p-2 text-gray-500 hover:text-red-500 focus:outline-none"
//                         aria-label="Remove entry"
//                       >
//                         <Trash2 size={18} />
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))}

//               {errors.cashflow && (
//                 <p className="mt-1 text-sm text-red-600">{errors.cashflow}</p>
//               )}

//               {!readOnly && !masterDataWarning.length && (
//                 <div className="flex justify-end mt-4">
//                   <button
//                     type="button"
//                     onClick={addCashflowEntry}
//                     className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors flex items-center gap-2"
//                   >
//                     <Plus size={16} />
//                     Add Entry
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="mt-8 flex justify-between">
//         {!readOnly && (
//           <>
//             <button
//               type="button"
//               onClick={handleSave}
//               disabled={isSaving}
//               className={`bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors ${
//                 isSaving ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//             >
//               {isSaving ? "Saving..." : "Save"}
//             </button>
//             <button
//               type="button"
//               onClick={handleNext}
//               disabled={masterDataWarning.length > 0}
//               className={`px-4 py-2 rounded-md transition-colors ${
//                 masterDataWarning.length > 0
//                   ? "bg-gray-400 text-gray-200 cursor-not-allowed"
//                   : "bg-[#008F98] text-white hover:bg-[#007A82]"
//               }`}
//             >
//               Next
//             </button>
//           </>
//         )}
       
//         {readOnly && (
//           <div className="w-full flex justify-end">
//             <button
//               type="button"
//               onClick={onNext}
//               className="bg-[#008F98] text-white px-4 py-2 rounded-md hover:bg-[#007A82] transition-colors"
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LeaseBasicInfo;