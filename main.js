const input = document.querySelector('.input__item');
const form = document.querySelector('.new-form');
const addBtn = document.querySelector('.add-btn');
const items = document.querySelector('.items');
const contents = document.querySelector('.contents');

let id = 0; //UUID

input.addEventListener('focus', () => {
  window.scrollTo(contents);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  onAdd();
});

function onAdd() {
  const text = input.value;
  const newItem = createItem(text);
  if (text === '') {
    input.focus();
    return;
  }
  addItem(newItem);
  resetInput();
}

function resetInput() {
  input.value = '';
  input.focus();
}

function createItem(text) {
  const item = document.createElement('li');
  item.setAttribute('class', 'item');
  item.setAttribute('data-id', id);
  item.innerHTML = `
    <span>${text}</span>
    <div class="item__btns">
      <button class="check-btn">
        <i class="fa-solid fa-circle-check check-icon" data-id="${id}"></i>
      </button>
      <button class='delete-btn'>
        <i class="fa-solid fa-circle-xmark delete-icon" data-id="${id}"></i>
      </button>
    </div>
  `;
  id++;
  return item;
}

function addItem(item) {
  item.classList.add('moving-down');
  items.insertBefore(item, items.firstChild);
}

function moveToTop(item) {
  if (item.classList.contains('moving-down')) {
    item.classList.remove('moving-down');
  }
  if (item === items.firstChild) {
    item.classList.remove('moving-up');
    items.insertBefore(item, items.firstChild);
  } else {
    item.classList.remove('moving-down');
    item.classList.add('moving-up');
    items.insertBefore(item, items.firstChild);
  }
}

function moveToBottom(item) {
  if (item.classList.contains('moving-up')) {
    item.classList.remove('moving-up');
  }
  if (item === items.lastChild) {
    item.classList.remove('moving-down');
    items.appendChild(item);
  } else {
    item.classList.add('moving-down');
    items.appendChild(item);
  }
}

items.addEventListener('click', (event) => {
  onClickBtn(event);
});

function onClickBtn(event) {
  const selectedId = event.target.dataset.id;
  const selectedBtn = event.target.parentNode;
  const selectedItem = document.querySelector(`.item[data-id='${selectedId}']`);
  const selectedText = selectedItem.children[0];
  if (selectedBtn.classList.contains('check-btn')) {
    if (selectedBtn.classList.contains('active')) {
      selectedBtn.classList.remove('active');
      selectedText.classList.remove('blur');
      moveToTop(selectedItem);
    } else {
      selectedBtn.classList.add('active');
      selectedText.classList.add('blur');
      moveToBottom(selectedItem);
    }
  } else if (selectedBtn.classList.contains('delete-btn')) {
    selectedItem.classList.add('vanish');
    setTimeout(() => {
      selectedItem.remove();
    }, 250);
  } else {
    return;
  }
}
