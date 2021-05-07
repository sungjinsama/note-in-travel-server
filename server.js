require("dotenv").config();

const express = require("express");
const path = require("path");
const cors = require("cors");
const logger = require("morgan");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");

const db = require("./config/db");
const auth = require("./routes/auth");

const app = express();

app.use(logger("dev"));
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

db.init();

app.use("/auth", auth);

app.use((req, res, next) => {
  next(createError(404, "Not Found Page"));
});

app.use((err, req, res, next) => {
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.json({
    ok: false,
    error: { message: err.message },
  });
});

module.exports = app;