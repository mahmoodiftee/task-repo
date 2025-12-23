import { useQuery } from "@apollo/client";
import { Tabs, Loader, Text } from "@mantine/core";
import {
  GET_BORROWED_PRODUCTS_BY_USER_ID,
  GET_BOUGHT_PRODUCTS_BY_USER_ID,
  GET_LENT_PRODUCTS_BY_USER_ID,
  GET_SOLD_PRODUCTS_BY_USER_ID,
} from "../../graphql/transaction/queries";
import { useAuth } from "../../shared/Hooks/useAuth";
import { ITransaction } from "../../shared/TypeDefs";
import ProductCard from "../../shared/Components/ProductCard";

const TransactionHistoryPage = () => {
  const { user } = useAuth();

  const { data: soldData, loading: soldLoading } = useQuery(GET_SOLD_PRODUCTS_BY_USER_ID, {
    variables: { userId: user?.id },
    skip: !user?.id,
  });

  const { data: boughtData, loading: boughtLoading } = useQuery(GET_BOUGHT_PRODUCTS_BY_USER_ID, {
    variables: { userId: user?.id },
    skip: !user?.id,
  });

  const { data: lentData, loading: lentLoading } = useQuery(GET_LENT_PRODUCTS_BY_USER_ID, {
    variables: { userId: user?.id },
    skip: !user?.id,
  });

  const { data: borrowedData, loading: borrowedLoading } = useQuery(
    GET_BORROWED_PRODUCTS_BY_USER_ID,
    {
      variables: { userId: user?.id },
      skip: !user?.id,
    },
  );

  if (!user)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Text size="lg">Please log in to view your history</Text>
      </div>
    );

  const renderTransactions = (transactions: ITransaction[] | undefined, loading: boolean) => {
    if (loading) return <Loader size="xl" className="mx-auto mt-12" />;

    if (!transactions || transactions.length === 0)
      return <Text className="text-center mt-12">No transactions found.</Text>;

    return (
      <div className="w-2/3 mx-auto grid grid-cols-1 gap-6">
        {transactions.map((transaction: ITransaction) => (
          <ProductCard
            key={transaction.id}
            product={transaction.product}
            showDateAndViews={false}
          />
        ))}
      </div>
    );
  };

  return (
    <div>
      <Tabs defaultValue="bought" className="w-full mx-auto">
        <Tabs.List className="flex justify-evenly mb-4 border-b border-gray-300">
          <Tabs.Tab value="bought" color="#6558F5" className="text-lg font-medium w-1/4">
            Bought
          </Tabs.Tab>
          <Tabs.Tab value="sold" color="#6558F5" className="text-lg font-medium w-1/4">
            Sold
          </Tabs.Tab>
          <Tabs.Tab value="borrowed" color="#6558F5" className="text-lg font-medium w-1/4">
            Borrowed
          </Tabs.Tab>
          <Tabs.Tab value="lent" color="#6558F5" className="text-lg font-medium w-1/4">
            Lent
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="bought" pt="md">
          {renderTransactions(boughtData?.getBoughtProductsByUserId, boughtLoading)}
        </Tabs.Panel>

        <Tabs.Panel value="sold" pt="md">
          {renderTransactions(soldData?.getSoldProductsByUserId, soldLoading)}
        </Tabs.Panel>

        <Tabs.Panel value="borrowed" pt="md">
          {renderTransactions(borrowedData?.getBorrowedProductsByUserId, borrowedLoading)}
        </Tabs.Panel>

        <Tabs.Panel value="lent" pt="md">
          {renderTransactions(lentData?.getLentProductsByUserId, lentLoading)}
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

export default TransactionHistoryPage;
