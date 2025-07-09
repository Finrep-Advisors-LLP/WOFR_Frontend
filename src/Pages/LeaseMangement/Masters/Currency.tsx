import React, { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";

interface Currency {
  id: number;
  Currency_code: string;
  Currency_Name: string;
  Currency_Symbol: string;
  isEnabled: boolean;
}

const Currency_symbols = [
  { Currency_Name: "US Dollar", symbol: "$" },
  { Currency_Name: "Euro", symbol: "€" },
  { Currency_Name: "British Pound", symbol: "£" },
  { Currency_Name: "Indian Rupee", symbol: "₹" },
  { Currency_Name: "Australian Dollar", symbol: "$" },
];

const Currency: React.FC = () => {
  const [assets, setAssets] = useState<Currency[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Currency | null>(null);
  const [formData, setFormData] = useState({
    Currency_code: "",
    Currency_Name: "",
    Currency_Symbol: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAsset) {
      setAssets((prev) =>
        prev.map((asset) =>
          asset.id === editingAsset.id
            ? {
                ...asset,
                Currency_code: formData.Currency_code,
                Currency_Name: formData.Currency_Name,
                Currency_Symbol: formData.Currency_Symbol,
              }
            : asset
        )
      );
      setEditingAsset(null);
    } else {
      const newAsset: Currency = {
        id: Date.now(),
        Currency_code: formData.Currency_code,
        Currency_Name: formData.Currency_Name,
        Currency_Symbol: formData.Currency_Symbol,
        isEnabled: true,
      };
      setAssets((prev) => [...prev, newAsset]);
    }

    setFormData({
      Currency_code: "",
      Currency_Name: "",
      Currency_Symbol: "",
    });
    setShowForm(false);
  };

  const handleEdit = (asset: Currency) => {
    setEditingAsset(asset);
    setFormData({
      Currency_code: asset.Currency_code,
      Currency_Name: asset.Currency_Name,
      Currency_Symbol: asset.Currency_Symbol,
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setAssets((prev) => prev.filter((asset) => asset.id !== id));
  };

  const toggleAssetStatus = (id: number) => {
    setAssets((prev) =>
      prev.map((asset) =>
        asset.id === id ? { ...asset, isEnabled: !asset.isEnabled } : asset
      )
    );
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingAsset(null);
    setFormData({
      Currency_code: "",
      Currency_Name: "",
      Currency_Symbol: "",
    });
  };

  return (
    <div className=" bg-gray-50 mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        {/* Left side: Search Bar */}
        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder="Search Currency..."
            className="w-full pl-4 pr-10 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Right side: Buttons */}
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
            Create Currency
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
                {editingAsset ? "Edit Currency" : "Create New Currency"}
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="Currency_code"
                  value={formData.Currency_code}
                  placeholder="Enter Currency Code"
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="Currency_Name"
                  value={formData.Currency_Name}
                  placeholder="Enter Currency Name"
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency Symbol <span className="text-red-500">*</span>
                </label>
                <select
                  name="Currency_Symbol"
                  value={formData.Currency_Symbol}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="" disabled>
                    Select Symbol
                  </option>
                  {Currency_symbols.map((item, index) => (
                    <option key={index} value={item.symbol}>
                      {item.Currency_Name} ({item.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  {editingAsset ? "Update" : "Save"}
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Currency Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Currency Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Currency Symbol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {assets.length === 0 ? (
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
                        No Currency found
                      </h3>
                   
                      <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Create Currency
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                assets.map((asset) => (
                  <tr
                    key={asset.id}
                    className={asset.isEnabled ? "" : "opacity-60"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {asset.Currency_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {asset.Currency_Name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {asset.Currency_Symbol}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleAssetStatus(asset.id)}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            asset.isEnabled ? "bg-green-600" : "bg-gray-200"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              asset.isEnabled
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                        <span className="ml-2 text-sm">
                          {asset.isEnabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(asset)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(asset.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Currency;
