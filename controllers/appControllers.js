import UserModel from "../models/User.models.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import {Otp} from "../models/Otp.model.js";
import dotenv from "dotenv";
import verifyOtp from "../helper/otpVerification.js";
import { validationResult } from "express-validator";
dotenv.config();

// Middleware for verifying user
export async function verifyUser(req, res, next) {
  try {
    const username = req.method === "GET" ? req.query.username : req.body.username;
    const email = req.method === "GET" ? req.query.email : req.body.email;

    console.log("username:", username);

    const user = await UserModel.findOne({ username });
    const emailExist = await UserModel.findOne({ email : username });

    console.log("user:", user);
    console.log("emailExist:", emailExist);

    if (!user && !emailExist) {
      return res.status(401).send({ error: "Username or email not found" });
    }

    next();
  } catch (error) {
    console.error("Error during user verification:", error);
    return res.status(404).send({ error: "Authentication failed" });
  }
}

export async function verifyUserEmail(req, res, next) {
  try {
    const email =
      req.method === "GET" ? req.query.email : req.body.email;

    console.log("email:", email);

    const emailExist = await UserModel.findOne({ email: email });

    console.log("emailExist:", emailExist);

    if (!emailExist) {
      return res.status(401).send({ error: "Email not found" });
    }

    next();
  } catch (error) {
    console.error("Error during user verification:", error);
    return res.status(404).send({ error: "Authentication failed" });
  }
}

export async function register(req, res) {
  try {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res
        .status(400)
        .send({ error: "Username, password, and email are required ...!" });
    }

    // Check if the email is verified
    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord || !otpRecord.mailVarified) {
      return res.status(400).send({ error: "Email not verified ...!" });
    }

    // Check if the username or email is already registered
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return res
        .status(400)
        .send({ error: "Username or email already registered ...!" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new UserModel({
      username,
      password: hashedPassword,
      email,
    });

    await user.save();
    res.status(201).send({ msg: "Registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
}

export async function login(req, res) {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });
    const emailfound = await UserModel.findOne({ email: username }); 

    if (!user && !emailfound) {
      return res.status(404).send({ error: "Username or email not found" });
    }

    const userToCheck = user || emailfound; 

    const passwordCheck = await bcrypt.compare(password, userToCheck.password);
    if (!passwordCheck) {
      return res.status(400).send({ error: "Password does not match" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: userToCheck._id,
        username: userToCheck.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).send({
      msg: "Login Successful",
      username: userToCheck.username,
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
}

export async function loginUsingOtp(req, res) {
  const { email } = req.body;

  console.log("email:", email);

  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const emailfound = await UserModel.findOne({ email });

    if (!emailfound) {
      return res.status(404).send({ error: "Email not found" });
    }

    const userToCheck = emailfound;

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: userToCheck._id,
        email: userToCheck.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).send({
      msg: "Login Successful",
      email: userToCheck.email,
      token,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
}

// Other routes

export async function getUsernameByEmail(req, res) {
  const { email } = req.params;

  try {
    if (!email) {
      return res.status(400).send({ error: "Email Required" });
    }

    console.log(email);

    const emailfound = await UserModel.findOne({ email });

    console.log(emailfound);
    if (!emailfound) {
      return res.status(404).send({ error: "User not found" });
    }

    const { username } = emailfound; 
    return res.status(200).send({ username });
  } catch (error) {
    console.error("Error finding user data:", error); 
    return res.status(500).send({ error: "Can't find user data" });
  }
}


export async function getUser(req, res) {
  const { username , email } = req.params;

  try {
    if (!username) {
      return res.status(400).send({ error: "Username Required" });
    }

    const user = await UserModel.findOne({ username });
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Omit the password field from the response
    const { password, ...rest } = Object.assign({}, user.toJSON()); // CONVERTING TO JSON
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
  
    await UserModel.updateOne({ _id: userId }, body);

    return res.status(201).send({ msg: "Record updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal server error" });
  }
}

export async function generateOTP(req, res, next) {
  console.log("generateOTP called");
  try {
    const otp = otpGenerator.generate(4, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    req.otp = otp;
    console.log("OTP generated:", otp);

    const { email, username } = req.body;
    console.log("email:", email);

    if (!email) {
      return res.status(400).send({ error: "Email required... !" });
    }

    const emailExist = await Otp.findOne({ email });

    if (emailExist) {
      const cDate = new Date();
      const updatedUsername = username || emailExist.username; // Use existing username if not provided
      await Otp.findOneAndUpdate(
        { email },
        {
          otp,
          otpExpiration: new Date(cDate.getTime() + 10 * 60000), // OTP expires in 10 minutes
          username: updatedUsername,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      console.log("OTP and username updated in DB");
      return next();
    }

    const newOTP = new Otp({
      email,
      username,
      otp,
      otpExpiration: new Date(Date.now() + 10 * 60000), // OTP expires in 10 minutes
    });

    await newOTP.save();
    console.log("OTP generated and saved to DB:", otp);
    next();
  } catch (error) {
    console.error("Error generating OTP:", error);
    return res.status(500).send({ error: "Unable to generate OTP" });
  }
}



export async function verifyOTP(req, res) {
  const { otp, email } = req.body;

  console.log(req.body);

  console.log(otp);

  if (!otp) {
    return res.status(400).send({ msg: "OTP is required" });
  }

  if (!email) {
    return res.status(400).send({ msg: "Email is required" });
  }

  console.log("verifyOTP called");
  console.log("Received otp:", otp);
  console.log("Received email:", email);

  try {
    const otpMatched = await Otp.findOne({ email, otp: otp });

    if (otpMatched) {
      const isOTPExpired = await verifyOtp(otpMatched.otpExpiration);

      if (isOTPExpired) {
        return res.status(400).json({
          success: false,
          msg: "OTP has expired!",
        });
      }

      console.log("OTP Verified");

      await Otp.updateOne({ email }, { mailVarified: true });
      return res.status(200).send({ success: true, msg: "Email Verified" });
    } else {
      console.log("Invalid OTP");
      return res.status(400).send({ success: false, msg: "Invalid OTP" });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res
      .status(500)
      .send({ success: false, msg: "Internal Server Error" });
  }
}

export async function createResetSession(req, res) {
  if (req.app.locals.resetSession) {
    req.app.locals.resetSession = false;
    return res.status(201).send({ msg: "Access Granted... !" });
  }

  return res.status(440).send({ error: "Session Expired" });
}

export async function resetPassword(req, res) {
  try {

    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).send({ error: "Username not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.updateOne(
      { username: user.username },
      { password: hashedPassword }
    );

    req.app.locals.resetSession = false;
    return res.status(200).send({ msg: "Record Updated" });
  } catch (error) {
    return res.status(500).send({ error: "Unable to hash password" });
  }
}

export async function weeklySales(req, res) {
  const userId = req.user.userId;
}
