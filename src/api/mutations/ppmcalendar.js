import { gql } from '@apollo/client';

// Define the mutations
export const UPDATE_SERVICE_PLAN = gql`
  mutation UpdateServicePlan($ppm_id: Int!, $ppm_schedule: date!) {
    update_ppm_service_plan_by_pk(pk_columns: { ppm_id: $ppm_id }, _set: { ppm_schedule: $ppm_schedule }) {
      ppm_id
      ppm_schedule
    }
  }
`;

export const UPDATE_PPM_DISCIPLINE = gql`
  mutation UpdatePPMDiscipline($ppm_id: Int!, $disc_id: Int!) {
    update_ppm_service_plan_by_pk(pk_columns: { ppm_id: $ppm_id }, _set: { fk_disc_id: $disc_id }) {
      ppm_id
      fk_disc_id
    }
  }
`;