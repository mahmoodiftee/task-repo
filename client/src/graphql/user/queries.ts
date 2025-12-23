import { gql } from "@apollo/client";

export const GET_CURRENT_LOGGED_IN_USER = gql`
  query getCurrentUser {
    getCurrentUser {
      id
      firstName
      lastName
      address
      email
      phoneNumber
    }
  }
`;
