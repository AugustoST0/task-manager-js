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
    let password = document.getElementById("password").value;

    // validating
    if (name == "" || password == "") {
        showPopup("Unfilled required fields");
        return;
    }

    await getUsers();
    for (const user of users) {
        if (user.name == name && user.password == password) {
            const currentUser = {
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password
            }
            localStorage.setItem("user", JSON.stringify(currentUser));
            window.location.replace("http://localhost/task-manager/tasks/");
            return;
        }
    }
    showPopup("Incorrent user info");
}

function goToSignUp() {
    window.location.href = "http://localhost/task-manager/auth/signup";
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