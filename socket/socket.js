const ping = require("./pingSocket")
const user = require("./userSocket")

const socketHandler = {
  createSocket: (socket, clientsSockets) => {
    console.log("Adding Ping Events");
    socket.on("ping", ping.ping)
    console.log("Adding users Envets");
    const userEvents = user.createUserEvents(socket, clientsSockets)
    socket.on("username", userEvents.add_user)
    socket.on("notify", userEvents.notify)
  }
}

exports.create_socket_handlers = socketHandler.createSocket