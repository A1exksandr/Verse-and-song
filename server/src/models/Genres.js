import { Schema, model } from 'mongoose';

const genreSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: String,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
const Genre = model('Genre', genreSchema);
export default Genre;
