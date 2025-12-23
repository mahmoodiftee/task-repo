import { Link } from "react-router-dom";

import { useMutation } from "@apollo/client";
import { Button, PasswordInput, Title, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { REGISTER_USER } from "../../graphql/user/mutations";
import { IFormValues } from "../../shared/TypeDefs";

const RegistrationPage = () => {
  const [registerUser, { loading, error }] = useMutation(REGISTER_USER);

  const form = useForm<IFormValues>({
    initialValues: {
      firstName: "",
      lastName: "",
      address: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },

    validate: {
      firstName: (value) => (value.trim() ? null : "First name is required"),
      lastName: (value) => (value.trim() ? null : "Last name is required"),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email address"),
      phoneNumber: (value) => (value.trim() ? null : "Phone number is required"),
      password: (value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value)
          ? null
          : "Password must be at least 8 characters long, include 1 uppercase, 1 lowercase, 1 number, and 1 special character",
      confirmPassword: (value, values) =>
        value === values.password ? null : "Passwords do not match",
    },
  });

  const handleSubmit = async (values: IFormValues) => {
    try {
      await registerUser({
        variables: {
          email: values.email,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
          address: values.address,
          phoneNumber: values.phoneNumber,
        },
      });

      notifications.show({
        title: "Registration successful!",
        message: "You have successfully registered. Please login to continue.",
        color: "teal",
      });
    } catch (err) {
      notifications.show({
        title: "Registration failed",
        message: "An error occurred while registering. Please try again.",
        color: "red",
      });
      console.error("Error during registration:", err);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <form
        onSubmit={form.onSubmit(handleSubmit)}
        className="bg-white border border-gray-300 p-8 rounded-md shadow-lg w-full max-w-md"
      >
        <Stack>
          <Title order={2}>Sign Up</Title>

          <div className="flex gap-2">
            <TextInput placeholder="First Name" {...form.getInputProps("firstName")} />
            <TextInput placeholder="Last Name" {...form.getInputProps("lastName")} />
          </div>

          <TextInput placeholder="Address" {...form.getInputProps("address")} />

          <div className="flex gap-2">
            <TextInput placeholder="Email" {...form.getInputProps("email")} />
            <TextInput placeholder="Phone Number" {...form.getInputProps("phoneNumber")} />
          </div>

          <PasswordInput placeholder="Password" {...form.getInputProps("password")} />
          <PasswordInput
            placeholder="Confirm Password"
            {...form.getInputProps("confirmPassword")}
          />

          <Button type="submit" loading={loading} color="indigo" fullWidth>
            Sign Up
          </Button>

          {error && <Text color="red">Registration failed: {error.message}</Text>}

          <Text>
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-600 hover:underline">
              Log In
            </Link>
          </Text>
        </Stack>
      </form>
    </div>
  );
};

export default RegistrationPage;
