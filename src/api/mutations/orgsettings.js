// src/api/mutations.js
import { gql } from '@apollo/client';

export const ADD_ORGANIZATION = gql`
  mutation AddOrganization($org_name: String!, $org_address: String, $org_contact: String, $org_email: String, $org_phone: String) {
    insert_organizations_one(object: { org_name: $org_name, org_address: $org_address, org_contact: $org_contact, org_email: $org_email, org_phone: $org_phone }) {
      pk_org_id
      org_name
      org_address
      org_contact
      org_email
      org_phone
    }
  }
`;

export const DELETE_ORGANIZATION = gql`
  mutation DeleteOrganization($org_id: Int!) {
    delete_organizations_by_pk(pk_org_id: $org_id) {
      pk_org_id
    }
  }
`;

export const ADD_BUILDING = gql`
  mutation AddBuilding($bld_name: String!, $bld_address: String, $bld_contact: String, $bld_email: String, $bld_phone: String, $org_id: Int!) {
    insert_buildings_one(object: { bld_name: $bld_name, bld_address: $bld_address, bld_contact: $bld_contact, bld_email: $bld_email, bld_phone: $bld_phone, fk_org_id: $org_id }) {
      pk_bld_id
      bld_name
      bld_address
      bld_contact
      bld_email
      bld_phone
    }
  }
`;

export const DELETE_BUILDING = gql`
  mutation DeleteBuilding($bld_id: Int!) {
    delete_buildings_by_pk(pk_bld_id: $bld_id) {
      pk_bld_id
    }
  }
`;

export const ADD_LOCATION = gql`
  mutation AddLocation($loc_name: String!, $loc_description: String, $bld_id: Int!) {
    insert_locations_one(object: { loc_name: $loc_name, loc_description: $loc_description, fk_bld_id: $bld_id }) {
      pk_loc_id
      loc_name
      loc_description
    }
  }
`;

export const DELETE_LOCATION = gql`
  mutation DeleteLocation($loc_id: Int!) {
    delete_locations_by_pk(pk_loc_id: $loc_id) {
      pk_loc_id
    }
  }
`;