export const mutations = `#graphql
    buyProduct(productId: String!): Transaction
    rentProduct(productId: String!, rentTimeFrom: String!, rentTimeTo: String!): Transaction
`;