const createClientSockets = () => {
  const ClientsSocketsId = {}
  const add_user = (socketId,userId) => {
    console.log(`the client:${socketId} is for the  user:${userId}`);
    ClientsSocketsId[`${userId}`] = socketId
  }

  const get_user = (userID) => {
    console.log(ClientsSocketsId);
    return ClientsSocketsId[`${userID}`]
  }
  return {
    add_user,
    get_user,
  }
}

exports.createClientSockets = createClientSockets