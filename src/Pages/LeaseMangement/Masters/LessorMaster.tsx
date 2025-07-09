
import { useForm, Controller } from "react-hook-form";
import { useState, useEffect } from "react";
// import axios from "../../../helper/axios";
import useMaster from "../../../hooks/useMaster";
import { Loader2 } from "lucide-react";
import { ToastContainer } from "react-toastify";

interface FormData {
  Lessor_Name: string;
  Vendor_Code: string;
  VAT_application: string;
  Email: string;
  Tax_deduction_Application: string;
  Vendor_bank_name: string;
  relatedPartyRelationship: string;
  Vendor_registration_number: string;
  Tax_Identification_number: string;
  Vendor_Bank_Account_Number: string;
}


const LessorMaster: React.FC = () => {
  // const [entities, setEntities] = useState<LessorData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isSubmitting, setIsSubmitting] = useState(false);
  // const [isLoadingModules, setIsLoadingModules] = useState(true);
  const {
    LessorData,
    fetchLessors,
    createLessor,
    isSubmitting,
    relationshipTypes,
    vatOptions,
    taxDeductionOptions,
    // emailPattern,
  } = useMaster();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onChange",
  });

  //  const onSubmit = async (data: FormData) => {
  //   setIsSubmitting(true);

  //   await new Promise((resolve) => setTimeout(resolve, 800));

  //   const newEntity: LessorData = {
  //     id: entities.length + 1,
  //     Lessor_Name: data.Lessor_Name,
  //     Vendor_Code: data.Vendor_Code,
  //     VAT_application: data.VAT_application,
  //     Email: data.Email,
  //     Tax_deduction_Application: data.Tax_deduction_Application,
  //     Vendor_bank_name: data.Vendor_bank_name,
  //     Vendor_registration_number: data.Vendor_registration_number,
  //     Tax_Identification_number: data.Tax_Identification_number,
  //     Vendor_Bank_Account_Number: data.Vendor_Bank_Account_Number,
  //     relatedPartyRelationship:
  //       relationshipTypes.find(
  //         (type) => type.id.toString() === data.relatedPartyRelationship
  //       )?.name || "Not specified",
  //     createdAt: new Date().toLocaleDateString(),
  //   };

  //   setEntities((prev) => [...prev, newEntity]);
  //   reset();
  //   setIsSubmitting(false);
  //   setIsModalOpen(false);
  // };
  // const handleDelete = (id: number) => {
  //   setEntities((prev) => prev.filter((entity) => entity.id !== id));
  // };
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await fetchLessors();
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
    reset();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    reset();
  };

  // const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // const fetchLessors = async () => {
  //   try {
  //     const response = await axios.get(`api/v1/lease-lessors`, {
  //     });
  //     setEntities(response?.data?.data?.lease_lessors);
  //     console.log(
  //       "Lessor data fetched successfully:",
  //       response.data.data?.lease_lessors
  //     );
  //   } catch (error: any) {
  //     console.error("Failed to fetch lessors:", error);
  //     toast.error("Failed to load lessors");
  //   }
  // };

  // useEffect(() => {
  //   fetchLessors();
  // }, []);

  // const token = localStorage.getItem("token");

  // const [organizationId, setOrganizationId] = useState("");
  // const getId = async () => {
  //   try {
  //     const response = await axios.get(
  //       "/api/v1/tenant?page=1&limit=10&sort_by=created_at&sort_order=asc",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     console.log(response.data.data);

  //     console.log(response.data.data.tenants[0].tenant_id);
  //     setOrganizationId(response.data.data.tenants[0].tenant_id);
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  // useEffect(() => {
  //   getId();
  // }, []);

  // const onSubmit = async (data: FormData) => {
  //   setIsSubmitting(true);
  //   console.log(data);
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       throw new Error("No authentication token found");
  //     }

  //     const requestData = {
  //       organization_id: organizationId,
  //       vendor_code: data.Vendor_Code,
  //       lessor_name: data.Lessor_Name,
  //       vat_applicable: data.VAT_application,
  //       tax_deduction_applicable: data.Tax_deduction_Application,
  //       email: data.Email,
  //       related_party_relationship:
  //         relationshipTypes.find(
  //           (type) => type.id.toString() === data.relatedPartyRelationship
  //         )?.name || "Not specified",
  //       vendor_bank_name: data.Vendor_bank_name,
  //       vat_registration_number: data.Vendor_registration_number,
  //       tax_identification_number: data.Tax_Identification_number,
  //       vendor_bank_account_number: data.Vendor_Bank_Account_Number,
  //       status: "active",
  //     };

  //     const response = await axios.post("/api/v1/lease-lessor", requestData, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     fetchLessors();
  //     if (response.status >= 200 && response.status < 300) {
  //       const responseData = response.data;
  //       reset();
  //       setIsModalOpen(false);
  //       console.log("Lessor created successfully:", responseData);
  //     } else {
  //       // Handle non-2xx responses
  //       throw new Error(response.data?.message || "Failed to create lessor");
  //     }
  //   } catch (error: any) {
  //     console.log(error);
  //     console.error("Error creating lessor:", {
  //       message: error.message,
  //       response: error.response?.data,
  //       stack: error.stack,
  //     });

  //     // Show user-friendly error message
  //     // You could use a toast notification here
  //     alert(
  //       error.response?.data?.detail ||
  //       error.message ||
  //       "Failed to create lessor"
  //     );
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const onSubmit = async (data: FormData) => {
    const success = await createLessor(data);
    if (success) {
      fetchLessors(); // Refresh the list
      // closeModal(); // Close the modal on success
      setIsModalOpen(false);
    }
    // Error handling is already done in the hook
  };
  return (
    <div className=" bg-gray-50 p-4 sm:p-6">
      <div className="mx-auto ">
        <div className="flex justify-between items-center mb-8">
          {/* Left side: Search Bar */}
          <div className="w-full max-w-md">
            <input
              type="text"
              placeholder="Search Lessor Master..."
              className="w-full pl-4 pr-10 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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

          {/* Right side: Buttons */}
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
              Create Lessor
            </button>

            <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
              Export Excel
            </button>
          </div>
        </div>
        {/* Table */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-max">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Lessor Name
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Vendor Code
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      VAT Application
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Organization Name
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Tax Deduction
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Bank Name
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      VAT Reg. Number
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Tax ID Number
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Account Number
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Relationship
                    </th>
                    <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Created
                    </th>
                    {/* <th className="px-4 sm:px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th> */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {LessorData.length === 0 ? (
                    <tr>
                      <td colSpan={13} className="px-6 py-12 text-center">
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
                            No Lessor found
                          </h3>

                          <button
                            onClick={openModal}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                          >
                            Create Lessor
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    LessorData.map((entity, index) => (
                      <tr key={entity.id} className="hover:bg-gray-50">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {entity.lessor_name}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {entity.vendor_code}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {entity.vat_applicable}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {entity.email}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {entity.organization_name}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {entity.tax_deduction_applicable}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {entity.vendor_bank_name}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {entity.vat_registration_number}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {entity.tax_identification_number}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {entity.vendor_bank_account_number}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {entity.related_party_relationship}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(entity?.created_at).toLocaleDateString("en-GB")}
                        </td>
                        {/* <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleDelete(entity.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                          title="Delete entity"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </td> */}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Modal with Two-Column Form */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-900">
                Create New Lessor
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
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

            <form onSubmit={handleSubmit(onSubmit)} className="p-6">
              {/* Two Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Lessor Name - MANDATORY */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lessor Name
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("Lessor_Name", {
                        required: "Lessor name is required",
                        minLength: {
                          value: 2,
                          message: "Lessor name must be at least 2 characters",
                        },
                        maxLength: {
                          value: 100,
                          message: "Lessor name cannot exceed 100 characters",
                        },
                        pattern: {
                          value: /^[A-Za-z\u00C0-\u017F\s\-'.]+$/,
                          message:
                            "Name can only contain letters, spaces, and basic punctuation",
                        },
                        validate: (value) => {
                          const trimmedValue = value.trim();
                          if (trimmedValue.length < 2) {
                            return "Lessor name must be at least 2 non-whitespace characters";
                          }
                          return true;
                        },
                      })}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.Lessor_Name
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter Lessor name"
                    />
                    {errors.Lessor_Name && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.Lessor_Name.message}
                      </p>
                    )}
                  </div>

                  {/* Vendor Code - MANDATORY */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vendor Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("Vendor_Code", {
                        required: "Vendor code is required",
                        pattern: {
                          value: /^[A-Za-z0-9\-_]+$/,
                          message:
                            "Only alphanumeric characters, hyphens, and underscores allowed",
                        },
                        minLength: {
                          value: 3,
                          message: "Vendor code must be at least 3 characters",
                        },
                        maxLength: {
                          value: 20,
                          message: "Vendor code cannot exceed 20 characters",
                        },
                        validate: {
                          noConsecutiveSpecialChars: (value) =>
                            !/([-_]{2,})/.test(value) ||
                            "No consecutive special characters allowed",
                          startsWithLetter: (value) =>
                            /^[A-Za-z]/.test(value) ||
                            "Must start with a letter",
                        },
                      })}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.Vendor_Code
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter Vendor Code (e.g., VEN001)"
                    />
                    {errors.Vendor_Code && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.Vendor_Code.message}
                      </p>
                    )}
                  </div>

                  {/* VAT Application - MANDATORY */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      VAT Application <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      control={control}
                      name="VAT_application"
                      rules={{
                        required: "VAT application is required",
                        validate: (value) =>
                          vatOptions.some((option) => option.value === value) ||
                          "Invalid VAT option selected",
                      }}
                      render={({ field }) => (
                        <select
                          {...field}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            errors.VAT_application
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Select VAT Application</option>
                          {vatOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    {errors.VAT_application && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.VAT_application.message}
                      </p>
                    )}
                  </div>

                  {/* Email - NOT MANDATORY */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                                            <span className="text-red-500">*</span>

                    </label>
                    <input
                      type="email"
                      {...register("Email", {
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Please enter a valid email address",
                        },
                        maxLength: {
                          value: 254,
                          message: "Email cannot exceed 254 characters",
                        },
                      })}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.Email
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter Email (e.g., lessor@example.com)"
                    />
                    {errors.Email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.Email.message}
                      </p>
                    )}
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      {...register("Email")} // Removed all validation rules
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.Email
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter Email (e.g., lessor@example.com)"
                    />
                    {errors.Email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.Email.message}
                      </p>
                    )}
                  </div> */}

                  {/* Tax Deduction Application - MANDATORY */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax Deduction Application{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      control={control}
                      name="Tax_deduction_Application"
                      rules={{
                        required: "Tax deduction application is required",
                        validate: (value) =>
                          taxDeductionOptions.some(
                            (option) => option.value === value
                          ) || "Invalid tax deduction option",
                      }}
                      render={({ field }) => (
                        <select
                          {...field}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            errors.Tax_deduction_Application
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Select Tax Deduction</option>
                          {taxDeductionOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    {errors.Tax_deduction_Application && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.Tax_deduction_Application.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Column - ALL FIELDS HERE ARE OPTIONAL */}
                <div className="space-y-4">
                  {/* Vendor Bank Name - OPTIONAL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vendor Bank Name
                    </label>
                    <input
                      {...register("Vendor_bank_name", {
                        minLength: {
                          value: 2,
                          message: "Bank name must be at least 2 characters",
                        },
                        maxLength: {
                          value: 100,
                          message: "Bank name cannot exceed 100 characters",
                        },
                        pattern: {
                          value: /^[A-Za-z\u00C0-\u017F\s\-,.&]+$/,
                          message:
                            "Bank name can only contain letters, spaces, and basic punctuation",
                        },
                      })}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.Vendor_bank_name
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter Vendor bank name"
                    />
                    {errors.Vendor_bank_name && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.Vendor_bank_name.message}
                      </p>
                    )}
                  </div>

                  {/* Vendor Registration Number - OPTIONAL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vendor Registration Number
                    </label>
                    <input
                      {...register("Vendor_registration_number", {
                        pattern: {
                          value: /^[A-Za-z0-9\-_]+$/,
                          message:
                            "Only alphanumeric characters, hyphens, and underscores allowed",
                        },
                        maxLength: {
                          value: 30,
                          message:
                            "Registration number cannot exceed 30 characters",
                        },
                      })}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.Vendor_registration_number
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter Vendor registration number"
                    />
                    {errors.Vendor_registration_number && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.Vendor_registration_number.message}
                      </p>
                    )}
                  </div>

                  {/* Tax Identification Number - OPTIONAL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tax Identification Number
                    </label>
                    <input
                      {...register("Tax_Identification_number", {
                        pattern: {
                          value: /^[A-Za-z0-9\-_]+$/,
                          message:
                            "Only alphanumeric characters, hyphens, and underscores allowed",
                        },
                        maxLength: {
                          value: 20,
                          message: "Tax ID cannot exceed 20 characters",
                        },
                      })}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.Tax_Identification_number
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter Tax Identification number"
                    />
                    {errors.Tax_Identification_number && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.Tax_Identification_number.message}
                      </p>
                    )}
                  </div>

                  {/* Vendor Bank Account Number - OPTIONAL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vendor Bank Account Number
                    </label>
                    <input
                      {...register("Vendor_Bank_Account_Number", {
                        pattern: {
                          value: /^[0-9-]+$/,
                          message: "Only numbers and hyphens allowed",
                        },
                        maxLength: {
                          value: 24,
                          message: "Account number cannot exceed 24 characters",
                        },
                      })}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.Vendor_Bank_Account_Number
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter Bank Account Number"
                    />
                    {errors.Vendor_Bank_Account_Number && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.Vendor_Bank_Account_Number.message}
                      </p>
                    )}
                  </div>

                  {/* Related Party Relationship - OPTIONAL */}
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Related Party Relationship
                      <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      control={control}
                      name="relatedPartyRelationship"
                      render={({ field }) => (
                        <select
                          {...field}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            errors.relatedPartyRelationship
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          }`}
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
                    {errors.relatedPartyRelationship && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.relatedPartyRelationship.message}
                      </p>
                    )}
                  </div> */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Related Party Relationship
                      <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      control={control}
                      name="relatedPartyRelationship"
                      rules={{
                        required: "Related party relationship is required", // Added required validation
                      }}
                      render={({ field }) => (
                        <select
                          {...field}
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            errors.relatedPartyRelationship
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          }`}
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
                    {errors.relatedPartyRelationship && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.relatedPartyRelationship.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors order-2 sm:order-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-md font-medium transition-colors flex items-center justify-center gap-2 order-1 sm:order-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
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
                      Create Lessor
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessorMaster;
