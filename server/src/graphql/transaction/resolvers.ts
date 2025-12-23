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

export const resolvers = {
  queries,
};
