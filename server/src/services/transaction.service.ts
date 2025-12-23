import { PrismaClient, TransactionType } from "@prisma/client";

const prisma = new PrismaClient();

export class TransactionService {
  // Get all products the user has sold
  public static async getSoldProductsByUserId(userId: string) {
    return prisma.transaction.findMany({
      where: {
        product: { ownerId: userId },
        transactionType: TransactionType.BUY,
      },
      include: {
        product: {
          include: {
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  public static async getBoughtProductsByUserId(userId: string) {
    return prisma.transaction.findMany({
      where: { customerId: userId, transactionType: TransactionType.BUY },
      include: {
        product: {
          include: {
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  public static async getLentProductsByUserId(userId: string) {
    return prisma.transaction.findMany({
      where: {
        product: { ownerId: userId },
        transactionType: TransactionType.RENT,
      },
      include: {
        product: {
          include: {
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  public static async getBorrowedProductsByUserId(userId: string) {
    return prisma.transaction.findMany({
      where: { customerId: userId, transactionType: TransactionType.RENT },
      include: {
        product: {
          include: {
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        customer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  }

  public static async buyProduct() {
    console.log("To be implemented");
  }

  public static async rentProduct() {
    console.log("To be implemented");
  }
}

export default TransactionService;
