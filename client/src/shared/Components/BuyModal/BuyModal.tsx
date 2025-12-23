/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { Button, Group, Modal, Text } from "@mantine/core";
import { IBuyModalProps } from "../../TypeDefs";

const BuyModal: React.FC<IBuyModalProps> = ({
  opened,
  onClose,
  onConfirm,
  productId,
  productTitle,
  productPrice,
}) => {
  const handleConfirm = () => {
    alert("To be implemented");
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Confirm Purchase" centered>
      <div className="space-y-3">
        <Text>Are you sure you want to buy this product?</Text>
        {productTitle && <Text fw={500}>Product: {productTitle}</Text>}
        {productPrice && <Text fw={500}>Price: ${productPrice}</Text>}
        <Text size="sm" c="dimmed">
          This action cannot be undone.
        </Text>
      </div>
      <Group mt="md" justify="flex-end">
        <Button color="red" onClick={onClose}>
          Cancel
        </Button>
        <Button color="indigo" onClick={handleConfirm}>
          Confirm Purchase
        </Button>
      </Group>
    </Modal>
  );
};

export default BuyModal;
