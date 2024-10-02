import express from "express";
import cors from "cors";
import morgan from "morgan";
import connect from "./database/connection.js";
import router from "./router/route.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://crm.magicscale.in",
    "http://82.112.237.229",
    "http://kravy.magicscale.in",
    "https://kravy.magicscale.in",
    "https://billing.magicscale.in",
  ],
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
  ],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(morgan("tiny"));
app.disable("x-powered-by");

app.get("/", (req, res) => {
  res.status(201).json("Home GET Request");
});

console.log(`PORT from .env: ${process.env.PORT}`);

app.use("/api", router);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

connect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server connected to http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("Invalid database connection!", error);
  });

console.log(process.env.PORT);
