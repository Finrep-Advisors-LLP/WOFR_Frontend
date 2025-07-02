export interface Option {
  id: string;
  label: string;
}
export interface Modules {
  id: string;
  name: string;
}

export interface MultiSelectDropdownProps {
  title: string;
  options: Option[];
  selectedOptions: string[];
  onApply: (selected: string[]) => void;
  onReset: () => void;
  className?: string;
   position?: "left" | "right"; // Add position prop
  dropdownWidth?: string;
}

export interface ModuleData {
  id: number;
  name: string;
  description: string;
  actionId: string | null;
  roleId: string | null;
  enabled: boolean;
}

export interface UserData {
    status: "active" | "inactive";
  created_at: string | number | Date;
  user_id: any;
  phone_number: any;
  organization_name: any;
  username: any;
  id: number;
  OrgName: string;
  name: string;
  email: string;
  phone: string;
  roleId: string | null;
  moduleId: string | null;
  created: string;
  enabled: boolean;
  tenant_user_id: string;
  tenant_id: string;
}

// Type definitions for the Lease Management System

export type LeaseStatus =
  | "All Lease"
  | "Draft"
  | "Pending"
  | "Active"
  | "Rejected"
  | "Expired";

export interface Lease {
  id: string;
  leaseNumber: string;
  propertyType: string;
  client: string;
  price: number;
  startDate: string;
  endDate: string;
  status: Omit<LeaseStatus, "All lease">;
}

export interface CashflowItem {
  id: string;
  type: "income" | "expense";
  amount: number;
  date: string;
  description: string;
}

export type FormStep =
  | "basicInfo"
  | "leaseTerms"
  | "financialDetails"
  | "documents"
  | "reviewSubmit";

export interface Duration {
  years: number;
  months: number;
  days: number;
}

export interface Document {
  name: string;
  url?: string;
  size?: number;
}

export interface CashflowEntry {
  id: string;
  leaseId: string;
  date: string;
  amount: string;
}

export interface SecurityDeposit {
  id: string;
  depositNumber: string;
  amount: string;
  rate: string;
  startDate: string;
  endDate: string;
  remark : string;
}

export interface RentRevision {
  id: string;
  revisionDate: string;
  revisedPayment: string;
}

export interface LeaseFormData {
  overallEntityPercentages?: Record<string, number>;
  shortTermValue: string;
  hasLessorAllocation?: boolean;
  // entityDepartmentPercentages: { [s: string]: unknown; } | ArrayLike<unknown>;
  entityDepartmentPercentages?: Record<string, Record<string, number>>;
  lessorPercentages?: Record<string, number>;
 hasMultiEntityAllocation?: boolean;
entityMaster: string | string[];
leaserMaster: string | string[];
 department: string[];
  leaseId: string;
  leaseClass: string;
  isShortTerm: boolean;
  isLowValue: boolean;
  startDate: string;
  endDate: string;
  terminationDate: string;
  duration: Duration;
  hasCashflow: boolean;
  annualPayment: number | string;
  incrementalBorrowingRate: number | string;
  initialDirectCosts: number | string;
  paymentFrequency: string;
  paymentTiming: string;
  paymentDelay: number | string;
  depositNumber: string;
  depositAmount: number | string;
  depositRate: number | string;
  depositStartDate: string;
  depositEndDate: string;
  securityDeposits?: SecurityDeposit[];
  rentRevisions?: RentRevision[];
  cashflowEntries?: CashflowEntry[];
  documents: Document[];
  notes: string;
  clientContact: string;
  clientName: string;
  propertyAddress: string;
  propertyName: string;
  propertyId: string;
  leaseType: string;
  cashflowAmount: string;
  cashflowType: string;
}

export interface Organization {
  tenant_id: string;
  name: string;
  organization_type: string;
  industry_sector: string;
  registration_tax_id: string;
  address: string;
  country: string;
  zip_postal_code: string;
  incorporation_date?: string;
  created_at: string;
}

export interface LeaseInput {
  leaseId: string;
  class: string;
  startDate: string;
  endDate: string;
  annualLeasePayment: number;
  borrowingRate: number;
  initialDirectCosts: number;
  paymentFrequency: string;
  paymentTiming: string;
  sdAddition: number;
  sdRate: number;
  sdStartDate: string;
  sdEndDate: string;
}

export interface ROUEntry {
  leaseId: string;
  class: string;
  date: string;
  sdAddition: number;
  openingROU: number;
  addition: number;
  deletion: number;
  amortization: number;
  accumulatedAmortization: number;
  closingROU: number;
}

