import React, { useState, useEffect } from "react";
import { Plus, Search, Filter, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

import { Lease, LeaseStatus } from "../../types";
import LeaseTable from "../../component/common/LeaseTable/LeaseTable";
import StatusTabs from "../../component/common/LeaseTable/StatusTabs";

const LeaseManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LeaseStatus>("All Lease");
  const [leases, setLeases] = useState<Lease[]>([]);
  const [filteredLeases, setFilteredLeases] = useState<Lease[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - in real app, this would come from API
  const mockLeases: Lease[] = [
    {
      id: "1",
      leaseNumber: "LEASE-001",
      propertyType: "Office Space",
      client: "ABC Corp",
      price: 25000,
      startDate: "2024-01-01",
      endDate: "2025-01-01",
      status: "Active" as LeaseStatus
    },
    {
      id: "2",
      leaseNumber: "LEASE-002",
      propertyType: "Vehicle",
      client: "XYZ Ltd",
      price: 35000,
      startDate: "2024-02-01",
      endDate: "2025-02-01",
      status: "Pending" as LeaseStatus
    },
    {
      id: "3",
      leaseNumber: "LEASE-003",
      propertyType: "Equipment",
      client: "Tech Solutions",
      price: 15000,
      startDate: "2024-03-01",
      endDate: "2025-03-01",
      status: "Draft" as LeaseStatus
    },
    {
      id: "4",
      leaseNumber: "LEASE-004",
      propertyType: "Warehouse",
      client: "Storage Inc",
      price: 50000,
      startDate: "2024-04-01",
      endDate: "2025-04-01",
      status: "Rejected" as LeaseStatus
    },
    {
      id: "5",
      leaseNumber: "LEASE-005",
      propertyType: "Retail Space",
      client: "Fashion Store",
      price: 30000,
      startDate: "2023-01-01",
      endDate: "2024-01-01",
      status: "Expired" as LeaseStatus
    }
  ];

  useEffect(() => {
    loadLeases();
  }, []);

  useEffect(() => {
    filterLeases();
  }, [activeTab, leases, searchTerm]);

  const loadLeases = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLeases(mockLeases);
    } catch (error) {
      console.error("Failed to load leases:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterLeases = () => {
    let filtered = leases;

    // Filter by status
    if (activeTab !== "All Lease") {
      filtered = filtered.filter(lease => lease.status === activeTab);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(lease =>
        lease.leaseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lease.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lease.propertyType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLeases(filtered);
  };

  const getStatusCounts = (): Record<LeaseStatus, number> => {
    const counts: Record<LeaseStatus, number> = {
      "All Lease": leases.length,
      "Draft": 0,
      "Pending": 0,
      "Active": 0,
      "Rejected": 0,
      "Expired": 0
    };

    leases.forEach(lease => {
      // Type assertion to ensure we're working with actual lease statuses
      const status = lease.status as Exclude<LeaseStatus, "All Lease">;
      if (status in counts) {
        counts[status]++;
      }
    });

    return counts;
  };

  const handleRefresh = () => {
    loadLeases();
  };

  return (
    <div className="container mx-auto px-2 py-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-6">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
            Lease Management
          </h1>
          <p className="text-sm sm:text-base text-gray-500">
            Manage all your lease agreements
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <Link to="/dashboard/bulk-upload"
           className="bg-[#008F98] text-white px-4 py-2 rounded-md hover:bg-[#007a82] transition-colors flex items-center gap-2 justify-center">
   Lease Import
           </Link>
          
          <Link
            to="/dashboard/create-lease"
            className="bg-[#008F98] text-white px-4 py-2 rounded-md hover:bg-[#007a82] transition-colors flex items-center gap-2 justify-center"
          >
            <Plus size={16} />
            Create Lease
          </Link>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search leases..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <StatusTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        counts={getStatusCounts()}
      />

      {/* Lease Table */}
      <LeaseTable leases={filteredLeases} loading={loading} />
    </div>
  );
};

export default LeaseManagement;