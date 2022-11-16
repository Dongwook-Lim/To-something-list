const input = document.querySelector('.input__item');
const form = document.querySelector('.new-form');
const addBtn = document.querySelector('.add-btn');
const items = document.querySelector('.items');

let id = 0;

function onClickBtn(event) {
  const selectedIcon = event.target;
  const selectedBtn = event.target.parentNode;
  const selectedBtnClassName = selectedBtn.className;
  const selectedId = event.target.dataset.id;
  const selectedItem = document.querySelector(`.item[data-id='${selectedId}']`);
  const selectedItemText = selectedItem.children[0];

  switch (selectedBtnClassName) {
    case 'check-btn':
      selectedIcon.classList.toggle('checked');
      selectedItemText.classList.toggle('blur');

      switch (selectedIcon.classList.contains('checked')) {
        case true:
          selectedItem.classList.remove('moving-up');
          selectedItem.classList.add('moving-down');
          items.appendChild(selectedItem);
          break;
        case false:
          selectedItem.classList.remove('moving-down');
          selectedItem.classList.add('moving-up');
          items.insertBefore(selectedItem, items.firstChild);
          break;
      }

      break;
    case 'delete-btn':
      selectedItem.classList.add('vanish');
      setTimeout(() => {
        selectedItem.remove();
      }, 500);
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
  li.setAttribute('data-id', id);
  li.innerHTML = `
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
  return li;
}

function onSubmit() {
  const text = input.value;
  if (text === '') {
    input.focus();
    return;
  }

  const newItem = createItem(text);
  newItem.classList.add('moving-down');
  items.insertBefore(newItem, items.firstChild);

  input.value = '';
  input.focus();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  onSubmit();
});
