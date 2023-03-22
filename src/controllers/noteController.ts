import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { APP_URL } from "../config";
import Note from "../models/noteModel";
import mongoose from "mongoose";

interface CustomRequest extends Request {
  userData:
    | {
        email: string;
        userId: typeof mongoose.Schema.Types.ObjectId;
      }
    | JwtPayload;
}

const getAllNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const doc = await Note.find({
      userId: (req as CustomRequest).userData.userId,
    })
      .select("_id title content isDone")
      .exec();
    const response = {
      count: doc.length,
      note: doc.map((doc) => {
        return {
          title: doc.title,
          content: doc.content,
          isDone: doc.isDone,
          _id: doc._id,
          request: {
            type: "GET",
            url: APP_URL + "/note/" + doc._id,
          },
        };
      }),
    };
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

const createNewNote = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const note = new Note({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    content: req.body.content,
    userId: (req as CustomRequest).userData.userId,
  });
  try {
    const result = await note.save();
    res.status(201).json({
      message: "Created the Note",
      createdNote: {
        title: result.title,
        content: result.content,
        _id: result._id,
        request: {
          type: "GET",
          url: APP_URL + "/note/" + result._id,
        },
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
    });
  }
};

const getNote = async (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.NoteId;
  console.log(id);
  try {
    const doc = await Note.findById(id)
      .select("_id title content isDone")
      .exec();
    if (doc) {
      console.log(doc);
      res.status(200).json({
        Note: doc,
        request: {
          type: "GET",
          description: "Get all note",
          url: APP_URL + "/note",
        },
      });
    } else {
      res.status(400).json({
        message: "Not valid entry found for provided id",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};

export { getAllNote, createNewNote, getNote };
