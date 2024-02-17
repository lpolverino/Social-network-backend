const ping = require("./pingSocket")
const user = require("./userSocket")
const clientSockets = require("./ClientSocketId")
const clientsSockets = clientSockets.createClientSockets()

const socketHandler = {
  createSocket: (socket) => {
    console.log("Adding Ping Events");
    socket.on("ping", ping.ping)
    console.log("Adding users Envets");
    const userEvents = user.createUserEvents(socket, clientsSockets)
    socket.on("username", userEvents.add_user)
    socket.on("following", userEvents.follow)
  }
}

exports.create_socket_handlers = socketHandler.createSocket