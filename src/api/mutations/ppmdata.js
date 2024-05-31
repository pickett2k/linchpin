import { gql } from '@apollo/client';

// Mutations
export const UPDATE_SINGLE_PPM_SERVICE_PLAN = gql`
  mutation UpdateSinglePPMServicePlan($ppm_id: Int!, $fields: ppm_service_plan_set_input) {
    update_ppm_service_plan_by_pk(pk_columns: { ppm_id: $ppm_id }, _set: $fields) {
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
      fk_sup_id
      fk_disc_id
    }
  }
`;

export const CREATE_PPM_SERVICE_PLAN = gql`
  mutation CreatePPMServicePlan($fields: ppm_service_plan_insert_input!) {
    insert_ppm_service_plan_one(object: $fields) {
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
      fk_disc_id
      fk_sup_id
    }
  }
`;

export const CREATE_PPM_BUILDING_RELATIONSHIP = gql`
  mutation CreatePPMBuildingRelationship($ppm_id: Int!, $building_id: Int!, $supplier_id: Int!) {
    insert_ppm_building_service_plan_one(object: { fk_ppm_id: $ppm_id, fk_bld_id: $building_id, fk_sup_id: $supplier_id }) {
      ppm_bsp_key
    }
  }
`;