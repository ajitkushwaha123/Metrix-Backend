import bodyParser from "body-parser";
import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { Product } from "../models/Product.model.js";
import csv from "csvtojson";
import Auth from "../middleware/auth.js";
import { Category } from "../models/Category.models.js";

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

const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "text/csv") {
      return cb(new Error("Only CSV files are allowed"), false);
    }
    cb(null, true);
  },
});

bulkupload.post(
  "/upload",
  uploadMiddleware.single("file"),
  Auth,
  async (req, res, next) => {
    const file = req.file;
    const userId = req.user.userId;

    if (!file) {
      return res.status(400).send({ error: "Please choose a file" });
    }

    try {
      const response = await csv().fromFile(file.path);
      let userData = [];

      for (let i = 0; i < response.length; i++) {
        const { Name, Category: categoryName, Price, Stock, Photos } = response[i];

        // Validate required fields
        if (!Name || !categoryName || !Price) {
          return res.status(402).send({ error: "Missing required fields in CSV" });
        }

        const foundCategory = await Category.findOne({ name: categoryName });
        const categoryID = foundCategory ? foundCategory._id : null;

        userData.push({
          productName: Name,
          category: categoryName,
          price: Price,
          stock: Stock || 0, // Default to 0 if not provided
          photos: Photos ? [Photos] : [], // Default to empty array if not provided
          status: "published",
          userId: userId,
          categoryId: categoryID,
        });

        if (!foundCategory) {
          const newCategory = new Category({
            name: categoryName,
            photo: Photos,
            user: userId,
          });

          await newCategory.save();
        }
      }

      await Product.insertMany(userData);

      res.status(200).send({ success: "File uploaded successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: err.message });
    }
  }
);


// GET request working fine
bulkupload.get("/", (req, res) => {
  res.json("Bulk upload route");
});

export default bulkupload;
