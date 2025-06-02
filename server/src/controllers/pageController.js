import Work from '../models/Work.js';
import Author from '../models/Author.js';
// import Genre from '../models/Genre.js';

export const getHomePage = async (req, res) => {
  try {
    // Нам нужно получить избранные произведения, авторов и жанры для отображения на главной странице
    const featuredPoems = await Work.find({
      type: 'poem',
      featured: true,
    })
      .populate('author title')
      .limit(4); // Получаем 4 избранных стихотворений

    // Получаем избранные песни
    const featuredSongs = await Work.find({
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
    // res.status(500).render('error', {
    //   title: 'Ошибка',
    //   message: 'Произошла ошибка при загрузке страницы.',
    // });
  }
};


// TODO: отдать список авторов
// TODO: отдать список жанров
// TODO: отдать раздел об авторе
