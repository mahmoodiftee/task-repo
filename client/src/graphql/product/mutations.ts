import { gql } from "@apollo/client";

export const CREATE_PRODUCT = gql`
  mutation CreateProduct(
    $title: String!
    $categories: String!
    $description: String!
    $purchasePrice: Float!
    $rentPrice: Float!
    $rentalPeriod: RentalPeriod!
    $ownerId: String!
  ) {
    addProduct(
      title: $title
      categories: $categories
      description: $description
      purchasePrice: $purchasePrice
      rentPrice: $rentPrice
      rentalPeriod: $rentalPeriod
      ownerId: $ownerId
    ) {
      id
      title
      categories
      description
      purchasePrice
      rentPrice
      rentalPeriod
      ownerId
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_FAVOURITE_PRODUCT = gql`
  mutation createFavourite($productId: String!) {
    createFavourite(productId: $productId) {
      id
      productId
      userId
      createdAt
    }
  }
`;

export const DELETE_FAVOURITE_PRODUCT = gql`
  mutation deleteFavourite($productId: String!) {
    deleteFavourite(productId: $productId) {
      productId
    }
  }
`;



export const EDIT_PRODUCT = gql`
  mutation EditProduct(
    $id: String!
    $title: String
    $categories: String
    $description: String
    $purchasePrice: Float
    $rentPrice: Float
    $rentalPeriod: RentalPeriod
  ) {
    editProduct(
      id: $id
      title: $title
      categories: $categories
      description: $description
      purchasePrice: $purchasePrice
      rentPrice: $rentPrice
      rentalPeriod: $rentalPeriod
    ) {
      id
      title
      categories
      description
      purchasePrice
      rentPrice
      rentalPeriod
      updatedAt
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: String!) {
    deleteProduct(id: $id) {
      id
    }
  }
`;

export const INCREMENT_VIEWS = gql`
  mutation IncrementViews($id: String!) {
    incrementViews(id: $id) {
      id
      viewCount
    }
  }
`;
