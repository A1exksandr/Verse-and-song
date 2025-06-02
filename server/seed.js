// server/enhancedSeed.js
// Улучшенный seed файл, который работает с существующими данными

import mongoose from 'mongoose';
import { connectDB } from './src/config/db.js';
import Author from './src/models/Author.js';
import Work from './src/models/Work.js';
import Genre from './src/models/Genres.js';

const seedWorks = async () => {
  try {
    // Подключаемся к базе данных
    await connectDB();
    console.log('✅ Подключено к MongoDB');
    console.log(
      `📍 База данных: ${mongoose.connection.db.databaseName}\n`
    );

    // Получаем существующих авторов из базы данных
    const existingAuthors = await Author.find();
    console.log(
      `📚 Найдено ${existingAuthors.length} авторов в базе данных`
    );

    // Создаем словарь авторов для быстрого поиска по имени
    const authorMap = {};
    existingAuthors.forEach((author) => {
      authorMap[author.name] = author._id;
      console.log(`   - ${author.name} (${author.type})`);
    });

    // Получаем существующие жанры из базы данных
    const existingGenres = await Genre.find();
    console.log(
      `\n🎭 Найдено ${existingGenres.length} жанров в базе данных`
    );

    // Создаем словарь жанров для быстрого поиска по названию
    const genreMap = {};
    existingGenres.forEach((genre) => {
      genreMap[genre.name] = genre._id;
      console.log(`   - ${genre.name}`);
    });

    // Проверяем, есть ли необходимые авторы и жанры
    const requiredAuthors = [
      'Александр Пушкин',
      'Сергей Есенин',
      'Виктор Цой',
      'Владимир Маяковский',
    ];
    const requiredGenres = [
      'Лирика',
      'Классика',
      'Рок',
      'Философская',
    ];

    let allDataPresent = true;

    console.log('\n🔍 Проверка необходимых данных:');
    for (const authorName of requiredAuthors) {
      if (!authorMap[authorName]) {
        console.log(`❌ Отсутствует автор: ${authorName}`);
        allDataPresent = false;
      }
    }

    for (const genreName of requiredGenres) {
      if (!genreMap[genreName]) {
        console.log(`❌ Отсутствует жанр: ${genreName}`);
        allDataPresent = false;
      }
    }

    if (!allDataPresent) {
      console.log(
        '\n⚠️  Не все необходимые данные присутствуют в базе.'
      );
      console.log(
        'Сначала импортируйте авторов и жанры через MongoDB Compass.'
      );
      return;
    }

    console.log('✅ Все необходимые данные найдены\n');

    // Массив новых произведений для добавления
    const newWorks = [
      // Произведения Пушкина
      {
        title: 'Руслан и Людмила',
        type: 'poem',
        text: `У лукоморья дуб зелёный;
Златая цепь на дубе том:
И днём и ночью кот учёный
Всё ходит по цепи кругом;
Идёт направо — песнь заводит,
Налево — сказку говорит.

Там чудеса: там леший бродит,
Русалка на ветвях сидит;
Там на неведомых дорожках
Следы невиданных зверей;
Избушка там на курьих ножках
Стоит без окон, без дверей...`,
        author: authorMap['Александр Пушкин'],
        genres: [genreMap['Классика'], genreMap['Лирика']],
        featured: true,
        publicationDate: new Date('1820-01-01'),
        imageUrl:
          'https://placehold.co/400x400/2e8b57/ffffff?text=Руслан+и+Людмила',
      },
      {
        title: 'Евгений Онегин (Отрывок)',
        type: 'poem',
        text: `Мой дядя самых честных правил,
Когда не в шутку занемог,
Он уважать себя заставил
И лучше выдумать не мог.
Его пример другим наука;
Но, боже мой, какая скука
С больным сидеть и день и ночь,
Не отходя ни шагу прочь!`,
        author: authorMap['Александр Пушкин'],
        genres: [genreMap['Классика']],
        featured: false,
        publicationDate: new Date('1833-01-01'),
        imageUrl:
          'https://placehold.co/400x400/4682b4/ffffff?text=Евгений+Онегин',
      },

      // Произведения Есенина
      {
        title: 'Берёза',
        type: 'poem',
        text: `Белая берёза
Под моим окном
Принакрылась снегом,
Точно серебром.

На пушистых ветках
Снежною каймой
Распустились кисти
Белой бахромой.

И стоит берёза
В сонной тишине,
И горят снежинки
В золотом огне.`,
        author: authorMap['Сергей Есенин'],
        genres: [genreMap['Лирика']],
        featured: true,
        publicationDate: new Date('1913-01-01'),
        imageUrl:
          'https://placehold.co/400x400/90ee90/333333?text=Берёза',
      },
      {
        title: 'Клён ты мой опавший',
        type: 'poem',
        text: `Клён ты мой опавший, клён заледенелый,
Что стоишь, нагнувшись, под метелью белой?

Или что увидел? Или что услышал?
Словно за деревню погулять ты вышел

И, как пьяный сторож, выйдя на дорогу,
Утонул в сугробе, приморозил ногу.`,
        author: authorMap['Сергей Есенин'],
        genres: [genreMap['Лирика'], genreMap['Философская']],
        featured: false,
        publicationDate: new Date('1925-01-01'),
        imageUrl:
          'https://placehold.co/400x400/ff8c00/ffffff?text=Клён',
      },

      // Произведения Маяковского
      {
        title: 'А вы могли бы?',
        type: 'poem',
        text: `Я сразу смазал карту будня,
плеснувши краску из стакана;
я показал на блюде студня
косые скулы океана.

На чешуе жестяной рыбы
прочёл я зовы новых губ.
А вы
ноктюрн сыграть
могли бы
на флейте водосточных труб?`,
        author: authorMap['Владимир Маяковский'],
        genres: [genreMap['Лирика'], genreMap['Философская']],
        featured: true,
        publicationDate: new Date('1913-01-01'),
        imageUrl:
          'https://placehold.co/400x400/ff4500/ffffff?text=А+вы+могли+бы',
      },
      {
        title: 'Послушайте!',
        type: 'poem',
        text: `Послушайте!
Ведь, если звёзды зажигают —
значит — это кому-нибудь нужно?
Значит — кто-то хочет, чтобы они были?
Значит — кто-то называет эти плевочки
жемчужиной?`,
        author: authorMap['Владимир Маяковский'],
        genres: [genreMap['Философская']],
        featured: false,
        publicationDate: new Date('1914-01-01'),
        imageUrl:
          'https://placehold.co/400x400/ffd700/333333?text=Послушайте',
      },

      // Песни Виктора Цоя
      {
        title: 'Кукушка',
        type: 'song',
        text: `Песен еще ненаписанных, сколько?
Скажи, кукушка, пропой.
В городе мне жить или на выселках,
Камнем лежать или гореть звездой?
Звездой.

Солнце моё — взгляни на меня,
Моя ладонь превратилась в кулак,
И если есть порох — дай огня.
Вот так.`,
        author: authorMap['Виктор Цой'],
        genres: [genreMap['Рок'], genreMap['Философская']],
        featured: true,
        publicationDate: new Date('1990-01-01'),
        duration: 279,
        imageUrl:
          'https://placehold.co/400x400/4b0082/ffffff?text=Кукушка',
      },
      {
        title: 'Последний герой',
        type: 'song',
        text: `Ночь коротка, цель далека,
Ночью так часто хочется пить,
Ты выходишь на кухню,
Но вода здесь горькая,
Ты не можешь здесь спать,
Ты не хочешь здесь жить.

Доброе утро, последний герой!
Доброе утро тебе и таким, как ты,
Доброе утро, последний герой!
Здравствуй, последний герой!`,
        author: authorMap['Виктор Цой'],
        genres: [genreMap['Рок']],
        featured: false,
        publicationDate: new Date('1989-01-01'),
        duration: 197,
        imageUrl:
          'https://placehold.co/400x400/8b008b/ffffff?text=Последний+герой',
      },
    ];

    // Проверяем, какие произведения уже существуют
    console.log('📝 Проверка существующих произведений...');
    const existingTitles = await Work.find({}, 'title').lean();
    const existingTitleSet = new Set(
      existingTitles.map((w) => w.title)
    );

    // Фильтруем только новые произведения
    const worksToAdd = newWorks.filter(
      (work) => !existingTitleSet.has(work.title)
    );

    if (worksToAdd.length === 0) {
      console.log(
        '\n✅ Все произведения уже существуют в базе данных'
      );
      return;
    }

    console.log(
      `\n📥 Добавление ${worksToAdd.length} новых произведений...`
    );

    // Добавляем новые произведения
    const createdWorks = await Work.insertMany(worksToAdd);

    console.log('\n✅ Успешно добавлены произведения:');
    createdWorks.forEach((work) => {
      console.log(`   - "${work.title}" (${work.type})`);
    });

    // Показываем общую статистику
    const totalWorks = await Work.countDocuments();
    const totalPoems = await Work.countDocuments({ type: 'poem' });
    const totalSongs = await Work.countDocuments({ type: 'song' });

    console.log('\n📊 Общая статистика:');
    console.log(`   - Всего произведений: ${totalWorks}`);
    console.log(`   - Стихотворений: ${totalPoems}`);
    console.log(`   - Песен: ${totalSongs}`);
  } catch (error) {
    console.error('❌ Ошибка при добавлении произведений:', error);
  } finally {
    // Закрываем соединение
    await mongoose.connection.close();
    console.log('\n👋 Соединение с базой данных закрыто');
  }
};

// Запускаем seed
console.log(
  '🚀 Запуск seed скрипта для добавления произведений...\n'
);
seedWorks();
