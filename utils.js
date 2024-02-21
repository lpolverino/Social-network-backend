
const { createHash } = require('crypto');

const getGravatarHash =  (email) => {

  if (email.length > 0 || email !== undefined){
    const correctEmail = email.trim().toLowerCase()
    const hashedEmail = createHash('sha256').update(correctEmail).digest('hex')
    return "https://gravatar.com/avatar/" + hashedEmail 
  }
  return undefined
}

exports.getGravatarHash = getGravatarHash