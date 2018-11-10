const {passwordValidation} = require('./validate')

exports.register = (req, res, next) => {
  req.check('username', 'Missing field (username)').exists()
  req.check('password', 'Missing field (password)').exists()
  req.check('verifyPassword', 'Missing field (verifyPassword)').exists()
  //Breaak underprelim conditions
  if(req.validationErrors()){
    return next()
  }
  req.check('password','password mismatch').equals(req.body.verifyPassword)
  if(req.validationErrors()){
    return next()
  }
  // /*password Validation*/
  passwordValidation('password', req, res, function(){
    next()
  })
}
exports.login = (req, res, next) => {
  req.check('username', 'Missing field (username)').exists()
  req.check('password', 'Missing field (password)').exists()
  next()
}
