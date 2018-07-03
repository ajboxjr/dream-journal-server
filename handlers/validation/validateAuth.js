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
  req.check("password", "Must contain number 0-9").matches(/^(?=.*?[0-9])/g)
  req.check("password", "Must container capital A-Z").matches(/^(?=.*?[A-Z])/g)
  req.check("password", "Must contain special character excluding").matches(/^(?=.*?[\W])/g)
  req.check("password", "Must be at least 8 characters long").matches(/^(?=.{8,}$)/g)
  next()
}
exports.login = (req, res, next) => {
  req.check('username', 'Missing field (username)').exists()
  req.check('password', 'Missing field (password)').exists()
  next()
}
