const modeButton = document.querySelector(".modeButton");
const modeButton2 = document.querySelector(".buttonIsDark");
const body = document.querySelector("body");
const container = document.querySelector(".container");
const infoMobile = document.querySelector(".infoFilter--mobile");
const submit = document.querySelector(".submit");
const inputElement = document.querySelector(".input");
const taskListElement = document.querySelector(".taskList");
const dragDrop = document.querySelector(".dragDrop");
const numberOfTasks = document.querySelector(".numberOfTasks");
const cross = () => document.querySelectorAll(".cross");
const checkbox = () => document.querySelectorAll(".checkbox");
const taskElement = () => document.querySelectorAll(".task");
const filterButtons = () => document.querySelectorAll(".filterButton");
const filterButtonsPop = () => document.querySelectorAll(".filterButtonPop");

const clearCompleted = () => document.querySelector(".clearCompleted");


const modeHandler = () => {
  body.classList.toggle("darkIsActive");

  saveToDB("darkmodeFlag", body.classList.contains("darkIsActive"));
};
modeButton.addEventListener("click", modeHandler);
modeButton2.addEventListener("click", modeHandler);


const checkboxMark = (e, index) => {
  const tasks = fetchData("tasks");
  tasks[index].isComplete = !tasks[index].isComplete;
  e.currentTarget.parentElement.classList.toggle("taskList--isActive");
  saveToDB("tasks", tasks);
  initDataOnStartup();
};

const deleteTask = (index) => {
  const tasks = fetchData("tasks");
  tasks.splice(index, 1);
  saveToDB("tasks", tasks);
  initDataOnStartup();
};
const fetchData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};
const renderTasks = (tasks) => {
  let taskList = "";

  tasks.forEach((task) => {
    taskList += `<li class="task ${
      task.isComplete ? " taskList--isActive" : ""
    }">
    <!--taskList--isActive -->
    <button class=" checkbox square">
    <img class="checkMark" src="images/icon-check.svg" alt="" />
    </button>
    <p class="taskContent">${task.value}</p>
    <button class="cross">
    <img src="images/icon-cross.svg" alt="" />
    </button>
    </li>`;
  });
  let CompletedLength = tasks.filter((item) => item.isComplete === false);
  // console.log(CompletedLength.length);
  if (!taskList) {
    dragDrop.style.display = "none";
    infoMobile.style.display = "none";
  }
  if (taskList) {
    dragDrop.style.display = "block";
    infoMobile.style.display = "flex";

    taskList += ` <div class="info">
    <span>items left <span class="numberOfTasks">${CompletedLength.length}</span></span>
    <div class="infoFilter">
      <button class = "filterButton" data-filter="all">All</button>
      <button class = "filterButton" data-filter="active">Active</button>
      <button class = "filterButton" data-filter="completed">Completed</button>
    </div>
    <button class= "clearCompleted">Clear Completed</button>
  </div>
`;
  }
  taskListElement.innerHTML = taskList;
  inputElement.value = "";
  initlisteners();
};
const addTask = (e) => {
  e.preventDefault();
  const value = inputElement.value;

  if (!value) return;
  const task = {
    value,
    isComplete: false,
  };
  const allTasks = fetchData("tasks") || [];
  allTasks.push(task);
  saveToDB("tasks", allTasks);
  renderTasks(allTasks);
  initDataOnStartup();
  // initlisteners();
};
const initDataOnStartup = () => {
  if (body.classList.contains("darkIsActive")) {
    renderTasks(fetchData("tasks"));
  } else {
    fetchData("darkmodeFlag") && modeHandler();
    renderTasks(fetchData("tasks"));
  }
};
const filterAction = (e) => {
  const filterType = e.currentTarget.dataset.filter;
  const tasks = fetchData("tasks");
  let filteredTasks;

  switch (filterType) {
    case "all":
      filteredTasks = tasks;
      break;
    case "active":
      filteredTasks = tasks.filter((task) => !task.isComplete);
      break;
    case "completed":
      filteredTasks = tasks.filter((task) => task.isComplete);
      break;
    default:
      filteredTasks = tasks;
      break;
  }
  renderTasks(filteredTasks);
};
//

const saveToDB = (tasks, data) => {
  localStorage.setItem(tasks, JSON.stringify(data));
};
const initlisteners = () => {
  cross().forEach((icon, index) => {
    icon.addEventListener("click", () => deleteTask(index));
  });
  checkbox().forEach((icon, index) =>
    icon.addEventListener("click", (e) => checkboxMark(e, index))
  );
  checkbox().forEach((icon, index) =>
    icon.addEventListener(
      "keydown",
      (e) => e.key === "Enter" && toggleBox(e, index)
    )
  );

  clearCompleted().addEventListener("click", () => {
    const tasks = fetchData("tasks");
    const incompleteTasks = tasks.filter((task) => !task.isComplete);
    saveToDB("tasks", incompleteTasks);
    initDataOnStartup();
  });

  filterButtons().forEach((button) => {
    button.addEventListener("click", filterAction);
  });
  filterButtonsPop().forEach((button) => {
    button.addEventListener("click", filterAction);
  });
};

submit.addEventListener("click", addTask);

initDataOnStartup();

new Sortable(taskListElement, {
  animation: 150,
  swap: true,
  swapClass: "highlight-background",
  onEnd: function (e) {
    // saving sort to db
    const tasks = fetchData("tasks");
    const movedTask = tasks.splice(e.oldIndex, 1)[0];
    tasks.splice(e.newIndex, 0, movedTask);
    saveToDB("tasks", tasks);
    initDataOnStartup();
  },
});
