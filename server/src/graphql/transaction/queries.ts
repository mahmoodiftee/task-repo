export const queries = `#graphql
    getSoldProductsByUserId(userId: String!): [Transaction!]!
    getBoughtProductsByUserId(userId: String!): [Transaction!]!
    getLentProductsByUserId(userId: String!): [Transaction!]!
    getBorrowedProductsByUserId(userId: String!): [Transaction!]!
`;
