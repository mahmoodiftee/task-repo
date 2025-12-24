import { createContext, useState } from "react";

import { useQuery } from "@apollo/client";

import { GET_CURRENT_LOGGED_IN_USER } from "../../graphql/user/queries";
import { IUser, IAuthContextType, IAuthProviderProps } from "../../shared/TypeDefs";
import client from "../../apollo/apolloClient";

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: IAuthProviderProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(!!localStorage.getItem("token"));

  const token = localStorage.getItem("token");

  const { refetch } = useQuery(GET_CURRENT_LOGGED_IN_USER, {
    skip: !token,
    onCompleted: (data) => {
      setUser(data?.getCurrentUser || null);
      setLoading(false);
    },
    onError: () => {
      setUser(null);
      setLoading(false);
    },
    fetchPolicy: "network-only",
  });

  const login = (userData: { accessToken: string; refreshToken: string }) => {
    localStorage.setItem("token", userData.accessToken);
    localStorage.setItem("refreshToken", userData.refreshToken);
    client.clearStore().then(() => {
      refetch();
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    client.clearStore().then(() => {
      client.resetStore();
      setUser(null);
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
