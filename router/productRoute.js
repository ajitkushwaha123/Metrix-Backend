// routes/product_route.js
import express from "express";
import bodyParser from "body-parser";
import multer from "multer";
import path from "path";
import Auth from "../middleware/auth.js";
import { add_product, get_products } from "../controllers/productController.js"; // Assuming correct export names

const product_route = express();
product_route.use(bodyParser.json());
product_route.use(bodyParser.urlencoded({ extended: true }));
product_route.use(express.static('public'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/productImages')); // Removed unnecessary callback
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name); // Removed unnecessary callback
    }
});

const upload = multer({ storage: storage });

// POST: Add product (requires authentication)
product_route.post('/add-product', upload.array('images'), Auth, add_product);

// GET: Get products (requires authentication)
product_route.get('/get-products', Auth, get_products);

export default product_route;
