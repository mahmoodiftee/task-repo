import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Button, Modal, Text, Title, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IProductCardProps } from "../../TypeDefs";

const ProductCard = ({
  product,
  onDelete,
  isOwnProduct = false,
  showDateAndViews = true,
}: IProductCardProps) => {
  const navigate = useNavigate();

  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = () => {
    if (!isOwnProduct) {
      navigate(`/product/${product.id}`);
    } else {
      navigate(`/product/${product.id}/edit`);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    setIsModalOpen(false);
    if (onDelete) {
      onDelete(product.id);
      notifications.show({
        title: "Product deleted",
        message: `${product.title} has been deleted successfully.`,
        color: "green",
      });
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
  };

  const toggleDescription = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowFullDescription((prev) => !prev);
  };

  return (
    <>
      <Modal opened={isModalOpen} onClose={cancelDelete} title="Delete Product" centered>
        <Text>Are you sure you want to delete this product?</Text>
        <Group justify="flex-end" mt="md" gap="sm">
          <Button color="red" onClick={cancelDelete}>
            No
          </Button>
          <Button color="violet" onClick={confirmDelete}>
            Yes
          </Button>
        </Group>
      </Modal>

      <div
        className="p-4 mb-4 border border-gray-200 shadow-sm bg-white cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex justify-between items-center">
          <Title order={4}>{product.title}</Title>
          {isOwnProduct && (
            <Button variant="subtle" color="red" onClick={handleDelete} leftSection={<FaTrash />} />
          )}
        </div>

        <Text size="sm" className="mt-2">
          Categories: {product.categories.split(", ").join(", ")}
        </Text>

        <Text size="sm" className="mt-2">
          Owner: {product.owner.firstName} {product.owner.lastName}
        </Text>

        <Text className="mt-2">
          {showFullDescription ? product.description : `${product.description.slice(0, 100)}...`}
          {product.description.length > 100 && (
            <Button variant="subtle" size="xs" color="blue" ml={4} onClick={toggleDescription}>
              {showFullDescription ? "Show Less" : "More Details"}
            </Button>
          )}
        </Text>

        {showDateAndViews && (
          <div className="flex justify-between items-center mt-4">
            <Text size="xs">
              Date posted:{" "}
              {product.createdAt &&
                new Intl.DateTimeFormat("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                }).format(new Date(parseInt(product.createdAt)))}
            </Text>
            <Text size="xs">Views: {product.viewCount}</Text>
          </div>
        )}
      </div>
    </>
  );
};

export default ProductCard;
