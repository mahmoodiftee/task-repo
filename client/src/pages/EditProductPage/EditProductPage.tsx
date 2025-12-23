import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useMutation } from "@apollo/client";
import {
  Button,
  MultiSelect,
  NumberInput,
  Select,
  Textarea,
  TextInput,
  Title,
  Loader,
  Alert,
  Stack,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { EDIT_PRODUCT } from "../../graphql/product/mutations";
import { useProduct } from "../../shared/Hooks/useProduct";
import { useAuth } from "../../shared/Hooks/useAuth";
import { IFormData } from "../../shared/TypeDefs";

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { product, loading, error } = useProduct(id!, false);

  const [editProduct, { loading: updateLoading }] = useMutation(EDIT_PRODUCT);

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

  useEffect(() => {
    if (product) {
      form.setValues({
        title: product.title,
        categories: product.categories.split(", "),
        description: product.description,
        purchasePrice: product.purchasePrice,
        rentPrice: product.rentPrice,
        rentalPeriod: product.rentalPeriod,
      });
    }
  }, [product]);

  const handleSubmit = form.onSubmit(async (values) => {
    try {
      await editProduct({
        variables: {
          id,
          title: values.title.trim(),
          categories: values.categories.join(", "),
          description: values.description.trim(),
          purchasePrice: Number(values.purchasePrice),
          rentPrice: Number(values.rentPrice),
          rentalPeriod: values.rentalPeriod,
        },
      });
      notifications.show({
        title: "Product updated",
        message: "Your product has been successfully updated",
        color: "green",
      });
      navigate("/my-products");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      notifications.show({
        title: "Error",
        message: err.message || "An error occurred while updating the product",
        color: "red",
      });
      console.error("Error updating product:", err);
    }
  });

  if (!id) {
    return (
      <Alert color="red" className="mt-12 text-center">
        Error: Invalid product ID
      </Alert>
    );
  }

  if (loading) return <Loader size="xl" className="mx-auto mt-12" />;

  if (error) {
    return (
      <Alert color="red" className="mt-12 text-center">
        Error loading product: {error.message}
      </Alert>
    );
  }

  if (!product) {
    return (
      <Alert color="red" className="mt-12 text-center">
        Product not found
      </Alert>
    );
  }

  // Check if the current user owns this product
  if (user?.id !== product.ownerId) {
    return (
      <Alert color="red" className="mt-12 text-center">
        You don't have permission to edit this product
      </Alert>
    );
  }

  return (
    <div className="min-h-screen py-10 bg-gray-100">
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-md shadow-lg">
        <Title order={2} className="mb-6 text-center">
          Edit Product
        </Title>

        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Product Title"
              placeholder="Enter product title"
              {...form.getInputProps("title")}
              required
            />

            <MultiSelect
              label="Categories"
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
              required
            />

            <Textarea
              label="Description"
              placeholder="Enter product description"
              {...form.getInputProps("description")}
              minRows={4}
              autosize
              required
            />

            <Group gap="md">
              <NumberInput
                label="Purchase Price"
                placeholder="Enter price (e.g., 1500)"
                {...form.getInputProps("purchasePrice")}
                min={0.01}
                max={999999}
                decimalScale={2}
                fixedDecimalScale
                required
              />

              <NumberInput
                label="Rent Price"
                placeholder="Enter rent price (e.g., 50)"
                {...form.getInputProps("rentPrice")}
                min={0.01}
                max={999999}
                decimalScale={2}
                fixedDecimalScale
                required
              />

              <Select
                label="Rent Period"
                placeholder="Select rent period"
                data={[
                  { value: "DAY", label: "Per Day" },
                  { value: "WEEK", label: "Per Week" },
                  { value: "MONTH", label: "Per Month" },
                ]}
                {...form.getInputProps("rentalPeriod")}
                required
              />
            </Group>

            <Group justify="space-between" mt="lg">
              <Button
                variant="outline"
                onClick={() => navigate("/my-products")}
                disabled={updateLoading}
              >
                Cancel
              </Button>
              <Button type="submit" color="violet" loading={updateLoading}>
                Update Product
              </Button>
            </Group>
          </Stack>
        </form>
      </div>
    </div>
  );
};

export default EditProductPage;
