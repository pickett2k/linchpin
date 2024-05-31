import { gql } from '@apollo/client';

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

// ADD_ASSET_TO_PPM mutation
export const ADD_ASSET_TO_PPM = gql`
  mutation AddAssetToPPM($fk_as_id: Int!, $ppm_fk_ppm_id: Int!) {
  insert_ppm_asset_service_plan_one(object: {fk_as_id: $fk_as_id, ppm_fk_ppm_id: $ppm_fk_ppm_id}) {
    fk_as_id
    ppm_fk_ppm_id
  }
}
`;

// DELETE_ASSET_FROM_PPM mutation
export const DELETE_ASSET_FROM_PPM = gql`
  mutation DeleteAssetFromPPM($fk_as_id: Int!, $ppm_fk_ppm_id: Int!) {
  delete_ppm_asset_service_plan(where: {fk_as_id: {_eq: $fk_as_id}, ppm_fk_ppm_id: {_eq: $ppm_fk_ppm_id}}) {
    affected_rows
  }
}
`;

export const UPDATE_PPM = gql`
  mutation UpdatePPM(
    $ppm_id: Int!,
    $compliance_ppm: Boolean,
    $compliance_ppm_expiry: date,
    $fk_sup_id: Int,
    $last_service_date: date,
    $next_service_date: date,
    $notes: String,
    $ppm_archive: Boolean,
    $ppm_cost: Int,
    $ppm_created_date: date,
    $ppm_description: String,
    $ppm_frequency: String,
    $ppm_schedule: date,
    $ppm_service_name: String,
    $ppm_standard: String,
    $ppm_status: String,
    $ppm_type: String
  ) {
    update_ppm_service_plan_by_pk(
      pk_columns: { ppm_id: $ppm_id },
      _set: {
        compliance_ppm: $compliance_ppm,
        compliance_ppm_expiry: $compliance_ppm_expiry,
        fk_sup_id: $fk_sup_id,
        last_service_date: $last_service_date,
        next_service_date: $next_service_date,
        notes: $notes,
        ppm_archive: $ppm_archive,
        ppm_cost: $ppm_cost,
        ppm_created_date: $ppm_created_date,
        ppm_description: $ppm_description,
        ppm_frequency: $ppm_frequency,
        ppm_schedule: $ppm_schedule,
        ppm_service_name: $ppm_service_name,
        ppm_standard: $ppm_standard,
        ppm_status: $ppm_status,
        ppm_type: $ppm_type
      }
    ) {
      ppm_id
    }
  }
`;

export const UPDATE_DISCIPLINE = gql`
  mutation UpdateDiscipline($ppm_id: Int!, $fk_disc_id: Int!) {
    update_ppm_service_plan_by_pk(pk_columns: { ppm_id: $ppm_id }, _set: { fk_disc_id: $fk_disc_id }) {
      ppm_id
      fk_disc_id
    }
  }
`;