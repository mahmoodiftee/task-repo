import { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import { ApolloProvider } from "@apollo/client";
import { Notifications } from "@mantine/notifications";
import { MantineProvider } from "@mantine/core";

import client from "./apollo/apolloClient.ts";
import Loader from "./shared/Components/Loader";
import { AuthProvider } from "./shared/Providers/AuthProvider.tsx";
import { router } from "./routes/Routes.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={client}>
    <MantineProvider>
      <Notifications />
      <AuthProvider>
        <Suspense fallback={<Loader />}>
          <RouterProvider router={router} />
        </Suspense>
      </AuthProvider>
    </MantineProvider>
  </ApolloProvider>,
);
