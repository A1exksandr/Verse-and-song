import { Schema, model } from 'mongoose';

const workSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['song', 'poem'],
      required: true,
    },
    text: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: 'Author',
      required: true,
    },
    genres: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Genre',
      },
    ],
    publicationDate: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Work = model('Work', workSchema);
export default Work;
