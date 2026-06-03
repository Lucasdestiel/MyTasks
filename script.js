const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");

const tasksContainer =
document.getElementById("tasksContainer");

const filters =
document.querySelectorAll(".filter");

let currentFilter = "all";

let tasks =
JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks(){
  localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
  );
}

function addTask(){

  const text = taskInput.value.trim();

  if(!text) return;

  tasks.push({
    id: Date.now(),
    text,
    completed:false
  });

  taskInput.value="";

  saveTasks();
  renderTasks();
}

function toggleTask(id){

  tasks = tasks.map(task =>

    task.id === id
      ? {...task, completed:!task.completed}
      : task

  );

  saveTasks();
  renderTasks();
}

function deleteTask(id){

  tasks = tasks.filter(
    task => task.id !== id
  );

  saveTasks();
  renderTasks();
}

function editTask(id){

  const task =
  tasks.find(task => task.id === id);

  const newText =
  prompt("Editar tarefa:", task.text);

  if(!newText) return;

  task.text = newText.trim();

  saveTasks();
  renderTasks();
}

function clearCompleted(){

  tasks =
  tasks.filter(task => !task.completed);

  saveTasks();
  renderTasks();
}

function updateStats(){

  const total =
  tasks.length;

  const completed =
  tasks.filter(
    task => task.completed
  ).length;

  const pending =
  total - completed;

  document.getElementById(
    "totalTasks"
  ).textContent = total;

  document.getElementById(
    "completedTasks"
  ).textContent = completed;

  document.getElementById(
    "pendingTasks"
  ).textContent = pending;

  const progress =
  total === 0
    ? 0
    : (completed / total) * 100;

  document.getElementById(
    "progressBar"
  ).style.width = `${progress}%`;
}

function renderTasks(){

  tasksContainer.innerHTML = "";

  let filteredTasks = tasks;

  if(currentFilter === "pending"){
    filteredTasks =
    tasks.filter(task => !task.completed);
  }

  if(currentFilter === "completed"){
    filteredTasks =
    tasks.filter(task => task.completed);
  }

  if(filteredTasks.length === 0){

    tasksContainer.innerHTML = `
      <div class="empty">
        Nenhuma tarefa encontrada.
      </div>
    `;

    updateStats();
    return;
  }

  filteredTasks.forEach(task => {

    const taskElement =
    document.createElement("div");

    taskElement.className =
      `task ${task.completed ? "completed" : ""}`;

    taskElement.innerHTML = `
      <div class="task-left">

        <input
          type="checkbox"
          ${task.completed ? "checked" : ""}
        >

        <span class="task-text">
          ${task.text}
        </span>

      </div>

      <div class="task-actions">

        <button class="icon-btn edit-btn">
          ✏️
        </button>

        <button class="icon-btn delete-btn">
          🗑️
        </button>

      </div>
    `;

    taskElement
      .querySelector("input")
      .addEventListener(
        "change",
        () => toggleTask(task.id)
      );

    taskElement
      .querySelector(".edit-btn")
      .addEventListener(
        "click",
        () => editTask(task.id)
      );

    taskElement
      .querySelector(".delete-btn")
      .addEventListener(
        "click",
        () => deleteTask(task.id)
      );

    tasksContainer.appendChild(
      taskElement
    );
  });

  updateStats();
}

addBtn.addEventListener(
  "click",
  addTask
);

taskInput.addEventListener(
  "keydown",
  (e)=>{
    if(e.key==="Enter"){
      addTask();
    }
  }
);

filters.forEach(btn=>{

  btn.addEventListener(
    "click",
    ()=>{

      filters.forEach(
        b=>b.classList.remove("active")
      );

      btn.classList.add("active");

      currentFilter =
      btn.dataset.filter;

      renderTasks();
    }
  );
});

document
.getElementById("clearCompleted")
.addEventListener(
  "click",
  clearCompleted
);

renderTasks();