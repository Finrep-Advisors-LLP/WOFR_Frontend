import { useForm, Controller } from "react-hook-form";
import Select from "react-select";
import countries from "world-countries";
import { toast } from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { useState, useEffect } from "react";
import { Organization } from "../../types";
import { updateOrganization } from "../../hooks/organizationService";

interface OrganizationFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  initialData: Organization | null;
}

interface FormData {
  name: string;
  organization_type: string;
  industry_sector: { label: string; value: string } | null;
  registration_tax_id: string;
  address: string;
  country: { label: string; value: string } | null;
  zip_postal_code: string;
  incorporation_date?: string;
}

const countryOptions = countries.map((country) => ({
  value: country.cca2,
  label: country.name.common,
}));

// Static industry options for finance website
const industryOptions = [
  {
    label: "Banking and Financial Services",
    value: "banking_financial_services",
  },
  { label: "Investment Management", value: "investment_management" },
  { label: "Insurance", value: "insurance" },
  { label: "Wealth Management", value: "wealth_management" },
  { label: "Fintech and Digital Banking", value: "fintech_digital_banking" },
  { label: "Capital Markets", value: "capital_markets" },
  { label: "Real Estate Finance", value: "real_estate_finance" },
  { label: "Corporate Finance", value: "corporate_finance" },
  { label: "Risk Management", value: "risk_management" },
  { label: "Financial Consulting", value: "financial_consulting" },
  { label: "Other", value: "other" },
];

const OrganizationForm = ({
  onSuccess,
  onCancel,
  initialData,
}: OrganizationFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { authState } = useAuth();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  useEffect(() => {
    if (initialData) {
      // Find country option
      const countryOption = countryOptions.find(
        (option) => option.label === initialData.country
      );

      // Find industry option - check both label and value
      const industryOption = industryOptions.find(
        (option) =>
          option.label === initialData.industry_sector ||
          option.value === initialData.industry_sector ||
          option.label.toLowerCase() ===
            initialData.industry_sector?.toLowerCase()
      );

      // Format date for HTML date input (YYYY-MM-DD)
      let formattedDate = "";
      if (initialData.incorporation_date) {
        const date = new Date(initialData.incorporation_date);
        if (!isNaN(date.getTime())) {
          formattedDate = date.toISOString().split("T")[0];
        }
      }

      reset({
        name: initialData.name || "",
        organization_type: initialData.organization_type || "",
        industry_sector: industryOption || null,
        registration_tax_id: initialData.registration_tax_id || "",
        address: initialData.address || "",
        country: countryOption || null,
        zip_postal_code: initialData.zip_postal_code || "",
        incorporation_date: formattedDate,
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: FormData) => {
    if (!authState.token) {
      toast.error("Authentication required");
      return;
    }

    setIsSubmitting(true);

    const payload = {
      name: data.name,
      organization_type: data.organization_type,
      industry_sector: data.industry_sector?.label || "",
      registration_tax_id: data.registration_tax_id || null,
      address: data.address || null,
      country: data.country?.label || "",
      zip_postal_code: data.zip_postal_code || null,
      incorporation_date: data.incorporation_date || null,
    };


    try {
      await updateOrganization(payload, authState.token);
      toast.success("Organization updated successfully");
      onSuccess();
    } catch (error: any) {
      console.error("API Error:", error);
      toast.error(error?.response?.data?.detail || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Organization Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Organization Name <span className="text-red-500">*</span>
            </label>
            <input
              {...register("name", {
                required: "Organization name is required",
              })}
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              placeholder="Enter your organization name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          {/* Organization Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Organization Type <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name="organization_type"
              rules={{ required: "Organization type is required" }}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                >
                  <option value="">Select organization type</option>
                  <option value="Sole Proprietorship">
                    Sole Proprietorship
                  </option>
                  <option value="Partnership">Partnership</option>
                  <option value="Limited Liability Partnership (LLP)">
                    Limited Liability Partnership (LLP)
                  </option>
                  <option value="Limited Liability Company (LLC)">
                    Limited Liability Company (LLC)
                  </option>
                  <option value="Corporation (C-Corp)">
                    Corporation (C-Corp)
                  </option>
                  <option value="S-Corporation (S-Corp)">
                    S-Corporation (S-Corp)
                  </option>
                  <option value="Nonprofit Organization">
                    Nonprofit Organization
                  </option>
                  <option value="Cooperative">Cooperative</option>
                  <option value="Government Agency">Government Agency</option>
                  <option value="Educational Institution">
                    Educational Institution
                  </option>
                  <option value="Healthcare Provider">
                    Healthcare Provider
                  </option>
                  <option value="Financial Institution">
                    Financial Institution
                  </option>
                  <option value="Retail Business">Retail Business</option>
                  <option value="Manufacturing Company">
                    Manufacturing Company
                  </option>
                  <option value="Technology Company">Technology Company</option>
                  <option value="Professional Services">
                    Professional Services
                  </option>
                  <option value="Freelance/Independent Contractor">
                    Freelance/Independent Contractor
                  </option>
                </select>
              )}
            />
            {errors.organization_type && (
              <p className="text-red-500 text-sm">
                {errors.organization_type.message}
              </p>
            )}
          </div>

          {/* Industry Sector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Industry Sector <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name="industry_sector"
              rules={{ required: "Industry sector is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={industryOptions}
                  placeholder="Select industry sector"
                  isClearable
                  isSearchable
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: "rgba(243, 244, 246, 1)",
                      borderColor: "transparent",
                      boxShadow: state.isFocused
                        ? "0 0 0 2px rgba(59, 130, 246, 0.5)"
                        : "none",
                      minHeight: "2.75rem",
                      borderRadius: "0.5rem",
                      "&:hover": {
                        backgroundColor: "#ffffff",
                      },
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 50,
                      borderRadius: "0.5rem",
                    }),
                  }}
                />
              )}
            />
            {errors.industry_sector && (
              <p className="text-red-500 text-sm">
                {errors.industry_sector.message}
              </p>
            )}
          </div>

          {/* Date of Incorporation */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Date of Incorporation <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register("incorporation_date", {
                required: "Date of incorporation is required",
              })}
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
            />
            {errors.incorporation_date && (
              <p className="text-red-500 text-sm">
                {errors.incorporation_date.message}
              </p>
            )}
          </div>

          {/* Tax ID */}
          {/* <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Registration / Tax ID
            </label>
            <input
              {...register("registration_tax_id")}
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              placeholder="Enter your tax ID (optional)"
            />
          </div> */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Registration / Tax ID
            </label>
            <input
              {...register("registration_tax_id", {
                required: "Registration / Tax ID is required",
                validate: (value) => {
                  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
                  const gstinRegex =
                    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
                  const cinRegex =
                    /^[UL][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;

                  if (
                    panRegex.test(value) ||
                    gstinRegex.test(value) ||
                    cinRegex.test(value)
                  ) {
                    return true;
                  }
                  return "Enter a valid PAN, GSTIN, or CIN";
                },
              })}
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              placeholder="Enter PAN, GSTIN, or CIN"
            />
            {errors.registration_tax_id && (
              <p className="text-red-500 text-sm">
                {errors.registration_tax_id.message}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Address</label>
            <input
              {...register("address")}
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              placeholder="Enter your complete address (optional)"
            />
          </div>

          {/* Country */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Country <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name="country"
              rules={{ required: "Country is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={countryOptions}
                  placeholder="Select your country"
                  isClearable
                  isSearchable
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: "rgba(243, 244, 246, 1)",
                      borderColor: "transparent",
                      boxShadow: state.isFocused
                        ? "0 0 0 2px rgba(59, 130, 246, 0.5)"
                        : "none",
                      minHeight: "2.75rem",
                      borderRadius: "0.5rem",
                      "&:hover": {
                        backgroundColor: "#ffffff",
                      },
                    }),
                    menu: (base) => ({
                      ...base,
                      zIndex: 50,
                      borderRadius: "0.5rem",
                    }),
                  }}
                />
              )}
            />
            {errors.country && (
              <p className="text-red-500 text-sm">{errors.country.message}</p>
            )}
          </div>

          {/* Postal Code */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Pincode <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("zip_postal_code", {
                required: "Pincode is required",
                pattern: {
                  value: /^\d{6}$/,
                  message: "Invalid pincode format (6 digits required)",
                },
              })}
              className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
              placeholder="Enter 6-digit pincode"
            />
            {errors.zip_postal_code && (
              <p className="text-red-500 text-sm">
                {errors.zip_postal_code.message}
              </p>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                <span>Processing...</span>
              </>
            ) : (
              <span>Update Organization</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrganizationForm;
