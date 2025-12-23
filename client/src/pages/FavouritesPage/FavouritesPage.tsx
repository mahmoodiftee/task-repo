import { useMutation, useQuery } from "@apollo/client";
import { notifications } from "@mantine/notifications";
import ErrorMessage from "../../shared/Components/ErrorMessage";
import Loading from "../../shared/Components/Loader";
import ProductCard from "../../shared/Components/ProductCard";
import { useAuth } from "../../shared/Hooks/useAuth";
import { GET_FAVOURITES } from "../../graphql/product/queries";
import { DELETE_FAVOURITE_PRODUCT } from "../../graphql/product/mutations";

const FavouritesPage = () => {
    const { user } = useAuth();

    // Fetch favourites
    const { data, loading, error, refetch } = useQuery(GET_FAVOURITES, {
        skip: !user,
    });

    const favourites = data?.getFavouritesByUser || [];

    const [deleteFavourite, { loading: deleteLoading }] = useMutation(DELETE_FAVOURITE_PRODUCT);

    const handleDelete = async (productId: string) => {
        try {
            await deleteFavourite({ variables: { productId } });
            notifications.show({
                title: "Removed from favorites",
                message: "Product removed from favorites",
                color: "blue",
            });
            refetch();
        } catch (err: any) {
            notifications.show({
                title: "Error",
                message: err.message || "Failed to remove favorite",
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
                    <h2 className="font-bold text-3xl text-gray-800">Your Favourites</h2>
                </div>

                {favourites.length > 0 ? (
                    <div className="w-2/3 mx-auto grid grid-cols-1 gap-6">
                        {favourites.map((fav: any) => (
                            <ProductCard
                                key={fav.id}
                                product={fav.product}
                                onFavourite={() => handleDelete(fav.productId)}
                                isFavourite={true}
                                showDateAndViews
                                deleteFavouriteLoading={deleteLoading}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-600">You have not added any products yet.</p>
                )}

            </div>
        </div>
    );
};

export default FavouritesPage;
