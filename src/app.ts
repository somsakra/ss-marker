import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USER } from "./config";
import express from "express";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes";
import noteRoutes from "./routes/noteRoutes";

const app = express();

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
app.use("/note", noteRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
