import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { SECRET_TOKEN } from "../config";

interface CustomRequest extends Request {
  userData: string | JwtPayload;
}

const auth = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({
        message: "Missing Token",
      });
    }
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, SECRET_TOKEN as string);
    (req as CustomRequest).userData = decoded;
    console.log((req as CustomRequest).userData);
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }
};

export default auth;
