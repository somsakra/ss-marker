import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSignUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    if (user) {
      return res.status(200).json({
        message: "E-mail already exists",
      });
    } else {
      bcrypt.hash(req.body.password, 10, async (err, hash) => {
        if (err) {
          return res.status(500).json({ error: err });
        } else {
          const newUser = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash,
          });
          try {
            const result = await newUser.save();
            console.log(result);
            res.status(200).json({
              message: "User created",
            });
          } catch (error) {
            res.status(500).json({
              message: error,
            });
          }
        }
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: err,
    });
  }
};

export { userSignUp };
