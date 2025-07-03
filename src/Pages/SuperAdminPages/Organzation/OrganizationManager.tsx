
import { useState, useEffect } from "react";
import { Organization } from "../../../types";
import { useAuth } from "../../../hooks/useAuth";
import OrganizationForm from "./OrganizationForm";
import { fetchOrganizations } from "../../../hooks/organizationService";

const OrganizationManager = () => {
  const [ ,setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingOrganization, setEditingOrganization] = useState<Organization | null>(null);
  const { authState } = useAuth();
  const [isEditting, setIsEditting] = useState(false);

  const loadOrganizations = async () => {
    if (!authState.token) return;

    setIsLoading(true);
    try {
      const result = await fetchOrganizations(authState.token, 1, 1); // Just get the first organization
      
      if (result.organizations.length > 0) {
        setEditingOrganization(result.organizations[0]);
      } else {
        setEditingOrganization(null); // Ensure null when no organizations exist
      }
      setOrganizations(result.organizations);
    } catch (error) {
      console.error("Failed to load organizations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrganizations();
  }, [authState.token]);

  const handleFormSuccess = () => {
    setIsEditting(false);
    loadOrganizations(); // Refresh the data after successful submission
  };

  const handleCancelForm = () => {
    // If in create mode and canceled, reload to show empty state
    setIsEditting(false);
    if (!editingOrganization) {
      loadOrganizations();
    }
    
  };

  useEffect(() => {
    if(!isEditting){
      loadOrganizations();
    }
  
    
  }, [isEditting])
  

  return (
    <div className="mx-auto  px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {editingOrganization ? "Organization Details" : "Create Organization"}
          </h2>
        </div>
        {!isLoading && (
          <OrganizationForm
            onSuccess={handleFormSuccess}
            initialData={editingOrganization}
            onCancel={handleCancelForm}
            mode={editingOrganization ? "edit" : "create"}
            isEditting={isEditting}
            setIsEditting={setIsEditting}
          />
        )}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default OrganizationManager;