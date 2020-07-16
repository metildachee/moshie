const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
require("dotenv").config();

app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static("public"));
app.use("/", require('./routes/dashboard.routes'));

let currentUsers = [];

io.on("connection", socket => {
    io.to(socket.id).emit("addNewUser", currentUsers);
    currentUsers.push({ name: "", id: socket.id });

    socket.on("newUser", (name, next) => {
        currentUsers.forEach( user => { if (user.id == socket.id) user["name"] = name; });
        socket.broadcast.emit("incomingMessage", `Admin: ${name} has joined moshie! Remember to say hi!`);
        socket.broadcast.emit("addNewUser", [{ name: `${name}` }]);
    })

    socket.on("messageSent", msg => socket.broadcast.emit("incomingMessage", msg));    
    socket.on("typingMessage", msg => socket.broadcast.emit("typingMessage", msg));
    socket.on("typingStopped", msg => socket.broadcast.emit("typingMessage", msg));

    socket.on("disconnect", () => {
        let user = currentUsers.find( user => user.id == socket.id );
        let index = currentUsers.findIndex( user => user.id == socket.id );
        io.emit("leftChat", user.name);
        currentUsers.splice(index, 1);
    });
})

http.listen(PORT = process.env.PORT || 3000, () => console.log(`Go to localhost:${PORT}`));
