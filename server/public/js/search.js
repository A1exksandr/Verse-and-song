const KEYS = {
  SEARCH: 'vs_last_search',
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// Функция для отправки запроса на сервер
async function searchOnServer(query, type = 'all') {
  try {
    const response = await fetch(
      `/api/v1/search?q=${encodeURIComponent(query)}&type=${type}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка поиска:', error);
    return null;
  }
}

// Функция для создания HTML карточки
function createCardHTML(item, type) {
  let title = '';
  let subtitle = '';
  let imageUrl = '';

  switch (type) {
    case 'poem':
    case 'song':
      title = item.title;
      subtitle = item.author?.name || 'Неизвестен';
      imageUrl =
        item.imageUrl ||
        `https://placehold.co/400x400/f8e2cf/333333?text=${encodeURIComponent(
          title
        )}`;
      break;
    case 'author':
      title = item.name;
      subtitle = '';
      imageUrl =
        item.imageUrl ||
        `https://placehold.co/400x400/f8e2cf/333333?text=${encodeURIComponent(
          title
        )}`;
      break;
    case 'genre':
      title = item.name;
      subtitle = '';
      imageUrl =
        item.imageUrl ||
        `https://placehold.co/400x400/f8e2cf/333333?text=${encodeURIComponent(
          title
        )}`;
      break;
  }

  return `
    <div class="item-card">
      <div class="item-image">
        <img src="${imageUrl}" alt="${title}">
      </div>
      <h3 class="item-title">
        <a href="#">${title}</a>
      </h3>
      ${subtitle ? `<p class="item-subtitle">${subtitle}</p>` : ''}
    </div>
  `;
}

// Функция для отображения результатов поиска
function displaySearchResults(searchResults, type) {
  const sectionTitles = $('.section-title');
  let searchResultsContainer = $('#search-results-container');

  // Если есть поиск, скрываем оригинальные секции
  if (
    searchResults &&
    searchResults.query &&
    searchResults.query.trim() !== ''
  ) {
    // Скрываем все оригинальные секции
    const originalSections = $('main > section:not(.hero)');
    originalSections.forEach((section) => {
      section.style.display = 'none';
    });

    // Создаем контейнер для результатов, если его нет
    if (!searchResultsContainer) {
      searchResultsContainer = document.createElement('div');
      searchResultsContainer.id = 'search-results-container';
      const mainContainer = $('main');
      const heroSection = $('.hero');
      if (mainContainer && heroSection) {
        mainContainer.insertBefore(
          searchResultsContainer,
          heroSection.nextSibling
        );
      }
    }

    // Очищаем контейнер
    searchResultsContainer.innerHTML = '';
    searchResultsContainer.style.display = 'block';

    if (
      searchResults.status === 'success' &&
      searchResults.totalResults > 0
    ) {
      // Добавляем заголовок с количеством результатов
      const header = document.createElement('h3');
      header.className = 'search-results-header';
      header.textContent = `Найдено результатов: ${searchResults.totalResults}`;
      searchResultsContainer.appendChild(header);

      // Создаем секции для каждого типа результатов
      if (searchResults.results.poems.length > 0) {
        const section = document.createElement('section');
        section.innerHTML = `
          <h2 class="section-title">Стихотворения</h2>
          <div class="items-grid">
            ${searchResults.results.poems
              .map((poem) => createCardHTML(poem, 'poem'))
              .join('')}
          </div>
        `;
        searchResultsContainer.appendChild(section);
      }

      if (searchResults.results.songs.length > 0) {
        const section = document.createElement('section');
        section.innerHTML = `
          <h2 class="section-title">Песни</h2>
          <div class="items-grid">
            ${searchResults.results.songs
              .map((song) => createCardHTML(song, 'song'))
              .join('')}
          </div>
        `;
        searchResultsContainer.appendChild(section);
      }

      if (searchResults.results.authors.length > 0) {
        const section = document.createElement('section');
        section.innerHTML = `
          <h2 class="section-title">Авторы</h2>
          <div class="items-grid">
            ${searchResults.results.authors
              .map((author) => createCardHTML(author, 'author'))
              .join('')}
          </div>
        `;
        searchResultsContainer.appendChild(section);
      }

      if (
        type === 'genres' &&
        searchResults.results.genres.length > 0
      ) {
        const section = document.createElement('section');
        section.innerHTML = `
          <h2 class="section-title">Жанры</h2>
          <div class="items-grid">
            ${searchResults.results.genres
              .map((genre) => createCardHTML(genre, 'genre'))
              .join('')}
          </div>
        `;
        searchResultsContainer.appendChild(section);
      }
    } else {
      // Показываем сообщение "Ничего не найдено"
      const noResults = document.createElement('h3');
      noResults.className = 'search-results-header';
      noResults.textContent = 'Ничего не найдено';
      searchResultsContainer.appendChild(noResults);
    }
  } else {
    // Если поиск пустой, показываем оригинальные секции
    const originalSections = $('main > section:not(.hero)');
    originalSections.forEach((section) => {
      section.style.display = '';
    });

    // Скрываем контейнер результатов
    if (searchResultsContainer) {
      searchResultsContainer.style.display = 'none';
    }
  }
}

// Функция для фильтрации жанров (оставляем старую логику для страницы жанров)
function filterGenres(searchResults) {
  const allCards = $('.items-grid .item-card');
  const sectionTitles = $('.section-title');
  let visibleCount = 0;

  if (
    searchResults &&
    searchResults.query &&
    searchResults.query.trim() !== ''
  ) {
    // Скрываем все карточки сначала
    allCards.forEach((card) => {
      card.style.display = 'none';
    });

    // Показываем только найденные
    if (searchResults.status === 'success') {
      allCards.forEach((card) => {
        const titleElement = card.querySelector('.item-title');
        const title = titleElement?.textContent.trim();

        const shouldShow = searchResults.results.genres.some(
          (genre) => genre.name === title
        );

        if (shouldShow) {
          card.style.display = '';
          visibleCount++;
        }
      });
    }
  } else {
    // Показываем все карточки
    allCards.forEach((card) => {
      card.style.display = '';
    });
  }

  return visibleCount;
}

// Функция выполнения поиска для главной страницы
async function performMainPageSearch(query) {
  if (!query || query.trim() === '') {
    displaySearchResults(null, 'all');
    return;
  }

  // Показываем индикатор загрузки
  let searchResultsContainer = $('#search-results-container');
  if (!searchResultsContainer) {
    searchResultsContainer = document.createElement('div');
    searchResultsContainer.id = 'search-results-container';
    const mainContainer = $('main');
    const heroSection = $('.hero');
    if (mainContainer && heroSection) {
      mainContainer.insertBefore(
        searchResultsContainer,
        heroSection.nextSibling
      );
    }
  }

  searchResultsContainer.innerHTML =
    '<h3 class="search-results-header">Поиск...</h3>';
  searchResultsContainer.style.display = 'block';

  // Скрываем оригинальные секции
  const originalSections = $('main > section:not(.hero)');
  originalSections.forEach((section) => {
    section.style.display = 'none';
  });

  // Отправляем запрос на сервер
  const searchResults = await searchOnServer(query, 'all');

  if (searchResults) {
    displaySearchResults(searchResults, 'all');
  } else {
    searchResultsContainer.innerHTML =
      '<h3 class="search-results-header">Ошибка при выполнении поиска</h3>';
  }
}

// Функция выполнения поиска для страницы жанров
async function performGenresSearch(query) {
  let resultHeader = $('.search-results-header');

  if (!query || query.trim() === '') {
    // Показываем все жанры
    const allCards = $('.items-grid .item-card');
    allCards.forEach((card) => {
      card.style.display = '';
    });
    if (resultHeader) {
      resultHeader.style.display = 'none';
    }
    return;
  }

  // Создаем заголовок если его нет
  if (!resultHeader) {
    resultHeader = document.createElement('h3');
    resultHeader.className = 'search-results-header';
    const mainContainer = $('main');
    const sectionTitle = $('.section-title');
    if (mainContainer && sectionTitle) {
      mainContainer.insertBefore(resultHeader, sectionTitle);
    }
  }

  resultHeader.textContent = 'Поиск...';
  resultHeader.style.display = 'block';

  // Отправляем запрос на сервер
  const searchResults = await searchOnServer(query, 'genres');

  if (searchResults) {
    const visibleCount = filterGenres(searchResults);
    if (visibleCount > 0) {
      resultHeader.textContent = `Найдено результатов: ${visibleCount}`;
    } else {
      resultHeader.textContent = 'Ничего не найдено';
    }
  } else {
    resultHeader.textContent = 'Ошибка при выполнении поиска';
  }
}

// Инициализация поиска для главной страницы
function initMainPageSearch() {
  const searchInput = $('#search');
  const searchButton = $('.hero__search-button');

  if (!searchInput) return;

  // Восстанавливаем последний поиск
  const lastSearch = localStorage.getItem(KEYS.SEARCH);
  if (lastSearch && lastSearch.trim() !== '') {
    searchInput.value = lastSearch;
    performMainPageSearch(lastSearch);
  }

  // Обработчик для кнопки поиска
  if (searchButton) {
    searchButton.addEventListener('click', () => {
      const query = searchInput.value;
      localStorage.setItem(KEYS.SEARCH, query);
      performMainPageSearch(query);
    });
  }

  // Обработчик для нажатия Enter
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const query = e.target.value;
      localStorage.setItem(KEYS.SEARCH, query);
      performMainPageSearch(query);
    }
  });

  // Поиск при вводе с задержкой
  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value;
    localStorage.setItem(KEYS.SEARCH, query);

    searchTimeout = setTimeout(() => {
      performMainPageSearch(query);
    }, 500); // Задержка 500мс, чтобы не спамить сервер
  });
}

// Инициализация поиска для страницы жанров
function initGenresPageSearch() {
  const searchInput = $('#search');
  const searchButton = $('.hero__search-button');

  if (!searchInput) return;

  // Обработчик для кнопки поиска
  if (searchButton) {
    searchButton.addEventListener('click', () => {
      performGenresSearch(searchInput.value);
    });
  }

  // Обработчик для нажатия Enter
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performGenresSearch(e.target.value);
    }
  });

  // Поиск при вводе с задержкой
  let searchTimeout;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      performGenresSearch(e.target.value);
    }, 500);
  });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  // Определяем на какой мы странице
  const currentPath = window.location.pathname;

  if (currentPath === '/' || currentPath === '/index') {
    initMainPageSearch();
  } else if (currentPath === '/genres') {
    initGenresPageSearch();
  }
});
