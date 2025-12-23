import { useState } from "react";
import { useParams } from "react-router-dom";

import { Button, Title, Text, Loader, Alert, Group } from "@mantine/core";

import BuyModal from "../../shared/Components/BuyModal";
import RentModal from "../../shared/Components/RentModal";
import { useProduct } from "../../shared/Hooks/useProduct";

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isRentModalOpen, setIsRentModalOpen] = useState(false);

  const { product, loading, error } = useProduct(id!, true);

  const handleBuy = () => {
    console.log("Buy logic to be implemented");
    setIsBuyModalOpen(false);
  };

  const handleRent = () => {
    console.log("Rent logic to be implemented");
    setIsRentModalOpen(false);
  };

  if (loading) return <Loader size="xl" className="mx-auto mt-12" />;

  if (!id || !product || error) {
    return (
      <Alert color="red" className="mt-12 text-center">
        Something went wrong
      </Alert>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-12 p-8 bg-white shadow-lg rounded-lg">
      <Title order={1} className="mb-6">
        {product.title}
      </Title>

      {product.owner && (
        <Text size="lg" className="mb-sm">
          <strong>Owner:</strong> {product.owner.firstName} {product.owner.lastName}
        </Text>
      )}

      <Text size="lg" className="mb-sm">
        <strong>Categories:</strong> {product.categories}
      </Text>

      <Text size="lg" className="mb-sm">
        <strong>Purchase Price:</strong> ${product.purchasePrice}
      </Text>

      <Text size="lg" className="mb-sm">
        <strong>Rent Price:</strong> ${product.rentPrice} per {product.rentalPeriod?.toLowerCase()}
      </Text>

      <Text size="lg" className="mb-sm">
        <strong>Views:</strong> {product.viewCount}
      </Text>

      <Text className="mb-6">{product.description}</Text>

      <Group justify="flex-end" gap="md">
        <Button color="violet" size="lg" onClick={() => setIsRentModalOpen(true)}>
          Rent for ${product.rentPrice}
        </Button>
        <Button color="violet" size="lg" onClick={() => setIsBuyModalOpen(true)}>
          Buy for ${product.purchasePrice}
        </Button>
      </Group>

      <BuyModal
        opened={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        onConfirm={handleBuy}
        productId={product.id}
        productTitle={product.title}
        productPrice={product.purchasePrice}
      />

      <RentModal
        opened={isRentModalOpen}
        onClose={() => setIsRentModalOpen(false)}
        onConfirm={handleRent}
        productId={product.id}
        rentPrice={product.rentPrice}
        rentalPeriod={product.rentalPeriod}
        productTitle={product.title}
      />
    </div>
  );
};

export default ProductDetailsPage;
