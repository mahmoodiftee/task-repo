import { IContextType } from "../../lib/types";
import { TransactionService } from "../../services/transaction.service";

const queries = {
  // Get all products the user has sold
  getSoldProductsByUserId: async (
    _: unknown,
    args: { userId: string },
    context: IContextType
  ) => {
    if (!context || !context.user) throw new Error("Unauthorized");
    return TransactionService.getSoldProductsByUserId(args.userId);
  },

  // Get all products the user has bought
  getBoughtProductsByUserId: async (
    _: unknown,
    args: { userId: string },
    context: IContextType
  ) => {
    if (!context || !context.user) throw new Error("Unauthorized");
    return TransactionService.getBoughtProductsByUserId(args.userId);
  },

  // Get all products the user has lent out
  getLentProductsByUserId: async (
    _: unknown,
    args: { userId: string },
    context: IContextType
  ) => {
    if (!context || !context.user) throw new Error("Unauthorized");
    return TransactionService.getLentProductsByUserId(args.userId);
  },

  // Get all products the user has borrowed
  getBorrowedProductsByUserId: async (
    _: unknown,
    args: { userId: string },
    context: IContextType
  ) => {
    if (!context || !context.user) throw new Error("Unauthorized");
    return TransactionService.getBorrowedProductsByUserId(args.userId);
  },
};

const mutations = {
  buyProduct: async (
    _: unknown,
    args: { productId: string },
    context: IContextType
  ) => {
    if (!context || !context.user) throw new Error("Unauthorized");
    return TransactionService.buyProduct(context.user.id, args.productId);
  },
  rentProduct: async (
    _: unknown,
    args: { productId: string, rentTimeFrom: Date, rentTimeTo: Date },
    context: IContextType
  ) => {
    if (!context || !context.user) throw new Error("Unauthorized")
    return TransactionService.rentProduct(context.user.id, args.productId, new Date(args.rentTimeFrom), new Date(args.rentTimeTo))
  },
};

export const resolvers = {
  queries,
  mutations,
};
