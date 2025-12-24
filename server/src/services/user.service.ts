import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import { prismaClient } from "../lib/db";
import { IRegisterUserPayload, ILoginUserPayload } from "../lib/types";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

class UserService {
  private static async getUserByEmail(email: string) {
    try {
      return await prismaClient.user.findUnique({
        where: { email },
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Database query failed:", error.message);
        throw new Error("Internal server error. Please try again later.");
      }
      throw new Error(
        "An unexpected error occurred during the database query."
      );
    }
  }

  public static getUserById(id: string) {
    return prismaClient.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        address: true,
        email: true,
        phoneNumber: true,
      },
    });
  }

  public static decodeJWTToken(token: string) {
    try {
      return JWT.verify(token, JWT_SECRET);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error decoding JWT token:", error.message);
        throw new Error("Invalid token. Please log in again.");
      }
      throw new Error("An unexpected error occurred during token decoding.");
    }
  }

  public static async registerUser(payload: IRegisterUserPayload) {
    const { firstName, lastName, address, email, phoneNumber, password } =
      payload;

    try {
      const existingUser = await this.getUserByEmail(email);

      if (existingUser) throw new Error("User with this email already exists.");

      if (
        password.length < 8 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/[0-9]/.test(password) ||
        !/[!@#$%^&*]/.test(password)
      ) {
        throw new Error(
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prismaClient.user.create({
        data: {
          firstName,
          lastName: lastName || null,
          address: address || null,
          email,
          phoneNumber: phoneNumber || null,
          password: hashedPassword,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          address: true,
          email: true,
          phoneNumber: true,
        },
      });

      return user;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error creating user:", error.message);
        throw new Error(error.message);
      }
      throw new Error("An unexpected error occurred during registration.");
    }
  }

  public static async loginUser(payload: ILoginUserPayload) {
    const { email, password } = payload;
    const user = await this.getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("Invalid email or password.");
    }
    const accessToken = JWT.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "15m" }
    );
    const refreshToken = JWT.sign(
      { id: user.id },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" }
    );

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await prismaClient.user.update({
      where: { id: user.id },
      data: { refreshToken: hashedRefreshToken }
    });
    return { accessToken, refreshToken };
  }

  public static async refreshUserToken(incomingRefreshToken: string) {
    try {
      const decoded = JWT.verify(incomingRefreshToken, process.env.JWT_SECRET!) as { id: string };

      const user = await prismaClient.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user || !user.refreshToken) throw new Error("Invalid request");
      const isValid = await bcrypt.compare(incomingRefreshToken, user.refreshToken);
      if (!isValid) throw new Error("Invalid refresh token");
      const newAccessToken = JWT.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "15m" }
      );
      return newAccessToken;
    } catch (e) { throw new Error("Invalid or expired refresh token"); }
  }

}

export default UserService;
