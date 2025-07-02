
import { Edit } from "lucide-react";
import { Organization } from "../../types";
import Pagination from "../common/ui/Table/Pagination";

interface OrganizationTableProps {
  organizations: Organization[];
  isLoading: boolean;
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onEdit: (organization: Organization) => void;
}

const OrganizationTable = ({
  organizations,
  isLoading,
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  onEdit
}: OrganizationTableProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (organizations.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No organization data found</p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th> */}
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organization</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax ID</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {organizations.map((org, index) => (
              <tr key={`${org.tenant_id}-${index}`} className="hover:bg-gray-50 transition-colors">
                {/* <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{org.tenant_id.slice(0, 8)}...</td> */}
                {/* <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{org.tenant_id}</td> */}
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{org.name}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{org.organization_type}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{org.industry_sector}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{org.registration_tax_id}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {org.country}, {org.zip_postal_code}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(org.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button 
                    onClick={() => onEdit(org)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                    title="Edit organization"
                  >
                    <Edit size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 ">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalItems / itemsPerPage)}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default OrganizationTable;