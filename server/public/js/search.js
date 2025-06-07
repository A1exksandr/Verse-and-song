const KEYS = {
  SEARCH: 'vs_last_search',
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => {
  try {
    const elements = root.querySelectorAll(sel);
    return elements ? Array.from(elements) : [];
  } catch (e) {
    console.error('Ошибка при выборе элементов:', e);
    return [];
  }
};

let currentAbortController = null;

// Функция для отправки запроса на сервер
async function searchOnServer(query, type = 'all') {
  if (currentAbortController) {
    currentAbortController.abort();
  }

  currentAbortController = new AbortController();

  try {
    const response = await fetch(
      `/api/v1/search?q=${encodeURIComponent(query)}&type=${type}`,
      { signal: currentAbortController.signal }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Ошибка поиска:', error);
    }
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
    const originalSections = $$('main > section:not(.hero)');
    originalSections.forEach((section) => {
      section.style.display = 'none';
    });

    // Создаем контейнер для результатов
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
    const originalSections = $$('main > section:not(.hero)');
    originalSections.forEach((section) => {
      section.style.display = '';
    });

    // Скрываем контейнер результатов
    if (searchResultsContainer) {
      searchResultsContainer.style.display = 'none';
    }
  }
}

// Функция выполнения поиска для главной страницы
async function performMainPageSearch(query) {
  if (!query || query.trim() === '') {
    displaySearchResults(null, 'all');
    return;
  }

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
  const originalSections = $$('main > section:not(.hero)');
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
    const allCards = $$('.items-grid--1gap .item-card');
    allCards.forEach((card) => {
      card.style.display = '';
    });

    // Восстанавливаем видимость секции жанров
    const genresSection = $('.section-title')?.parentElement;
    if (genresSection) {
      genresSection.style.display = '';
    }

    if (resultHeader) {
      resultHeader.style.display = 'none';
    }
    return;
  }

  // Создаем заголовок
  if (!resultHeader) {
    resultHeader = document.createElement('h3');
    resultHeader.className = 'search-results-header';
    const mainContainer = $('main');
    const sectionTitle = $('.section-title');

    if (mainContainer) {
      if (sectionTitle && sectionTitle.parentElement) {
        // Вставляем перед родительским элементом section-title
        mainContainer.insertBefore(
          resultHeader,
          sectionTitle.parentElement
        );
      } else {
        // Если нет section-title, вставляем после hero секции
        const heroSection = $('.hero');
        if (heroSection && heroSection.nextSibling) {
          mainContainer.insertBefore(
            resultHeader,
            heroSection.nextSibling
          );
        } else {
          // В крайнем случае добавляем в конец main
          mainContainer.appendChild(resultHeader);
        }
      }
    }
  }

  resultHeader.textContent = 'Поиск...';
  resultHeader.style.display = 'block';

  // Отправляем запрос на сервер
  const searchResults = await searchOnServer(query, 'genres');

  if (searchResults) {
    const allCards = $$('.items-grid--1gap .item-card');
    if (
      searchResults.status === 'success' &&
      searchResults.totalResults === 0
    ) {
      // Если ничего не найдено, скрываем все карточки
      allCards.forEach((card) => {
        card.style.display = 'none';
      });

      // Также можно скрыть заголовок "Жанры" и весь контейнер
      const genresSection = $('.section-title')?.parentElement;
      if (genresSection) {
        genresSection.style.display = 'none';
      }

      resultHeader.textContent = 'Ничего не найдено';
    } else if (
      searchResults.status === 'success' &&
      searchResults.results.genres.length > 0
    ) {
      // Восстанавливаем видимость секции
      const genresSection = $('.section-title')?.parentElement;
      if (genresSection) {
        genresSection.style.display = '';
      }

      // Сначала скрываем все
      allCards.forEach((card) => {
        card.style.display = 'none';
      });

      // Показываем только найденные
      let visibleCount = 0;
      allCards.forEach((card) => {
        const titleElement = card.querySelector('.item-title');
        const title = titleElement?.textContent.trim();

        const shouldShow = searchResults.results.genres.some(
          (genre) => genre.name.toLowerCase() === title.toLowerCase()
        );

        if (shouldShow) {
          card.style.display = '';
          visibleCount++;
        }
      });

      resultHeader.textContent = `Найдено результатов: ${visibleCount}`;
    } else {
      resultHeader.textContent = 'Ничего не найдено';
      allCards.forEach((card) => {
        card.style.display = 'none';
      });

      // Скрываем секцию жанров
      const genresSection = $('.section-title')?.parentElement;
      if (genresSection) {
        genresSection.style.display = 'none';
      }
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
    }, 1000);
  });
}

// Инициализация поиска для страницы жанров
function initGenresPageSearch() {
  const searchInput = $('#search');
  const searchButton = $('.hero__search-button');

  if (!searchInput) return;

  const testCards = document.querySelectorAll(
    '.items-grid--1gap .item-card'
  );

  if (testCards.length === 0) {
    const altCards1 = document.querySelectorAll('.item-card');

    const altCards2 = document.querySelectorAll(
      '[class*="item-card"]'
    );
  }

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
    }, 1000);
  });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;

  if (currentPath === '/' || currentPath === '/index') {
    initMainPageSearch();
  } else if (currentPath === '/genres') {
    console.log('Инициализация страницы жанров');
    setTimeout(() => {
      initGenresPageSearch();
    }, 100);
  }
});
