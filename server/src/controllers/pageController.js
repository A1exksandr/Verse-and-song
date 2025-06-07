import Works from '../models/Work.js';
import Author from '../models/Author.js';
import Genres from '../models/Genres.js';

export const getHomePage = async (req, res) => {
  try {
    // Нам нужно получить избранные произведения, авторов и жанры для отображения на главной странице
    const featuredPoems = await Works.find({
      type: 'poem',
      featured: true,
    })
      .populate('author title')
      .limit(4); // Получаем 4 избранных стихотворений

    // Получаем избранные песни
    const featuredSongs = await Works.find({
      type: 'song',
      featured: true,
    })
      .populate('author title')
      .limit(4);

    // Получаем избранных авторов
    const featuredAuthors = await Author.find().limit(4);

    res.render('index', {
      title: 'Главная страница',
      featuredPoems,
      featuredSongs,
      featuredAuthors,
    });
  } catch (error) {
    console.error('Ошибка при загрузке главной страницы:', error);
    res.status(500).render('error', {
      title: 'Ошибка',
      message: 'Произошла ошибка при загрузке страницы.',
    });
  }
};

// TODO: отдать список жанров
export const getGenresPage = async (req, res) => {
  try {
    // Здесь можно получить список жанров, если он есть
    const genres = await Genres.find({});
    console.log(JSON.stringify(genres, null, 2));

    res.render('genres', {
      title: 'Жанры',
      genres,
    });
  } catch (error) {
    console.error('Ошибка при загрузке страницы жанров:', error);
    res.status(500).render('error', {
      title: 'Ошибка',
      message: 'Произошла ошибка при загрузке страницы жанров.',
    });
  }
};

// TODO: отдать список авторов
export const getAuthorsPage = async (req, res) => {
  try {
    // Здесь можно получить список авторов
    const authors = await Author.find({});
    console.log(JSON.stringify(authors, null, 2));

    res.render('authors', {
      title: 'Авторы',
      authors,
    });
  } catch (error) {
    console.error('Ошибка при загрузке страницы авторов:', error);
    res.status(500).render('error', {
      title: 'Ошибка',
      message: 'Произошла ошибка при загрузке страницы авторов.',
    });
  }
};

// Контроллер для конкретного автора
export const getAuthorPage = async (req, res) => {
  try {
    // Здесь получаем конкретного автора по id
    const author = await Author.findById(req.params.id); // Предполагаем, что у автора есть поле works, содержащее его произведения

    console.log(JSON.stringify(author, null, 2));
    console.log('======');

    res.render('author', {
      title: author.name,
      author,
    });

    // if (!author) {
    //   return res.status(404).render('error', {
    //     title: 'Автор не найден',
    //     message: 'Автор с таким ID не найден.',
    //   });
    // }
  } catch (error) {
    console.error('Ошибка при загрузке страницы автора:', error);
    // return res.status(500).render('error', {
    //   title: 'Ошибка',
    //   message: 'Произошла ошибка при загрузке страницы автора.',
    // });
  }
};

// TODO: отдать раздел об авторе
