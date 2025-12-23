import {
  IContextType,
  ILoginUserPayload,
  IRegisterUserPayload,
} from "../../lib/types";
import UserService from "../../services/user.service";

const queries = {
  getCurrentUser: async (_: unknown, __: unknown, context: IContextType) => {
    if (context && context.user) {
      const id = context.user.id;
      const user = await UserService.getUserById(id);
      return user;
    }
  },
};

const mutations = {
  registerUser: async (_: unknown, payload: IRegisterUserPayload) => {
    const res = await UserService.registerUser(payload);

    return res.id;
  },

  loginUser: async (_: unknown, payload: ILoginUserPayload) => {
    const token = await UserService.loginUser(payload);

    return token;
  },
};

export const resolvers = {
  queries,
  mutations,
};
