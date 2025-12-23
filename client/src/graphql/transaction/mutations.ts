import { gql } from "@apollo/client";
export const BUY_PRODUCT = gql`
  mutation BuyProduct($productId: String!) {
    buyProduct(productId: $productId) {
      id
      transactionType
    }
  }
`;
export const RENT_PRODUCT = gql`
  mutation RentProduct($productId: String!, $rentTimeFrom: String!, $rentTimeTo: String!) {
    rentProduct(productId: $productId, rentTimeFrom: $rentTimeFrom, rentTimeTo: $rentTimeTo) {
      id
      transactionType
      rentTimeFrom
      rentTimeTo
    }
  }
`;