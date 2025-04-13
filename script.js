var popups = document.getElementById("popups");
var topText = document.getElementById("top-text");
var addButton = document.getElementById("add-button");
var filters = document.querySelectorAll(".filter");
var allTasks = document.getElementById("all-tasks");
var toDo = document.getElementById("to-do");
var done = document.getElementById("done");
var tbody = document.getElementById("table-body");
var editingLine = null;
var currentFilter = null;
var statusFilter = 0;
var tasks = [];
var toDoTasks = [];
var doneTasks = [];

addButton.addEventListener("click", function () {
    let title = document.getElementById("title").value;
    let description = document.getElementById("description").value;

    if (title == "") {
        showPopup("Unfilled required field");
        return;
    }

    // editing existing line
    if (editingLine != null) {
        listSubDiv = Array.from(editingLine.children);
        listSubDiv[0].innerHTML = title;
        listSubDiv[1].innerHTML = description;
        addButton.innerHTML = "Add task";
        topText.innerHTML = "Add task";
        editingLine = null;
        showPopup("Edited task successfully");
        return;
    }

    document.getElementById("title").value = "";
    document.getElementById("description").value = "";

    // creating new line
    let newLine = document.createElement("div");
    newLine.classList.add("line");
    newLine.classList.add("to-do");
    tasks.push(newLine);
    toDoTasks.push(newLine);

    let newTitle = document.createElement("div");
    let newDescription = document.createElement("div");
    let newActions = document.createElement("div");

    newTitle.textContent = title;
    newTitle.style.width = "30%";
    newDescription.textContent = description;
    newDescription.style.width = "40%";
    newActions.style.width = "30%";

    let doneOption = document.createElement("img");
    let editOption = document.createElement("img");
    let deleteOption = document.createElement("img");
    doneOption.src = "imgs/done.png";
    editOption.src = "imgs/editar.png";
    deleteOption.src = "imgs/deletar.png";

    // click event for done option
    doneOption.addEventListener("click", function () {
        let thisLine = this.closest(".line");
        thisLine.classList.toggle("done");
        thisLine.classList.toggle("to-do");

        if (toDoTasks.includes(thisLine)) {
            doneTasks.push(thisLine);
            index = toDoTasks.indexOf(thisLine);
            if (index != -1) toDoTasks.splice(index, 1);
            showPopup("Completed task successfully");
        } else {
            toDoTasks.push(thisLine);
            index = doneTasks.indexOf(thisLine);
            if (index != -1) doneTasks.splice(index, 1);
        }

        if (statusFilter == 1) showToDo();
        if (statusFilter == 2) showDone();

    })

    // click event for edit option
    editOption.addEventListener("click", function () {
        document.getElementById("title").value = title;
        document.getElementById("description").value = description;
        addButton.innerHTML = "Save";
        topText.innerHTML = "Edit task";
        editingLine = this.closest(".line");
    })

    // click event for delete option
    deleteOption.addEventListener("click", function () {
        let taskToDelete = this.closest(".line");
        taskToDelete.classList.remove("show");
        setTimeout(() => {
            taskToDelete.remove();
        }, 70);

        tasks = tasks.filter(t => t !== taskToDelete);
        toDoTasks = toDoTasks.filter(t => t !== taskToDelete);
        doneTasks = doneTasks.filter(t => t !== taskToDelete);

        showPopup("Task deleted");
    })

    // appending
    newActions.appendChild(doneOption);
    newActions.appendChild(editOption);
    newActions.appendChild(deleteOption);

    newLine.appendChild(newTitle);
    newLine.appendChild(newDescription);
    newLine.appendChild(newActions);
    tbody.appendChild(newLine);

    requestAnimationFrame(() => {
        newLine.classList.add("show");
    })

    if (statusFilter == 1) showToDo();
    if (statusFilter == 2) showDone();
    showPopup("Task added");
})

// filters CSS
filters.forEach(filter => {
    filter.addEventListener("click", () => {
        if (filter.classList.contains("active")) {
            filter.classList.remove("active");
        } else {
            filters.forEach(f => f.classList.remove("active"));
            filter.classList.add("active");
        }
    });
});

// filters logic
function showAll() {
    statusFilter = 0;
    tasks.forEach(task => {
        task.style.display = "flex";
    })
}

function showToDo() {
    statusFilter = 1;
    tasks.forEach(task => {
        if (toDoTasks.includes(task)) task.style.display = "flex";
        else task.style.display = "none";
    })
}

function showDone() {
    statusFilter = 2;
    tasks.forEach(task => {
        if (doneTasks.includes(task)) task.style.display = "flex";
        else task.style.display = "none";
    })
}

// popup logic
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