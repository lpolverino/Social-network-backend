
const { createHash } = require('crypto');

const getGravatarHash =  (email) => {

  if (email.length > 0 || email !== undefined){
    const correctEmail = email.trim().toLowerCase()
    const hashedEmail = createHash('sha256').update(correctEmail).digest('hex')
    return "https://gravatar.com/avatar/" + hashedEmail 
  }
  return undefined
}

const errorToJson = (info, error) => {
  return {error:{msg:info, error}}
}

const parseErrorsToJson = (errors) => {
  return errors.map(error => {
    return {error:{msg:error.msg}}}
    )
}

exports.getGravatarHash = getGravatarHash
exports.errorToJson = errorToJson
exports.parseErrorsToJson = parseErrorsToJson