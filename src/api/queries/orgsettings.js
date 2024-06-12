import { gql } from '@apollo/client';

export const GET_ORGANIZATIONS = gql`
  query GetOrganizations {
    organizations {
      pk_org_id
      org_name
      org_type
      org_description
    }
  }
`;

export const GET_BUILDINGS = gql`
  query GetBuildings($orgId: Int!) {
    buildings(where: { fk_org_id: { _eq: $orgId } }) {
      pk_bld_id
      bld_name
      bld_address
      bld_floors
      bld_opening_date
    }
  }
`;

export const GET_LOCATIONS = gql`
  query GetLocations($bldId: Int!) {
    locations(where: { fk_bld_id: { _eq: $bldId } }) {
      pk_loc_id
      loc_name
      loc_description
    }
  }
`;