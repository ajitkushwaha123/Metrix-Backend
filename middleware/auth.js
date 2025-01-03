import jwt from 'jsonwebtoken';
// import ENV from '../config.js';

import dotenv from "dotenv";
dotenv.config();

export default async function Auth(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];

    // Retrieve the logged-in user details
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ error: "Authentication Failed" });
  }
}
export function localVariable(req, res, next) {
  req.app.locals = {
    OTP: null,
    resetSession: false,
  };
  next();
}
