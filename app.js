const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const { handleErrors, currentUser } = require("./middleware");
const { NotFoundError } = require("./errors");

const { authRouter } = require("./api/auth");

const app = express();

/**
 * Middleware
 */
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(currentUser);

/**
 * Routers
 */
app.use("/auth", authRouter);
// app.use("/posts", postsRouter);

/**
 * Not Found Catchall
 */
app.all("*", (req) => {
  throw NotFoundError(`${req.method} ${req.url}: Route not found`);
});

/**
 * Error Handling
 */
app.use(handleErrors);

module.exports = app;
