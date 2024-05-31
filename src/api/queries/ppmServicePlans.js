
import { gql } from '@apollo/client';

export const GET_ASSET_DISCIPLINE = gql`
  query GetAssetDiscipline($as_id: Int!) {
    asset_by_pk(as_id: $as_id) {
      fk_disc_id
      fk_r_disc_id
      fk_loc_id
    }
  }
`;

export const GET_PPM_DISCIPLINE_NAME = gql`
  query GetDisciplineName($disc_id: Int!) {
    ppm_discipline_by_pk(disc_id: $disc_id) {
      disc_name
    }
  }
`;

export const GET_REACT_DISCIPLINE_NAME = gql`
  query GetDisciplineName($disc_id: Int!) {
    react_discipline_by_pk(disc_id: $disc_id) {
      disc_name
    }
  }
`;

export const GET_PPM_SERVICE_PLANS = gql`
  query GetPPMServicePlansByAsset($as_id: Int!) {
    ppm_asset_service_plan(where: { fk_as_id: { _eq: $as_id } }) {
      ppm_service_plan {
        ppm_service_name
      }
    }
  }
`;

export const GET_PPM_DISCIPLINES = gql`
  query GetDisciplines {
    ppm_discipline(where: { disc_ppm: { _eq: true } }) {
      disc_id
      disc_name
    }
  }
`;

export const GET_REACT_DISCIPLINES = gql`
  query GetDisciplines {
    react_discipline(where: { disc_ppm: { _eq: false } }) {
      disc_id
      disc_name
    }
  }
`;