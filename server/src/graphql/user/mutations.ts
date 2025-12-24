export const mutations = `#graphql
    registerUser(
        firstName: String!,
        lastName: String,
        address: String,
        email: String!,
        phoneNumber: String,
        password: String!
    ): String

    loginUser(email: String!, password: String!): AuthPayload!
    refreshToken(token: String!): String!
`;
