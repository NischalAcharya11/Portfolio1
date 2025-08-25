
document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector('.todo-app');
  if(!app) return; // Only run on javascript.html

  const form = app.querySelector('#todo-form');
  const input = app.querySelector('#todo-input');
  const list = app.querySelector('#todo-list');
  const filter = app.querySelector('#filter-select');
  const clearBtn = app.querySelector('#clear-completed');

  const load = () => JSON.parse(localStorage.getItem('todos') || '[]');
  const save = (items) => localStorage.setItem('todos', JSON.stringify(items));

  let todos = load();

  const render = () => {
    list.innerHTML = '';
    const view = todos.filter(t => {
      if(filter.value === 'all') return true;
      if(filter.value === 'active') return !t.done;
      if(filter.value === 'completed') return t.done;
    });
    for(const t of view){
      const li = document.createElement('li');
      li.className = 'todo-item ' + (t.done ? 'completed' : '');

      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.checked = t.done;
      cb.addEventListener('change', () => {
        t.done = cb.checked;
        save(todos); render();
      });

      const span = document.createElement('span');
      span.className = 'todo-text flex-grow-1';
      span.textContent = t.text;

      const del = document.createElement('button');
      del.className = 'btn btn-sm btn-outline-ink';
      del.textContent = 'Delete';
      del.addEventListener('click', () => {
        todos = todos.filter(x => x.id !== t.id);
        save(todos); render();
      });

      li.append(cb, span, del);
      list.appendChild(li);
    }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if(!text) return;
    todos.push({ id: Date.now(), text, done:false });
    input.value = '';
    save(todos); render();
  });

  clearBtn.addEventListener('click', () => {
    todos = todos.filter(t => !t.done);
    save(todos); render();
  });

  filter.addEventListener('change', render);

  render();
});
