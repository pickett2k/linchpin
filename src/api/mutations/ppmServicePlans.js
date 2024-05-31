import { gql } from '@apollo/client';

export const UPDATE_PPM_ASSET_DISCIPLINE = gql`
  mutation UpdateAssetDiscipline($as_id: Int!, $fk_disc_id: Int!) {
    update_asset_by_pk(pk_columns: { as_id: $as_id }, _set: { fk_disc_id: $fk_disc_id }) {
      as_id
      fk_disc_id
    }
  }
`;

export const DELETE_PPM_SERVICE_PLANS = gql`
mutation DeletePpmServicePlans($as_id: Int!) {
    delete_ppm_asset_service_plan(where: { fk_as_id: { _eq: $as_id } }) {
      affected_rows
    }
  }
  `;

export const ADD_ASSET_TO_SERVICE_PLAN = gql`
mutation AddAssetToServicePlan($as_id: Int!, $ppm_id: Int!) {
  insert_ppm_asset_service_plan(objects: { fk_as_id: $as_id, ppm_id: $ppm_id }) {
    affected_rows
  }
}
`;

export const UPDATE_REACT_ASSET_DISCIPLINE = gql`
  mutation UpdateAssetDiscipline($as_id: Int!, $fk_r_disc_id: Int!) {
    update_asset_by_pk(pk_columns: { as_id: $as_id }, _set: { fk_r_disc_id: $fk_r_disc_id }) {
      as_id
      fk_r_disc_id
    }
  }
`;