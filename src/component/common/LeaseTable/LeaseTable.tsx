import React from "react";
import { FileText, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Lease } from "../../../types";

interface LeaseTableProps {
  leases: Lease[];
  loading?: boolean;
}

const LeaseTable: React.FC<LeaseTableProps> = ({ leases, loading = false }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4 my-4">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (leases.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 my-4 text-center">
        <FileText size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-medium text-gray-800">No leases found</h3>
        <p className="text-gray-500 mt-2">
          Create a new lease or change your filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden my-4">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ITEM
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                LEASES
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CLIENT / ENTITY
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PRICE
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PERIOD
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                STATUS
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ACTION
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leases.map((lease, index) => (
              <tr key={lease.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-gray-900">
                    {lease.leaseNumber}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {lease.propertyType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {lease.client}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${lease.price.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {lease.startDate} to
                  <br />
                  {lease.endDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    lease.status === 'Active' ? 'bg-green-100 text-green-800' :
                    lease.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    lease.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                    lease.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    lease.status === 'Expired' ? 'bg-orange-100 text-orange-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {lease.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    to={`/dashboard/lease/view/${lease.id}`}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Eye size={16} />
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaseTable;