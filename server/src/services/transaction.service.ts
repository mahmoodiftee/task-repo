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

  public static async buyProduct(userId: string, productId: string) {
    console.log("To be implemented");
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    if (product.ownerId === userId) {
      throw new Error("Cannot buy your own product");
    }

    return await prisma.transaction.create({
      data: {
        customerId: userId,
        productId: productId,
        rentTimeFrom: new Date(),
        rentTimeTo: new Date(),
        transactionType: TransactionType.BUY,
      },
      include: { product: true, customer: true }
    })

  }

  public static async rentProduct(userId: string, productId: string, rentTimeFrom: Date, rentTimeTo: Date) {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
    if (!userId) throw new Error("User not found");
    if (!product) throw new Error("Product not found");
    if (product!.ownerId === userId) throw new Error("Cannot Rent your own product");

    return await prisma.transaction.create({
      data: {
        customerId: userId,
        productId: productId,
        rentTimeFrom: rentTimeFrom,
        rentTimeTo: rentTimeTo,
        transactionType: TransactionType.RENT,
      },
      include: { product: true, customer: true }
    })
  }
}

export default TransactionService;
