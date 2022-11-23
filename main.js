const input = document.querySelector('.input__item');
const form = document.querySelector('.new-form');
const addBtn = document.querySelector('.add-btn');
const items = document.querySelector('.items');
const todayDate = document.querySelector('.today-date');
const listTitleText = document.querySelector('.list-title__text');
const nav = document.querySelector('.navigation');
const navItems = document.querySelectorAll('.nav-item');

const Todo_LS = 'todos';
const Tobuy_LS = 'tobuys';

const DoThemeColor = '#283593';
const DoSubThemeColor = '#5f5fc4';
const BuyThemeColor = '#f9a825';
const BuySubThemeColor = '#ffd95a';

const monthName = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const weekDay = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

function changeThemeColor(themeColor, subThemeColor, text) {
  document.documentElement.style.setProperty('--theme-color', themeColor);
  document.documentElement.style.setProperty(
    '--sub-theme-color',
    subThemeColor
  );
  listTitleText.innerText = text;
}

function onClickNav(event) {
  const target = event.target;
  const icon = target.parentNode;
  const navItem = icon.parentNode.parentNode;
  if (!target.classList.contains('fa-solid')) {
    return;
  }
  navItems.forEach((item) => {
    item.classList.remove('active');
    navItem.classList.add('active');
  });
  if (icon.classList.contains('buy-icon')) {
    changeThemeColor(BuyThemeColor, BuySubThemeColor, 'To-Buy');
  } else {
    changeThemeColor(DoThemeColor, DoSubThemeColor, 'To-Do');
  }
}

nav.addEventListener('click', (event) => {
  onClickNav(event);
});

function deleteItem(selectedItem, selectedText) {
  let savedItems = JSON.parse(localStorage.getItem(Todo_LS));
  savedItems.forEach((item) => {
    if (item.text === selectedText) {
      savedItems.splice(savedItems.indexOf(item), 1);
    }
  });
  localStorage.setItem(Todo_LS, JSON.stringify(savedItems));

  selectedItem.classList.add('vanish');
  setTimeout(() => {
    selectedItem.remove();
  }, 500);
}

function checkItem(savedItems, selectedText, index) {
  for (let i = 0; i < savedItems.length; i++) {
    if (savedItems[i].text === selectedText) {
      const selectedItem = savedItems[i];
      savedItems.splice(i, 1);
      savedItems.splice(index, 0, selectedItem);
      selectedItem.checked = !selectedItem.checked;
      break;
    }
  }
  localStorage.setItem(Todo_LS, JSON.stringify(savedItems));
}

function onClickBtn(event) {
  const selectedIcon = event.target;
  const selectedBtnClassName = selectedIcon.parentNode.className;
  const selectedItem = selectedIcon.parentNode.parentNode.parentNode;
  const selectedSpan = selectedItem.children[0];
  const selectedText = selectedSpan.textContent;

  switch (selectedBtnClassName) {
    case 'check-btn':
      let savedItems = JSON.parse(localStorage.getItem(Todo_LS));
      selectedIcon.classList.toggle('checked');
      selectedSpan.classList.toggle('blur');
      switch (selectedIcon.classList.contains('checked')) {
        case true:
          checkItem(savedItems, selectedText, 0);
          selectedItem.classList.remove('moving-up');
          selectedItem.classList.add('moving-down');
          items.appendChild(selectedItem);
          break;
        case false:
          checkItem(savedItems, selectedText, savedItems.length);
          selectedItem.classList.remove('moving-down');
          selectedItem.classList.add('moving-up');
          items.insertBefore(selectedItem, items.firstChild);
          break;
      }
      break;
    case 'delete-btn':
      deleteItem(selectedItem, selectedText);
      break;
    default:
      return;
  }
}

items.addEventListener('click', (event) => {
  if (event.target === items) {
    return;
  } else {
    onClickBtn(event);
  }
});

function setTime(span) {
  const currentTime = new Date();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  span.innerText = `${hours < 10 ? '0' + hours : hours}:${
    minutes < 10 ? '0' + minutes : minutes
  }`;
}

function createItem(text) {
  const li = document.createElement('li');
  li.setAttribute('class', 'item');

  const span = document.createElement('span');
  span.innerText = `${text}`;
  li.appendChild(span);

  const itemFooter = document.createElement('div');
  itemFooter.setAttribute('class', 'item-footer');

  const itemContent = document.createElement('div');
  itemContent.setAttribute('class', 'item-content');
  const itemDate = document.createElement('span');
  itemDate.setAttribute('class', 'item-date');
  setDate(itemDate);
  const itemTime = document.createElement('span');
  itemTime.setAttribute('class', 'item-time');
  setTime(itemTime);
  itemContent.appendChild(itemDate);
  itemContent.appendChild(itemTime);
  itemFooter.appendChild(itemContent);

  const itemBtns = document.createElement('div');
  itemBtns.setAttribute('class', 'item__btns');
  const checkBtn = document.createElement('button');
  checkBtn.setAttribute('class', 'check-btn');
  checkBtn.innerHTML = `<i class="fa-solid fa-circle-check check-icon"></i>`;
  const deleteBtn = document.createElement('button');
  deleteBtn.setAttribute('class', 'delete-btn');
  deleteBtn.innerHTML = `<i class="fa-solid fa-circle-xmark delete-icon"></i>`;
  itemBtns.appendChild(checkBtn);
  itemBtns.appendChild(deleteBtn);
  itemFooter.appendChild(itemBtns);

  li.appendChild(itemFooter);
  return li;
}

function addItem(text) {
  const newItem = createItem(text);
  localStorage.setItem(
    Todo_LS,
    JSON.stringify([
      ...JSON.parse(localStorage.getItem(Todo_LS) || '[]'),
      { text: text, checked: false },
    ])
  );
  newItem.classList.add('moving-down');
  items.insertBefore(newItem, items.firstChild);

  input.value = '';
  input.focus();
}

function onSubmit() {
  const text = input.value;
  if (text === '') {
    input.focus();
    return;
  }

  let savedItems = JSON.parse(localStorage.getItem(Todo_LS));
  for (let i = 0; i < savedItems.length; i++) {
    if (text === savedItems[i].text) {
      alert('That already exists!😳');
      input.value = '';
      return;
    }
  }
  addItem(text);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  onSubmit();
});

function setDate(span) {
  const newDate = new Date();
  const year = newDate.getYear() - 100;
  const month = monthName[newDate.getMonth()];
  const date = newDate.getDate();
  const week = weekDay[newDate.getDay()];
  span.innerText = `${week}, ${month} ${date}, ${year}`;
}

function loadItems() {
  let savedItems = JSON.parse(localStorage.getItem(Todo_LS));
  if (savedItems === null) {
    localStorage.setItem(Todo_LS, JSON.stringify([]));
    return;
  } else {
    savedItems.forEach((item) => {
      const li = document.createElement('li');
      li.setAttribute('class', 'item');
      li.innerHTML = `
    <span class="${item.checked ? 'blur' : ''}">${item.text}</span>
    <div class="item__btns">
      <button class="check-btn">
        <i class="fa-solid fa-circle-check check-icon ${
          item.checked ? 'checked' : ''
        }"></i>
      </button>
      <button class='delete-btn'>
        <i class="fa-solid fa-circle-xmark delete-icon"></i>
      </button>
    </div>
    `;
      items.insertBefore(li, items.children[0]);
    });
  }
}

window.addEventListener('load', () => {
  loadItems();
  setDate(todayDate);
});
