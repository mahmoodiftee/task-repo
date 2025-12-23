import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Pagination, TextInput, Select, Group } from "@mantine/core";
import ErrorMessage from "../../shared/Components/ErrorMessage";
import Loading from "../../shared/Components/Loader";
import ProductCard from "../../shared/Components/ProductCard";
import { GET_ALL_PRODUCTS, GET_FAVOURITES } from "../../graphql/product/queries";
import { IProduct } from "../../shared/TypeDefs";
import { useAuth } from "../../shared/Hooks/useAuth";
import { notifications } from "@mantine/notifications";
import { useSearchParams } from "react-router-dom";
import { CREATE_FAVOURITE_PRODUCT, DELETE_FAVOURITE_PRODUCT } from "../../graphql/product/mutations";

const AllProductsPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
  const [activePage, setActivePage] = useState(pageFromUrl);
  const [favouriteProducts, setFavouriteProducts] = useState<Set<string>>(new Set());
  const limit = 3;

  const { data, loading, error } = useQuery(GET_ALL_PRODUCTS, {
    variables: {
      page: activePage,
      limit,
      searchTerm: searchTerm || null,
      categoryFilter: categoryFilter || null,
    },
  });

  const products: IProduct[] = data?.getAllProducts.products || [];
  const totalCount: number = data?.getAllProducts.totalCount || 0;
  const totalPages = Math.ceil(totalCount / limit);

  const handlePageChange = (page: number) => {
    setActivePage(page);
    setSearchParams({ page: page.toString() });
  };

  useEffect(() => {
    setActivePage(1);
    setSearchParams({ page: "1" });
  }, [searchTerm, categoryFilter]);

  useEffect(() => {
    if (totalPages > 0 && activePage > totalPages) {
      handlePageChange(totalPages);
    }
  }, [totalPages, activePage]);

  const [createFavourite, { loading: favouriteLoading }] = useMutation(CREATE_FAVOURITE_PRODUCT);
  const [deleteFavourite, { loading: deleteFavouriteLoading }] = useMutation(DELETE_FAVOURITE_PRODUCT);

  const { data: favouritesData } = useQuery(GET_FAVOURITES, {
    skip: !user,
  });

  useEffect(() => {
    if (favouritesData?.getFavouritesByUser) {
      const favoriteIds = new Set<string>(
        favouritesData.getFavouritesByUser.map((fav: any) => fav.productId)
      );
      setFavouriteProducts(favoriteIds);
    }
  }, [favouritesData]);

  const handleFavourite = async (productId: string) => {
    const isFavourited = favouriteProducts.has(productId);

    setFavouriteProducts(prev => {
      const newSet = new Set(prev);
      if (isFavourited) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });

    try {
      if (favouriteProducts.has(productId)) {
        await deleteFavourite({ variables: { productId } });
        notifications.show({ title: "Removed from favorites", message: "Product removed", color: "blue" });
      } else {
        await createFavourite({ variables: { productId } });
        notifications.show({ title: "Added to favorites", message: "Product added", color: "green" });
      }
    } catch (err: any) {
      notifications.show({ title: "Error", message: err.message || "Failed to update favorite", color: "red" });
      setFavouriteProducts(prev => {
        const newSet = new Set(prev);
        if (newSet.has(productId)) newSet.delete(productId);
        else newSet.add(productId);
        return newSet;
      });
    }
  };

  if (loading) return <Loading />;
  if (error || !user)
    return <ErrorMessage errorMessage={error?.message || "Something went wrong!"} />;

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="font-bold text-3xl text-center mb-8 text-gray-800">All Products</h2>
        <Group justify="center" align="center" gap="md">
          <TextInput
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.currentTarget.value)}
          />
          <Select
            placeholder="Filter by Category"
            data={[
              "Electronics",
              "Games",
              "Sports",
              "Beauty",
              "Shoes",
              "Toys",
              "Computers",
              "Garden",
              "Outdoors",
              "Kids",
              "Automotive",
              "Books",
              "Movies"
            ]}
            value={categoryFilter}
            onChange={setCategoryFilter}
            clearable
            style={{ width: 200 }}
          />
        </Group>
        <div className="my-10">
          {products.length > 0 ? (
            <>
              <div className="w-2/3 mx-auto grid grid-cols-1 gap-6">
                {products.map((product: IProduct) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onFavourite={product.owner.id !== user?.id ? () => handleFavourite(product.id) : undefined}
                    isFavourite={favouriteProducts.has(product.id)}
                    favouriteLoading={favouriteLoading}
                    deleteFavouriteLoading={deleteFavouriteLoading}
                  />
                ))}
              </div>
              {totalPages > 0 ? (
                <div className="mt-8 flex justify-center">
                  <Pagination value={activePage} onChange={handlePageChange} total={totalPages} />
                </div>
              ) : (
                <p className="text-center text-gray-600">No products available at the moment.</p>
              )}
            </>
          ) : (
            <p className="text-center text-gray-600">No products available at the moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllProductsPage;