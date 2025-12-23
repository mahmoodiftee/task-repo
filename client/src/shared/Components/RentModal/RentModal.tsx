/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { Button, Group, Modal, Text } from "@mantine/core";
import { DateInput } from "@mantine/dates";

import { IRentModalProps } from "../../TypeDefs";

const RentModal: React.FC<IRentModalProps> = ({
  opened,
  onClose,
  onConfirm,
  productId,
  productTitle,
  rentPrice,
  rentalPeriod,
}) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleClose = () => {
    setStartDate(null);
    setEndDate(null);
    onClose();
  };

  const handleConfirm = () => {
    alert("To be implemented.");
  };

  const duration =
    startDate && endDate ? Math.ceil((+endDate - +startDate) / (1000 * 60 * 60 * 24)) : 0;
  const totalCost = duration * (rentPrice || 0);

  return (
    <Modal opened={opened} onClose={handleClose} title="Rent Product" centered size="lg">
      <div className="space-y-4">
        {productTitle && <Text className="font-semibold">Product: {productTitle}</Text>}

        <div className="grid grid-cols-2 gap-4">
          <DateInput
            label="Start Date"
            value={startDate}
            onChange={setStartDate}
            minDate={new Date()}
            required
          />
          <DateInput
            label="End Date"
            value={endDate}
            onChange={setEndDate}
            minDate={startDate || new Date()}
            required
          />
        </div>

        {rentPrice && (
          <div className="space-y-2">
            <Text size="sm">
              <strong>Rental Price:</strong> ${rentPrice} per {rentalPeriod?.toLowerCase() || "day"}
            </Text>
            {duration > 0 && (
              <>
                <Text size="sm">
                  <strong>Duration:</strong> {duration} days
                </Text>
                <Text size="sm" className="font-semibold">
                  <strong>Total Cost:</strong> ${totalCost.toFixed(2)}
                </Text>
              </>
            )}
          </div>
        )}

        <Text size="sm" className="text-gray-600">
          Please select your desired rental period.
        </Text>
      </div>

      <Group className="mt-8 flex justify-end">
        <Button onClick={handleClose} className="bg-[#D3455B] hover:bg-[#D8374F]">
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!startDate || !endDate}
          className="bg-[#6558F5] hover:bg-[#4D3DD9]"
        >
          Confirm Rental
        </Button>
      </Group>
    </Modal>
  );
};

export default RentModal;
