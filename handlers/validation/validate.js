const {validationResult} = require('express-validator/check');

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
        return res.status(400).json({
          jsonapi: {
            version: "1.0"
          },
          errors: errors.array(),
          links: {
            "self": "/api" + req.url
          }
        })
      }

      next()
    })
  }
};
