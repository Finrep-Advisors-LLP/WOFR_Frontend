
import React, { useState, useEffect } from "react";
// import { Edit2, Trash2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import useMaster from "../../../hooks/useMaster";
import { Loader2 } from "lucide-react";


interface Asset {
  id: number;
  asset_group_code: string;
  description: string;
  low_value_limit: string;
  asset_group_name: string;
  isEnabled: boolean;
  status: string;
  organization_name: string;
}

const AssetMaster: React.FC = () => {
  const {
    assets,
    fetchAssets,
    createAsset,
    isSubmitting,
    // editAsset,
    // deleteAsset,
    organizationId
  } = useMaster();
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  // const [assetGroups] = useState<string[]>([...defaultAssetGroups]);
  const [showForm, setShowForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    assetGroup: "",
    description: "",
    Asset_Value: "",
    isLowValue: false,
  });
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await  fetchAssets();
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);
  

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    // Code must be exactly 4 alphabets
    const codeRegex = /^[A-Za-z]{4}$/;
    if (!codeRegex.test(formData.code)) {
      toast.error("Code must be exactly 4 alphabetic characters");
      return false;
    }

    // Asset Group is mandatory
    if (!formData.assetGroup.trim()) {
      toast.error("Asset Group is required");
      return false;
    }

    // If Low Value is checked, Asset_Value must be provided and be a valid integer
    if (
      formData.isLowValue &&
      (!formData.Asset_Value.trim() || !/^\d+$/.test(formData.Asset_Value))
    ) {
      toast.error("Low Value must be a valid integer when checked");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const assetData = {
      asset_group_code: formData.code,
      asset_group_name: formData.assetGroup,
      description: formData.description,
      low_value_limit: formData.isLowValue ? formData.Asset_Value : "",
       organization_id: organizationId, 
    };

    const success = await createAsset(assetData);
    if (success) {
      handleCancel();
      fetchAssets();
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAsset(null);
    setFormData({
      code: "",
      assetGroup: "",
      description: "",
      Asset_Value: "",
      isLowValue: false,
    });
  };

  return (
    <div className="bg-gray-50 mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder="Search Asset..."
            className="w-full px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowForm(true)}
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
            Create Asset
          </button>

          <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
            Export Excel
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold mb-4">
                {editingAsset ? "Edit Asset" : "Create New Asset"}
              </h3>
              <button
                onClick={handleCancel}
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

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Asset Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asset Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="code"
                  required
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="Enter 4 alphabet code"
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={4}
                  pattern="[A-Za-z]{4}"
                  title="Must be exactly 4 alphabetic characters"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Standard 4 alphabets
                </p>
              </div>

              {/* Asset Group */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name of Asset Group <span className="text-red-500">*</span>
                </label>
                <select
                  name="assetGroup"
                  value={formData.assetGroup}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select an asset group</option>
                  {assetGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div> */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name of Asset Group <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="assetGroup"
                  value={formData.assetGroup}
                  onChange={handleInputChange}
                  placeholder="Enter asset group name"
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  placeholder="Enter Asset Description (optional)"
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              {/* Low Value */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isLowValue"
                  checked={formData.isLowValue}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Low Value
                </label>
              </div>

              {formData.isLowValue && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Low Value <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="Asset_Value"
                    value={formData.Asset_Value}
                    placeholder="Enter integer value"
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required={formData.isLowValue}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Integer value required when Low Value is checked
                  </p>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Processing..."
                    : editingAsset
                    ? "Update Asset"
                    : "Save Asset"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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


      {/* Assets Table */}
      {isLoading?(
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
      ):(
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Asset Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Organization Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Asset Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Asset Group
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th> */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
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
                        No Asset found
                      </h3>
                      <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Create Asset
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                assets.map((asset) => (
                  <tr
                    key={asset.id}
                    // className={asset.isEnabled ? "" : "opacity-60"}
                  >
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {asset.asset_group_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {asset.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {asset.organization_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {asset.low_value_limit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {asset.asset_group_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {asset.status}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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
  );
};

export default AssetMaster;
