const menuOpener = document.getElementById("menu-opener");
const menu = document.getElementById("options-menu");
const popups = document.getElementById("popups");
const currentUser = JSON.parse(localStorage.getItem("user"));

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

async function changePassword() {
    let currentPassword = document.getElementById("current-password").value;
    let newPassword = document.getElementById("new-password").value;
    let confirmedNewPassword = document.getElementById("confirmed-new-password").value;

    if (currentUser.password != currentPassword) {
        showPopup("Incorrect user info");
        return;
    }
    if (newPassword != confirmedNewPassword) {
        showPopup("Passwords don't match");
        return;
    }
    if (currentPassword == newPassword) {
        showPopup("You must type a different password");
        return;
    }

    await patchPassword(newPassword);
}

function goToTaskManager() {
    window.location.href = "http://localhost/task-manager/frontend/tasks/";
}

function signOut() {
    localStorage.clear();
    window.location.replace("http://localhost/task-manager/frontend/auth/signin/");
}

function showCustomAlert(message, onDelete, onCancel) {
    const overlay = document.getElementById("custom-alert");
    const messageElem = document.getElementById("alert-message");
    const deleteBtn = document.getElementById("alert-delete");
    const cancelBtn = document.getElementById("alert-cancel");

    messageElem.textContent = message;
    overlay.classList.remove("hidden");

    deleteBtn.onclick = () => {
        overlay.classList.add("hidden");
        if (onDelete) onDelete();
    };

    cancelBtn.onclick = () => {
        overlay.classList.add("hidden");
        if (onCancel) onCancel();
    };
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

async function patchPassword(newPassword) {
    try {
        const res = await fetch(`http://localhost:8080/api/v1/task-manager/users/${currentUser.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password: newPassword
            })
        })
        if (!res.ok) throw new Error("Error updating password");
        currentUser.password = newPassword;
        showPopup("Changed password successfully");
    } catch (err) {
        console.log(err);
        showPopup("Error updating password");
    }
}

async function deleteAccount() {
    showCustomAlert("Are you sure you want to delete your account?",
        async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/v1/task-manager/users/${currentUser.id}`, {
                    method: "DELETE"
                })
                if (!res.ok) throw new Error("Error deleting user");
                signOut();
            } catch (err) {
                console.log(err);
                showPopup("Error deleting user");
            }
        }, () => {
            return;
        })
}
