import bodyParser from "body-parser";
import express, { response } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { upload } from "../middleware/multer.js";
import {Product} from "../models/Product.model.js";
import csv from "csvtojson";
import Auth from "../middleware/auth.js";
import { Category } from "../models/Category.models.js";

// Helper function to get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const bulkupload = express();

bulkupload.use(bodyParser.urlencoded({ extended: true }));
bulkupload.use(express.static(path.resolve(__dirname, "public")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/data"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadMiddleware = multer({ storage });

// POST request
bulkupload.post(
  "/upload",
  uploadMiddleware.single("file"),
  Auth,
  async (req, res, next) => {
    const file = req.file;
    const userId = req.user.userId;

    console.log("File:", userId);

    console.log("User ID:", userId);
    if (!file) {
      const error = new Error("Please choose a file");
      error.httpStatusCode = 400;
      return next(error);
    }

    try {
      let userData = [];

      const response = await csv().fromFile(file.path);
      // console.log(response);

      for (let i = 0; i < response.length; i++) {
        userData.push({
          productName: response[i].Name,
          category: response[i].Category,
          price: response[i].Price,
          stock: response[i].Stock,
          photos: [response[i].Photos],
          status: "published",
          userId: userId,
        });

        const categoryExists = await Category.findOne({
          name: response[i].Category,
        });



        if (!categoryExists) {
          const newCategory = new Category({
            name: response[i].Category,
            photo: response[i].Photos,
            user: userId,
          });

          await newCategory.save();
        }
      }

      // console.log(userData);
      
      await Product.insertMany(userData);

      res.status(200).send({ success: "File uploaded successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  }
);


// GET request working fine
bulkupload.get("/", (req, res) => {
  res.json("Bulk upload route");
});

export default bulkupload;
