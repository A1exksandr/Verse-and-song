import { Schema, model } from 'mongoose';

const authorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
  versionKey: false,
});

const Author = model('Author', authorSchema);
export default Author;