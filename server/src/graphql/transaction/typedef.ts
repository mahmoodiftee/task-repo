export const typeDefs = `#graphql
    type User {
        id: ID!
        firstName: String!
        lastName: String
        address: String
        email: String!
        phoneNumber: String
        products: [Product!]!
        transactions: [Transaction!]!
    }

    type Product {
        id: String!
        title: String!
        categories: String
        description: String
        purchasePrice: Float
        rentPrice: Float
        rentalPeriod: RentalPeriod
        viewCount: Int!
        ownerId: String!
        owner: User!
        transactions: [Transaction!]!
        createdAt: String!
        updatedAt: String!
    }

    type Transaction {
        id: String!
        product: Product!
        customer: User!
        transactionType: TransactionType!
        rentTimeFrom: String
        rentTimeTo: String
        createdAt: String!
    }

    enum RentalPeriod {
        DAY
        WEEK
        MONTH
    }

    enum TransactionType {
        BUY
        RENT
    }

    type Query {
        # Get all products the user has sold
        getSoldProductsByUserId(userId: String!): [Transaction!]!

        # Get all products the user has bought
        getBoughtProductsByUserId(userId: String!): [Transaction!]!

        # Get all products the user has lent out
        getLentProductsByUserId(userId: String!): [Transaction!]!

        # Get all products the user has borrowed
        getBorrowedProductsByUserId(userId: String!): [Transaction!]!
    }

    type Mutation {
        # Buy a product
        buyProduct(productId: String!): Transaction!

        # Rent a product
        rentProduct(
            productId: String!,
            rentTimeFrom: String!,
            rentTimeTo: String!): Transaction!
    }
`;
