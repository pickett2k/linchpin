import { gql } from '@apollo/client';

// Mutations
export const UPDATE_SINGLE_PPM_SERVICE_PLAN = gql`
  mutation UpdateSinglePPMServicePlan($ppm_id: Int!, $fields: ppm_service_plan_set_input) {
  update_ppm_service_plan_by_pk(pk_columns: { ppm_id: $ppm_id }, _set: $fields) {
    ppm_id
    ppm_description
    ppm_schedule
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
  mutation CreatePPMBuildingRelationship($ppm_id: Int!, $building_id: Int!, $ppm_cost: Int!, $supplier_id: Int!) {
  insert_ppm_building_service_plan_one(object: { ppm_fk_ppm_id: $ppm_id, fk_bld_id: $building_id, ppm_cost: $ppm_cost, fk_sup_id: $supplier_id }) {
    ppm_bsp_key
  }
}
`;

export const INSERT_PPM_BULK_CHANGE = gql`
  mutation InsertPPMBulkChange(
    $change_type: String!,
    $change_reason: String!,
    $change_request_by: String!,
    $ppm_service_plans: String!,
    $bulk_affected_buildings: String!
  ) {
    insert_ppm_bulk_change(objects: {
      change_type: $change_type,
      change_reason: $change_reason,
      change_request_by: $change_request_by,
      ppm_service_plans: $ppm_service_plans,
      bulk_affected_buildings: $bulk_affected_buildings
    }) {
      affected_rows
    }
  }
`;

export const BULK_UPDATE_PPM_BUILDING_SERVICE_PLANS = gql`
  mutation BulkUpdatePPMBuildingServicePlans($updates: [ppm_building_service_plan_updates!]!) {
  update_ppm_building_service_plan_many(updates: $updates) {
    affected_rows
    returning {
      ppm_bsp_key
    }
  }
}
`;

export const BULK_INSERT_PPM_BULK_CHANGE = gql`
  mutation BulkInsertPPMBulkChange($objects: [ppm_bulk_change_insert_input!]!) {
    insert_ppm_bulk_change(objects: $objects) {
      returning {
        bulk_id
      }
    }
  }
`;

export const UPDATE_INSTRUCTION = gql`
  mutation UpdateInstruction($pk_inst_set_id: Int!, $object: instruction_set_set_input!) {
    update_instruction_set_by_pk(pk_columns: { pk_inst_set_id: $pk_inst_set_id }, _set: $object) {
      pk_inst_set_id
    }
  }
`;

export const INSERT_INSTRUCTION = gql`
  mutation InsertInstruction($object: instruction_set_insert_input!) {
    insert_instruction_set_one(object: $object) {
      pk_inst_set_id
      fk_ppm_id
      inst_set_detail
    }
  }
`;

export const DELETE_INSTRUCTION = gql`
  mutation DeleteInstruction($pk_inst_set_id: Int!) {
    delete_instruction_set_by_pk(pk_inst_set_id: $pk_inst_set_id) {
      pk_inst_set_id
    }
  }
`;

export const UPDATE_PPM_SCHEDULE_DATE = gql`
mutation UpdatePPMScheduleDate($ppm_bsp_key: Int!, $ppm_b_schedule_date: date!) {
  update_ppm_building_service_plans_by_pk(pk_columns: { ppm_bsp_key: $ppm_bsp_key }, _set: { ppm_b_schedule_date: $ppm_b_schedule_date }) {
    ppm_bsp_key
    ppm_b_schedule_date
  }
}
`;