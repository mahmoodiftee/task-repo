import { gql } from "@apollo/client";

export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts($page: Int!, $limit: Int!, $searchTerm: String, $categoryFilter: String) {
    getAllProducts(page: $page, limit: $limit, searchTerm: $searchTerm, categoryFilter: $categoryFilter) {
      products {
        id
        title
        categories
        description
        purchasePrice
        rentPrice
        rentalPeriod
        ownerId
        viewCount
        createdAt
        updatedAt
        owner {
          id
          firstName
          lastName
          email
        }
      }
      totalCount
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: String!) {
    getProductById(id: $id) {
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
      }
      transactions {
        id
        transactionType
        rentTimeFrom
        rentTimeTo
      }
    }
  }
`;

export const GET_PRODUCTS_BY_USER_ID = gql`
  query GetProductsByUserId($ownerId: String!) {
    getProductsByUserId(ownerId: $ownerId) {
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
  }
`;
