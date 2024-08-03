import express from "express";
import cors from "cors";
import morgan from "morgan";
import connect from "./database/connection.js";
import router from "./router/route.js";
import ENV from "./config.js"

const app = express();
const port = ENV.PORT;

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors({ origin: "http://localhost:5173" })); // Specify the allowed origin
app.use(morgan("tiny"));
app.disable("x-powered-by");

// Routes
app.get("/", (req, res) => {
  res.status(201).json("Home GET Request");
});

app.use("/api", router);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Database connection and server start
connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server connected to http://localhost:${ENV.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Invalid database connection!");
  });
