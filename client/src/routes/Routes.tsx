import { createBrowserRouter, Navigate } from "react-router-dom";

import CreateProductPage from "../pages/CreateProductPage";
import AllProductsPage from "../pages/AllProductsPage";
import EditProductPage from "../pages/EditProductPage";
import TransactionHistoryPage from "../pages/TransactionHistoryPage";
import LoginPage from "../pages/LoginPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import RegistrationPage from "../pages/RegistrationPage";
import MyProductsPage from "../pages/MyProductsPage";
import NotFoundPage from "../pages/NotFoundPage";

import PrivateRoute from "./PrivateRoute";
import FavouritesPage from "../pages/FavouritesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/registration",
    element: <RegistrationPage />,
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        children: [
          { path: "/my-products", element: <MyProductsPage /> },
          { path: "/favourites", element: <FavouritesPage /> },
          { path: "/product/new", element: <CreateProductPage /> },
          { path: "/product/:id/edit", element: <EditProductPage /> },
          { path: "/transaction-history", element: <TransactionHistoryPage /> },
          { path: "/product/:id", element: <ProductDetailsPage /> },
          { path: "/all-products", element: <AllProductsPage /> },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
