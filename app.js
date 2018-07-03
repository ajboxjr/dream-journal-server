const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const expresssValidator = require('express-validator')
const helmet = require('helmet')
var morgan = require('morgan')
app = express(helmet())

//Morgan
app.use(morgan('tiny'))

//Use body parser to get infromation from forms
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
// Validate incoming data
app.use(expresssValidator())

//Added methodOverride to  Update, and Delete
app.use(methodOverride('_method'));

/*
  Parse url to determine whether to store token.
	if Authentication set req.user to null
*/

//Include Routes
app.use('/api', require('./routes/routes'))

// error handler, required as of 0.3.0
app.use('*', function(req, res, next) {
  // TODO: Add links
  res.status(404).json({
    error: [
      {
        details: "Not Found"
      }
    ]
  });
});

module.exports = app
