import { IContextType, IProductPayload } from '../../lib/types';
import { ProductService } from '../../services/product.service';

const queries = {
  // Get a single product by ID
  getProductById: async (
    _: unknown,
    args: { id: string },
    context: IContextType
  ) => {
    if (!context || !context.user) throw new Error('Unauthorized');
    return await ProductService.getProductById(args.id);
  },

  // Get all products
  getAllProducts: async (
    _: unknown,
    args: { page: number; limit: number; searchTerm?: string; categoryFilter?: string },
    context: IContextType
  ) => {
    if (!context || !context.user) throw new Error('Unauthorized');
    return await ProductService.getAllProducts(args.page, args.limit, args.searchTerm || '', args.categoryFilter || '');
  },

  // Get all products of the logged-in user
  getProductsByUserId: async (
    _: unknown,
    __: unknown,
    context: IContextType
  ) => {
    if (!context || !context.user) throw new Error('Unauthorized');
    const userId = context.user.id;
    return await ProductService.getProductsByUser(userId);
  },
};

const mutations = {
  // Create a new product
  addProduct: async (
    _: unknown,
    payload: IProductPayload,
    context: IContextType
  ) => {
    if (!context || !context.user) throw new Error('Unauthorized');
    const userId = context.user.id;
    const productData = { ...payload, ownerId: userId };
    const res = await ProductService.addProduct(productData);
    return res;
  },

  // Edit an existing product
  editProduct: async (
    _: unknown,
    args: { id: string } & Partial<IProductPayload>,
    context: IContextType
  ) => {
    if (!context || !context.user) throw new Error('Unauthorized');
    const userId = context.user.id;

    // Verify the product belongs to the logged-in user
    const product = await ProductService.getProductById(args.id);
    if (!product || product.ownerId !== userId) {
      throw new Error('Unauthorized or Product not found');
    }

    return await ProductService.editProduct(args.id, args);
  },

  // Delete a product
  deleteProduct: async (
    _: unknown,
    args: { id: string },
    context: IContextType
  ) => {
    if (!context || !context.user) throw new Error('Unauthorized');
    const userId = context.user.id;

    // Verify the product belongs to the logged-in user
    const product = await ProductService.getProductById(args.id);
    if (!product || product.ownerId !== userId) {
      throw new Error('Unauthorized or Product not found');
    }

    return await ProductService.deleteProduct(args.id);
  },

  // Increment the viewCount of a product
  incrementViews: async (
    _: unknown,
    args: { id: string },
    context: IContextType
  ) => {
    if (!context || !context.user) throw new Error('Unauthorized');
    return await ProductService.incrementViews(args.id);
  },
};

export const resolvers = {
  queries,
  mutations,
};
