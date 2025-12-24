export const typeDefs = `#graphql
    type User {
        id: ID!
        firstName: String!
        lastName: String
        address: String
        email: String!
        phoneNumber: String
    }
    type AuthPayload {
    accessToken: String!
    refreshToken: String!
    }
`;
