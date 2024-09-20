// routes/userRoutes.js
import { Router } from "express";
import * as controller from "../controllers/appControllers.js";
import Auth from "../middleware/auth.js"; 
import { registerMail } from "../controllers/mailer.js";
import products from "./product.route.js";
import orders from "./Order.routes.js";
import carts from "./cart.route.js";
import category from "./category.route.js";
import customers from "./customer.route.js";
import bulkupload from "./Bulk.route.js";
import orderTable from "./orderTable.route.js";
import variant from "./Variant.route.js";
import addons from "./Addons.route.js";
import tax from "./Tax.route.js";
import discount from "./Discount.route.js";
import invoice from "./Invoice.route.js";
import otps from "./Otp.route.js";
import contact from "./contact.route.js";
import support from "./Support.route.js";
import gemini from "./Gemini.route.js";
import { body } from "express-validator";

const router = Router();

// POST: Register user
router.route("/generate-mail").post(controller.generateOTP, registerMail);

router.route("/verify-otp").post(controller.verifyOTP);

router.route("/register").post(controller.register);

// // POST: Send registration email
router.route("/register-mail").post(registerMail);

// // POST: User login
router.route("/login").post(controller.verifyUser, controller.login);


router.use(
  "/login-otp",
  [body("email").isEmail().withMessage("Enter a valid email address")],
  controller.loginUsingOtp
);

// // POST: Authenticate (placeholder)
router
  .route("/authenticate")
  .post(controller.verifyUser, (req, res) => res.end());
router
  .route("/authenticate-mail")
  .post(controller.verifyUserEmail, (req, res) => res.end());

// // GET: Get user details by username
router.route("/user/:username").get(controller.getUser);

router.route("/user-by-email/:email").get(controller.getUsernameByEmail);

// // PUT: Update user data (requires authentication)
router.route("/updateuser").put(Auth, controller.updateUser);

// // PUT: Reset user password
router
  .route("/resetPassword")
  .put(controller.verifyUserEmail, controller.resetPassword);

// // Products
router.use("/products", products);
router.use("/cart", carts);
router.use("/orders", orders);
router.use("/category", category);
router.use("/customer", customers);
router.use("/bulkupload", bulkupload);
router.use("/orderTable", orderTable);
router.use("/variant", variant);
router.use("/addons", addons);
router.use("/tax", tax);
router.use("/discount", discount);
router.use("/invoice", invoice);
router.use("/otp", otps);
router.use("/contact", contact);
router.use("/support", support);
router.use("/gemini", gemini);



export default router;
