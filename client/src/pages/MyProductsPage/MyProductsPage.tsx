import { useMutation, useQuery } from "@apollo/client";
import { Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Link } from "react-router-dom";
import ErrorMessage from "../../shared/Components/ErrorMessage";
import Loading from "../../shared/Components/Loader";
import ProductCard from "../../shared/Components/ProductCard";
import { DELETE_PRODUCT } from "../../graphql/product/mutations";
import { GET_PRODUCTS_BY_USER_ID } from "../../graphql/product/queries";
import { useAuth } from "../../shared/Hooks/useAuth";
import { IProduct } from "../../shared/TypeDefs";

const MyProductsPage = () => {
  const { user } = useAuth();

  const [deleteProduct] = useMutation(DELETE_PRODUCT);

  const { data, loading, error } = useQuery(GET_PRODUCTS_BY_USER_ID, {
    variables: { ownerId: user?.id },
    skip: !user,
  });

  const products = data?.getProductsByUserId || [];

  const handleDelete = async (productId: string) => {
    try {
      await deleteProduct({
        variables: { id: productId },
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      notifications.show({
        title: "Error deleting product",
        message: "An error occurred while deleting the product",
        color: "red",
      });
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage errorMessage={error.message} />;

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h2 className="font-bold text-3xl text-gray-800">Your Products</h2>
        </div>

        {products.length > 0 ? (
          <div className="w-2/3 mx-auto grid grid-cols-1 gap-6">
            {products.map((product: IProduct) => (
              <ProductCard
                key={product.id}
                product={product}
                onDelete={handleDelete}
                isOwnProduct
                showDateAndViews
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">You have not added any products yet.</p>
        )}

        <div className="w-2/3 mx-auto flex justify-end mt-10">
          <Button className="bg-[#6558F5] hover:bg-[#4D3DD9]">
            <Link to="/product/new">Add Product</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MyProductsPage;
