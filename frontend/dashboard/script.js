const token = localStorage.getItem("token");
const saveTaskButton = document.getElementById("save-task-button");
const completeTodoEl = document.querySelector(".completed");
const pendingTodoEl = document.querySelector(".pending");
const taskOption = document.getElementById("task-options");
const logoutButton = document.getElementById("logout-button");
const darkLightButton = document.getElementById("dark-light-button");

saveTaskButton.addEventListener("click", async function () {
  const title = document.getElementById("create-todo-title").value;
  const description = document.getElementById("create-todo-description").value;
  const dueDate = document.getElementById("create-todo-duedate").value;

  const newTodo = {
    title: title,
    description: description,
    dueDate: dueDate,
    isDone: false,
  };
  const response = await fetch("http://localhost:3000/todos/create-todo", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      token: token,
    },
    body: JSON.stringify(newTodo),
  });

  const data = await response.json();

  renderTodo(data);
});

taskOption.addEventListener("change", function () {
  const selectedValue = this.value;

  if (selectedValue === "completed") {
    this.previousElementSibling.textContent = "Completed tasks";
    completeTodoEl.classList.toggle("hidden");
    pendingTodoEl.classList.toggle("hidden");
  } else {
    this.previousElementSibling.textContent = "Pending tasks";
    completeTodoEl.classList.toggle("hidden");
    pendingTodoEl.classList.toggle("hidden");
  }
});

function renderTodo(data) {
  const date = new Date(data.dueDate);
  const month = date.toLocaleString("default", { month: "long" });
  const dueDate = `${month} ${date.getDate()}, ${date.getFullYear()} ${date
    .getHours()
    .toString()
    .padStart(2, 0)}:${date.getMinutes().toString().padStart(2, 0)}`;

  const markup = `
          <div class="todos" data-id="${data.id.toString()}">
            <div class="todo-details details">
              <h4 class="todo-title">${data.title}</h4>
              <p class="todo-duedate">${dueDate}</p>
              <p class="todo-description">${data.description}</p>
            </div>
            <form class="todo-details edit hidden">
              <input class="edit-description"
              type="text" placeholder="Description" />
              <input class="edit-duedate" type="datetime-local" />
              <select class="edit-task-type">
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
              <button class="edit-form-btn">Update todo</button>
            </form>
            <button class="todo-edit-btn">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h357l-80 80H200v560h560v-278l80-80v358q0 33-23.5 56.5T760-120H200Zm280-360ZM360-360v-170l367-367q12-12 27-18t30-6q16 0 30.5 6t26.5 18l56 57q11 12 17 26.5t6 29.5q0 15-5.5 29.5T897-728L530-360H360Zm481-424-56-56 56 56ZM440-440h56l232-232-28-28-29-28-231 231v57Zm260-260-29-28 29 28 28 28-28-28Z"/></svg>
            </button>
            <button class="todo-delete-btn">
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
            </button>
          </div>`;

  if (data.isDone) {
    completeTodoEl.insertAdjacentHTML("afterbegin", markup);
    completeTodoEl
      .querySelector(".todo-delete-btn")
      .addEventListener("click", deleteTodo);
    completeTodoEl
      .querySelector(".todo-edit-btn")
      .addEventListener("click", openEditForm);

    completeTodoEl.querySelector(".edit").addEventListener("submit", editTodo);
  } else {
    pendingTodoEl.insertAdjacentHTML("afterbegin", markup);
    pendingTodoEl
      .querySelector(".todo-edit-btn")
      .addEventListener("click", openEditForm);
    pendingTodoEl
      .querySelector(".todo-delete-btn")
      .addEventListener("click", deleteTodo);
    pendingTodoEl.querySelector(".edit").addEventListener("submit", editTodo);
  }
}
function insertTodoHTML(data) {
  completeTodoEl.innerHTML = "";
  pendingTodoEl.innerHTML = "";
  if (data.length > 0) {
    data.forEach((resTodo) => {
      const todo = {
        title: resTodo.title,
        description: resTodo.description,
        dueDate: resTodo.dueDate,
        isDone: resTodo.isDone,
        id: resTodo._id,
      };
      renderTodo(todo);
    });
  } else {
    completeTodoEl.innerHTML =
      "<h4 class='no-todos'>No Task has been completed yet, please completed a task to view here</h4>";
    pendingTodoEl.innerHTML =
      "<h4 class='no-todos'>No Pending tasks available, please add a task to view</h4>";
  }
}

function openEditForm() {
  const parentEl = this.parentElement;
  parentEl.querySelector(".edit").classList.toggle("hidden");
  parentEl.querySelector(".details").classList.toggle("hidden");
}

async function editTodo(e) {
  e.preventDefault();

  const parentEl = this.parentElement;

  const title = parentEl.querySelector(".todo-title").textContent;
  const description = parentEl.querySelector(".edit-description").value;
  const dueDate = parentEl.querySelector(".edit-duedate").value;
  const id = parentEl.dataset.id;
  const taskType = parentEl.querySelector(".edit-task-type").value;
  const isDone = taskType === "completed" ? true : false;

  const updatedTodo = {
    title: title,
    description: description,
    dueDate: dueDate,
    id: id,
    isDone: isDone,
  };

  await fetch("http://localhost:3000/todos/update-todo", {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      token: token,
    },
    body: JSON.stringify(updatedTodo),
  });

  const response = await fetch("http://localhost:3000/todos/user-details", {
    method: "GET",
    headers: {
      "content-type": "application/json",
      token: token,
    },
  });
  const data = await response.json();
  insertTodoHTML(data.todos);
}

async function deleteTodo() {
  const id = this.parentElement.dataset.id;

  await fetch("http://localhost:3000/todos/delete-todo", {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
      token: token,
    },
    body: JSON.stringify({ id: id }),
  });

  const response = await fetch("http://localhost:3000/todos/user-details", {
    method: "GET",
    headers: {
      "content-type": "application/json",
      token: token,
    },
  });
  const data = await response.json();
  insertTodoHTML(data.todos);
}
logoutButton.addEventListener("click", function () {
  window.localStorage.removeItem("token");
  window.location.href = "http://localhost:3000/";
});

darkLightButton.addEventListener("click", function () {
  const body = document.body;
  body.classList.toggle("light-mode");
  if (body.classList.contains("light-mode")) {
    darkLightButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/></svg>`;
    localStorage.setItem("theme", "light");
  } else {
    darkLightButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z"/></svg>`;
    localStorage.removeItem("theme");
  }
});

async function init() {
  if (token) {
    const response = await fetch("http://localhost:3000/todos/user-details", {
      method: "GET",
      headers: {
        "content-type": "application/json",
        token: token,
      },
    });

    const data = await response.json();

    const name = data.fullName.split(" ")[0];
    const userNameEl = document.getElementById("user-name");
    userNameEl.textContent = "Welcome " + name;

    const todos = data.todos;

    insertTodoHTML(todos);

    const body = document.body;
    const theme = localStorage.getItem("theme");
    if (theme === "light") {
      body.classList.add("light-mode");
    }

    if (body.classList.contains("light-mode")) {
      darkLightButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/></svg>`;
    } else {
      darkLightButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M480-360q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0 80q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z"/></svg>`;
    }
  } else {
    window.location.href = "http://localhost:3000/signin";
  }
}
document.addEventListener("DOMContentLoaded", init);
