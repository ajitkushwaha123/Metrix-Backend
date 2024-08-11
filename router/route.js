// routes/userRoutes.js
import { Router } from "express";
import * as controller from '../controllers/appControllers.js';
import Auth from "../middleware/auth.js"; // Assuming Auth is the middleware for authentication
import { registerMail } from "../controllers/mailer.js";
import products from "./product.route.js";
import orders from "./Order.routes.js";
import carts from "./cart.route.js";
import category from "./category.route.js";
import customers from "./customer.route.js";
// import { weeklySales } from "../controllers/appControllers.js";
import bulkupload from "./Bulk.route.js";
import orderTable from "./orderTable.route.js";
import variant from "./Variant.route.js";
import addons from "./Addons.route.js";
import tax from "./Tax.route.js";
import discount from "./Discount.route.js";


const router = Router();

// POST: Register user
router.route('/register').post(controller.register);

// POST: Send registration email
router.route('/registerMail').post(registerMail);

// POST: User login
router.route('/login').post(controller.verifyUser, controller.login);

// POST: Authenticate (placeholder)
router.route('/authenticate').post(controller.verifyUser, (req, res) => res.end());

// GET: Get user details by username
router.route('/user/:username').get(controller.getUser);
// PUT: Update user data (requires authentication)
router.route('/updateuser').put(Auth, controller.updateUser);

// PUT: Reset user password
router.route('/resetPassword').put(controller.verifyUser, controller.resetPassword);



//Products
router.use('/products' , products);
router.use("/cart", carts);
router.use("/orders", orders);
router.use("/category" , category)
router.use("/customer" , customers)
router.use("/bulkupload" , bulkupload);
router.use("/orderTable" , orderTable);
router.use("/variant" , variant);
router.use("/addons" , addons);
router.use("/tax" , tax);
router.use("/discount" , discount);

export default router;
