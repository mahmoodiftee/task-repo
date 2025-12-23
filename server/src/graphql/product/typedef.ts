export const typeDefs = `#graphql
    enum RentalPeriod {
        DAY
        WEEK
        MONTH
    }

    type Product {
        id: String!
        title: String!
        categories: String!
        description: String!
        purchasePrice: Float!
        rentPrice: Float!
        rentalPeriod: RentalPeriod!
        ownerId: String!
        viewCount: Int!
        createdAt: String!
        updatedAt: String!
    }

    type Query {
        getProductById(id: String!): Product
        getProductsByUserId(ownerId: String!): [Product]
        getAllProducts: PaginatedProducts
    }

    type PaginatedProducts {
        products: [Product]
        totalCount: Int
    }

    type Mutation {
        addProduct(
            title: String!, 
            categories: String!,
            description: String!, 
            purchasePrice: Float!,
            rentPrice: Float!,
            rentalPeriod: RentalPeriod!,
            ownerId: String!
        ): Product
        
        editProduct(
            id: String!, 
            title: String, 
            categories: String, 
            description: String, 
            purchasePrice: Float,
            rentPrice: Float,
            rentalPeriod: RentalPeriod
        ): Product
        
        deleteProduct(id: String!): Product

        incrementViews(id: String!): Product
    }
`;
