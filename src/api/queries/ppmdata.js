import { gql } from '@apollo/client';

// Queries
export const GET_PPM_SERVICE_PLANS = gql`
  query GetPPMServicePlans {
    ppm_service_plan {
      ppm_id
      ppm_description
      ppm_schedule
      ppm_cost
      ppm_frequency
      last_service_date
      next_service_date
      ppm_status
      ppm_type
      ppm_standard
      notes
      compliance_ppm
      ppm_service_name
      compliance_ppm_expiry
      ppm_discipline {
        disc_name
      }
      supplier {
        sup_name
        sup_id
      }
      ppm_building_service_plans {
        ppm_bsp_key
        building {
          pk_bld_id
          bld_name
          organization {
            org_name
          }
        }
      }
    }
  }
`;

export const GET_SUPPLIERS = gql`
  query GetSuppliers {
    suppliers {
      sup_id
      sup_name
    }
  }
`;


export const GET_PPM_DISCIPLINES = gql`
  query GetPPMDisciplines {
    ppm_discipline {
      disc_id
      disc_name
    }
  }
`;

export const GET_BUILDINGS = gql`
  query GetBuildings {
    buildings {
      pk_bld_id
      bld_name
      fk_org_id
    }
  }
`;

export const GET_ORGANIZATIONS = gql`
  query GetOrganizations {
    organizations {
      pk_org_id
      org_name
    }
  }
`;

export const GET_PPM_DATA = gql`
  query GetPPMData($buildingId: Int, $discId: Int) {
    ppm_data(where: { building_id: { _eq: $buildingId }, disc_id: { _eq: $discId } }) {
      id
      service_name
      frequency
      last_service_date
      next_service_date
    }
  }
`;