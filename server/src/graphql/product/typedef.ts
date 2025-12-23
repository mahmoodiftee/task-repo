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

    type Favourite {
        id: String!
        productId: String!
        userId: String!
        createdAt: String
        product: Product
    }

    type Query {
        getProductById(id: String!): Product
        getProductsByUserId(ownerId: String!): [Product]
        getAllProducts: PaginatedProducts
        getFavouritesByUser: [Favourite]
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

        createFavourite(productId: String!): Favourite
        deleteFavourite(productId: String!): Favourite
    }
`;
