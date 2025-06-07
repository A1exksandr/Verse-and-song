import Work from '../models/Work.js';
import Author from '../models/Author.js';
import Genre from '../models/Genres.js';

export const search = async (req, res) => {
  try {
    const { q, type = 'all' } = req.query;

    if (!q || q.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Поисковой запрос не может быть пустым',
      });
    }

    const searchQuery = q.trim();
    const searchRegex = new RegExp(searchQuery, 'i'); // i - для регистронезависимого поиска

    let results = {
      poems: [],
      songs: [],
      authors: [],
      genres: [],
    };

    // Поиск по стихам
    if (type === 'all' || type === 'poems') {
      results.poems = await Work.find({
        type: 'poem',
        $or: [{ title: searchRegex }, { text: searchRegex }],
      })
        .populate('author', 'name')
        .populate('genres', 'name')
        .limit(10);
    }

    // Поиск по песням
    if (type === 'all' || type === 'songs') {
      results.songs = await Work.find({
        type: 'song',
        $or: [{ title: searchRegex }, { text: searchRegex }],
      })
        .populate('author', 'name')
        .populate('genres', 'name')
        .limit(10);
    }

    // Поиск по авторам
    if (type === 'all' || type === 'authors') {
      results.authors = await Author.find({
        $or: [{ name: searchRegex }, { bio: searchRegex }],
      }).limit(10);
    }

    // Поиск по жанрам
    if (type === 'all' || type === 'genres') {
      results.genres = await Genre.find({
        $or: [{ name: searchRegex }, { description: searchRegex }],
      }).limit(10);
    }

    // Подсчет общего количества результатов
    const totalResults =
      results.poems.length +
      results.songs.length +
      results.authors.length +
      results.genres.length;

    res.status(200).json({
      status: 'success',
      query: searchQuery,
      totalResults,
      results,
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Ошибка при выполнении поиска',
    });
  }
};
