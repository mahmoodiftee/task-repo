export const queries = `#graphql
    getProductById(id: String!): Product
    getProductsByUserId(ownerId: String!): [Product]
    getAllProducts(page: Int, limit: Int, searchTerm: String, categoryFilter: String): PaginatedProducts
    getFavouritesByUser: [Favourite]
`;
