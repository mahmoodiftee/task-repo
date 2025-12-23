import { ReactNode } from "react";

export interface IFormValues {
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export interface IProduct {
  id: string;
  title: string;
  categories: string;
  description: string;
  purchasePrice: number;
  rentPrice: number;
  rentalPeriod: string;
  viewCount?: number;
  createdAt?: string;
  ownerId: string;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface ITransaction {
  id: string;
  product: IProduct;
  customer: {
    id: string;
    email: string;
  };
  transactionType: string;
  createdAt: string;
}

export interface IBuyModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productId: string;
  productTitle: string;
  productPrice: number;
}

export interface IProductCardProps {
  product: {
    id: string;
    title: string;
    categories: string;
    description: string;
    purchasePrice: number;
    rentPrice: number;
    rentalPeriod: string;
    viewCount?: number;
    createdAt?: string;
    owner: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  onFavourite?: (productId: string) => void;
  isFavourite?: boolean;
  favouriteLoading?: boolean;
  deleteFavouriteLoading?: boolean;
  onDelete?: (productId: string) => void;
  isOwnProduct?: boolean;
  showDateAndViews?: boolean;
}

export interface IRentModalProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: (startDate: Date, endDate: Date) => void;
  productId: string;
  productTitle?: string;
  rentPrice: number;
  rentalPeriod?: string;
}

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  phoneNumber: string;
}

export interface IAuthContextType {
  user: IUser | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

export interface IAuthProviderProps {
  children: ReactNode;
}

export interface IFormData {
  title: string;
  categories: string[];
  description: string;
  purchasePrice: string;
  rentPrice: string;
  rentalPeriod: string;
}
