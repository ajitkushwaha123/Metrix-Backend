import UserModel from "../models/User.models.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js';
import otpGenerator from 'otp-generator';
import { Product } from "../models/Product.model.js";
import { Order } from "../models/Order.models.js";
import Auth from "../middleware/auth.js";
// Middleware for verifying user
export async function verifyUser(req, res, next) {
  try {
    const username = (req.method === "GET") ? req.query.username : req.body.username;

    const exist = await UserModel.findOne({ username });
    if (!exist) {
      return res.status(401).send({ error: username });
    }

    next();
  } catch (error) {
    return res.status(404).send({ error: "Authentication failed" });
  }
}


export async function register(req, res) {
  try {
    const { username, password, email } = req.body;

    // Check if username or email already exists
    const existingUser = await UserModel.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).send({ error: "Username or email already registered" });
    }

    if (!password) {
      return res.status(400).send({ error: "Password is required" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new UserModel({
      username,
      password: hashedPassword,
      email,
    });

    // Save the user and send response
    await user.save();
    res.status(201).send({ msg: "Registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
}

// export async function singleProduct(req, res) {
//   try {
//     const product = await Product.create(req.body);

//     res.status(200).json({
//       success: true,
//       product,
//     });
//   } catch (error) {
//     console.error('Error creating product:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error creating product',
//     });
//   }
// }


export async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).send({ error: "Username not found" });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res.status(400).send({ error: "Password does not match" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      ENV.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).send({
      msg: "Login Successful",
      username: user.username,
      token,
    });
  } catch (error) {
    return res.status(500).send({ error });
  }
}

// Other routes
export async function getUser(req, res) {
  const { username } = req.params;

  try {
    if (!username) {
      return res.status(400).send({ error: "Username Required" });
    }

    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Omit the password field from the response
    const { password, ...rest } = Object.assign({} , user.toJSON()); // CONVERTING TO JSON
    return res.status(200).send(rest);
  } catch (error) {
    return res.status(500).send({ error: "Can't find user data" });
  }
}

export async function updateUser(req, res) {
  try {
    const { userId } = req.user;

    if (!userId) {
      return res.status(401).send({ error: "User ID not provided" });
    }

    const body = req.body;

    // Update data using promises
    await UserModel.updateOne({ _id: userId }, body);

    return res.status(201).send({ msg: "Record updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal server error" });
  }
}



export async function generateOTP(req, res) {
  req.app.locals.OTP = await otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
  res.status(201).send({ code: req.app.locals.OTP }); // Send the generated OTP
}

export async function verifyOTP(req, res) {
  const { code } = req.query;

    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
      req.app.locals.OTP = null;
      req.app.locals.resetSession = true;
      return res.status(201).send({ msg: 'Verification successful' });
    } 

    return res.status(400).send({ msg: 'Invalid OTP' });
}



export async function createResetSession(req, res) {
  if(req.app.locals.resetSession)
    {
       req.app.locals.resetSession = false;
       return res.status(201).send({msg : "Access Granted... !"})
    }

    return res.status(440).send({error : "Session Expired"});
}
export async function resetPassword(req, res) {
  try {
      if (!req.app.locals.resetSession) {
          return res.status(401).send({ error: "Session Expired" });
      }

      const { username, password } = req.body;
      const user = await UserModel.findOne({ username });

      if (!user) {
          return res.status(404).send({ error: "Username not found" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await UserModel.updateOne({ username: user.username }, { password: hashedPassword });

      req.app.locals.resetSession = false;
      return res.status(200).send({ msg: "Record Updated" });
  } catch (error) {
      return res.status(500).send({ error: "Unable to hash password" });
  }
}


export async function weeklySales(req , res){
   const userId = req.user.userId;

   console.log("userId" , userId);
}