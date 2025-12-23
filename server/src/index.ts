require("dotenv").config();
import cors from "cors";
import express from "express";

import { expressMiddleware } from "@apollo/server/express4";

import createApolloGraphqlServer from "./graphql";
import UserService from "./services/user.service";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 8000;

  app.use(express.json());
  app.use(cors());

  app.get("/", (req, res) => {
    res.json({ message: "Server is running! 🥳" });
  });

  app.use(
    "/graphql",
    expressMiddleware(await createApolloGraphqlServer(), {
      context: async ({ req }) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
          return { user: null };
        }

        const token = authHeader.replace("Bearer ", "");

        try {
          const user = await UserService.decodeJWTToken(token);
          return { user };
        } catch (error) {
          console.error("Error decoding JWT token:", error);
          return { user: null };
        }
      },
    })
  );
  console.log("PORT", PORT);
  console.log("process", process.env.PORT);

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startServer();
