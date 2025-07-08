
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import useMaster from "../../../hooks/useMaster";
import { Loader2 } from "lucide-react";
import { ToastContainer } from "react-toastify";

interface Department {
  department_id: string | number; 
  department_name: string;
}
interface FormData {
  entity_name: string;
  functional_currency: string;
  financial_start_date: string;
  ownership_share_percent: string;
  department_ids: number[];
  related_to: string;
  relationship_type: string;
  status: "active";
  organization_id: string ; 
}

const EntityMaster: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartments, setSelectedDepartments] = useState<Department[]>(
    []
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const {
    entities,
    fetchEntityMaster,
    EntitySubmit,
    isSubmitting,
    relationshipTypes,
    department,
  } = useMaster();

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormData>();

  const openModal = () => {
    setIsModalOpen(true);
    reset();
    setSelectedDepartments([]);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
    setSelectedDepartments([]);
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchEntityMaster();
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

 const onSubmit = async (data: FormData) => {
  // Add organization_id if it's missing
  const submitData: FormData = {
    ...data,
    organization_id: data.organization_id || "1", // Provide default value or get from context
    status: data.status || "active" // Add default status if needed
  };
  
  const success = await EntitySubmit(submitData);
  if (success) {
    await fetchEntityMaster();
    setIsModalOpen(false);
  }
};

  // const handleDepartmentSelect = (dept: Department) => {
  //   const isSelected = selectedDepartments.some(
  //     (d) => d.department_id === dept.department_id
  //   );

  //   if (!isSelected) {
  //     const newSelected = [...selectedDepartments, dept];
  //     setSelectedDepartments(newSelected);
  //     setValue(
  //       "department_ids", // Changed from "Department_IDs"
  //       newSelected.map((d) => Number(d.department_id)) // Convert to numbers
  //     );
  //   }
  // };

  // const handleDepartmentRemove = (deptId: string) => {
  //   const newSelected = selectedDepartments.filter(
  //     (d) => d.department_id !== deptId
  //   );
  //   setSelectedDepartments(newSelected);
  //   setValue(
  //     "department_ids", // Changed from "Department_IDs"
  //     newSelected.map((d) => Number(d.department_id)) // Convert to numbers
  //   );
  // };
 const handleDepartmentSelect = (dept: Department) => {
  // Ensure department_id is converted to string for comparison
  const deptId = String(dept.department_id);
  
  const isSelected = selectedDepartments.some(
    (d) => String(d.department_id) === deptId
  );

  if (!isSelected) {
    // Create new department object with string department_id
    const newDept: Department = {
      ...dept,
      department_id: deptId
    };
    
    const newSelected = [...selectedDepartments, newDept];
    setSelectedDepartments(newSelected);
    setValue(
      "department_ids",
      newSelected.map((d) => Number(d.department_id)),
      { shouldValidate: true }
    );
  }
};

 const handleDepartmentRemove = (deptId: string | number) => {
  const deptIdStr = String(deptId);
  const newSelected = selectedDepartments.filter(
    (d) => String(d.department_id) !== deptIdStr
  );
  setSelectedDepartments(newSelected);
  setValue(
    "department_ids",
    newSelected.map((d) => Number(d.department_id)),
    { shouldValidate: true }
  );
};

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Add this useEffect to your component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="bg-gray-50 p-6">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="w-full max-w-md">
            <input
              type="text"
              placeholder="Search entity..."
              className="w-full pl-4 pr-10 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={openModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Entity
            </button>

            <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
              Export Excel
            </button>
          </div>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : (
          /* Table */
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Entity Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Currency
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Financial Start
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Relationship
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      OwnerShipShare
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {entities.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <svg
                            className="w-12 h-12 text-gray-300 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No entities found
                          </h3>
                          <button
                            onClick={openModal}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                          >
                            Create Entity
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    entities.map((entity, index) => (
                      <tr key={entity.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {entity.entity_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {entity.functional_currency}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {entity.financial_start_date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {entity.departments
                            .map((dep) => dep.department_name)
                            .join(" , ")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {entity.relationship_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {entity.ownership_share_percent}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {entity.created_at}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Create New Entity
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column - Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Basic Information
                  </h3>

                  {/* Entity Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Entity Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("entity_name", {
                        required: "Entity name is required",
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter entity name"
                    />
                    {errors.entity_name && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.entity_name.message}
                      </p>
                    )}
                  </div>

                  {/* Functional Currency */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Functional Currency{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      control={control}
                      name="functional_currency"
                      rules={{ required: "Currency is required" }}
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select currency</option>
                          <option value="Indian Rupee (INR)">
                            Indian Rupee (INR)
                          </option>
                          <option value="US Dollar (USD)">
                            US Dollar (USD)
                          </option>
                          <option value="Euro (EUR)">Euro (EUR)</option>
                          <option value="British Pound (GBP)">
                            British Pound (GBP)
                          </option>
                          <option value="Australian Dollar (AUD)">
                            Australian Dollar (AUD)
                          </option>
                          <option value="Singapore Dollar (SGD)">
                            Singapore Dollar (SGD)
                          </option>
                        </select>
                      )}
                    />
                    {errors.functional_currency && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.functional_currency.message}
                      </p>
                    )}
                  </div>

                  {/* Financial Start */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Financial Start Date
                    </label>
                    <input
                      type="date"
                      {...register("financial_start_date")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Department Name - Custom Multi-Select */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department Name(s) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative" ref={dropdownRef}>
                      <div
                        className={`w-full px-3 py-2 border ${
                          errors.department_ids
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-left ${
                          selectedDepartments.length === 0
                            ? "text-gray-400"
                            : "text-gray-900"
                        }`}
                        onClick={toggleDropdown}
                      >
                        {selectedDepartments.length === 0 ? (
                          "Select departments"
                        ) : (
                          <div className="flex flex-wrap gap-1">
                            {selectedDepartments.map((dept) => (
                              <span
                                key={dept.department_id}
                                className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs"
                              >
                                {dept.department_name}
                             <button
  type="button"
  onClick={(e) => {
    e.stopPropagation();
    handleDepartmentRemove(String(dept.department_id));
  }}
  className="ml-1 text-blue-600 hover:text-blue-800"
>
  ×
</button>
                              </span>
                            ))}
                          </div>
                        )}
                        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                          <svg
                            className={`h-5 w-5 text-gray-400 transition-transform ${
                              isDropdownOpen ? "rotate-180" : ""
                            }`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </span>
                      </div>

                      {isDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-300 max-h-60 overflow-auto">
                          {department.length > 0 ? (
                            <ul className="py-1">
                              {department.map((dept) => (
                             <li
  key={dept.department_id}
  className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${
    selectedDepartments.some(
      (d) => String(d.department_id) === String(dept.department_id)
    )
      ? "bg-blue-50 text-blue-800"
      : "text-gray-900"
  }`}
  onClick={(e) => {
    e.stopPropagation();
    handleDepartmentSelect(dept);
  }}
>
  <div className="flex items-center">
    <span className="ml-2 block truncate">
      {dept.department_name}
    </span>
  </div></li>
                              ))}
                            </ul>
                          ) : (
                            <div className="px-3 py-2 text-gray-500">
                              No departments available
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {errors.department_ids && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.department_ids.message}
                      </p>
                    )}
                    {department.length === 0 && (
                      <p className="mt-1 text-sm text-yellow-600">
                        Note: Please create departments in Department Master
                        first.
                      </p>
                    )}
                    <input
                      type="hidden"
                      {...register("department_ids", {
                        required: "At least one department is required",
                      })}
                    />
                  </div>
                </div>

                {/* Right Column - Organizational Details */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Organizational Details
                  </h3>

                  {/* Ownership Share */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ownership Share (%){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      {...register("ownership_share_percent", {
                        required: "Ownership share is required",
                        min: {
                          value: 1,
                          message: "Ownership share must be at least 1%",
                        },
                        max: {
                          value: 100,
                          message: "Ownership share cannot exceed 100%",
                        },
                        validate: (value) =>
                          !isNaN(Number(value)) ||
                          "Please enter a valid number",
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter ownership share (1-100)"
                      min="1"
                      max="100"
                    />
                    {errors.ownership_share_percent && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.ownership_share_percent.message}
                      </p>
                    )}
                  </div>

                  {/* Parent Organization */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Parent Organization
                    </label>
                    <Controller
                      control={control}
                      name="related_to"
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select parent organization</option>
                          {entities.length > 0 ? (
                            entities.map((entity) => (
                              <option
                                key={entity.entity_id}
                                value={entity.entity_name}
                              >
                                {entity.entity_name}
                              </option>
                            ))
                          ) : (
                            <option value="own">Own Organization</option>
                          )}
                        </select>
                      )}
                    />
                  </div>

                  {/* Relationship Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Related Party Relationship
                    </label>
                    <Controller
                      control={control}
                      name="relationship_type"
                      render={({ field }) => (
                        <select
                          {...field}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select relationship type</option>
                          {relationshipTypes.map((type) => (
                            <option key={type.id} value={type.id.toString()}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md font-medium transition-colors flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Entity"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntityMaster;

