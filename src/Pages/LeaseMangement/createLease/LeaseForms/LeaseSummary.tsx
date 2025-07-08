


import React, { useState, useEffect } from "react";
import { LeaseFormData } from "../../../../types";

interface LeaseSummaryProps {
  formData: LeaseFormData;
  onPrevious: () => void;
  onNext: () => void;
  isSaving?: boolean;
  readOnly?: boolean;
  disabled?: boolean;
}


const LeaseSummary: React.FC<LeaseSummaryProps> = ({
  onPrevious,
  onNext,
  readOnly = false,
}) => {
  const [activeTab, setActiveTab] = useState("Cash_Flow");
  const [loading, setLoading] = useState(true);
  const [tabData, setTabData] = useState<Record<string, any>>({});


  const tabs = [
    "Cash_Flow",
    "Liability_Schedule",
    "SD1",
    "SD_AMR1",
    "SD_SUMMARY",
    "Rou_Schedule",
    "LL_Summary",
    "Rou_Summary",
    "Short Term | Low Value",
    "Journal_Entries",
  ];


  // Simulate API calls for each tab
  useEffect(() => {
    const fetchTabData = async (tabName: string) => {
      // Simulate loading delay
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
     
      // Commented API calls - replace with actual APIs when available
      /*
      try {
        const response = await fetch(`/api/v1/lease-summary/${tabName.toLowerCase()}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(`Error fetching ${tabName} data:`, error);
        return { headers: [], rows: [] };
      }
      */
     
      // Sample data for demonstration
      // const sampleData = {
      //   Cash_Flow: {
      //     headers: [
      //       "Lease ID", "Class", "Date", "Period", "Cash flow", "Discount factor", "PV"
      //     ],
      //     rows: [
      //       ["Mumbai", "Building", "2024-04-10", "-", "-", "-", "-"],
      //       ["Mumbai", "Building", "2024-04-10", "1.00", "1,709,190.00", "1.00", "1,709,190.00"],
      //       ["Mumbai", "Building", "2024-05-01", "2.00", "2,441,700.00", "0.99", "2,423,503.53"],
      //       ["Mumbai", "Building", "2024-06-01", "3.00", "2,441,700.00", "0.99", "2,405,442.66"],
      //       ["Mumbai", "Building", "2024-07-01", "4.00", "2,441,700.00", "0.98", "2,387,516.39"],
      //     ]
      //   },
      //   Liability_Schedule: {
      //     headers: [
      //       "LEASE ID", "CLASS", "DATE", "OPENING LIABILITY", "ADDITION", "DELETION", "INTEREST", "REPAYMENT", "CLOSING LIABILITY"
      //     ],
      //     rows: [
      //       ["Mumbai", "Building", "2024-04-10", "419,638,349.53", "419,638,349.53", "-", "-", "-", "-"],
      //       ["Mumbai", "Building", "2024-04-10", "419,638,349.53", "-", "-", "-", "1,709,190.00", "417,929,159.53"],
      //     ]
      //   },
      //   // Add other tabs with similar structure
      // };
   const sampleData = {
      Rou_Summary: {
      headers: [
        "CLASS",
        "LEASE COUNT",
        "FINANCIAL YEAR START",
        "FINANCIAL YEAR END",
        "SD ADDITION",
        "OPENING ROU",
        "ADDITION",
        "DELETION",
        "AMORTIZATION",
        "ACCUMULATED AMORTIZATION",
        "NET ROU",
      ],
      rows: [
        [
          "Building",
          "1",
          "2024-04-10",
          "2025-03-31",
          "4637201.56",
          "-",
          "419,638,349.53",
          "-",
          "14130031.94",
          "14130031.94",
          "410145519.15",
        ],
        [
          "Building",
          "1",
          "2025-04-01",
          "2026-03-31",
          "-",
          "424275551.09",
          "-",
          "-",
          "14130031.94",
          "14130031.94",
          "396002570.21",
        ],
        [
          "Building",
          "1",
          "2026-04-01",
          "2027-03-31",
          "-",
          "424275551.09",
          "-",
          "-",
          "14130031.94",
          "14130031.94",
          "381859621.27",
        ],
        [
          "Building",
          "1",
          "2027-04-01",
          "2028-03-31",
          "-",
          "424275551.09",
          "-",
          "-",
          "14130031.94",
          "14130031.94",
          "367716672.34",
        ],
        [
          "Building",
          "1",
          "2027-04-01",
          "2028-03-31",
          "-",
          "424275551.09",
          "-",
          "-",
          "14130031.94",
          "14130031.94",
          "353573723.4",
        ],
      ],
    },

    SD_SUMMARY: {
      headers: [
        "FINANCIAL YEAR START",
        "FINANCIAL YEAR END",
        "OPENNING_SD",
        "ADDITION",
        "ACCELERATED INTEREST ",
        "INTEREST",
        "REPAYMENT",
        "CLOSING_SD",
      ],
      rows: [
        [
          "2024-04-01",
          "2025-03-31",
          "-",
          "1,814,836.32",
          "-",
          "114,266.52",
          "-",
          "1,929,102.84",
        ],
        [
          "2025-04-01",
          "2026-03-31",
          "-",
          "1,929,102.84",
          "-",
          "143,795.88",
          "-",
          "2,072,898.72",
        ],
        [
          "2026-04-01",
          "2027-03-31",
          "-",
          "2,072,898.72",
          "-",
          "154,514.46",
          "-",
          "2,227,413.18",
        ],
        [
          "2027-04-01",
          "2028-03-31",
          "-",
          "2,227,413.18",
          "-",
          "166,503.42",
          "-",
          "2,393,916.60",
        ],
      ],
    },
    Cash_Flow: {
      headers: [
        "Lease ID",
        "Class",
        "Date",
        "Period",
        "Cash flow",
        "Discount factor",
        "PV",
      ],
      rows: [
        ["Mumbai", "Building", "2024-04-10", "-", "-", "-", "-"],
        [
          "Mumbai",
          "Building",
          "2024-04-10",
          "1.00",
          "1,709,190.00",
          "1.00",
          "1,709,190.00",
        ],
        [
          "Mumbai",
          "Building",
          "2024-05-01",
          "2.00",
          "2,441,700.00",
          "0.99",
          "2,423,503.53",
        ],
        [
          "Mumbai",
          "Building",
          "2024-06-01",
          "3.00",
          "2,441,700.00",
          "0.99",
          "2,405,442.66",
        ],
        [
          "Mumbai",
          "Building",
          "2024-07-01",
          "4.00",
          "2,441,700.00",
          "0.98",
          "2,387,516.39",
        ],
        [
          "Mumbai",
          "Building",
          "2024-08-01",
          "5.00",
          "2,441,700.00",
          "0.97",
          "2,369,723.72",
        ],
        [
          "Mumbai",
          "Building",
          "2024-09-01",
          "6.00",
          "2,441,700.00",
          "0.96",
          "2,352,063.64",
        ],
        [
          "Mumbai",
          "Building",
          "2024-10-01",
          "7.00",
          "2,441,700.00",
          "0.96",
          "2,334,535.17",
        ],
        [
          "Mumbai",
          "Building",
          "2024-11-01",
          "8.00",
          "2,441,700.00",
          "0.95",
          "2,317,137.33",
        ],
      ],
    },
    Liability_Schedule: {
      headers: [
        "LEASE ID",
        "CLASS",
        "DATE",
        "OPENING LIABILITY",
        "ADDITION",
        "DELETION",
        "INTEREST",
        "REPAYMENT",
        "CLOSING LIABILITY",
      ],

      rows: [
        [
          "Mumbai",
          "Building",
          "2024-04-10",
          "419,638,349.53",
          "419,638,349.53",
          "-",
          "-",
          "-",
          "-",
        ],
        [
          "Mumbai",
          "Building",
          "2024-04-10",
          "419,638,349.53",
          "-",
          "-",
          "-",
          " 1,709,190.00 ",
          " 417,929,159.53 ",
        ],
        [
          "Mumbai",
          "Building",
          "2024-04-10",
          "419,638,349.53",
          "-",
          "-",
          "-",
          " 1,709,190.00 ",
          " 417,929,159.53 ",
        ],
        [
          "Mumbai",
          "Building",
          "2024-04-10",
          "419,638,349.53",
          "-",
          "-",
          "-",
          " 1,709,190.00 ",
          " 417,929,159.53 ",
        ],
      ],
    },
    SD1: {
      headers: [
        "LEASE ID",
        "DATE",
        "PERIOD",
        "OPENNING",
        "ADDITION",
        "ACCELERATED INTEREST",
        "INTEREST",
        "REPAYMENT",
        "CLOSING",
        "NO. OF DAYS",
      ],
      rows: [
        [
          "Mumbai",
          "2024-05-25",
          "-",
          "-",
          "604,945.44",
          "_",
          "-",
          "-",
          "-",
          "-",
        ],
        [
          "Mumbai",
          "2024-05-25",
          " 1.00 ",
          " 604,945.44 ",
          "-",
          "-",
          " 715.35 ",
          "-",
          " 605,660.79 ",
          " 6.00 ",
        ],
        [
          "Mumbai",
          "2024-05-25",
          "2.00",
          "605,660.79",
          "-",
          "-",
          "3,589.45",
          "-",
          "609,250.24",
          "30.00",
        ],
        [
          "Mumbai",
          "2024-05-25",
          "2.00",
          "609,250.24",
          "-",
          "-",
          "3,731.45",
          "-",
          "612,981.69",
          "31.00",
        ],
        [
          "Mumbai",
          "2024-09-01",
          "5.00",
          "616,735.99",
          "-",
          "-",
          "3,655.09",
          "-",
          "620,391.07",
          "30.00",
        ],
      ],
    },
    SD_AMR1: {
      headers: [
        "LEASE ID",
        "DATE",
        "OPENNING",
        "ADDITION",
        "DELETION",
        "AMORTIZATION",
        "ACCUMULATED AMORTIZATION",
        "CLOSING",
        "NO. OD DAYS",
        "MONTH",
        "YEAR",
      ],
      rows: [
        [
          "Mumbai",
          "2024-05-25",
          "-",
          "4,637,201.56",
          "-",
          "-",
          "-",
          "-",
          "-",
          "5",
          "2024",
        ],
        [
          "Mumbai",
          "2024-05-25",
          "4,637,201.56",
          "-",
          "-",
          "12,845.43",
          "12,845.43",
          "4,624,356.12",
          "6.00",
          "5",
          "2024",
        ],
        [
          "Mumbai",
          "2024-05-25",
          "4,624,356.12",
          "-",
          "-",
          "12,845.43",
          "25,690.87",
          "4,611,510.69",
          "30.00",
          "6",
          "2024",
        ],
        [
          "Mumbai",
          "2024-05-25",
          "4,611,510.69",
          "-",
          "-",
          "12,845.43",
          "38,536.30",
          "4,598,665.26",
          "31.00",
          "7",
          "2024",
        ],
      ],
    },
    LL_Summary: {
      headers: [
        "CLASS",
        "LEASE COUNT",
        "FINANCIAL YEAR START",
        "FINANCIAL YEAR END",
        "OPENNING_LL",
        "ADDITION",
        "DELETION",
        "INTEREST",
        "REPAYMENT",
        "CLOSING_LL",
      ],
      rows: [
        [
          "Building",
          "1",
          "2024-04-01",
          "2025-03-31",
          "-",
          "419,638,349.53",
          "-",
          "34,811,563.40",
          "28,567,890.00",
          "425,882,022.93",
        ],
        [
          "Building",
          "1",
          "2025-04-01",
          "2026-03-31",
          "425,882,022.93",
          "-",
          "-",
          "38,756,124.49",
          "29,300,400.00",
          "435,337,747.42",
        ],
        [
          "Building",
          "1",
          "2026-04-01",
          "2027-03-31",
          "-",
          "419,638,349.53",
          "-",
          "34,811,563.40",
          "28,567,890.00",
          "425,882,022.93",
        ],
        [
          "Building",
          "1",
          "2027-04-01",
          "2028-03-31",
          "-",
          "419,638,349.53",
          "-",
          "34,811,563.40",
          "28,567,890.00",
          "453,965,666.20",
        ],
      ],
    },
    Rou_Schedule: {
      headers: [
        "DATE",
        "SD ADDITION",
        "OPENNING ROU",
        "ADDITION",
        "DELETION",
        "AMORTIZATION",
        "ACCUMULATED AMORTIZATION",
        "CLOSING ROU",
      ],
      rows: [
        ["2024-04-10", "-", "-", "419,638,349.53", "-", "-", "-", "-"],
        [
          "2024-04-10",
          "-",
          "419,638,349.53",
          "-",
          "-",
          "1,165,662.08",
          "1,165,662.08",
          "418,472,687.44",
        ],
        [
          "2024-05-01",
          "4,637,201.56",
          "423,109,889.00",
          "-",
          "-",
          "1,178,579.08",
          "2,344,241.16",
          "421,931,309.93",
        ],
        [
          "2024-05-01",
          "4,637,201.56",
          "423,109,889.00",
          "-",
          "-",
          "1,178,579.08",
          "2,344,241.16",
          "421,931,309.93",
        ],
        [
          "2024-05-01",
          "4,637,201.56",
          "423,109,889.00",
          "-",
          "-",
          "1,178,579.08",
          "2,344,241.16",
          "421,931,309.93",
        ],
      ],
    },
    "Short Term | Low Value": {
      headers: [
        "FINANCIAL YEAR START",
        "FINANCIAL YEAR END",
        "SHORT TERM",
        "LOW VALUE",
      ],
      rows: [
        ["2024-04-01", "2025-03-31", "-", "23,684,490.00"],
        ["2025-04-01", "2026-03-31", "-", "29,300,400.00"],
        ["2026-04-01", "2027-03-31", "-", "29,300,400.00"],
        ["2027-04-01", "2028-03-31", "-", "32,230,440.00"],
        ["2028-04-01", "2029-03-31", "-", "32,816,448.00"],
      ],
    },
    Journal_Entries: {
      headers: ["DESCRIPTION", "Dr", "Cr", "NET", "NARRATION"],
      rows: [
        [
          "Right of use Assets",
          "-",
          "-",
          "-",
          "Being initial ROU & Lease Liability recorded",
        ],
        [
          "Lease Liability",
          "-",
          "-",
          "-",
          "Being initial ROU & Lease Liability recorded",
        ],
        [
          "Security Deposit",
          "-",
          "-",
          "-",
          "Being initial ROU & Lease Liability recorded",
        ],
        [
          "Prepaid Expenses / P&L Expenses",
          "-",
          "-",
          "-",
          "Being initial ROU & Lease Liability recorded",
        ],
      ],
    },
  };


      setLoading(false);
      return sampleData[tabName as keyof typeof sampleData] || { headers: [], rows: [] };
    };


    fetchTabData(activeTab).then(data => {
      setTabData(prev => ({ ...prev, [activeTab]: data }));
    });
  }, [activeTab]);


  const currentData = tabData[activeTab] || { headers: [], rows: [] };


  const handleNext = () => {
    onNext();
  };


  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-sm mx-auto">
      <div className="mb-3">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Lease Summary</h3>
      </div>
     
      <div className="w-full max-w-full mx-auto bg-white">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="overflow-x-auto">
            <div className="flex min-w-max">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-5 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600 bg-white"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>
        </div>


        {/* Table Content */}
        <div className="overflow-x-auto bg-white">
          <div className="min-w-full">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-gray-600">Loading {activeTab.replace("_", " ")} data...</p>
                </div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                {/* Table Header */}
                <thead className="bg-gray-50">
                  <tr>
                    {currentData.headers?.map((header: string, index: number) => (
                      <th
                        key={index}
                        className="px-2 sm:px-4 py-3 text-left text-xs font-medium text-black-500 uppercase tracking-wider whitespace-nowrap"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>


                {/* Table Body */}
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentData.rows?.length > 0 ? (
                    currentData.rows.map((row: any[], rowIndex: number) => (
                      <tr key={rowIndex} className="hover:bg-gray-50">
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="px-2 sm:px-4 py-3 text-xs sm:text-sm text-gray-900 whitespace-nowrap"
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={currentData.headers?.length || 1} className="px-6 py-12 text-center">
                        <div className="text-gray-500">
                          <p>No data available for {activeTab.replace("_", " ")}</p>
                          <p className="text-sm mt-1">Data will be generated based on lease information</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>


        {/* Mobile-friendly summary for very small screens */}
        <div className="block sm:hidden bg-gray-50 p-4">
          <p className="text-xs text-gray-600">
            Active Tab:{" "}
            <span className="font-medium text-gray-900">
              {activeTab.replace("_", " ")}
            </span>
          </p>
          <p className="text-xs text-gray-600 mt-1">
            Total Records:{" "}
            <span className="font-medium text-gray-900">
              {currentData.rows?.length || 0}
            </span>
          </p>
        </div>
      </div>


      {!readOnly && (
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={onPrevious}
            className="bg-white cursor-pointer text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <button
            type="button"
            className="bg-white cursor-pointer text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="bg-[#008F98] text-white px-4 py-2 rounded-md hover:bg-[#007A82] transition-colors w-full sm:w-auto"
          >
            Next
          </button>
        </div>
      )}


      {/* READ-ONLY MODE NAVIGATION */}
      {readOnly && (
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={onPrevious}
            className="bg-white text-gray-700 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={onNext}
            className="bg-[#008F98] text-white px-4 py-2 rounded-md hover:bg-[#007A82] transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};


export default LeaseSummary;

