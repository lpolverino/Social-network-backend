const createUserEvents = (socket, clientSockets) => {
  const add_user = (userId) => {
    console.log("adding" + userId);
    clientSockets.add_user(socket.id, userId)
  }
  const notify = (userId, notification) => {
    const notifySocket = clientSockets.get_user(userId)
    socket.to(notifySocket).emit("notification","you have a notification")
  }

  return{
    add_user,
    notify,
  }
}

exports.createUserEvents = createUserEvents