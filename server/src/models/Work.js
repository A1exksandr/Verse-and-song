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
    featured: {
      type: Boolean,
      default: false, // Indicates if the work is featured
    },
    publicationDate: Date,
    audioUrl: String,
    duration: Number, // Duration in seconds
    imageUrl: String, // URL to an image representing the work
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Work = model('Work', workSchema);
export default Work;
