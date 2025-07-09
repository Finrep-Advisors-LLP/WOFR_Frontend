

import React, { useState,useEffect } from "react";
// import { Edit2, Trash2 } from "lucide-react";
// import { useRoleManagement } from "../../../hooks/useRoleManagement";
import useMaster from "../../../hooks/useMaster";
import { Loader2 } from "lucide-react";
import { ToastContainer } from "react-toastify";

interface Department {
  id: number;
  department_code: string;
  department_name: string;
  isEnabled: boolean;
  status: string;
}

const DepartmentMaster: React.FC = () => {
  // const [department, setDepartment] = useState<Department[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Department | null>(null);
  const [formData, setFormData] = useState({
    department_code: "",
    department_name: "",
  });
    const [isLoading, setIsLoading] = useState(true); // Add loading state

  
  const { department,createDepartment,fetchDepartment}=useMaster();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  
  //    try{
  //    setFormData({
  //     department_code: "",
  //     department_name: "",
  //   });
  //    }
  //    catch(e:any){
  // console.log(e)
  //    }
  //    finally{
  //   setShowForm(false);

  //    }
    
  // };

  // const handleEdit = (asset: Department) => {
  //   setEditingAsset(asset);
  //   setFormData({
  //     department_code: asset.department_code,
  //     department_name: asset.Department_Name,
  //   });
  //   setShowForm(true);
  // };

  // const handleDelete = (id: number) => {
  //   setDepartment((prev) => prev.filter((asset) => asset.id !== id));
  // };

  // const toggleAssetStatus = (id: number) => {
  //   setDepartment((prev) =>
  //     prev.map((asset) =>
  //       asset.id === id ? { ...asset, isEnabled: !asset.isEnabled } : asset
  //     )
  //   );
  // };
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      const success = await createDepartment(formData.department_name);
    // const success = await createDepartment(departmentName);
    if (success) {
      fetchDepartment();
      handleCancel();
      // setDepartmentName(''); // Reset form on success
    }
  };

   useEffect(() => {
      const loadData = async () => {
        setIsLoading(true);
        try {
          await fetchDepartment();

        } finally {
          setIsLoading(false);
        }
      };
      loadData();
    }, []);

  const handleCancel = () => {
    setShowForm(false);
    setEditingAsset(null);
    setFormData({
      department_code: "",
      department_name: "",
    });
  };

  // const fetchDepartment = async () => {
  //   try {
  //     const response = await axios.get(`/api/v1/departments`);
  //     setDepartment(response?.data?.data?.departments || []);
  //     console.log("Department data fetched:", response?.data?.data?.departments);
  //   } catch (error) {
  //     console.error("Error fetching department data:", error);
  //     toast.error("Failed to fetch department data");
  //   }
  // };

  // useEffect(() => {
  //   fetchDepartment();
  // }, []);

  return (
    <div className="bg-gray-50 mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder="Search Department..."
            className="w-full pl-4 pr-10 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Department
          </button>

          <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
            Export Excel
          </button>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold mb-4">
                {editingAsset ? "Edit Department" : "Create New Department"}
              </h3>
              <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
             {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="department_code"
                  value={formData.department_code}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div> */}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="department_name"
                  value={formData.department_name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex gap-2 pt-4">
               
                <button type="button" onClick={handleCancel} className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600">
                  Cancel
                </button>
                 <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                  {editingAsset ? "Update" : "Save"}
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

      {/* Table */}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Department Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Department Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Actions</th> */}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {department.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">No Department found</td>
                </tr>
              ) : (
                department.map((asset) => (
                  <tr key={asset.id} 
                  // className={asset.isEnabled ? "" : "opacity-60"}
                  >
                    <td className="px-6 py-4 text-gray-900">{asset.department_code}</td>
                    <td className="px-6 py-4 text-gray-600 ">{asset.department_name}</td>
                    <td className="px-6 py-4 text-gray-600 ">
                      {/* <button
                        onClick={() => toggleAssetStatus(asset.id)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${asset.isEnabled ? "bg-green-600" : "bg-gray-200"}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${asset.isEnabled ? "translate-x-6" : "translate-x-1"}`}
                        />
                      </button> */}
                      {asset.status}
                      {/* <span className="ml-2">{asset.isEnabled ? "Enabled" : "Disabled"}</span> */}
                    </td>
                    {/* <td className="px-6 py-4 flex gap-2">
                      <button 
                      // onClick={() => handleEdit(asset)} 
                      className="text-blue-600 hover:text-blue-800">
                        <Edit2 size={16} />
                      </button>
                      <button 
                      // onClick={() => handleDelete(asset.id)} 
                      className="text-red-600 hover:text-red-800">
                        <Trash2 size={16} />
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
  );
};

export default DepartmentMaster;
