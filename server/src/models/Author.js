import { Schema, model } from 'mongoose';

const authorSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    deathDate: Date,
    bio: String,
    type: {
      type: String,
      enum: ['poet', 'musician', 'writer', 'artist'],
      default: 'poet',
    },
    imageUrl: String,
    works: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Work',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Author = model('Author', authorSchema);
export default Author;
