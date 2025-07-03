
import axios from '../helper/axios';
import { Organization } from '../types';

// Add this new function for creating organizations
export const createOrganization = async (
  organizationData: any,
  token: string
): Promise<Organization> => {
  try {
    const response = await axios.post(`api/v1/tenant`, organizationData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data?.data;
  } catch (error) {
    console.error("Failed to create organization:", error);
    throw error;
  }
};

// Keep your existing functions
export const updateOrganization = async (
  organizationData: any,
  token: string
): Promise<Organization> => {
  try {
    const response = await axios.put(`api/v1/tenant`, organizationData, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data?.data;
  } catch (error) {
    console.error("Failed to update organization:", error);
    throw error;
  }
};

export const fetchOrganizations = async (
  token: string,
  page: number = 1,
  limit: number = 50
): Promise<{ organizations: Organization[]; totalItems: number }> => {
  try {
    const response = await axios.get(
      `api/v1/tenant?page=${page}&limit=${limit}&sort_by=created_at&sort_order=asc`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data?.data;
    const tenants = data?.tenants || [];
    const totalItems = response.data?.meta?.total_items || tenants.length;

    const organizations = tenants.map((tenant: any) => ({
      tenant_id: tenant.tenant_id,
      user_id: tenant.user_id,
      user_name: tenant.user_name,
      name: tenant.name === "N/A" ? "" : tenant.name,
      organization_type: tenant.organization_type === "N/A" ? "" : tenant.organization_type,
      industry_sector: tenant.industry_sector === "N/A" ? "" : tenant.industry_sector,
      registration_tax_id: tenant.registration_tax_id,
      address: tenant.address,
      country: tenant.country === "N/A" ? "" : tenant.country,
      zip_postal_code: tenant.zip_postal_code === "N/A" ? "" : tenant.zip_postal_code,
      incorporation_date: tenant.incorporation_date,
      created_at: tenant.created_at,
      updated_at: tenant.updated_at,
    }));

    return { organizations, totalItems };
  } catch (error) {
    console.error("Failed to fetch organizations:", error);
    throw error;
  }
};