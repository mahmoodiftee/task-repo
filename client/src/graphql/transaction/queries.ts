import { gql } from "@apollo/client";

export const GET_SOLD_PRODUCTS_BY_USER_ID = gql`
  query GetSoldProductsByUserId($userId: String!) {
    getSoldProductsByUserId(userId: $userId) {
      id
      transactionType
      createdAt
      product {
        id
        title
        categories
        description
        purchasePrice
        rentPrice
        rentalPeriod
        viewCount
        ownerId
        createdAt
        updatedAt
        owner {
          id
          firstName
          lastName
          email
        }
      }
      customer {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

export const GET_BOUGHT_PRODUCTS_BY_USER_ID = gql`
  query GetBoughtProductsByUserId($userId: String!) {
    getBoughtProductsByUserId(userId: $userId) {
      id
      transactionType
      createdAt
      product {
        id
        title
        categories
        description
        purchasePrice
        rentPrice
        rentalPeriod
        viewCount
        ownerId
        createdAt
        updatedAt
        owner {
          id
          firstName
          lastName
          email
        }
      }
      customer {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

export const GET_LENT_PRODUCTS_BY_USER_ID = gql`
  query GetLentProductsByUserId($userId: String!) {
    getLentProductsByUserId(userId: $userId) {
      id
      transactionType
      createdAt
      product {
        id
        title
        description
        categories
        rentPrice
        rentalPeriod
        owner {
          id
          firstName
          lastName
          email
        }
      }
      customer {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

export const GET_BORROWED_PRODUCTS_BY_USER_ID = gql`
  query GetBorrowedProductsByUserId($userId: String!) {
    getBorrowedProductsByUserId(userId: $userId) {
      id
      transactionType
      createdAt
      product {
        id
        title
        description
        categories
        rentPrice
        rentalPeriod
        owner {
          id
          firstName
          lastName
          email
        }
      }
      customer {
        id
        firstName
        lastName
        email
      }
    }
  }
`;
