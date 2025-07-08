import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, X, AlertTriangle } from "lucide-react";
import { LeaseFormData } from "../../../../types";
import useMaster from "../../../../hooks/useMaster";


interface LeaseBasicInfoProps {
  formData: LeaseFormData;
  updateFormData: (data: Partial<LeaseFormData>) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSave: () => void;
  isSaving: boolean;
  readOnly?: boolean;
  disabled?: boolean;
}


interface MultiSelectDropdownProps {
  options: { label: string; value: string }[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder: string;
  disabled?: boolean;
  singleSelect?: boolean;
}


const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  options,
  selectedValues,
  onSelectionChange,
  placeholder,
  disabled = false,
  singleSelect = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };


    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const handleOptionToggle = (value: string) => {
    if (singleSelect) {
      onSelectionChange([value]);
      setIsOpen(false);
    } else {
      const newSelection = selectedValues.includes(value)
        ? selectedValues.filter((v) => v !== value)
        : [...selectedValues, value];
      onSelectionChange(newSelection);
    }
  };


  const removeSelectedItem = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectionChange(selectedValues.filter((v) => v !== value));
  };


  const getSelectedLabels = () => {
    return selectedValues.map(
      (value) =>
        options.find((option) => option.value === value)?.label || value
    );
  };


  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`w-full min-h-[42px] rounded-md border border-gray-300 px-4 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${
          disabled
            ? "bg-gray-100 cursor-not-allowed"
            : "bg-white hover:border-gray-400"
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-h-[24px]">
            {selectedValues.length === 0 ? (
              <span className="text-gray-500">{placeholder}</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {getSelectedLabels().map((label, index) => (
                  <span
                    key={selectedValues[index]}
                    className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-md"
                  >
                    {label}
                    {!disabled && !singleSelect && (
                      <X
                        size={14}
                        className="ml-1 cursor-pointer hover:text-blue-600"
                        onClick={(e) =>
                          removeSelectedItem(selectedValues[index], e)
                        }
                      />
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>
          <ChevronDown
            size={20}
            className={`text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>


      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {options.length === 0 ? (
            <div className="px-4 py-2 text-gray-500">No options available</div>
          ) : (
            options.map((option) => (
              <div
                key={option.value}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center ${
                  selectedValues.includes(option.value)
                    ? "bg-blue-50 text-blue-700"
                    : ""
                }`}
                onClick={() => handleOptionToggle(option.value)}
              >
                {!singleSelect && (
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option.value)}
                    onChange={() => {}}
                    className="mr-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                )}
                {singleSelect && (
                  <input
                    type="radio"
                    checked={selectedValues.includes(option.value)}
                    onChange={() => {}}
                    className="mr-3 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                )}
                {option.label}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};


export const LessorDetails: React.FC<LeaseBasicInfoProps> = ({
  formData,
  updateFormData,
  onPrevious,
  onNext,
  onSave,
  isSaving,
  readOnly = false,
  disabled = false,
}) => {
  const { entities, LessorData, department, fetchEntityMaster, fetchLessors, fetchDepartment } = useMaster();
 
  const [entityDepartmentPercentages, setEntityDepartmentPercentages] =
    useState<Record<string, Record<string, number>>>(
      formData.entityDepartmentPercentages || {}
    );
  const [lessorPercentages, setLessorPercentages] = useState<
    Record<string, number>
  >(formData.lessorPercentages || {});
  const [overallEntityPercentages, setOverallEntityPercentages] = useState<
    Record<string, number>
  >(formData.overallEntityPercentages || {});
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");


  const isMultiEntityMode = formData.hasMultiEntityAllocation;
  const isLessorSplitMode = formData.hasLessorAllocation;


  // Load master data
  useEffect(() => {
    fetchEntityMaster();
    fetchLessors();
    fetchDepartment();
  }, []);


  // Convert API data to dropdown options
  const entityOptions = entities.map(entity => ({
    label: entity.entity_name,
    value: entity.entity_id.toString()
  }));


  const lessorOptions = LessorData.map(lessor => ({
    label: lessor.lessor_name,
    value: lessor.lessor_id.toString()
  }));


  // Create department map based on entities (for demo purposes, showing all departments for all entities)
 const getDepartmentsForEntity = (entityId: string) => {
  console.log(entityId);
  
  return department
    .filter(dept => dept.department_id !== null) // Filter out null department_ids
    .map(dept => ({
      label: dept.department_name,
      value: dept.department_id!.toString() // Using ! to assert non-null since we filtered
    }));
};



  // Update formData whenever percentages change
  useEffect(() => {
    if (!readOnly) {
      if (isMultiEntityMode) {
        updateFormData({
          entityDepartmentPercentages,
          overallEntityPercentages,
        });
      }


      if (isLessorSplitMode) {
        updateFormData({
          lessorPercentages,
        });
      }
    }
  }, [
    entityDepartmentPercentages,
    overallEntityPercentages,
    lessorPercentages,
    isMultiEntityMode,
    isLessorSplitMode,
    readOnly,
  ]);


  const handleEntityChange = (selectedEntities: string[]) => {
    if (readOnly) return;
   
    updateFormData({
      entityMaster: isMultiEntityMode
        ? selectedEntities
        : selectedEntities[0] || "",
    });


    // Reset department selection when entity changes in single mode
    if (!isMultiEntityMode) {
      setSelectedDepartment("");
      updateFormData({ department: [] as string[] });
    }
  };


  const handleLessorChange = (selectedLessors: string[]) => {
    if (readOnly) return;
   
    updateFormData({
      leaserMaster: isLessorSplitMode
        ? selectedLessors
        : selectedLessors[0] || "",
    });
  };


  const handleDepartmentChange = (selectedDepartments: string[]) => {
    if (readOnly) return;
   
    if (!isMultiEntityMode) {
      setSelectedDepartment(selectedDepartments[0] || "");
      updateFormData({ department: selectedDepartments });
    }
  };


  const handleEntityDepartmentPercentageChange = (
    entityId: string,
    deptId: string,
    value: string
  ) => {
    if (readOnly) return;
   
    const numValue = parseFloat(value) || 0;
    const newPercentages = {
      ...entityDepartmentPercentages,
      [entityId]: {
        ...entityDepartmentPercentages[entityId],
        [deptId]: numValue,
      },
    };
    setEntityDepartmentPercentages(newPercentages);
  };


  const handleOverallEntityPercentageChange = (
    entityId: string,
    value: string
  ) => {
    if (readOnly) return;
   
    const numValue = parseFloat(value) || 0;
    const newOverallPercentages = {
      ...overallEntityPercentages,
      [entityId]: numValue,
    };
    setOverallEntityPercentages(newOverallPercentages);
  };


  const handleLessorPercentageChange = (lessorId: string, value: string) => {
    if (readOnly) return;
   
    const numValue = parseFloat(value) || 0;
    const newPercentages = {
      ...lessorPercentages,
      [lessorId]: numValue,
    };
    setLessorPercentages(newPercentages);
  };


  const getUniqueDepartments = () => {
    const selectedEntities = Array.isArray(formData.entityMaster)
      ? formData.entityMaster
      : formData.entityMaster
      ? [formData.entityMaster]
      : [];
   
    const deptMap = new Map<string, string>();
   
    selectedEntities.forEach((entityId) => {
      const departments = getDepartmentsForEntity(entityId);
      departments.forEach((dept) => {
        if (!deptMap.has(dept.value)) {
          deptMap.set(dept.value, dept.label);
        }
      });
    });


    return Array.from(deptMap.entries()).map(([value, label]) => ({
      value,
      label,
    }));
  };


  const entityHasDepartment = (entityId: string, deptValue: string) => {
    const departments = getDepartmentsForEntity(entityId);
    return departments.some((dept) => dept.value === deptValue);
  };


  const getEntityTotal = (entityId: string) => {
    const entityPercentages = entityDepartmentPercentages[entityId] || {};
    return Object.values(entityPercentages).reduce((sum, val) => sum + val, 0);
  };


  const getOverallEntityGrandTotal = () => {
    return Object.values(overallEntityPercentages).reduce(
      (sum, val) => sum + val,
      0
    );
  };


  const lessorTotal = Object.values(lessorPercentages).reduce(
    (sum, val) => sum + val,
    0
  );


  const selectedEntities = Array.isArray(formData.entityMaster)
    ? formData.entityMaster
    : formData.entityMaster
    ? [formData.entityMaster]
    : [];
  const selectedLessors = Array.isArray(formData.leaserMaster)
    ? formData.leaserMaster
    : formData.leaserMaster
    ? [formData.leaserMaster]
    : [];
  const uniqueDepartments = getUniqueDepartments();


  // Validation
  const allEntityTotalsValid =
    !isMultiEntityMode ||
    (selectedEntities.length > 0 &&
      selectedEntities.every((entityId) => {
        const total = getEntityTotal(entityId);
        return Math.abs(total - 100) < 0.01;
      }));


  const overallEntityGrandTotalValid =
    !isMultiEntityMode ||
    selectedEntities.length === 0 ||
    Math.abs(getOverallEntityGrandTotal() - 100) < 0.01;


  const lessorTotalValid =
    !isLessorSplitMode ||
    selectedLessors.length === 0 ||
    Math.abs(lessorTotal - 100) < 0.01;


  const singleModeValid =
    (isMultiEntityMode || selectedEntities.length > 0) &&
    (isLessorSplitMode || selectedLessors.length > 0) &&
    (isMultiEntityMode || selectedDepartment);


  const canProceed =
    readOnly ||
    (isMultiEntityMode || isLessorSplitMode
      ? allEntityTotalsValid &&
        overallEntityGrandTotalValid &&
        lessorTotalValid &&
        selectedEntities.length > 0 &&
        selectedLessors.length > 0
      : singleModeValid);


  // Check if master data is available
  const hasRequiredMasterData = entities.length > 0 && LessorData.length > 0;


  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-6">
        {isMultiEntityMode || isLessorSplitMode
          ? "Multi-Entity/Lessor Setup"
          : "Lease Master Setup"}
      </h2>


      {/* Warning if master data is missing */}
      {!hasRequiredMasterData && (
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-md">
          <div className="flex items-start">
            <AlertTriangle className="text-yellow-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-yellow-800 font-medium">Required Master Data Missing</h3>
              <p className="text-yellow-700 mt-1">
                Please create the following master data first:
              </p>
              <ul className="list-disc list-inside mt-2 text-yellow-700">
                {entities.length === 0 && <li>Entity Master records</li>}
                {LessorData.length === 0 && <li>Lessor Master records</li>}
              </ul>
            </div>
          </div>
        </div>
      )}


      {/* Section: Entity Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Entity Selection
        </h3>
        <div>
          <label
            htmlFor="entityMaster"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {isMultiEntityMode ? "Select Entities" : "Select Entity"}{" "}
            <span className="text-red-600">*</span>
          </label>
          <MultiSelectDropdown
            options={entityOptions}
            selectedValues={selectedEntities}
            onSelectionChange={handleEntityChange}
            placeholder={
              isMultiEntityMode ? "Select Entity(ies)" : "Select an Entity"
            }
            singleSelect={!isMultiEntityMode}
            disabled={disabled || !hasRequiredMasterData}
          />
        </div>
      </div>


      {/* Department Selection for Single Entity Mode */}
      {!isMultiEntityMode && selectedEntities.length > 0 && hasRequiredMasterData && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Department Selection
          </h3>
          <div>
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Department
            </label>
            <MultiSelectDropdown
              options={getDepartmentsForEntity(selectedEntities[0])}
              selectedValues={selectedDepartment ? [selectedDepartment] : []}
              onSelectionChange={handleDepartmentChange}
              placeholder="Select a Department"
              singleSelect={true}
              disabled={disabled}
            />
          </div>
        </div>
      )}


      {/* Entity-Department Matrix for Multi-Entity Mode */}
      {isMultiEntityMode &&
        selectedEntities.length > 0 &&
        uniqueDepartments.length > 0 &&
        hasRequiredMasterData && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Entity-Department Allocation Matrix
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-300 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-r border-gray-300 bg-gray-100 min-w-[120px]">
                      Overall Allocation (%)
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-r border-gray-300">
                      Entity
                    </th>
                    {uniqueDepartments.map((dept) => (
                      <th
                        key={dept.value}
                        className="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-b border-r border-gray-300 min-w-[120px]"
                      >
                        {dept.label}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900 border-b bg-gray-100 border-gray-300">
                      Entity Total (%)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedEntities.map((entityId, entityIndex) => {
                    const entityTotal = getEntityTotal(entityId);
                    const isValidTotal = Math.abs(entityTotal - 100) < 0.01;
                    const currentOverallEntityValue =
                      overallEntityPercentages[entityId] || "";
                    const entityName = entities.find(e => e.entity_id.toString() === entityId)?.entity_name || entityId;


                    return (
                      <tr
                        key={entityId}
                        className={
                          entityIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }
                      >
                        <td className="px-2 py-3 border-r border-gray-300 text-center">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.01"
                            placeholder="0.00"
                            className={`w-full px-2 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                              disabled ? "bg-gray-100 cursor-not-allowed" : ""
                            }`}
                            value={currentOverallEntityValue}
                            onChange={(e) =>
                              handleOverallEntityPercentageChange(
                                entityId,
                                e.target.value
                              )
                            }
                            disabled={disabled}
                            readOnly={readOnly}
                          />
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-300 bg-gray-50">
                          {entityName}
                        </td>
                        {uniqueDepartments.map((dept) => {
                          const hasThisDept = entityHasDepartment(
                            entityId,
                            dept.value
                          );
                          const currentValue =
                            entityDepartmentPercentages[entityId]?.[
                              dept.value
                            ] || "";


                          return (
                            <td
                              key={dept.value}
                              className="px-2 py-3 border-r text-center border-gray-300"
                            >
                              <input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                placeholder={hasThisDept ? "0.00" : "N/A"}
                                disabled={!hasThisDept || disabled}
                                className={`w-full px-2 py-1 border border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                  !hasThisDept || disabled
                                    ? "bg-gray-100 cursor-not-allowed text-gray-400"
                                    : ""
                                }`}
                                value={hasThisDept ? currentValue : ""}
                                onChange={(e) =>
                                  hasThisDept &&
                                  handleEntityDepartmentPercentageChange(
                                    entityId,
                                    dept.value,
                                    e.target.value
                                  )
                                }
                                readOnly={readOnly}
                              />
                            </td>
                          );
                        })}
                        <td className="px-4 py-3 text-center bg-gray-100 border-l">
                          <span
                            className={`text-sm font-semibold ${
                              isValidTotal ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {entityTotal.toFixed(2)}%
                          </span>
                          {!isValidTotal && (
                            <div className="flex items-center justify-center mt-1">
                              <AlertTriangle
                                size={12}
                                className="text-red-500 mr-1"
                              />
                              <span className="text-xs text-red-600">
                                ≠100%
                              </span>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 border-r border-gray-300 bg-gray-100">
                      Overall Grand Total:
                    </td>
                    <td className="px-4 py-3 text-center bg-gray-100 border-l border-r border-gray-300">
                      <span
                        className={`text-sm font-semibold ${
                          overallEntityGrandTotalValid
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {getOverallEntityGrandTotal().toFixed(2)}%
                      </span>
                      {!overallEntityGrandTotalValid && (
                        <div className="flex items-center justify-center mt-1">
                          <AlertTriangle
                            size={12}
                            className="text-red-500 mr-1"
                          />
                          <span className="text-xs text-red-600">≠100%</span>
                        </div>
                      )}
                    </td>
                    {uniqueDepartments.map((dept) => (
                      <td
                        key={`empty-dept-footer-${dept.value}`}
                        className="px-4 py-3 bg-gray-100 border-r border-gray-300"
                      ></td>
                    ))}
                    <td className="px-4 py-3 bg-gray-100"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}


      {/* Section: Lessor Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Lessor Selection
        </h3>
        <div>
          <label
            htmlFor="leaserMaster"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {isLessorSplitMode ? "Select Lessor(s)" : "Select Lessor"}
            <span className="text-red-600">*</span>
          </label>
          <MultiSelectDropdown
            options={lessorOptions}
            selectedValues={selectedLessors}
            onSelectionChange={handleLessorChange}
            placeholder={
              isLessorSplitMode ? "Select Lessor(s)" : "Select a Lessor"
            }
            singleSelect={!isLessorSplitMode}
            disabled={disabled || !hasRequiredMasterData}
          />
        </div>
      </div>


      {/* Lessor Allocation Table for Lessor Split Mode */}
      {isLessorSplitMode && selectedLessors.length > 0 && hasRequiredMasterData && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Lessor Allocation
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                    Lessor
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                    Percentage (%)
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedLessors.map((lessorId) => {
                  const lessor = LessorData.find(
                    (l) => l.lessor_id.toString() === lessorId
                  );
                  return (
                    <tr key={lessorId} className="border-b">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {lessor?.lessor_name || lessorId}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          placeholder="0.00"
                          className={`w-32 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            disabled ? "bg-gray-100 cursor-not-allowed" : ""
                          }`}
                          value={lessorPercentages[lessorId] || ""}
                          onChange={(e) =>
                            handleLessorPercentageChange(
                              lessorId,
                              e.target.value
                            )
                          }
                          disabled={disabled}
                          readOnly={readOnly}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    Total:
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-sm font-semibold ${
                        lessorTotalValid ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {lessorTotal.toFixed(2)}%
                    </span>
                    {!lessorTotalValid && (
                      <div className="flex items-center mt-1">
                        <AlertTriangle
                          size={16}
                          className="text-red-500 mr-1"
                        />
                        <span className="text-xs text-red-600">
                          Must equal 100%
                        </span>
                      </div>
                    )}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}


      {/* Buttons */}
      {!readOnly && (
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
            onClick={onSave}
            disabled={isSaving}
            className={`bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors ${
              isSaving ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={onNext}
            disabled={!canProceed || !hasRequiredMasterData}
            className={`px-4 py-2 rounded-md transition-colors ${
              !canProceed || !hasRequiredMasterData
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-[#008F98] text-white hover:bg-[#007A82] cursor-pointer"
            }`}
          >
            Next
          </button>
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

