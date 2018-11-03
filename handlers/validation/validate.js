const {validationResult} = require('express-validator/check');
var {jsonHeader} = require('../jsonResponse/jsonResponse');

// TODO: Export default
exports.handleValidation = (schema) => {
  return function(req, res, next) {
    schema(req, res, function() {
      //Seems to only work withthis .....
      req.validationErrors()
      const errorFormatter = ({location, msg, param, value, nestedErrors}) => {
        // Build your resulting errors however you want! String, object, whatever - it works!
        return {
          detail: msg,
          source: {
            "pointer": `/data/attributes/${param}`
          }
        };
      };
      var errors = validationResult(req).formatWith(errorFormatter)
      if (!errors.isEmpty()) {
        return res.status(400).json(
          jsonHeader({
            errors: errors.array(),
            links: {
              "self": "/api" + req.url
            }
          })
        )
      }
      next()
    })
  }
};

/*
  Verify password capacha
  IN: req.body password name
*/
exports.passwordValidation = (password_name,req, res, next) => {
  req.check(password_name, "Must contain number 0-9").matches(/^(?=.*?[0-9])/g)
  req.check(password_name, "Must container capital A-Z").matches(/^(?=.*?[A-Z])/g)
  req.check(password_name, "Must contain special character excluding").matches(/^(?=.*?[\W])/g)
  req.check(password_name, "Must be at least 8 characters long").matches(/^(?=.{8,}$)/g)
  next()
}
