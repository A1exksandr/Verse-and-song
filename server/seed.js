import mongoose from 'mongoose';
import {connectDB} from './src/config/db.js'
import Author from './src/models/Author.js';

await connectDB();

const authors = [
  {
    name: 'J.K. Rowling',
    birthDate: new Date('1965-07-31'),
  },
  {
    name: 'George R.R. Martin',
    birthDate: new Date('1948-09-20'),
  },
  {
    name: 'J.R.R. Tolkien',
    birthDate: new Date('1892-01-03'),
  },
];

const seedDB = async () => {
  try {
    await Author.deleteMany();
    console.log('All authors deleted');
    const createdAuthors = await Author.insertMany(authors);
    console.log('Authors seeded:', createdAuthors);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
}
seedDB();