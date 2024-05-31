import gql from 'graphql-tag';

// ***** Organisations ***** //

// Get Organisations - Query
export const GET_ORGANIZATIONS = gql`
  query GetOrganizations {
    organizations {
      pk_org_id
      org_name
    }
  }
`;

// Get Individual Organisation - Query
export const GET_ORGANIZATION_BY_PK = gql`
  query GetOrganizationByPk($pk_org_id: Int!) {
    organization_by_pk(pk_org_id: $pk_org_id) {
      org_active
      org_description
      org_name
      org_type
      org_uuid
      pk_org_id
    }
  }
`;

// Get Individual Organization by ID - Query
export const GET_ORGANIZATION_BY_ID = gql`
  query GetOrganizationById($pk_org_id: Int!) {
    organizations_by_pk(pk_org_id: $pk_org_id) {
      org_active
      org_description
      org_name
      org_type
      org_uuid
      pk_org_id
    }
  }
`;

// ***** Task Disciplines ***** //

// Get Disciplines - Query
export const GET_DISCIPLINES = gql`
  query disciplinesData {
    ppm_discipline {
      disc_id
      disc_name
      disc_ppm
      disc_uuid
      ppm_service_plans {
        ppm_id
        ppm_asset_service_plans {
          fk_as_id
        }
        ppm_building_service_plans {
          fk_bld_id
        }
      }
    }
  }
`;

// Get Individual Discipline - Query
export const GET_DISCIPLINE_BY_ID = gql`
  query GetDisciplineById($disc_id: Int!) {
    ppm_discipline_by_pk(disc_id: $disc_id) {
      disc_id
      disc_name
      disc_description
      disc_ppm
      disc_uuid
    }
  }
`;

// ***** Buildings ***** //

// Get Buildings
export const GET_BUILDINGS = gql`
  query buildingsData {
    buildings {
      pk_bld_id
      bld_address
      bld_construction_date
      bld_floors
      bld_name
      bld_type
      bld_uuid
      fk_org_id
      ppm_building_service_plans {
        ppm_service_plan {
          ppm_id
        }
      }
    }
  }
`;

// Get Individual Building - Query
export const GET_BUILDING_BY_ID = gql`
  query GetBuildingById($pk_bld_id: Int!) {
    buildings_by_pk(pk_bld_id: $pk_bld_id) {
      pk_bld_id
      bld_name
      bld_address
      bld_construction_date
      bld_floors
      bld_type
      bld_uuid
      fk_org_id
    }
  }
`;

// ***** Asset Tables ***** //

// Asset Information
export const GET_ASSET = gql`
  query GetAsset {
    asset {
      as_access_restrictions
      as_archived
      as_archived_by
      as_archived_date
      as_business_critical
      as_created_by
      as_created_date
      as_deleted
      as_expected_life
      as_extra_info
      as_id
      as_last_service_date
      as_latitude
      as_longitude
      as_manufacture_year
      as_manufacturer
      as_model_name
      as_name
      as_next_service_date
      as_serial_num
      as_standard
      as_status
      as_uuid
      as_verified_by
      as_verified_date
      as_verified_status
      as_warranty
      as_warranty_expiry
      as_warranty_length
      fk_as_cat_id
      fk_loc_id
      fk_disc_id
    }
  }
`;

// Individual Asset Information
export const GET_ASSET_BY_PK = gql`
  query GetAssetByPK($as_id: Int!) {
    asset_by_pk(as_id: $as_id) {
      as_id
      as_name
      as_manufacturer
      as_model_name
      as_serial_num
      as_standard
      as_status
      as_next_service_date
      as_manufacture_year
      as_last_service_date
      as_access_restrictions
      as_business_critical
      as_expected_life
      as_extra_info
      as_warranty
      as_warranty_expiry
      as_warranty_length
      as_verified_status
      as_verified_date
      as_archived
      as_archived_date
      fk_loc_id
      fk_disc_id
      location {
        loc_name
        building {
          bld_name
          organization {
            org_name
          }
        }
      }
    }
  }
`;

// Location Information
export const GET_LOCATIONS = gql`
  query GetLocations {
    locations {
      loc_id
      loc_name
      building {
        bld_id
        bld_name
        organization {
          org_id
          org_name
        }
      }
    }
  }
`;

// Update an Asset
export const UPDATE_ASSET = gql`
  mutation UpdateAsset($as_id: Int!, $object: asset_set_input!) {
    update_asset_by_pk(pk_columns: {as_id: $as_id}, _set: $object) {
      as_id
    }
  }
`;

// Asset Groups
export const GET_GROUPS = gql`
  query GetGroups {
    as_group {
      as_group_id
      as_group_name
    }
  }
`;

// Asset Types based on a Group
export const GET_TYPES_BY_GROUP = gql`
  query GetTypesByGroup($as_group_id: Int_comparison_exp = {}) {
    as_type(where: { as_group: { as_group_id: $as_group_id } }) {
      as_type_id
      as_type_name
    }
  }
`;

// Asset Categories based on a Type
export const GET_CATEGORIES_BY_TYPE = gql`
  query GetCategoriesByType($as_type_id: Int_comparison_exp = {}) {
    as_category(where: { as_type: { as_type_id: $as_type_id } }) {
      as_cat_id
      as_cat_name
    }
  }
`;

// Create a new Asset
export const CREATE_ASSET = gql`
  mutation CreateAsset(
    $as_name: String!,
    $as_manufacturer: String!,
    $as_model_name: String!,
    $as_serial_num: String!,
    $fk_as_cat_id: Int!
  ) {
    insert_asset_one(
      object: {
        as_name: $as_name,
        as_manufacturer: $as_manufacturer,
        as_model_name: $as_model_name,
        as_serial_num: $as_serial_num,
        fk_as_cat_id: $fk_as_cat_id
      }
    ) {
      as_id
    }
  }
`;

// ***** Suppliers Table ***** //

// Get Suppliers
export const GET_SUPPLIERS = gql`
query supplierData {
  suppliers {
    sup_add
    sup_bill_add
    sup_cis_reg
    sup_company_num
    sup_credit_score
    sup_id
    sup_key
    sup_name
    sup_ppm
    sup_vat_num
  }
}
`;

// ***** PPM Queries ***** //

// PPM Service Plans
export const GET_SERVICE_PLANS = gql`
  query GetServicePlans {
    ppm_service_plan {
      ppm_id
      ppm_schedule
      ppm_description
      compliance_ppm
      ppm_service_name
      ppm_building_service_plans {
        building {
          bld_name
          pk_bld_id
        }
      }
      ppm_asset_service_plans {
        asset {
          as_id
          as_name
        }
      }
      ppm_discipline {
        disc_name
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

// PPM Service Plan by Discipline and Building - Query
export const GET_PPM_SERVICE_PLANS_BY_DISCIPLINE_AND_BUILDING = gql`
  query GetPPMServicePlansByDisciplineAndBuilding($fk_disc_id: Int!, $fk_loc_id: Int!) {
    ppm_service_plan(where: {fk_disc_id: {_eq: $fk_disc_id}, building: {fk_loc_id: {_eq: $fk_loc_id}}}) {
      ppm_id
      ppm_service_name
    }
  }
`;

// Get PPM Service Plan - Query
export const GET_PPM_SERVICE_PLANS = gql`
  query GetPPMServicePlans {
    ppm_service_plan {
      ppm_id
      ppm_schedule
      ppm_description
      ppm_status
      ppm_type
      ppm_frequency
      ppm_standard
      last_service_date
      next_service_date
      ppm_cost
      ppm_service_name
      compliance_ppm
      fk_sup_id
      notes
      supplier {
        sup_name
        sup_id
      }
      ppm_discipline {
        disc_name
      }
      ppm_building_service_plans {
        building {
          bld_name
          fk_org_id
          organization {
            org_name
            pk_org_id
          }
        }
      }
    }
  }
`;

// Update PPM Service Plan
export const UPDATE_SERVICE_PLAN = gql`
  mutation UpdateServicePlan($ppm_id: Int!, $ppm_schedule: date!) {
    update_ppm_service_plan_by_pk(pk_columns: {ppm_id: $ppm_id}, _set: {ppm_schedule: $ppm_schedule}) {
      ppm_id
      ppm_schedule
    }
  }
`;

// Update a single PPM service plan
export const UPDATE_SINGLE_PPM_SERVICE_PLAN = gql`
  mutation updatePPMServicePlan(
    $ppm_id: Int!,
    $ppm_schedule: date,
    $ppm_description: String,
    $ppm_status: String,
    $ppm_type: String,
    $ppm_frequency: String,
    $ppm_standard: String,
    $last_service_date: date,
    $next_service_date: date,
    $ppm_cost: numeric,
    $notes: String,
    $compliance_ppm: Boolean
  ) {
    update_ppm_service_plan_by_pk(
      pk_columns: { ppm_id: $ppm_id },
      _set: {
        ppm_schedule: $ppm_schedule,
        ppm_description: $ppm_description,
        ppm_status: $ppm_status,
        ppm_type: $ppm_type,
        ppm_frequency: $ppm_frequency,
        ppm_standard: $ppm_standard,
        last_service_date: $last_service_date,
        next_service_date: $next_service_date,
        ppm_cost: $ppm_cost,
        notes: $notes,
        compliance_ppm: $compliance_ppm
      }
    ) {
      ppm_id
    }
  }
`;

// Update multiple PPM service plans
export const UPDATE_MULTIPLE_PPM_SERVICE_PLANS = gql`
  mutation UpdateMultiplePPMServicePlans($objects: [ppm_service_plan_insert_input!]!) {
    delete_ppm_service_plan(where: {}) {
      affected_rows
    }
    insert_ppm_service_plan(objects: $objects) {
      affected_rows
    }
  }
`;

// PPM Get Disciplines - Query
export const GET_PPM_DISCIPLINES = gql`
  query GetPPMDisciplines {
    ppm_discipline {
      disc_id
      disc_name
    }
  }
`;

// PPM Get Single PPM - Query
export const GET_PPM_BY_PK = gql`
  query GetPPMByPk($ppm_id: Int!) {
    ppm_service_plan_by_pk(ppm_id: $ppm_id) {
      ppm_standard
      ppm_status
      ppm_type
      last_service_date
      next_service_date
      ppm_schedule
      ppm_cost
      ppm_id
      notes
      ppm_description
      ppm_frequency
      compliance_ppm
      ppm_service_name
      ppm_building_service_plans {
        building {
          bld_name
        }
        supplier {
          sup_name
        }
      }
    }
  }
`;

// Update PPM Service Plan - Update Mutation
export const UPDATE_PPM = gql`
  mutation UpdatePPM(
    $ppm_id: Int!
    $ppm_standard: String
    $ppm_status: String
    $ppm_type: String
    $last_service_date: date
    $next_service_date: date
    $ppm_schedule: date
    $ppm_cost: Int
    $notes: String
    $ppm_description: String
    $ppm_frequency: String
    $ppm_service_name: String
    $compliance_ppm: Boolean
  ) {
    update_ppm_service_plan_by_pk(
      pk_columns: { ppm_id: $ppm_id }
      _set: {
        ppm_standard: $ppm_standard
        ppm_status: $ppm_status
        ppm_type: $ppm_type
        last_service_date: $last_service_date
        next_service_date: $next_service_date
        ppm_schedule: $ppm_schedule
        ppm_cost: $ppm_cost
        notes: $notes
        ppm_description: $ppm_description
        ppm_frequency: $ppm_frequency
        ppm_service_name: $ppm_service_name
        compliance_ppm: $compliance_ppm
      }
    ) {
      ppm_id
    }
  }
`;

// PPM Building Service Plan - Update Mutation
export const UPDATE_PPM_BUILDING_SERVICE_PLAN = gql`
  mutation UpdatePPMBuildingServicePlan(
    $ppm_bsp_key: Int!
    $fk_bld_id: Int
    $fk_sup_id: Int
  ) {
    update_ppm_building_service_plan_by_pk(
      pk_columns: { ppm_bsp_key: $ppm_bsp_key }
      _set: {
        fk_bld_id: $fk_bld_id
        fk_sup_id: $fk_sup_id
      }
    ) {
      ppm_bsp_key
    }
  }
`;

// Create PPM Service Plan - Create Mutation
export const CREATE_PPM_SERVICE_PLAN = gql`
  mutation CreatePPMServicePlan($fields: ppm_service_plan_insert_input!) {
    insert_ppm_service_plan_one(object: $fields) {
      ppm_id
    }
  }
`;

// Create Building Relationships - Insert Mutation
export const CREATE_PPM_BUILDING_RELATIONSHIP = gql`
  mutation CreatePPMBuildingRelationship($ppm_id: Int!, $building_id: Int!, $supplier_id: Int!) {
    insert_ppm_building_service_plan_one(object: { ppm_fk_ppm_id: $ppm_id, fk_bld_id: $building_id, fk_sup_id: $supplier_id }) {
      ppm_bsp_key
    }
  }
`;

export const GET_PPM_SERVICE_PLANS_BY_ASSET_ID = gql`
  query GetPPMServicePlansByAssetID($as_id: Int!) {
    ppm_asset_service_plan(where: {fk_as_id: {_eq: $as_id}}) {
      ppm_fk_ppm_id
      ppm_service_plan {
        ppm_service_name
      }
    }
  }
`;

// Assets PPM

// Get Assets by PPM - Query
export const GET_ASSETS_BY_PPM = gql`
  query GetAssetsByPPM($ppm_fk_ppm_id: Int!) {
    ppm_asset_service_plan(where: { ppm_fk_ppm_id: { _eq: $ppm_fk_ppm_id } }) {
      fk_as_id
      asset {
        as_id
        as_name
      }
    }
  }
`;

// Asset Get Assets by Discipline and Building PPM - Query
export const GET_ASSETS_BY_DISCIPLINE_AND_BUILDING = gql`
  query GetAssetsByDisciplineAndBuilding($fk_disc_id: Int!, $fk_loc_id: Int!) {
    asset(where: { fk_disc_id: { _eq: $fk_disc_id }, fk_loc_id: { _eq: $fk_loc_id }, as_deleted: { _eq: false } }) {
      as_id
      as_name
    }
  }
`;

// Asset ADD to PPM - Insert Mutation
export const ADD_ASSET_TO_PPM = gql`
  mutation AddAssetToPPM($fk_as_id: Int!, $ppm_fk_ppm_id: Int!) {
    insert_ppm_asset_service_plan_one(object: { fk_as_id: $fk_as_id, ppm_fk_ppm_id: $ppm_fk_ppm_id }) {
      ppm_asp_key
    }
  }
`;

// Asset Delete from PPM - Remove Mutation
export const DELETE_ASSET_FROM_PPM = gql`
  mutation DeleteAssetFromPPM($fk_as_id: Int!, $ppm_fk_ppm_id: Int!) {
    delete_ppm_asset_service_plan(where: { fk_as_id: { _eq: $fk_as_id }, ppm_fk_ppm_id: { _eq: $ppm_fk_ppm_id } }) {
      affected_rows
    }
  }
`;

// Instructions Get Instruction Sets - Query
export const GET_INSTRUCTIONS = gql`
  query GetInstructions($ppm_id: Int!) {
    instruction_set(where: { fk_ppm_id: { _eq: $ppm_id }, inst_set_deleted: { _eq: false } }) {
      pk_inst_set_id
      fk_ppm_id
      inst_set_detail
      inst_set_pass
      inst_set_archived
      inst_set_deleted
    }
  }
`;

// Instructions Update Instruction Sets - Update Mutation
export const UPDATE_INSTRUCTION = gql`
  mutation UpdateInstruction(
    $pk_inst_set_id: Int!
    $inst_set_detail: String!
    $inst_set_archived: Boolean!
    $inst_set_deleted: Boolean!
  ) {
    update_instruction_set_by_pk(
      pk_columns: { pk_inst_set_id: $pk_inst_set_id }
      _set: {
        inst_set_detail: $inst_set_detail
        inst_set_archived: $inst_set_archived
        inst_set_deleted: $inst_set_deleted
      }
    ) {
      pk_inst_set_id
    }
  }
`;

// Instructions Insert Instruction Sets - Insert Mutation
export const INSERT_INSTRUCTION = gql`
  mutation InsertInstruction(
    $fk_ppm_id: Int!
    $inst_set_detail: String!
    $inst_set_pass: String!
  ) {
    insert_instruction_set_one(object: {
      fk_ppm_id: $fk_ppm_id
      inst_set_detail: $inst_set_detail
      inst_set_pass: $inst_set_pass
    }) {
      pk_inst_set_id
    }
  }
`;

// Instructions Remove Instruction Sets - Delete Mutation
export const DELETE_INSTRUCTION = gql`
  mutation DeleteInstruction($pk_inst_set_id: Int!) {
    update_instruction_set_by_pk(
      pk_columns: { pk_inst_set_id: $pk_inst_set_id }
      _set: { inst_set_deleted: true }
    ) {
      pk_inst_set_id
    }
  }
`;
