const socket = io();
let name; let timer;

document.getElementById("send").addEventListener('click', sendMessage);
document.getElementById("nameBtn").addEventListener('click', addName);
document.querySelector('.inputMessage').addEventListener('keyup', typingHandler);

socket.on('onConnection', msg => displayMessage(msg));
socket.on("addNewUser", users => addUser(users));
socket.on("typingMessage", msg => document.querySelector('.typing').innerHTML = `<p class="italic">${msg}</p>`);
socket.on('incomingMessage', msg => displayMessage(msg));
socket.on('leftChat', username => updateUsers(username));

function sendMessage() {
    window.clearTimeout(timer);
    let inputMessage = `${name}: ${document.querySelector('.inputMessage').value}`;
    displayMessage(`You: ${document.querySelector('.inputMessage').value}`);
    document.querySelector('.inputMessage').value = "";
    socket.emit("messageSent", inputMessage);
    socket.emit("typingStopped", "");
}

function addName() {
    name = document.getElementById("name").value;
    document.getElementById("nameContainer").remove();
    addUser([{ name: "You" }]);
    displayMessage(`Welcome to the chat ${name}!`);
    socket.emit("newUser", `${name}`);
}

function typingHandler() {
    window.clearTimeout(timer);
    socket.emit("typingMessage", `${name}: is typing....`);
    timer = setTimeout(() => { socket.emit("typingStopped", "") }, 2000);
}

function displayMessage(msg) {
    let para = document.createElement("tr");
    if (msg.includes(":")) para.innerHTML = `<span class="bold">${msg.split(": ")[0]}: </span>${msg.split(": ")[1]}`;
    else para.textContent = msg;
    document.querySelector('.messageContainer').appendChild(para);
}

function addUser(users) {
    users.forEach( user => {
        let newUser = document.createElement("p");
        newUser.textContent = user.name;
        newUser.setAttribute("class", "badge badge-pill badge-primary");
        document.getElementById("peepsContainer").appendChild(newUser);
    })
}

function updateUsers(username) {
    document.getElementById("peepsContainer").childNodes.forEach( p => {
        if (p.textContent == username){
            displayMessage(`Admin: ${p.textContent} left the chat..`);
            p.remove();
        } 
    })
}

