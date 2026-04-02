// luu key trong localStorage
const KEY = "week3-todos";

let todos = [];
let filter = "all";

export function loadState() {
  try {
    const json = localStorage.getItem(KEY);
    if (json == null) return;
    const data = JSON.parse(json);
    todos = data.todos;
    if (!Array.isArray(todos)) todos = [];
    filter = data.filter != null ? data.filter : "all";
  } catch (e) {
    todos = [];
    filter = "all";
  }
}

function saveToStorage() {
  localStorage.setItem(KEY, JSON.stringify({ todos: todos, filter: filter }));
}

export function getTodos() {
  return todos;
}

export function getFilter() {
  return filter;
}

export function addTodo(text) {
  text = text.trim();
  if (text === "") return false;
  const item = {
    id: String(Date.now()) + "_" + String(Math.random()).slice(2, 8),
    title: text,
    done: false,
  };
  todos.push(item);
  saveToStorage();
  return true;
}

export function setTodoDone(id, done) {
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id === id) {
      todos[i].done = done;
      saveToStorage();
      return;
    }
  }
}

export function deleteTodo(id) {
  const tmp = [];
  for (let i = 0; i < todos.length; i++) {
    if (todos[i].id !== id) tmp.push(todos[i]);
  }
  todos = tmp;
  saveToStorage();
}

export function setFilter(f) {
  if (f !== "all" && f !== "active" && f !== "done") return;
  filter = f;
  saveToStorage();
}
