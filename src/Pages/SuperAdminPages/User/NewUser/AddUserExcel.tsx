

import { UserPlus, X, Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { useState, useRef } from "react";
import { useAuth } from "../../../../hooks/useAuth";
import axios from "../../../../helper/axios";

interface UserData {
  name: string;
  email: string;
  row?: number;
  errors?: string[];
}

interface ValidationResult {
  valid: UserData[];
  invalid: UserData[];
}

type CSVUploadModalProps = {
  onClose: () => void;
  onSave?: (users: UserData[]) => void;
  modules?: any[];
};

const AddUserExcel: React.FC<CSVUploadModalProps> = ({ onClose }) => {
  const { authState } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [csvData, setCsvData] = useState<UserData[]>([]);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStep, setUploadStep] = useState<'upload' | 'preview' | 'result'>('upload');
  const [apiError, setApiError] = useState<string>("");

  // Download template for both CSV and Excel
  const downloadTemplate = (format: 'csv' | 'excel') => {
    const data = [
      ['name', 'email'],
      ['John Doe', 'john.doe@company.com'],
      ['Jane Smith', 'jane.smith@company.com']
    ];

    if (format === 'csv') {
      const csvContent = data.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'user_template.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      // For Excel, we'll create a simple CSV that Excel can open
      const csvContent = data.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'user_template.xls';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  };

  // Enhanced CSV parser that handles Excel exports
  const parseCSV = (text: string): UserData[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('File must contain at least a header row and one data row');
    }

    const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''));
    
    const nameIndex = headers.findIndex(h => h.includes('name'));
    const emailIndex = headers.findIndex(h => h.includes('email'));
    
    if (nameIndex === -1 || emailIndex === -1) {
      throw new Error('File must contain "name" and "email" columns');
    }

    return lines.slice(1).map((line, index) => {
      // Handle quoted values and commas within quotes
      const values = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
      const cleanValues = values.map(v => v.trim().replace(/^"|"$/g, ''));
      
      return {
        name: (cleanValues[nameIndex] || '').trim(),
        email: (cleanValues[emailIndex] || '').trim(),
        row: index + 2 
      };
    }).filter(user => user.name || user.email); 
  };

  // Enhanced validation with better error messages
  const validateUsers = (users: UserData[]): ValidationResult => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    const emails = new Set<string>();
    
    const valid: UserData[] = [];
    const invalid: UserData[] = [];

    users.forEach(user => {
      const errors: string[] = [];
      
      // Name validation
      if (!user.name.trim()) {
        errors.push('Name is required');
      } else if (user.name.length < 2) {
        errors.push('Name must be at least 2 characters');
      } else if (user.name.length > 50) {
        errors.push('Name must be less than 50 characters');
      } else if (!nameRegex.test(user.name)) {
        errors.push('Name should contain only letters, spaces, hyphens and apostrophes');
      }
      
      // Email validation
      if (!user.email.trim()) {
        errors.push('Email is required');
      } else if (user.email.length > 100) {
        errors.push('Email must be less than 100 characters');
      } else if (!emailRegex.test(user.email)) {
        errors.push('Invalid email format');
      } else if (emails.has(user.email.toLowerCase())) {
        errors.push('Duplicate email in file');
      } else {
        emails.add(user.email.toLowerCase());
      }
      
      if (errors.length > 0) {
        invalid.push({ ...user, errors });
      } else {
        valid.push(user);
      }
    });

    return { valid, invalid };
  };

  // Enhanced file upload handler
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isValidFile = fileName.endsWith('.csv') || 
                       fileName.endsWith('.xls') || 
                       fileName.endsWith('.xlsx');

    if (!isValidFile) {
      setApiError('Please upload a CSV or Excel file (.csv, .xls, .xlsx)');
      return;
    }

    setApiError("");
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsedData = parseCSV(text);
        
        if (parsedData.length === 0) {
          throw new Error('No valid data found in file');
        }
        
        if (parsedData.length > 100) {
          throw new Error('Maximum 100 users allowed per upload');
        }
        
        const validation = validateUsers(parsedData);
        
        setCsvData(parsedData);
        setValidationResult(validation);
        setUploadStep('preview');
      } catch (error) {
        setApiError(error instanceof Error ? error.message : 'Error parsing file');
      }
    };
    reader.readAsText(file);
  };

  // Enhanced API call with better error handling
  const createUsersFromCSV = async () => {
    if (!validationResult?.valid.length) return;

    setIsLoading(true);
    setApiError("");
    
    try {
      const token = authState.token;
      const userData = validationResult.valid.map(user => ({
        name: user.name.trim(),
        email: user.email.toLowerCase().trim()
      }));

       await axios.post(
        "api/v1/tenant-user",
        userData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      setUploadStep('result');
    } catch (error: any) {
      console.error("Error creating users:", error);
      
      // Enhanced error handling from API response
      let errorMessage = 'Error creating users. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setApiError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-1 sm:p-2">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        
        {/* Compact Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-3 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4 text-white" />
              <div>
                <h2 className="text-sm font-bold text-white">Bulk User Upload</h2>
                <p className="text-green-100 text-xs">Upload CSV/Excel file</p>
              </div>
            </div>
            <button onClick={onClose} disabled={isLoading} className="p-1 hover:bg-white/20 rounded">
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        </div>

        <div className="p-3 max-h-[75vh] overflow-y-auto">
          {/* API Error Display */}
          {apiError && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-700">{apiError}</div>
                <button onClick={() => setApiError("")} className="ml-auto text-red-500">
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}

          {uploadStep === 'upload' && (
            <div className="space-y-3">
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded p-2">
                <h3 className="text-xs font-semibold text-blue-800 mb-1">Requirements</h3>
                <ul className="text-xs text-blue-700 space-y-0.5">
                  <li>• CSV/Excel with "name" and "email" columns</li>
                  <li>• Max 100 users, unique emails, valid format</li>
                </ul>
              </div>

              {/* Template Downloads */}
              <div className="flex gap-2 justify-center">
                <button onClick={() => downloadTemplate('csv')} className="text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded">
                  <FileText className="h-3 w-3 inline mr-1" />CSV Template
                </button>
                <button onClick={() => downloadTemplate('excel')} className="text-xs px-2 py-1 text-green-600 hover:bg-green-50 rounded">
                  <FileText className="h-3 w-3 inline mr-1" />Excel Template
                </button>
              </div>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center hover:border-green-400">
                <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                <h3 className="text-sm font-medium text-gray-700 mb-1">Upload File</h3>
                <p className="text-xs text-gray-500 mb-2">CSV or Excel file</p>
                <input ref={fileInputRef} type="file" accept=".csv,.xls,.xlsx" onChange={handleFileUpload} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="px-3 py-1.5 bg-green-600 text-white rounded text-sm">
                  Choose File
                </button>
              </div>
            </div>
          )}

          {uploadStep === 'preview' && validationResult && (
            <div className="space-y-3">
              {/* Summary */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-blue-50 p-2 rounded text-center">
                  <div className="text-lg font-bold text-blue-600">{csvData.length}</div>
                  <div className="text-xs text-blue-800">Total</div>
                </div>
                <div className="bg-green-50 p-2 rounded text-center">
                  <div className="text-lg font-bold text-green-600">{validationResult.valid.length}</div>
                  <div className="text-xs text-green-800">Valid</div>
                </div>
                <div className="bg-red-50 p-2 rounded text-center">
                  <div className="text-lg font-bold text-red-600">{validationResult.invalid.length}</div>
                  <div className="text-xs text-red-800">Invalid</div>
                </div>
              </div>

              {/* Valid Users */}
              {validationResult.valid.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-green-700 mb-1 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />Valid Users ({validationResult.valid.length})
                  </h3>
                  <div className="bg-green-50 rounded max-h-24 overflow-y-auto">
                    {validationResult.valid.slice(0, 5).map((user, index) => (
                      <div key={index} className="px-2 py-1 border-b border-green-200 last:border-b-0 flex justify-between text-xs">
                        <span className="font-medium truncate">{user.name}</span>
                        <span className="text-gray-600 truncate ml-2">{user.email}</span>
                      </div>
                    ))}
                    {validationResult.valid.length > 5 && (
                      <div className="px-2 py-1 text-xs text-green-600 text-center">
                        +{validationResult.valid.length - 5} more...
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Invalid Users */}
              {validationResult.invalid.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-red-700 mb-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />Invalid Users ({validationResult.invalid.length})
                  </h3>
                  <div className="bg-red-50 rounded max-h-24 overflow-y-auto">
                    {validationResult.invalid.slice(0, 3).map((user, index) => (
                      <div key={index} className="px-2 py-1 border-b border-red-200 last:border-b-0">
                        <div className="flex justify-between items-start text-xs">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{user.name || 'No name'}</div>
                            <div className="text-gray-600 truncate">{user.email || 'No email'}</div>
                          </div>
                          <div className="text-red-600 ml-2">Row {user.row}</div>
                        </div>
                        <div className="text-xs text-red-600 mt-0.5">{user.errors?.join(', ')}</div>
                      </div>
                    ))}
                    {validationResult.invalid.length > 3 && (
                      <div className="px-2 py-1 text-xs text-red-600 text-center">
                        +{validationResult.invalid.length - 3} more errors...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {uploadStep === 'result' && (
            <div className="text-center py-4">
              <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Success!</h3>
              <p className="text-sm text-gray-600 mb-3">{validationResult?.valid.length} users created.</p>
              <button onClick={() => { onClose(); window.location.reload(); }} className="px-4 py-2 bg-green-600 text-white rounded text-sm">
                Continue
              </button>
            </div>
          )}
        </div>

        {/* Action Footer */}
        {uploadStep === 'preview' && (
          <div className="bg-gray-50 px-3 py-2 border-t flex gap-2 justify-between">
            <button onClick={() => setUploadStep('upload')} className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700">
              Back
            </button>
            <div className="flex gap-2">
              <button onClick={onClose} className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700">
                Cancel
              </button>
              <button onClick={createUsersFromCSV} disabled={!validationResult?.valid.length || isLoading} className="px-3 py-1.5 bg-green-600 text-white rounded text-sm disabled:bg-gray-400 flex items-center gap-1">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-3 w-3" />
                    Create {validationResult?.valid.length || 0}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddUserExcel;