const {passwordValidation} = require('./validate')

exports.updatePassword = (req, res, next) => {
  req.check('oldpassword', 'Missing field (username)').exists()
  req.check('newpassword', 'Missing field (password)').exists()
  passwordValidation('newpassword', req, res, function(){
    next()
  })
}

exports.editDreamEntry = (req, res, next) => {
  req.check('title','missing field (title)').exists()
  req.check('tags','must be of type array').optional({ checkFalsy: true }).isArray()
  req.check('entry', 'Missing field (entry)').exists()
  next()
}

exports.removeUser = (req, res, next) => {
  console.log(req.body);
  req.check('oldpassword','Missing field (oldpassword)').exists()
  next()
}
