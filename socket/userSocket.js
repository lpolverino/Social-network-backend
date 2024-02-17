const createUserEvents = (socket, clientSockets) => {
  const add_user = (userId) => {
    console.log("adding" + userId);
    clientSockets.add_user(socket.id, userId)
  }
  const follow = (followedId) => {
    console.log(`notifying ${followedId}`);
  }
  return{
    add_user,
    follow
  }
}

exports.createUserEvents = createUserEvents