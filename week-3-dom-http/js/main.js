import * as store from "./store.js";

const listEl = document.getElementById("todo-list");
const countEl = document.getElementById("count-active");

// ve lai list + dem so task chua xong + highlight nut filter
function render() {
  const all = store.getTodos();
  const f = store.getFilter();

  var showList = [];
  for (var i = 0; i < all.length; i++) {
    var t = all[i];
    if (f === "all") {
      showList.push(t);
    } else if (f === "active") {
      if (t.done === false) showList.push(t);
    } else if (f === "done") {
      if (t.done === true) showList.push(t);
    }
  }

  listEl.innerHTML = "";
  for (var j = 0; j < showList.length; j++) {
    var item = showList[j];
    var li = document.createElement("li");
    li.className = "todo-item";
    li.dataset.id = item.id;

    var label = document.createElement("label");
    label.className = "todo-row";

    var cb = document.createElement("input");
    cb.type = "checkbox";
    cb.className = "todo-check";
    if (item.done) cb.checked = true;

    var span = document.createElement("span");
    span.className = "todo-title";
    if (item.done) span.className += " done";
    span.textContent = item.title;

    var delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "btn-delete";
    delBtn.textContent = "X";
    delBtn.setAttribute("data-action", "delete");

    label.appendChild(cb);
    label.appendChild(span);
    label.appendChild(delBtn);
    li.appendChild(label);
    listEl.appendChild(li);
  }

  var count = 0;
  for (var k = 0; k < all.length; k++) {
    if (all[k].done === false) count++;
  }
  countEl.textContent = count;

  var filterBtns = document.querySelectorAll("#filters button");
  for (var b = 0; b < filterBtns.length; b++) {
    var btn = filterBtns[b];
    var val = btn.getAttribute("data-filter");
    if (val === f) btn.classList.add("active");
    else btn.classList.remove("active");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  store.loadState();
  render();

  document.getElementById("todo-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var inp = document.getElementById("todo-input");
    if (store.addTodo(inp.value)) {
      inp.value = "";
    }
    render();
  });

  // 1 listener cho ca list: checkbox doi -> cap nhat done
  listEl.addEventListener("change", function (e) {
    if (e.target.classList.contains("todo-check")) {
      var li = e.target.closest(".todo-item");
      store.setTodoDone(li.dataset.id, e.target.checked);
      render();
    }
  });

  // cung listener cha, click nut X
  listEl.addEventListener("click", function (e) {
    var del = e.target.closest("button[data-action='delete']");
    if (del) {
      e.preventDefault();
      var li = del.closest(".todo-item");
      store.deleteTodo(li.dataset.id);
      render();
    }
  });

  document.getElementById("filters").addEventListener("click", function (e) {
    var btn = e.target.closest("[data-filter]");
    if (btn) {
      store.setFilter(btn.getAttribute("data-filter"));
      render();
    }
  });
});
