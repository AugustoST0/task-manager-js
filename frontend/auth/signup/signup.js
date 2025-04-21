var popups = document.getElementById("popups");
var users = [];

class User {
    constructor(id, name, email, password) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
    }
}

async function submitData() {
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let confirmedPassword = document.getElementById("confirmed-password").value;

    // validating
    if (name == "" || email == "" || password == "" || confirmedPassword == "") {
        showPopup("Unfilled required fields");
        return;
    }
    if (password != confirmedPassword) {
        showPopup("Passwords do not match. Try again");
        return;
    }

    let valid = await isNameValid(name);
    if (!valid) {
        showPopup("Username already in use");
        return;
    }

    // registering new user
    insertUser(new User(undefined, name, email, password));
}

async function isNameValid(name) {
    await getUsers();
    const nameExists = users.some(user => user.name == name);
    return !nameExists;
}

function goToSignIn() {
    window.location.href = "http://localhost/task-manager/frontend/auth/signin";
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

async function getUsers() {
    try {
        const res = await fetch("http://localhost:8080/api/v1/task-manager/users");
        if (!res.ok) throw new Error("Error loading users");
        const data = await res.json();
        data.forEach(user => {
            users.push(new User(user.id, user.name, user.email, user.password));
        })
    } catch (err) {
        console.log(err);
        showPopup("Error loading users");
    }
}

function insertUser(user) {
    const newUser = {
        name: user.name,
        email: user.email,
        password: user.password
    }

    fetch("http://localhost:8080/api/v1/task-manager/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newUser)
    })
        .then(res => {
            if (!res.ok) throw new Error("Error signing user");
            return res.json();
        })
        .then(createdUser => {
            users.push(new User(createdUser.id, createdUser.name, createdUser.email, createdUser.password));
            goToSignIn();
        })
        .catch(err => {
            console.error(err);
            showPopup("Error signing user");
        })
}