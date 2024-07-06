document.addEventListener("DOMContentLoaded", loadTasks);

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
    setTimeout(() => {
        ev.target.classList.add("dragging");
    }, 0);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var task = document.getElementById(data);
    var targetContainer = ev.target.closest('.column').querySelector('.task-container');
    targetContainer.appendChild(task);
    task.classList.remove("dragging");
    saveTasks();
}

function addTask(columnId) {
    var taskText = prompt("Enter task description:");
    if (taskText) {
        var column = document.querySelector(`#${columnId} .task-container`);
        var newTask = document.createElement("div");
        var taskId = "task" + new Date().getTime();
        newTask.id = taskId;
        newTask.className = "task";
        newTask.draggable = true;
        newTask.ondragstart = drag;
        newTask.innerHTML = `<span>${taskText}</span><button onclick="removeTask('${taskId}')">&times;</button>`;
        column.appendChild(newTask);
        saveTasks();
    }
}

function removeTask(taskId) {
    var task = document.getElementById(taskId);
    task.parentNode.removeChild(task);
    saveTasks();
}

function saveTasks() {
    var tasks = {};
    document.querySelectorAll(".column").forEach(column => {
        tasks[column.id] = [];
        column.querySelectorAll(".task").forEach(task => {
            tasks[column.id].push({ id: task.id, text: task.querySelector("span").textContent });
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    var tasks = JSON.parse(localStorage.getItem("tasks"));
    if (tasks) {
        for (var columnId in tasks) {
            tasks[columnId].forEach(taskData => {
                var column = document.querySelector(`#${columnId} .task-container`);
                var task = document.createElement("div");
                task.id = taskData.id;
                task.className = "task";
                task.draggable = true;
                task.ondragstart = drag;
                task.innerHTML = `<span>${taskData.text}</span><button onclick="removeTask('${taskData.id}')">&times;</button>`;
                column.appendChild(task);
            });
        }
    }
}
