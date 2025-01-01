import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { upload } from "../middleware/multer.js";
import Papa from "papaparse";

const gemini = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

gemini.use(bodyParser.urlencoded({ extended: true }));
gemini.use(express.static(path.resolve(__dirname, "public")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/Menu"));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "image/png" || "image/webp" || "image/jpeg") {
      return cb(new Error("Only png , webp , jpeg images are allowed"), false);
    }
    cb(null, true);
  },
});

const genAI = new GoogleGenerativeAI("AIzaSyAzLX7YRreKOh4BEszmTSK2yRroWf3ROJ8");

gemini.post("/upload", upload.single("photos"), async (req, res) => {
  const file = req.file;

  console.log("req.file", req.body);
  console.log("file", file);

  if (!file) {
    return res.status(400).send({ error: "Please choose a file" });
  } else if (
    !["image/png", "image/webp", "image/jpeg", "application/pdf"].includes(
      file.mimetype
    )
  ) {
    return res.status(400).send({
      error: "Only PNG, WebP, JPEG images, and PDF files are allowed",
    });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `!important Do not add csv before data Must fill all the fields and strictly do not add comment or note anything just send the csv data (photos and variant can be empty for a few products but the rest should be completely filled). Extract the product details from the menu in CSV format with the following columns:
Name
Category (Capitalize)
Price (int)
Stock (int & if not present, add any random number between 1 to 10)
Photos (empty string if not present)
ShortCode (e.g., Butter Chicken => BTC)
Variant1
Value1(int) (if variant1 is present then add value1 as well, else make both empty)
Variant2
Value2(int) (if variant2 is present then add value2 as well, else make both empty)
Variant3
Value3(int) (if variant3 is present then add value3 as well, else both will be empty)
Fill the data correctly and do not leave any fields empty. Add according to your knowledge if correct data isn’t present, except for variants. If variants are not present, skip them in the image/PDF.

Example Data Format:

Name,Category,Price,Stock,Photos,ShortCode,Variant1,Value1,Variant2,Value2,Variant3,Value3
Butter Chicken,Main Course,250,5,"",BTC,Quater,200,Half,300,Full,400,`;

    const image = {
      inlineData: {
        data: Buffer.from(
          fs.readFileSync(`${file.destination}/${file.filename}`)
        ).toString("base64"),
        mimeType: file.mimetype,
      },
    };

    const result = await model.generateContent([prompt, image]);
    const responseText = result.response.text();

    if (
      !responseText.includes(
        "Name,Category,Price,Stock,Photos,ShortCode,Variant1,Value1,Variant2,Value2,Variant3,Value3"
      )
    ) {
      console.log("Invalid CSV format in response");
      return res.status(400).json({ error: "Invalid CSV format in response" });
    }

    const csvDataStartIndex = responseText.indexOf(
      "Name,Category,Price,Stock,Photos,ShortCode,Variant1,Value1,Variant2,Value2,Variant3,Value3"
    );
    const csvData = responseText.substring(csvDataStartIndex);

    const parsedData = Papa.parse(csvData, { header: true });
    const jsonData = parsedData.data;

    return res.status(200).json({
      data: jsonData,
      message: "CSV data parsed successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error uploading or parsing data" });
  }
});


export default gemini;
