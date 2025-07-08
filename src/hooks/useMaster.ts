

import { useState, useEffect } from "react";
import axios from "../helper/axios";

import { useAuth } from "./useAuth";

import { toast } from "react-toastify";

interface GlMasterData {
  id: number;
  entity_id: number;
  entry_name: string;
  event_phase: string;
  entity_name: string;
  description_narration: string;
  gl_code: string;
  gl_description: string;
  department_id: number;
  department_name: string;
  created_at: string;
  status: string;
}
interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}
interface GlMasterFormData {
  Entry_Name: string;
  Event: string;
  Entity_ID: number;
  Description?: string;
  GL_Code?: string;
  GL_Description: string;
  Dept_ID?: string;
  status: string;
  // ENTITY_ID: number;
  // DEPARTMENT_ID: number;
  // EVENT_PHASE: string;
  // ENTRY_NAME: string;
  // DESCRIPTION_NARRATION: string;
  // GL_CODE: string;
  // GL_DESCRIPTION: string;
  // STATUS: string;
}
interface LessorData {
  id: number;
  lessor_id: number;
  lessor_name: string;
  vendor_code: string;
  vat_applicable: string;
  email: string;
  tax_deduction_applicable: string;
  vendor_bank_name: string;
  related_party_relationship: string;
  vat_registration_number: string;
  tax_identification_number: string;
  vendor_bank_account_number: string;
  created_at: string;
  organization_name: string;
}

interface FormDataLessor {
  Lessor_Name: string;
  Vendor_Code: string;
  VAT_application: string;
  Email: string;
  Tax_deduction_Application: string;
  Vendor_bank_name: string;
  relatedPartyRelationship: string;
  Vendor_registration_number: string;
  Tax_Identification_number: string;
  Vendor_Bank_Account_Number: string;
}
interface Asset {
  asset_id: number;
  id: number;
  asset_group_code: string;
  description: string;
  low_value_limit: string;
  asset_group_name: string;
  isEnabled: boolean;
  status: string;
  organization_name: string;
}


interface EntityFormData {
  organization_id: string;
  entity_name: string;
  functional_currency: string;
  financial_start_date: string;
  ownership_share_percent: string;
  relationship_type: string;
  related_to: string;
  department_ids: number[];
  status: "active";

}

interface Department {
  department_id: string | number;
  // department_id: number;
  id: number;
  department_code: string;
  department_name: string;
  isEnabled: boolean;
  status: string;
}

interface EntityData {
  // functional_currency: ReactNode;
  // financial_start_date: ReactNode;
  // parentOrganization: ReactNode;
  // relationship_type: ReactNode;
  // ownership_share_percent: ReactNode;
  id: number;
  functional_currency: string;
  financial_start_date: string;
  ownership_share_percent: string;
  relationship_type: string;

  entity_id: number;
  entry_name: string;
  event_phase: string;
  entity_name: string;
  Event: string;
  description_narration: string;
  gl_code: string;
  gl_description: string;
  department_id: string;
  departments: {
     department_id: number;
    department_name: string;
  }[];
  // department_name: string;
  created_at: string;
}

const useMaster = () => {
  //*********** Lessor Master *****************
  const [LessorData, setLessorData] = useState<LessorData[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState("");
  const { authState } = useAuth();
  const relationshipTypes = [
    { id: 1, name: "Subsidiary" },
    { id: 2, name: "Branch" },
    { id: 3, name: "Division" },
    { id: 4, name: "Joint Venture" },
    { id: 5, name: "Associate" },
  ];

  const vatOptions = [
    { value: "applicable", label: "Applicable" },
    { value: "not_applicable", label: "Not Applicable" },
    { value: "exempt", label: "Exempt" },
  ];

  const taxDeductionOptions = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ];

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const fetchOrganizationId = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get(
        "/api/v1/tenant?page=1&limit=10&sort_by=created_at&sort_order=asc",
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setOrganizationId(response.data.data.tenants[0].tenant_id);
    } catch (error) {
      console.error("Failed to fetch organization ID:", error);
      toast.error("Failed to load organization information");
    }
  };

  const fetchLessors = async () => {
    setIsLoading(true);
    try {
      // const response = await axios.get(`api/v1/lease-lessors`);
      // const response = await axios.get(`api/v1/lease-lessors`);
      const response = await axios.get(`api/v1/lease-lessors`, {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`, // Include the auth token
        },
      });
      setLessorData(response?.data?.data?.lease_lessors);
    } catch (error: any) {
      console.error("Failed to fetch lessors:", error);
      toast.error("Failed to load lessors");
    } finally {
      setIsLoading(false);
    }
  };

  //***********  Asset  *******************
  const createLessor = async (data: FormDataLessor) => {
    setIsSubmitting(true);
    try {
      const requestData = {
        organization_id: organizationId,
        vendor_code: data.Vendor_Code,
        lessor_name: data.Lessor_Name,
        vat_applicable: data.VAT_application,
        tax_deduction_applicable: data.Tax_deduction_Application,
        email: data.Email,
        related_party_relationship:
          relationshipTypes.find(
            (type) => type.id.toString() === data.relatedPartyRelationship
          )?.name || "Not specified",
        vendor_bank_name: data.Vendor_bank_name,
        vat_registration_number: data.Vendor_registration_number,
        tax_identification_number: data.Tax_Identification_number,
        vendor_bank_account_number: data.Vendor_Bank_Account_Number,
        status: "active",
      };

      const response = await axios.post("/api/v1/lease-lessor", requestData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        await fetchLessors();
        // toast.success("Lessor created successfully");
        toast.success("Lessor created successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return true;
      }
      return false;
    } catch (error: any) {
      // console.log(error.response.data.detail);
      console.error("Error creating lessor:", error);
      toast.error(
        error.response?.data?.detail ||
          error.message ||
          "Failed to create lessor"
      );
      return false; // Return false on error
    } finally {
      setIsSubmitting(false);
    }
  };
  // const [assetGroups] = useState<string[]>([...defaultAssetGroups]);
  const [assets, setAssets] = useState<Asset[]>([]);
  // const [formData, setFormData] = useState({
  //   code: "",
  //   assetGroup: assetGroups[0],
  //   description: "",
  //   Asset_Value: "",
  // });
  const fetchAssets = async () => {
    try {
      const response = await axios.get(`api/v1/lease-asset-groups`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
      });
      setAssets(response?.data?.data?.lease_asset_groups);
    } catch (error: any) {
      console.error("Failed to fetch Assets:", error);
      toast.error("Failed to load Assets");
    }
  };

  const createAsset = async (assetData: {
    asset_group_code: string;
    asset_group_name: string;
    description: string;
    low_value_limit: string;
    organization_id: string;
  }) => {
    setIsSubmitting(true);
    try {
      const payload = {
        organization_id: organizationId,
        asset_group_name: assetData.asset_group_name,
        description: assetData.description,
        low_value_limit: assetData.low_value_limit,
        status: "active",
      };

      const response = await axios.post("/api/v1/lease-asset-group", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        // toast.success("Asset created successfully");
        toast.success("Asset created successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Error saving asset:", error);
      toast.error(error.response?.data?.message || "Failed to save asset");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  //***********  Entity master  *******************
  const [entities, setEntities] = useState<EntityData[]>([]);

  const fetchEntityMaster = async () => {
    try {
      const response = await axios.get(`api/v1/entities`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
      });
      setEntities(response.data);
      // console.log("Entities data fetched successfully:", response.data);
    } catch (error: any) {
      console.error("Failed to fetch Entities:", error);
      toast.error("Failed to load Entities");
    }
  };


  const EntitySubmit = async (data: EntityFormData) => {
    setIsSubmitting(true);

    try {
      // Ensure department_ids is an array of numbers
      const departmentIds = Array.isArray(data.department_ids)
        ? data.department_ids.map(Number)
        : [];

      const requestData = {
        organization_id: organizationId,
        entity_name: data.entity_name,
        functional_currency: data.functional_currency,
        financial_start_date: data.financial_start_date
          ? new Date(data.financial_start_date).toISOString()
          : new Date().toISOString(),
        ownership_share_percent: data.ownership_share_percent || "0",
        relationship_type:
          relationshipTypes.find(
            (type) => type.id.toString() === data.relationship_type
          )?.name || "Not specified",
        related_to: data.related_to || "Not specified",
        department_ids: departmentIds, // Send all selected departments at once
        status: "active",
      };

    // console.log('d',requestData)

      const response = await axios.post("/api/v1/entities", requestData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
      });

      if (response.status >= 200 && response.status < 300) {
      //     console.log(
      //   response
      // );
        fetchEntityMaster();
        toast.success("Entity created successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Error creating entity:", error);
      toast.error(error.response?.data?.detail || "Failed to create entity");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };
  const [department, setDepartment] = useState<Department[]>([]);
  const [isSubmittingDept] = useState(false);

  const fetchDepartment = async () => {
    try {
      const response = await axios.get(`/api/v1/departments`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
      });
      // console.log("dept", response);
      setDepartment(response?.data?.data?.departments || []);
    } catch (error) {
      console.error("Error fetching department data:", error);
      toast.error("Failed to fetch department data");
    }
  };
  const createDepartment = async (departmentName: string) => {
    setIsSubmitting(true);
    try {
      const departmentData = {
        department_name: departmentName,
        status: "active",
      };

      const response = await axios.post("/api/v1/department", departmentData, {
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
      });

      if (response.status >= 200 && response.status < 300) {
        // toast.success("Department created successfully");
        toast.success("Department created successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        fetchDepartment(); // Refresh the list
        return true; // Return success status
      }
      throw new Error(response.data?.message || "Failed to create department");
    } catch (error: any) {
      console.error("Error creating department:", error);
      toast.error(error.message || "Failed to create department");
      return false; // Return failure status
    } finally {
      setIsSubmitting(false);
    }
  };

  //********** GLMaster  **********/

  const [glData, setGlData] = useState<GlMasterData[]>([]);

  const [glPagination, setGlPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 1,
    totalPages: 1,
  });

  // const fetchGlData = async (
  //   page: number = glPagination.currentPage,
  //   limit: number = glPagination.itemsPerPage
  // ) => {
  //   try {

  //     const response = await axios.get(`/api/v1/lease-gl-masters?page=1&limit=10&sort_by=created_at&sort_order=asc`, {
  //       params: {
  //         page,
  //         limit,
  //         sort_by: "created_at",
  //         sort_order: "asc",
  //       },
  //       headers: {
  //         accept: "application/json",
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${authState.token}`,
  //       },
  //     });

  //     const data = response?.data?.data;
  //     setGlData(data?.lease_gl_masters || []);

  //     // Update pagination state
  //     setGlPagination((prev) => ({
  //       ...prev,
  //       currentPage: page,
  //       itemsPerPage: limit,
  //       totalItems: data?.total_count || 0,
  //       totalPages: Math.ceil((data?.total_count || 0) / limit),
  //     }));
  //   } catch (error) {
  //     console.error("Error fetching GL data:", error);
  //     toast.error("Failed to fetch GL data");
  //   }
  // };
  const fetchGlData = async (
    page: number = glPagination.currentPage,
    limit: number = glPagination.itemsPerPage
  ) => {
    // console.log(limit);
    try {
      const response = await axios.get(`/api/v1/lease-gl-masters`, {
        params: {
          page,
          limit,
          sort_by: "created_at",
          sort_order: "asc",
          // Removed search parameter since we're doing client-side filtering
        },
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
      });
      // console.log(response?.data?.data);

      const data = response?.data?.data;
      setGlData(data?.lease_gl_masters || []);

      // setGlPagination((prev) => ({
      //   ...prev,
      //   currentPage: page,
      //   itemsPerPage: limit,
      //   totalItems: data?.meta?.total_items || 0,
      //   totalPages: Math.ceil((data?.meta?.total_items || 0) / limit),
      // }));
      setGlPagination((prev) => ({
        ...prev,
        currentPage: page,
        itemsPerPage: limit,
        totalItems: data?.total_count || data?.meta?.total_items || 0,
        totalPages: Math.ceil(
          (data?.total_count || data?.meta?.total_items || 0) / limit
        ),
      }));
    } catch (error) {
      console.error("Error fetching GL data:", error);
      toast.error("Failed to fetch GL data");
    }
  };

  const handleMaster = async (
    data: GlMasterFormData,
    onSuccess?: () => void
  ) => {
    try {
      const payload = {
        entity_id: Number(data.Entity_ID),
        department_id: Number(data.Dept_ID),
        event_phase: data.Event,
        entry_name: data.Entry_Name,
        description_narration: data.Description || "",
        gl_code: data.GL_Code || "",
        gl_description: data.GL_Description,
        status: "active",
      };

      const response = await axios.post("/api/v1/lease-gl-master", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authState.token}`,
        },
      });
      // console.log(response);

      if (response.status >= 200 && response.status < 300) {
        await fetchGlData();
        // toast.success("Data added successfully");

        if (onSuccess) onSuccess(); // Call the success callback
        toast.success("Data added successfully", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Error creating GL Master:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to create GL Master. Please check console for details."
      );
      return false;
    }
  };

  useEffect(() => {
    fetchOrganizationId();
    fetchLessors();
    fetchAssets();
    fetchEntityMaster();
    fetchDepartment();
    fetchGlData();
    // glData();
  }, []);

  return {
    entities,
    isLoading,
    isSubmitting,
    relationshipTypes,
    vatOptions,
    taxDeductionOptions,
    emailPattern,
    fetchLessors,
    createLessor,
    assets,
    createAsset,
    fetchEntityMaster,
    EntitySubmit,
    department,
    glData,
    LessorData,
    fetchAssets,
    createDepartment,
    isSubmittingDept,
    fetchDepartment,
    handleMaster,
    glPagination,
    setGlPagination,
    fetchGlData,
    organizationId
    // EntityData
  };
};

export default useMaster;
