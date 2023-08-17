const taskTime = document.getElementById('taskTime');
const taskContainer = document.getElementById('task-container');
const viewTask = document.getElementById('view-task');
const checkbox = document.getElementById('completed-checkbox');
const popup = document.getElementById('popup');

const tasks = [];

function addTask(taskText, taskTimeValue) {
  if (taskText !== "") {
    const newTask = { text: taskText, time: taskTimeValue, completed: false, index: tasks.length };
    tasks.push(newTask);
    updateTaskList();
  }
}

let taskList = document.getElementById('taskList');
taskList.style.visibility = 'hidden';

function updateTaskList() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    let li = document.createElement("li");
    li.textContent = `${index + 1}. ${task.text} - ${task.time}`;

    let deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function() {
      deleteTask(index);
    });

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", function() {
      task.completed = checkbox.checked;
      saveTasksToLocalStorage();
    });

    li.appendChild(checkbox);
    li.appendChild(deleteButton);
    taskList.appendChild(li);
  });
}

const addTaskBtn = document.getElementById('add-task');
addTaskBtn.addEventListener("click", () => {
  const taskInput = document.getElementById('taskInput');
  const taskTimeValue = taskTime.value; // Store the task time value
  addTask(taskInput.value, taskTimeValue);
  taskInput.value = "";
  taskTime.value = "";
});

// Function to show the popup
function showPopup(taskText, taskTimeValue) {
  popup.style.display = 'block';
  const popupText = document.createElement('p');
  popupText.textContent = `It's time for your task: ${taskText}`;
  popup.appendChild(popupText);

// Set a timer to hide the popup after an hour
const currentTime = new Date().getTime();
const taskTimeMs = new Date(taskTimeValue).getTime();
const oneHourMs = 60 * 60 * 1000;

const hidePopupTimeout = setTimeout(() => {
  popup.style.display = 'none';
  clearTimeout(hidePopupTimeout);
}, taskTimeMs + oneHourMs - currentTime);
}

// Event listener to show the popup when the task time matches the user's local time
addTaskBtn.addEventListener("click", () => {
  const taskInput = document.getElementById('taskInput');
  const taskTimeValue = taskTime.value; // Store the task time value
  addTask(taskInput.value, taskTimeValue);
  showPopup(taskInput.value, taskTimeValue); // Call the showPopup function
  taskInput.value = "";
  taskTime.value = "";
});


function deleteTask(index) {
  if (index >= 0 && index < tasks.length) {
    tasks.splice(index, 1);
    updateTaskList();
    for (let i = index; i < tasks.length; i++) {
      tasks[i].index--;
    }
  }
}

const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
tasks.push(...storedTasks);
updateTaskList();

function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

const tasksProxy = new Proxy(tasks, {
  set: function(target, property, value, receiver) {
    const result = Reflect.set(target, property, value, receiver);
    if (property !== "length" && property !== "completed") {
      saveTasksToLocalStorage();
    }
    return result;
  },
});

viewTask.addEventListener('click', () => {
  taskList.style.visibility = 'visible';
});

checkbox.addEventListener("change", function() {
  const taskIndex = tasks.findIndex((task) => task.id === this.id);
  tasks[taskIndex].completed = this.checked;
  saveTasksToLocalStorage();
});

const clearCompletedTasksBtn = document.getElementById('clear-completed-tasks');
clearCompletedTasksBtn.addEventListener("click", function() {
  tasks = tasks.filter((task) => !task.completed);
  updateTaskList();
  saveTasksToLocalStorage();
});