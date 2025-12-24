import { ApolloClient, createHttpLink, InMemoryCache, from, Observable } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { setContext } from "@apollo/client/link/context";
import { REFRESH_TOKEN } from "../graphql/user/mutations";

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URL,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return { headers };
  }
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions?.code === 'UNAUTHENTICATED' || err.message === 'Unauthorized') {
        return new Observable((observer) => {
          const refreshToken = localStorage.getItem('refreshToken');

          if (!refreshToken) {
            observer.error(err);
            return;
          }

          client.mutate({
            mutation: REFRESH_TOKEN,
            variables: { token: refreshToken },
          })
            .then((response) => {
              const newAccessToken = response.data?.refreshToken;
              if (newAccessToken) {
                localStorage.setItem('token', newAccessToken);

                const oldHeaders = operation.getContext().headers;
                operation.setContext({
                  headers: {
                    ...oldHeaders,
                    authorization: `Bearer ${newAccessToken}`,
                  },
                });

                // Retry the operation
                const subscriber = {
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer),
                };

                forward(operation).subscribe(subscriber);
              } else {
                observer.error(err);
              }
            })
            .catch((error) => {
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              client.resetStore();
              observer.error(error);
            });
        });
      }
    }
  }
});

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
