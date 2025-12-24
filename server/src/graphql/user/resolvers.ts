import {
  IContextType,
  ILoginUserPayload,
  IRegisterUserPayload,
} from "../../lib/types";
import { GraphQLError } from "graphql";
import UserService from "../../services/user.service";

const queries = {
  getCurrentUser: async (_: unknown, __: unknown, context: IContextType) => {
    if (context && context.user) {
      const id = context.user.id;
      const user = await UserService.getUserById(id);
      return user;
    }
    throw new GraphQLError('Unauthorized', {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    });
  },
};

const mutations = {
  registerUser: async (_: unknown, payload: IRegisterUserPayload) => {
    const res = await UserService.registerUser(payload);

    return res.id;
  },

  loginUser: async (_: unknown, payload: ILoginUserPayload) => {
    const result = await UserService.loginUser(payload);
    return result;
  },

  refreshToken: async (_: unknown, { token }: { token: string }) => {
    return await UserService.refreshUserToken(token);
  },
};

export const resolvers = {
  queries,
  mutations,
};
