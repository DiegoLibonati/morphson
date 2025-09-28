import express from "express";

import routes from "@src/routes";

import { notFoundHandler } from "@src/middlewares/not_found_handler.middleware";
import { errorHandler } from "@src/middlewares/error_handler.middleware";

const app: express.Application = express();

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Routes
app.use("/api/v1", routes);
app.use("/api/v1/alive", (_, res) => {
  res.status(200).json({
    author: "Diego Libonati",
    name: "JSON-Transformer-API",
    version: "1.1.0",
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
