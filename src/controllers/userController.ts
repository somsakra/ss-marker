import { Request, Response, NextFunction, response } from "express";
import User from "../models/userModel";
import { SECRET_TOKEN } from "../config";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomRequest extends Request {
  userData:
    | {
        email: string;
        userId: typeof mongoose.Schema.Types.ObjectId;
      }
    | JwtPayload;
}

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

const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  console.log(req.body);
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    if (!user) {
      return res.status(401).json({
        message: `User not Found`,
      });
    }
    bcrypt.compare(req.body.password, user.password, (err, result) => {
      if (err) {
        return res.status(401).json({
          message: `Password Incorrect`,
        });
      }
      if (result) {
        const token = jwt.sign(
          {
            email: user.email,
            userId: user._id,
          },
          SECRET_TOKEN as string,
          {
            expiresIn: "24h",
          }
        );
        return res.status(200).json({
          message: "Authentication successful",
          email: req.body.email,
          token: token,
        });
      } else {
        return res.status(401).json({
          message: `Authication failed`,
        });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};

const getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  console.log((req as CustomRequest).userData);
  try {
    const user = await User.findOne({
      email: (req as CustomRequest).userData.email,
    }).exec();
    if (user) {
      const token = jwt.sign(
        {
          email: user.email,
          userId: user._id,
        },
        SECRET_TOKEN as string,
        {
          expiresIn: "24h",
        }
      );
      const response = {
        email: user.email,
        refreshToken: token,
      };
      return res.status(200).json(response);
    }
    return res.status(401).json({ message: "please re-login" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err });
  }
};

export { userSignUp, userLogin, getUserInfo };
