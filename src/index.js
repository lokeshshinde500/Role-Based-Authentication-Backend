import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import constant from "./config/constant.js";
import db from "./config/db.js";
import indexRoutes from "./routes/indexRoutes.js";

const app = express();
const port = constant.PORT;

// for cross origin connection
app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      callback(null, origin || true);
    },
  })
);

// for enable read cookies
app.use(cookieParser());

// for parse json / url encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// create server
app.listen(port, (error) => {
  if (error) {
    console.error("Server not connected!", error);
  } else {
    console.log(`Server running on Port ${port}.`);
    db();
  }
});

// api routing
app.use("/api", indexRoutes);
