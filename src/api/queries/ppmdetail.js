import { gql } from '@apollo/client';

export const GET_PPM_BY_PK = gql`
  query GetPPMByPk($ppm_id: Int!) {
    ppm_service_plan_by_pk(ppm_id: $ppm_id) {
      ppm_id
      ppm_standard
      ppm_status
      ppm_type
      last_service_date
      next_service_date
      ppm_schedule
      notes
      ppm_description
      ppm_frequency
      ppm_service_name
      ppm_archive
      fk_sup_id
      fk_disc_id
      ppm_discipline {
        disc_id
        disc_name
      }
      supplier {
        sup_id
        sup_name
      }
      ppm_building_service_plans {
        ppm_bsp_key
        ppm_b_last_service_date
        ppm_b_next_service_date
        ppm_b_schedule_date
        ppm_fk_ppm_id
        ppm_cost
        fk_bld_id
        building {
          pk_bld_id
          bld_name
        }
      }
    }
  }
`;

// GET_ASSETS_BY_DISCIPLINE_AND_BUILDING query
export const GET_ASSETS_BY_DISCIPLINE_AND_BUILDING = gql`
  query GetAssetsByDisciplineAndBuilding($fk_disc_id: Int!, $fk_pk_bld_id: Int!) {
    vw_asset_bld_org(where: {disc_id: {_eq: $fk_disc_id}, bld_id: {_eq: $fk_pk_bld_id}}) {
      as_id
      as_name
    }
  }
`;
export const GET_ASSETS_OVERVIEW = gql`
query GetAssetsOverview($ppm_id: Int!) {
  ppm_service_plan_by_pk(ppm_id: $ppm_id) {
    fk_disc_id
    ppm_building_service_plans {
      fk_bld_id
    }
  }
}
`;

export const GET_LINKED_ASSETS = gql`
query GetLinkedAssets($ppm_id: Int!) {
  ppm_asset_service_plan(where: { ppm_fk_ppm_id: { _eq: $ppm_id } }) {
    asset {
      as_id
      as_name
      location {
        fk_bld_id
      }
    }
  }
}
`;

export const GET_ASSETS_BY_PPM = gql`
  query GetAssetsByPPM($ppm_fk_ppm_id: Int!) {
  ppm_asset_service_plan(where: {ppm_fk_ppm_id: {_eq: $ppm_fk_ppm_id}}) {
    asset {
      as_id
      as_name
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

export const GET_DISCIPLINES = gql`
  query GetDisciplines {
    ppm_discipline {
      disc_id
      disc_name
    }
  }
`;

export const GET_INSTRUCTIONS = gql`
  query GetInstructions($ppm_id: Int!) {
    instruction_set(where: { fk_ppm_id: { _eq: $ppm_id } }) {
      pk_inst_set_id
      inst_set_detail
      inst_set_pass
      inst_set_archived
      inst_set_deleted
    }
  }
`;