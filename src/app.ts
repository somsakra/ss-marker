import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME } = process.env;
console.log(DB_USER);

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(
      `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`
    );
    console.log(`MongoDB Connected at ${conn.connection.host}`);
  } catch (error) {
    console.log(`Cannot connect to dataBase`, error);
  }
};

dbConnect();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
