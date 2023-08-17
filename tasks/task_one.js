const taskTime = document.getElementById('taskTime');
const taskContainer = document.querySelector('#taskContainer');
const viewTask = document.getElementById('view-task');
const addNav = document.getElementById('add-task');
const popup = document.getElementById('popup');
let checkbox = document.createElement("input");

const tasks = [];

function addTask(taskText, taskTimeValue) {
  if (taskText !== "") {
    const newTask = { text: taskText, time: taskTimeValue, completed: false, index: tasks.length };
    tasks.push(newTask);
    updateTaskList();
    saveTasksToLocalStorage()
  }
}

let taskList = document.getElementById('taskList');

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
  // popup.style.display = 'block';
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
    saveTasksToLocalStorage()
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

console.log(taskContainer);
viewTask.addEventListener('click', () => {
  taskList.style.display = 'block';
  taskContainer.style.display = 'none';
});
addNav.addEventListener('click', () => {
  taskList.style.display = 'none';
  taskContainer.style.display = 'block';
});

window.addEventListener('load', () =>{
  taskList.style.display = 'none';
  taskContainer.style.display = 'block';

})

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