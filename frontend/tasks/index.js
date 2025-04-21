const menuOpener = document.getElementById("menu-opener");
const menu = document.getElementById("options-menu");
const popups = document.getElementById("popups");
const tbody = document.getElementById("table-body");
const TO_DO = 1;
const DONE = 2;
var filterStatus = 0;
var editingTask = null;
var tasks = [];

const currentUser = JSON.parse(localStorage.getItem("user"));

class Task {
    constructor(id, title, description, status, line) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.line = line;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (currentUser && currentUser.name) {
        document.getElementById("user-name").innerText = currentUser.name;
    } else {
        signOut();
    }
});

menuOpener.addEventListener("click", () => {
    const rect = menuOpener.getBoundingClientRect();
    menu.style.left = `${rect.left}px`;
    menu.style.top = `${rect.bottom}px`;
    menu.classList.toggle("hidden");
});

document.addEventListener("click", (e) => {
    if (!menuOpener.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.add("hidden");
    }
});

function addTask() {
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;

    if (title == "") {
        showPopup("Unfilled required field");
        return;
    }

    if (editingTask != null) { // editing task
        editingTask.title = title;
        editingTask.description = description;

        const fields = editingTask.line.children;
        fields[0].textContent = title;
        fields[1].textContent = description;

        updateTask(editingTask);
    } else { // creating task
        let task = new Task(undefined, title, description, TO_DO, undefined);
        insertTask(task);
    }
}

function generateLine(task) {
    let newLine = document.createElement("div");
    task.line = newLine;

    let titleField = document.createElement("div");
    titleField.textContent = task.title;
    titleField.style.width = "30%";

    let descriptionField = document.createElement("div");
    descriptionField.textContent = task.description;
    descriptionField.style.width = "40%";

    let actionsField = document.createElement("div");
    actionsField.style.width = "30%";

    let statusOption = document.createElement("img");
    statusOption.src = "../imgs/done.png";
    statusOption.classList.add("status-option", "unchecked");
    statusOption.addEventListener("click", function () {
        toggleStatus(this, task);
    })

    let editOption = document.createElement("img");
    editOption.src = "../imgs/editar.png";
    editOption.addEventListener("click", () => {
        setEditingInterface(task);
    })

    let deleteOption = document.createElement("img");
    deleteOption.src = "../imgs/deletar.png";
    deleteOption.addEventListener("click", () => {
        deleteTask(task);
    })

    actionsField.appendChild(statusOption);
    actionsField.appendChild(editOption);
    actionsField.appendChild(deleteOption);

    newLine.appendChild(titleField);
    newLine.appendChild(descriptionField);
    newLine.appendChild(actionsField);

    if (task.status == TO_DO) task.line.classList.add("line", "to-do");
    else {
        task.line.classList.add("line", "done");
        statusOption.classList.remove("unchecked");
    }

    tbody.appendChild(newLine);

    requestAnimationFrame(() => {
        newLine.classList.add("show");
    })

    document.getElementById("title").value = "";
    document.getElementById("description").value = "";

    if (filterStatus == 1) showToDo();
    if (filterStatus == 2) showDone();
}

function signOut() {
    localStorage.clear();
    window.location.replace("http://localhost/task-manager/frontend/auth/signin/");
}

function goToUserManaging() {
    window.location.href = "http://localhost/task-manager/frontend/manageuser";
}

function toggleStatus(statusOption, task) {
    currentLine = task.line;
    currentLine.classList.toggle("done");
    currentLine.classList.toggle("to-do");
    statusOption.classList.toggle("unchecked");

    if (task.status == TO_DO) {
        task.status = DONE;
        showPopup("Task completed successfully");
    } else if (task.status == DONE) task.status = TO_DO;

    patchStatus(task);
    if (filterStatus == 1) showToDo();
    if (filterStatus == 2) showDone();
}

function showAll(elem) {
    filterStatus = 0;
    if (elem) activeFilter(elem);
    for (let task of tasks) {
        task.line.style.display = "flex";
    }
}

function showToDo(elem) {
    filterStatus = 1;
    if (elem) activeFilter(elem);
    for (let task of tasks) {
        if (task.status == TO_DO) task.line.style.display = "flex";
        else task.line.style.display = "none";
    }
}

function showDone(elem) {
    filterStatus = 2;
    if (elem) activeFilter(elem);
    for (let task of tasks) {
        if (task.status == DONE) task.line.style.display = "flex";
        else task.line.style.display = "none";
    }
}

function activeFilter(elem) {
    let filters = document.querySelectorAll(".filter");
    filters.forEach(filter => {
        if (filter != elem) filter.classList.remove("active");
        else filter.classList.add("active");
    });
}

function setEditingInterface(task) {
    document.getElementById("top-text").textContent = "Edit task";
    document.getElementById("add-button").textContent = "Save";
    document.getElementById("title").value = task.title;
    document.getElementById("description").value = task.description;
    editingTask = task;
}

function showPopup(message) {
    let newPopup = document.createElement("div");
    newPopup.textContent = message;
    newPopup.classList.add("popup");
    popups.appendChild(newPopup);

    requestAnimationFrame(() => {
        newPopup.classList.add("show");
    })

    setTimeout(() => {
        newPopup.classList.remove("show");
        setTimeout(() => {
            popups.removeChild(newPopup);
        }, 200);
    }, 2500);
}

async function getTasks() {
    try {
        const res = await fetch("http://localhost:8080/api/v1/task-manager/tasks");
        if (!res.ok) throw new Error("Error loading tasks");
        const data = await res.json();
        tasks = [];
        data.forEach(task => {
            if (task.userId == currentUser.id) {
                let newTask = new Task(task.id, task.title, task.description, task.status, undefined);
                generateLine(newTask);
                tasks.push(newTask);
            }
        });
    } catch (err) {
        console.error(err);
        showPopup("Error loading tasks");
    }
}

function insertTask(task) {
    const newTask = {
        title: task.title,
        description: task.description,
        status: task.status,
        userId: currentUser.id
    }

    fetch("http://localhost:8080/api/v1/task-manager/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newTask)
    })
        .then(res => {
            if (!res.ok) throw new Error("Error adding task");
            return res.json();
        })
        .then(createdTask => {
            task.id = createdTask.id;
            generateLine(task);
            tasks.push(task);
            showPopup("Task created");
        })
        .catch(err => {
            console.error(err);
            showPopup("Error adding task")
        })
}

function updateTask(task) {
    const updatedData = {
        title: task.title,
        description: task.description,
        status: task.status,
        userId: currentUser.id
    }

    fetch(`http://localhost:8080/api/v1/task-manager/tasks/${task.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedData)
    })
        .then(res => {
            if (!res.ok) throw new Error("Error updating task");
        })
        .then(() => {
            document.getElementById("top-text").textContent = "Add task";
            document.getElementById("add-button").textContent = "Add";
            document.getElementById("title").value = "";
            document.getElementById("description").value = "";
            showPopup("Task saved");
            editingTask = null;
        })
        .catch(err => {
            console.error(err);
            showPopup("Error updating task");
        })
}

function patchStatus(task) {
    fetch(`http://localhost:8080/api/v1/task-manager/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            status: task.status
        })
    })
        .then(res => {
            if (!res.ok) throw new Error("Error patching task status");
        })
        .catch(err => {
            console.error(err);
            showPopup("Error patching task status");
        })
}

function deleteTask(task) {
    fetch(`http://localhost:8080/api/v1/task-manager/tasks/${task.id}`, {
        method: "DELETE",
    })
        .then(res => {
            if (!res.ok) throw new Error("Error deleting task");
        })
        .then(() => {
            index = tasks.indexOf(task);
            if (index != -1) tasks.splice(index, 1);
            task.line.classList.remove("show");
            setTimeout(() => {
                task.line.remove();
                task = null;
            }, 200)
            showPopup("Task deleted");
        })
        .catch(err => {
            console.error(err);
            showPopup("Error deleting task");
        })
}