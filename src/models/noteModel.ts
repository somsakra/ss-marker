import mongoose from "mongoose";

interface INote {
  _id: typeof mongoose.Schema.Types.ObjectId;
  title: string;
  content: string;
  isDone: boolean;
  userId: typeof mongoose.Schema.Types.ObjectId;
}

const noteSchema = new mongoose.Schema<INote>({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, required: true },
  content: { type: String, required: true },
  isDone: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

export default mongoose.model("Note", noteSchema);
