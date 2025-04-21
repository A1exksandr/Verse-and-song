const KEYS = {
  SEARCH: 'vs_last_search', // Ключ для сохранения последнего поиска
};

const $ = (sel, root = document) => root.querySelector(sel); // Дай мне первый элемент
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)]; // Массив всех совпадений, список всех элементов

// Селектор класса: .className
// Селектор атрибута: [attribute="value"]
// Селектор айдишника: #id

// liveSearch - функция живой поиск
function liveSearch() {
  const input = $('#search'); // Получаем элемент inpu
  if (!input) return; // Если элемента нет, то выходим из функции

  const listRoots = $$('.items-grid'); // Получаем элементы списка
  //$('.authors__list'),
  console.log(listRoots); // Выводим в консоль элементы списка

  // Восстановливаем сохраненный запрос из localStorage
  // input.value = localStorage.getItem(KEYS.SEARCH) || ''; // Получаем значение из localStorage
  // filterLists(input.value); // Вызываем функцию фильтрации списков

  input.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase(); // Получаем значение из input
    localStorage.setItem(KEYS.SEARCH, query); // Сохраняем значение в localStorage
    filterLists(query); // Вызываем функцию фильтрации списков
  });

  // filterLists - функция фильтрации списков
  function filterLists(query) {
    listRoots.forEach((listRoot) => {
      $$(':scope .item-card', listRoot).forEach((item) => {
        const text = item.textContent.toLowerCase(); // Получаем текст элемента
        if (text.includes(query)) {
          item.style.display = ''; // Если текст совпадает, то показываем элемент
        } else {
          item.style.display = 'none'; // Если текст не совпадает, то скрываем элемент
        }
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  liveSearch(); // Запускаем функцию живого поиска
});
