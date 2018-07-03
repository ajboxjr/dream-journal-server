exports.dreamEntry = (req, res, next) => {
  req.check('entry', 'Missing field (entry)').exists()
  req.check('title', 'Missing field (title)').exists()
  req.check('tags','must be of type array').optional({ checkFalsy: true }).isArray()
  next()
}

exports.editDreamEntry = (req, res, next) => {
  req.check('title','missing field (title)').exists()
  req.check('tags','must be of type array').optional({ checkFalsy: true }).isArray()
  req.check('entry', 'Missing field (entry)').exists()
}
