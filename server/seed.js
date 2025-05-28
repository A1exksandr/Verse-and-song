import mongoose from 'mongoose';
import { connectDB } from './src/config/db.js';
import Author from './src/models/Author.js';
import Work from './src/models/Work.js';

await connectDB();

const authors = [
  {
    name: 'Александр Пушкин',
    birthDate: new Date('1799-06-06'),
    deathDate: new Date('1837-02-10'),
    bio: 'Русский поэт, писатель и драматург, основоположник современного русского литературного языка.',
    type: 'poet',
  },
  {
    name: 'Сергей Есенин',
    birthDate: new Date('1948-09-20'),
    deathDate: new Date('1925-12-28'),
    bio: 'Русский поэт, представитель акмеизма, известный своими лирическими стихотворениями о природе и любви.',
    type: 'poet',
  },
  {
    name: 'Владимир Маяковский',
    birthDate: new Date('1892-01-03'),
    deathDate: new Date('1930-04-14'),
    bio: 'Русский поэт, драматург и художник, один из самых ярких представителей русского футуризма.',
    type: 'poet',
  },
  {
    name: 'Анна Ахматова',
    birthDate: new Date('1889-06-23'),
    deathDate: new Date('1966-03-05'),
    bio: 'Русская поэтесса, одна из самых значительных фигур русской литературы XX века.',
    type: 'poet',
  },
  {
    name: 'Марина Цветаева',
    birthDate: new Date('1892-09-08'),
    deathDate: new Date('1941-08-31'),
    bio: 'Русская поэтесса и писательница, известная своими глубокими и эмоциональными стихотворениями.',
    type: 'poet',
  },
  {
    name: 'Борис Гребенщиков',
    birthDate: new Date('1953-11-27'),
    bio: 'Российский музыкант, поэт и композитор, основатель группы "Аквариум".',
    type: 'musician',
  },
  {
    name: 'Дмитрий Быков',
    birthDate: new Date('1967-12-20'),
    bio: 'Российский писатель, поэт и журналист, известный своими сатирическими произведениями.',
    type: 'writer',
  },
  {
    name: 'Андрей Тарковский',
    birthDate: new Date('1932-04-04'),
    deathDate: new Date('1986-12-29'),
    bio: 'Советский кинорежиссёр, сценарист и художник, известный своими философскими фильмами.',
    type: 'artist',
  },
  {
    name: 'Виктор Цой',
    birthDate: new Date('1962-06-21'),
    deathDate: new Date('1990-08-15'),
    bio: 'Российский музыкант, поэт и актёр, лидер рок-группы "Кино".',
    type: 'musician',
  },
  {
    name: 'Лев Толстой',
    birthDate: new Date('1828-09-09'),
    deathDate: new Date('1910-11-20'),
    bio: 'Русский писатель, автор таких произведений, как "Война и мир" и "Анна Каренина".',
    type: 'writer',
  },
  {
    name: 'Фёдор Достоевский',
    birthDate: new Date('1821-11-11'),
    deathDate: new Date('1881-02-09'),
    bio: 'Русский писатель, автор таких произведений, как "Преступление и наказание" и "Братья Карамазовы".',
    type: 'writer',
  },
  {
    name: 'Александр Блок',
    birthDate: new Date('1880-11-28'),
    deathDate: new Date('1921-08-07'),
    bio: 'Русский поэт, один из самых ярких представителей Серебряного века русской поэзии.',
    type: 'poet',
  },
  {
    name: 'Гражданская Оборона',
    birthDate: new Date('1984-01-01'),
    bio: 'Российская панк-группа, основанная в 1984 году, известная своими социально-политическими текстами.',
    type: 'musician',
  },
];

const seedDB = async () => {
  try {
    await Author.deleteMany();
    await Work.deleteMany();
    console.log('All works deleted');
    console.log('All authors deleted');
    const createdAuthors = await Author.insertMany(authors);
    console.log('Authors seeded:', createdAuthors);

    // Массив works тестовый с type poem
    const works = [
      {
        title: 'Руслан и Людмила',
        type: 'poem',
        text: 'Поэма о любви и приключениях, написанная Пушкиным.',
        author: createdAuthors[0]._id, // Пушкин
        genres: [],
        featured: true,
        publicationDate: new Date('1820-01-01'),
      },
      {
        title: 'Письмо к женщине',
        type: 'poem',
        text: 'Стихотворение Есенина, посвященное любви и разлуке.',
        author: createdAuthors[1]._id, // Есенин
        genres: [],
        featured: true,
        publicationDate: new Date('1925-01-01'),
      },
      {
        title: 'Облако в штанах',
        type: 'poem',
        text: 'Поэма Маяковского, отражающая его революционные идеи и личные переживания.',
        author: createdAuthors[2]._id, // Маяковский
        genres: [],
        featured: true,
        publicationDate: new Date('1915-01-01'),
      },
      {
        title: 'Стихи о Петербурге',
        type: 'poem',
        text: 'Сборник стихов Ахматовой, посвященных родному городу.',
        author: createdAuthors[3]._id, // Ахматова
        genres: [],
        featured: true,
        publicationDate: new Date('1912-01-01'),
      },
      {
        title: 'Поэма конца',
        type: 'poem',
        text: 'Стихотворение Цветаевой, отражающее её внутренний мир и переживания.',
        author: createdAuthors[4]._id, // Цветаева
        genres: [],
        featured: true,
        publicationDate: new Date('1920-01-01'),
      },
    ];


    const createdWorks = await Work.insertMany(works);
    console.log('Works seeded:', createdWorks);
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    mongoose.connection.close();
  }
};
seedDB();
