import { Prisma, PrismaClient } from "@prisma/client";
import { IProductPayload } from "../lib/types";

const prisma = new PrismaClient();

export class ProductService {
  private static validateProductData(data: Partial<IProductPayload>) {
    const errors: string[] = [];

    if (data.title !== undefined) {
      if (!data.title || !data.title.trim()) {
        errors.push("Title is required");
      } else if (data.title.trim().length < 3) {
        errors.push("Title must be at least 3 characters");
      } else if (data.title.trim().length > 100) {
        errors.push("Title must be less than 100 characters");
      }
    }

    if (data.description !== undefined) {
      if (!data.description || !data.description.trim()) {
        errors.push("Description is required");
      } else if (data.description.trim().length < 10) {
        errors.push("Description must be at least 10 characters");
      } else if (data.description.trim().length > 1000) {
        errors.push("Description must be less than 1000 characters");
      }
    }

    if (data.categories !== undefined) {
      if (!data.categories || !data.categories.trim()) {
        errors.push("At least one category is required");
      }
    }

    if (data.purchasePrice !== undefined) {
      if (
        data.purchasePrice === null ||
        data.purchasePrice === undefined ||
        data.purchasePrice <= 0
      ) {
        errors.push("Purchase price must be greater than 0");
      } else if (data.purchasePrice > 999999) {
        errors.push("Purchase price must be less than $999,999");
      }
    }

    if (data.rentPrice !== undefined) {
      if (
        data.rentPrice === null ||
        data.rentPrice === undefined ||
        data.rentPrice <= 0
      ) {
        errors.push("Rent price must be greater than 0");
      } else if (data.rentPrice > 999999) {
        errors.push("Rent price must be less than $999,999");
      }
    }

    return errors;
  }

  public static async addProduct(data: IProductPayload) {
    try {
      const validationErrors = this.validateProductData(data);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(", ")}`);
      }

      const sanitizedData = {
        ...data,
        title: data.title?.trim(),
        description: data.description?.trim(),
        categories: data.categories?.trim(),
      };

      const product = await prisma.product.create({
        data: sanitizedData,
      });
      return product;
    } catch (error) {
      console.error("Error creating product:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while creating the product."
      );
    }
  }

  public static async getAllProducts(
    page: number,
    limit: number,
    searchTerm?: string,
    categoryFilter?: string
  ) {
    try {
      const skip = (page - 1) * limit;

      const where: any = {
        ...(searchTerm && {
          title: {
            contains: searchTerm,
            mode: "insensitive",
          },
        }),
        ...(categoryFilter && {
          categories: {
            equals: categoryFilter,
            mode: "insensitive",
          },
        }),
      };

      const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            transactions: true,
          },
        }),
        prisma.product.count({ where }),
      ]);

      return { products, totalCount };
    } catch (error) {
      console.error("Error fetching products:", error);
      throw new Error(
        error instanceof Error
          ? `Fetching products failed: ${error.message}`
          : "An unexpected error occurred"
      );
    }
  }


  public static async getProductById(id: string) {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          transactions: true,
        },
      });

      if (!product) throw new Error("Product not found");

      return product;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw new Error(
        error instanceof Error
          ? `Fetching product failed: ${error.message}`
          : "An unexpected error occurred while fetching the product."
      );
    }
  }

  public static async editProduct(id: string, data: Partial<IProductPayload>) {
    try {
      const validationErrors = this.validateProductData(data);
      if (validationErrors.length > 0) {
        throw new Error(`Validation failed: ${validationErrors.join(", ")}`);
      }

      const sanitizedData = Object.fromEntries(
        Object.entries(data)
          .filter(([_, value]) => value !== undefined && value !== null)
          .map(([key, value]) => {
            if (
              key === "title" ||
              key === "description" ||
              key === "categories"
            ) {
              return [key, typeof value === "string" ? value.trim() : value];
            }
            return [key, value];
          })
      );

      const updatedProduct = await prisma.product.update({
        where: { id },
        data: sanitizedData,
      });
      return updatedProduct;
    } catch (error) {
      console.error("Error updating product:", error);
      throw new Error(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while updating the product."
      );
    }
  }

  public static async deleteProduct(id: string) {
    try {
      return await prisma.product.delete({
        where: { id },
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
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      throw new Error(
        error instanceof Error
          ? `Deleting product failed: ${error.message}`
          : "An unexpected error occurred while deleting the product."
      );
    }
  }

  public static async getProductsByUser(ownerId: string) {
    try {
      return await prisma.product.findMany({
        where: { ownerId },
        include: {
          transactions: true,
          owner: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      console.error("Error fetching user's products:", error);
      throw new Error(
        error instanceof Error
          ? `Fetching user's products failed: ${error.message}`
          : "An unexpected error occurred while fetching the user's products."
      );
    }
  }

  public static async incrementViews(id: string) {
    try {
      const product = await prisma.product.update({
        where: { id },
        data: {
          viewCount: {
            increment: 1,
          },
        },
      });
      return product;
    } catch (error) {
      console.error("Error incrementing product viewCount:", error);
      throw new Error(
        error instanceof Error
          ? `Incrementing product viewCount failed: ${error.message}`
          : "An unexpected error occurred while incrementing the product viewCount."
      );
    }
  }
}

export default ProductService;
