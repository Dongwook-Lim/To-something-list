const input = document.querySelector('.input__item');
const form = document.querySelector('.new-form');
const addBtn = document.querySelector('.add-btn');
const items = document.querySelector('.items');

const Todo_LS = 'todos';
const Tobuy_LS = 'tobuys';

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
  const selectedBtn = selectedIcon.parentNode;
  const selectedBtnClassName = selectedBtn.className;
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

function createItem(text) {
  const li = document.createElement('li');
  li.setAttribute('class', 'item');
  li.innerHTML = `
    <span>${text}</span>
    <div class="item__btns">
      <button class="check-btn">
        <i class="fa-solid fa-circle-check check-icon"></i>
      </button>
      <button class='delete-btn'>
        <i class="fa-solid fa-circle-xmark delete-icon"></i>
      </button>
    </div>
  `;
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
      alert('Already Exist!😳');
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
});
