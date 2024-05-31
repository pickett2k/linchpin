import { gql } from '@apollo/client';


export const CREATE_ASSET = gql`
  mutation CreateAsset(
    $as_name: String!,
    $as_manufacturer: String!,
    $as_manufacture_year: Int!,
    $as_model_name: String!,
    $as_serial_num: String!,
    $as_expected_life: Int!,
    $as_business_critical: Boolean!,
    $as_warranty_length: Int!,
    $as_warranty_expiry: date!,
    $as_status: Boolean!,
    $as_extra_info: String!,
    $as_access_restrictions: String!,
    $as_last_service_date: date!,
    $as_parent_id: Int,
    $fk_loc_id: Int!,
    $fk_disc_id: Int!,
    $fk_r_disc_id: Int!,
    $fk_as_cat_id: Int!
  ) {
    insert_asset_one(object: {
      as_name: $as_name,
      as_manufacturer: $as_manufacturer,
      as_manufacture_year: $as_manufacture_year,
      as_model_name: $as_model_name,
      as_serial_num: $as_serial_num,
      as_expected_life: $as_expected_life,
      as_business_critical: $as_business_critical,
      as_warranty_length: $as_warranty_length,
      as_warranty_expiry: $as_warranty_expiry,
      as_status: $as_status,
      as_extra_info: $as_extra_info,
      as_access_restrictions: $as_access_restrictions,
      as_last_service_date: $as_last_service_date,
      as_parent_id: $as_parent_id,
      fk_loc_id: $fk_loc_id,
      fk_disc_id: $fk_disc_id,
      fk_r_disc_id: $fk_r_disc_id,
      fk_as_cat_id: $fk_as_cat_id
    }) {
      as_id
    }
  }
`;


export const UPDATE_ASSET_BY_PK = gql`
  mutation UpdateAsset(
    $as_id: Int!,
    $as_access_restrictions: String,
    $as_archived: Boolean,
    $as_archived_by: String,
    $as_archived_date: date,
    $as_business_critical: Boolean,
    $as_created_by: String,
    $as_created_date: timestamp,
    $as_expected_life: Int,
    $as_extra_info: String,
    $as_last_service_date: date,
    $as_manufacture_year: Int,
    $as_manufacturer: String,
    $as_model_name: String,
    $as_next_service_date: date,
    $as_parent_id: Int,
    $as_serial_num: String,
    $as_standard: String,
    $as_status: Boolean,
    $as_verified_by: String,
    $as_verified_date: date,
    $as_verified_status: Boolean,
    $as_warranty: Boolean,
    $as_warranty_expiry: date,
    $as_warranty_length: Int,
    $fk_as_cat_id: Int,
    $fk_disc_id: Int,
    $fk_loc_id: Int
  ) {
    update_asset_by_pk(
      pk_columns: { as_id: $as_id },
      _set: {
        as_access_restrictions: $as_access_restrictions,
        as_archived: $as_archived,
        as_archived_by: $as_archived_by,
        as_archived_date: $as_archived_date,
        as_business_critical: $as_business_critical,
        as_created_by: $as_created_by,
        as_created_date: $as_created_date,
        as_expected_life: $as_expected_life,
        as_extra_info: $as_extra_info,
        as_last_service_date: $as_last_service_date,
        as_manufacture_year: $as_manufacture_year,
        as_manufacturer: $as_manufacturer,
        as_model_name: $as_model_name,
        as_next_service_date: $as_next_service_date,
        as_parent_id: $as_parent_id,
        as_serial_num: $as_serial_num,
        as_standard: $as_standard,
        as_status: $as_status,
        as_verified_by: $as_verified_by,
        as_verified_date: $as_verified_date,
        as_verified_status: $as_verified_status,
        as_warranty: $as_warranty,
        as_warranty_expiry: $as_warranty_expiry,
        as_warranty_length: $as_warranty_length,
        fk_as_cat_id: $fk_as_cat_id,
        fk_disc_id: $fk_disc_id,
        fk_loc_id: $fk_loc_id
      }
    ) {
      as_id
    }
  }
`;

export const ADD_ASSET_TO_PPM = gql`
  mutation AddAssetToPPM($fk_as_id: Int!, $ppm_fk_ppm_id: Int!) {
    insert_ppm_asset_service_plan_one(object: { fk_as_id: $fk_as_id, ppm_fk_ppm_id: $ppm_fk_ppm_id }) {
      fk_as_id
      ppm_fk_ppm_id
    }
  }
`;

export const UPDATE_PPM_DISCIPLINE = gql`
  mutation UpdatePPMDiscipline($as_id: Int!, $disc_id: Int, $ppm_id: Int) {
    update_ppm_service_plan_by_pk(
      pk_columns: { as_id: $as_id }
      _set: { disc_id: $disc_id, ppm_id: $ppm_id }
    ) {
      as_id
      disc_id
      ppm_id
    }
  }
`;

export const UPDATE_ASSET = gql`
  mutation UpdateAsset(
    $as_id: Int!,
    $as_access_restrictions: String,
    $as_archived: Boolean,
    $as_archived_by: String,
    $as_archived_date: date,
    $as_business_critical: Boolean,
    $as_created_by: String,
    $as_created_date: timestamp,
    $as_expected_life: Int,
    $as_extra_info: String,
    $as_last_service_date: date,
    $as_manufacture_year: Int,
    $as_manufacturer: String,
    $as_model_name: String,
    $as_next_service_date: date,
    $as_parent_id: Int,
    $as_serial_num: String,
    $as_standard: String,
    $as_status: Boolean,
    $as_verified_by: String,
    $as_verified_date: date,
    $as_verified_status: Boolean,
    $as_warranty: Boolean,
    $as_warranty_expiry: date,
    $as_warranty_length: Int,
    $fk_as_cat_id: Int,
    $fk_disc_id: Int,
    $fk_loc_id: Int,
    $as_name: String
  ) {
    update_asset_by_pk(
      pk_columns: { as_id: $as_id },
      _set: {
        as_access_restrictions: $as_access_restrictions,
        as_archived: $as_archived,
        as_archived_by: $as_archived_by,
        as_archived_date: $as_archived_date,
        as_business_critical: $as_business_critical,
        as_created_by: $as_created_by,
        as_created_date: $as_created_date,
        as_expected_life: $as_expected_life,
        as_extra_info: $as_extra_info,
        as_last_service_date: $as_last_service_date,
        as_manufacture_year: $as_manufacture_year,
        as_manufacturer: $as_manufacturer,
        as_model_name: $as_model_name,
        as_next_service_date: $as_next_service_date,
        as_parent_id: $as_parent_id,
        as_serial_num: $as_serial_num,
        as_standard: $as_standard,
        as_status: $as_status,
        as_verified_by: $as_verified_by,
        as_verified_date: $as_verified_date,
        as_verified_status: $as_verified_status,
        as_warranty: $as_warranty,
        as_warranty_expiry: $as_warranty_expiry,
        as_warranty_length: $as_warranty_length,
        fk_as_cat_id: $fk_as_cat_id,
        fk_disc_id: $fk_disc_id,
        fk_loc_id: $fk_loc_id,
        as_name: $as_name
      }
    ) {
      as_id
    }
  }
`;

export const TOGGLE_ARCHIVE_ASSET = gql`
  mutation ToggleArchiveAsset($as_id: Int!, $as_archived: Boolean!) {
    update_asset_by_pk(pk_columns: { as_id: $as_id }, _set: { as_archived: $as_archived }) {
      as_id
      as_archived
    }
  }
`;

export const VERIFY_ASSET = gql`
  mutation VerifyAsset($as_id: Int!) {
    update_asset_by_pk(pk_columns: { as_id: $as_id }, _set: { as_verified_status: true }) {
      as_id
      as_verified_status
    }
  }
`;