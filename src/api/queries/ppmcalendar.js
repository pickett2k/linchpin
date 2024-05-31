import { gql } from '@apollo/client';

// Define the queries
export const GET_SERVICE_PLANS = gql`
  query GetServicePlans {
    ppm_service_plan {
      ppm_id
      ppm_description
      ppm_schedule
      ppm_discipline {
        disc_name
      }
      ppm_building_service_plans {
        building {
          pk_bld_id
          bld_name
        }
      }
      ppm_asset_service_plans {
        asset {
          as_id
          as_name
        }
      }
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