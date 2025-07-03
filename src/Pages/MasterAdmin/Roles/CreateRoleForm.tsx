import React, { useState } from "react";
import Button from "../../../component/common/ui/Button";

interface CreateRoleFormProps {
  onSubmit: (roleData: {
    role_name: string;
    description: string;
    status: string;
  }) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
  title?: string;
  submitButtonText?: string;
}

const CreateRoleForm: React.FC<CreateRoleFormProps> = ({
  onSubmit,
  onCancel,
  isLoading,
  // title = "Create Role",
  submitButtonText = "Create Role",
}) => {
  const [formData, setFormData] = useState({
    role_name: "",
    description: "",
    status: "active",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };


  const handleBlur = (e: React.FocusEvent<any>) => {

  const { name, value } = e.target;

  if (name === "role_name" && !value.trim()) {

    setErrors((prev) => ({ ...prev, role_name: "Role name is required" }));

  }

  if (name === "description" && !value.trim()) {

    setErrors((prev) => ({ ...prev, description: "Description is required" }));
  }
};

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.role_name.trim()) {
      newErrors.role_name = "Role name is required";
    } else if (formData.role_name.length < 2) {
      newErrors.role_name = "Role name must be at least 2 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await onSubmit(formData);
      setFormData({
        role_name: "",
        description: "",
        status: "active",
      });
      setErrors({});
      onCancel();
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="role_name"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
          Role Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="role_name"
            name="role_name"
            value={formData.role_name}
            onChange={handleChange}
            required
            onBlur={handleBlur}
            disabled={isLoading}
            className={`w-full px-4 py-3 text-sm border rounded-lg transition-all duration-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
              errors.role_name
                ? "border-red-300 bg-red-50"
                : "border-gray-300 bg-white hover:border-gray-400"
            }`}
            placeholder="Enter role name"
          />
          {errors.role_name && (
            <p className="mt-2 text-xs text-red-600">{errors.role_name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            required
            onChange={handleChange}
              onBlur={handleBlur}
            disabled={isLoading}
            className={`w-full px-4 py-3 text-sm border rounded-lg transition-all duration-200 text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
              errors.description
                ? "border-red-300 bg-red-50"
                : "border-gray-300 bg-white hover:border-gray-400"
            }`}
            placeholder="Enter role description"
          />
          {errors.description && (
            <p className="mt-2 text-xs text-red-600">{errors.description}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 text-sm font-medium"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="success"
            isLoading={isLoading}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 text-sm font-medium"
          >
            {submitButtonText}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateRoleForm;
