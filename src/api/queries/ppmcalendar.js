import { gql } from '@apollo/client';

// Define the queries
export const GET_SERVICE_PLANS = gql`
  query GetServicePlans {
    ppm_service_plan {
  ppm_id
  ppm_key
  ppm_service_name
  ppm_schedule
  ppm_frequency
  last_service_date
  next_service_date
  ppm_status
  ppm_type
  ppm_standard
  notes
  compliance_ppm_expiry
  compliance_ppm
      ppm_discipline {
        disc_name
      }
      ppm_building_service_plans {
    ppm_bsp_key
    ppm_fk_ppm_id
    fk_bld_id
    ppm_cost
        }
      }
      ppm_asset_service_plan {
        asset {
          as_id
          as_name
        }
      }
      organizations {
        org_name
    }
    ppm_discipline {
      disc_name
    }
    buildings {
      pk_bld_id
      bld_name
    }
  }
`;
