import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useMutation } from "@apollo/client";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  Button,
  MultiSelect,
  NumberInput,
  Select,
  Textarea,
  TextInput,
  Title,
  Text,
  Stack,
  Group,
} from "@mantine/core";

import { CREATE_PRODUCT } from "../../graphql/product/mutations";
import { useAuth } from "../../shared/Hooks/useAuth";
import { IFormData } from "../../shared/TypeDefs";

const CreateProductPage = () => {
  const { user } = useAuth();
  const [addProduct, { loading }] = useMutation(CREATE_PRODUCT);
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const form = useForm<IFormData>({
    initialValues: {
      title: "",
      categories: [],
      description: "",
      purchasePrice: "",
      rentPrice: "",
      rentalPeriod: "DAY",
    },
    validate: {
      title: (value) => {
        if (!value.trim()) return "Title is required";
        if (value.trim().length < 3) return "Title must be at least 3 characters";
        if (value.trim().length > 100) return "Title must be less than 100 characters";
        return null;
      },
      categories: (value) => {
        if (!value || value.length === 0) return "At least one category is required";
        if (value.length > 5) return "Maximum 5 categories allowed";
        return null;
      },
      description: (value) => {
        if (!value.trim()) return "Description is required";
        if (value.trim().length < 10) return "Description must be at least 10 characters";
        if (value.trim().length > 1000) return "Description must be less than 1000 characters";
        return null;
      },
      purchasePrice: (value) => {
        if (value === "" || value === null || value === undefined)
          return "Purchase price is required";
        if (typeof value === "number" && value <= 0) return "Purchase price must be greater than 0";
        if (typeof value === "number" && value > 999999)
          return "Purchase price must be less than $999,999";
        return null;
      },
      rentPrice: (value) => {
        if (value === "" || value === null || value === undefined) return "Rent price is required";
        if (typeof value === "number" && value <= 0) return "Rent price must be greater than 0";
        if (typeof value === "number" && value > 999999)
          return "Rent price must be less than $999,999";
        return null;
      },
      rentalPeriod: (value) => {
        if (!value) return "Rental period is required";
        if (!["DAY", "WEEK", "MONTH"].includes(value)) return "Invalid rental period";
        return null;
      },
    },
  });

  const validateCurrentStep = () => {
    const stepFields = [
      ["title"],
      ["categories"],
      ["description"],
      ["purchasePrice", "rentPrice", "rentalPeriod"],
    ];

    const fieldsToValidate = stepFields[activeStep];
    let isValid = true;

    fieldsToValidate.forEach((field) => {
      const res = form.validateField(field as never);
      if (res.hasError) isValid = false;
      setTouchedFields((prev) => ({ ...prev, [field]: true }));
    });

    return isValid;
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Stack>
            <Title order={3}>Select a title for your product</Title>
            <TextInput
              placeholder="Enter product title"
              {...form.getInputProps("title")}
              error={touchedFields.title ? form.errors.title : undefined}
              onBlur={() => setTouchedFields((prev) => ({ ...prev, title: true }))}
              required
            />
          </Stack>
        );
      case 1:
        return (
          <Stack>
            <Title order={3}>Select categories</Title>
            <MultiSelect
              placeholder="Select categories"
              data={[
                "Electronics",
                "Furniture",
                "Home Appliances",
                "Sporting Goods",
                "Outdoor",
                "Toys",
              ]}
              {...form.getInputProps("categories")}
              error={touchedFields.categories ? form.errors.categories : undefined}
              onBlur={() => setTouchedFields((prev) => ({ ...prev, categories: true }))}
              required
            />
          </Stack>
        );
      case 2:
        return (
          <Stack>
            <Title order={3}>Provide a description</Title>
            <Textarea
              placeholder="Enter product description"
              {...form.getInputProps("description")}
              error={touchedFields.description ? form.errors.description : undefined}
              onBlur={() => setTouchedFields((prev) => ({ ...prev, description: true }))}
              minRows={6}
              autosize
              required
            />
          </Stack>
        );
      case 3:
        return (
          <Stack>
            <Title order={3}>Set pricing</Title>
            <NumberInput
              placeholder="Enter purchase price"
              label="Purchase Price"
              {...form.getInputProps("purchasePrice")}
              error={touchedFields.purchasePrice ? form.errors.purchasePrice : undefined}
              onBlur={() => setTouchedFields((prev) => ({ ...prev, purchasePrice: true }))}
              min={0.01}
              max={999999}
              decimalScale={2}
              fixedDecimalScale
              required
            />
            <Group gap="md">
              <NumberInput
                label="Rent Price"
                placeholder="$50"
                {...form.getInputProps("rentPrice")}
                error={touchedFields.rentPrice ? form.errors.rentPrice : undefined}
                onBlur={() => setTouchedFields((prev) => ({ ...prev, rentPrice: true }))}
                min={0.01}
                max={999999}
                decimalScale={2}
                fixedDecimalScale
                required
              />
              <Select
                label="Rent Period"
                placeholder="Select option"
                data={[
                  { value: "DAY", label: "Per Day" },
                  { value: "WEEK", label: "Per Week" },
                  { value: "MONTH", label: "Per Month" },
                ]}
                {...form.getInputProps("rentalPeriod")}
                error={touchedFields.rentalPeriod ? form.errors.rentalPeriod : undefined}
                onBlur={() => setTouchedFields((prev) => ({ ...prev, rentalPeriod: true }))}
                required
              />
            </Group>
          </Stack>
        );
      case 4:
        return (
          <Stack>
            <Title order={3}>Summary</Title>
            <Text>
              <strong>Title:</strong> {form.values.title}
            </Text>
            <Text>
              <strong>Categories:</strong> {form.values.categories.join(", ")}
            </Text>
            <Text>
              <strong>Description:</strong> {form.values.description}
            </Text>
            <Text>
              <strong>Price:</strong> ${form.values.purchasePrice}
            </Text>
            <Text>
              <strong>Rent:</strong> ${form.values.rentPrice} per{" "}
              {form.values.rentalPeriod.toLowerCase()}
            </Text>
          </Stack>
        );
      default:
        return null;
    }
  };

  const nextStep = () => {
    if (validateCurrentStep() && activeStep < 4) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = form.onSubmit(async (values) => {
    Object.keys(values).forEach((key) => setTouchedFields((prev) => ({ ...prev, [key]: true })));

    try {
      await addProduct({
        variables: {
          title: values.title.trim(),
          categories: values.categories.join(", "),
          description: values.description.trim(),
          purchasePrice: Number(values.purchasePrice),
          rentPrice: Number(values.rentPrice),
          rentalPeriod: values.rentalPeriod,
          ownerId: user?.id,
        },
      });
      notifications.show({
        title: "Product created",
        message: "Your product has been successfully created",
        color: "green",
      });
      navigate("/my-products");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      notifications.show({
        title: "Error",
        message: err.message || "An error occurred while creating the product",
        color: "red",
      });
      console.error("Error creating product:", err);
    }
  });

  return (
    <div className="min-h-screen py-10 bg-gray-100">
      <div className="w-full max-w-md mx-auto p-6 bg-white rounded-md shadow-lg">
        <Stack>{renderStepContent()}</Stack>
        <Group justify="space-between" mt="md">
          <Button onClick={prevStep} disabled={activeStep === 0} color="violet">
            Back
          </Button>
          {activeStep === 4 ? (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            <Button onClick={handleSubmit as any} color="violet" loading={loading}>
              Submit
            </Button>
          ) : (
            <Button onClick={nextStep} color="violet">
              Next
            </Button>
          )}
        </Group>
      </div>
    </div>
  );
};

export default CreateProductPage;
