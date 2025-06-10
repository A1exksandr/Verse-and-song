import Works from '../models/Work.js';
import Author from '../models/Author.js';
import Genres from '../models/Genres.js';

export const getHomePage = async (req, res) => {
  try {
    const featuredPoems = await Works.find({
      type: 'poem',
      featured: true,
    })
      .populate('author', 'name')
      .populate('genres', 'name')
      .limit(4);

    const featuredSongs = await Works.find({
      type: 'song',
      featured: true,
    })
      .populate('author', 'name')
      .populate('genres', 'name')
      .limit(4);

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


export const getGenresPage = async (req, res) => {
  try {
    // Здесь можно получить список жанров
    const genres = await Genres.find({});

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


export const getAuthorsPage = async (req, res) => {
  try {
    const authors = await Author.find({});

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
    const author = await Author.findById(req.params.id).populate({
      path: 'works',
      populate: {
        path: 'genres',
        select: 'name',
      },
    });

    if (!author) {
      return res.status(404).render('error', {
        title: 'Автор не найден',
        message: 'Автор с таким ID не найден.',
      });
    }


    const poems = author.works.filter((work) => work.type === 'poem');
    const songs = author.works.filter((work) => work.type === 'song');


    res.render('author', {
      title: author.name,
      author,
      poems,
      songs,
      totalWorks: author.works.length,
    });
  } catch (error) {
    console.error('Ошибка при загрузке страницы автора:', error);
    return res.status(500).render('error', {
      title: 'Ошибка',
      message: 'Произошла ошибка при загрузке страницы автора.',
    });
  }
};

export const getAboutPage = async (req, res) => {
  try {
    const creatorData = {
      name: "Александр Воробьев",
      image: "https://placehold.co/400x400/f8e2cf/333333?text=Александр Воробьев",
      bio: "Я студент факультета компьютерных наук (ФКН) Воронежского государственного университета (ВГУ). Мой путь начался с разработки приложений на Python. На данный момент я активно изучаю и разрабатываю веб-сайты, изучая современные технологии.",
      projectsText: "Здесь я делюсь своими проектами: веб-сайтами, которые я создаю, и другими работами. Вы можете найти примеры моих проектов на GitHub.",
      github: "https://github.com/A1exksandr",
      email: "alexandr.answer@gmail.com"
    };

    return res.render('about', {
      title: 'Об авторе',
      creator: creatorData,
      user: req.user // если у вас есть аутентификация
    });
  }
catch (error) {
    console.error('Ошибка при загрузке страницы об авторе:', error);
    return res.status(500).render('error', {
      title: 'Ошибка',
      message: 'Произошла ошибка при загрузке страницы об авторе.',
    });
  }
};
// TODO: отдать раздел об авторе
