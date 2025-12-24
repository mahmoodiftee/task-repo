export interface IProductPayload {
  title?: string;
  categories?: string;
  description?: string;
  purchasePrice?: number;
  rentPrice?: number;
  ownerId: string;
}

export interface IRegisterUserPayload {
  firstName: string;
  lastName?: string;
  address?: string;
  email: string;
  phoneNumber?: string;
  password: string;
}

export interface ILoginUserPayload {
  email: string;
  password: string;
}

export interface IContextType {
  user?: {
    id: string;
    role: string;
  };
  token?: string;
}