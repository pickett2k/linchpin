import { gql } from '@apollo/client';

export const GET_GROUPS = gql`
  query GetGroups {
    as_group {
      as_group_id
      as_group_name
    }
  }
`;

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
      as_category {
        as_cat_id
        as_cat_name
      }
      fk_loc_id
      fk_disc_id
    }
  }
`;

export const GET_TYPES_BY_GROUP = gql`
  query GetTypesByGroup($groupId: Int!) {
    as_type(where: { fk_as_group_id: { _eq: $groupId } }) {
      as_type_id
      as_type_name
    }
  }
`;

export const GET_CATEGORIES_BY_TYPE = gql`
  query GetCategoriesByType($typeId: Int!) {
    as_category(where: { fk_type_id: { _eq: $typeId } }) {
      as_cat_id
      as_cat_name
    }
  }
`;

// Asset by PK
export const GET_ASSET_BY_PK = gql`
  query GetAssetByPK($as_id: Int!) {
    asset_by_pk(as_id: $as_id) {
      as_id
      as_access_restrictions
      as_archived
      as_archived_by
      as_archived_date
      as_business_critical
      as_created_by
      as_created_date
      as_expected_life
      as_extra_info
      as_last_service_date
      as_manufacture_year
      as_manufacturer
      as_model_name
      as_next_service_date
      as_parent_id
      as_serial_num
      as_status
      as_verified_by
      as_verified_date
      as_verified_status
      as_warranty
      as_warranty_expiry
      as_warranty_length
      as_name
      as_modified_date
      as_modified_by
      fk_as_cat_id
      fk_disc_id
      fk_loc_id
    }
  }
`;

export const GET_LOCATIONS = gql`
  query GetLocations {
    locations {
      pk_loc_id
      loc_name
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

export const GET_REACT_DISCIPLINES = gql`
  query GetReactDisciplines {
    react_discipline {
      disc_id
      disc_name
    }
  }
`;

export const GET_PPM_SERVICE_PLANS_BY_ASSET_ID = gql`
  query GetPPMServicePlansByAssetId($as_id: Int!) {
    ppm_asset_service_plan(where: { fk_as_id: { _eq: $as_id } }) {
      ppm_service_plan {
        ppm_id
        ppm_service_name
      }
    }
  }
`;

// Building by ID
export const GET_BUILDING_BY_ID = gql`
  query GetBuildingById($bld_id: Int!) {
    building_by_pk(pk_bld_id: $bld_id) {
      pk_bld_id
      bld_name
      fk_org_id
    }
  }
`;

// Organization by ID
export const GET_ORGANIZATION_BY_ID = gql`
  query GetOrganizationById($org_id: Int!) {
    organization_by_pk(pk_org_id: $org_id) {
      pk_org_id
      org_name
    }
  }
`;

// Discipline by ID
export const GET_DISCIPLINE_BY_ID = gql`
  query GetDisciplineById($disc_id: Int!) {
    ppm_discipline_by_pk(disc_id: $disc_id) {
      disc_id
      disc_name
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    as_category {
      as_cat_id
      as_cat_name
      as_type {
        as_type_name
        as_group {
          as_group_name
        }
      }
    }
  }
`;

export const GET_ASSET_NAME_AND_LOC_ID_BY_ID = gql`
  query GetAssetNameAndLocIdById($as_id: Int!) {
    asset_by_pk(as_id: $as_id) {
      as_name
      fk_loc_id
    }
  }
`;

export const GET_ORG_AND_BUILDING_BY_LOC_ID = gql`
  query GetOrgAndBuildingByLocId($pk_loc_id: Int!) {
    locations_by_pk(pk_loc_id: $pk_loc_id) {
      building {
        bld_name
        organization {
          org_name
        }
      }
    }
  }
`;

export const GET_ASSET_OVERVIEW = gql`
  query GetAssetOverview {
    vw_asset_bld_org {
      as_id
      as_name
      loc_name
      bld_name
      org_name
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

export const GET_BUILDINGS_BY_ORG = gql`
  query GetBuildingsByOrg($orgId: Int!) {
    buildings(where: { fk_org_id: { _eq: $orgId } }) {
      pk_bld_id
      bld_name
    }
  }
`;

export const GET_LOCATIONS_BY_BUILDING = gql`
  query GetLocationsByBuilding($bldId: Int!) {
    locations(where: { fk_bld_id: { _eq: $bldId } }) {
      pk_loc_id
      loc_name
    }
  }
`;
