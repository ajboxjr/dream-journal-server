const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const expresssValidator = require('express-validator')
const helmet = require('helmet')
app = express(helmet())

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

var handleUrl = function(fn){
  return function(req, res, next){
		console.log("req.url : ", req.url)
    if(req.url == '/api/login'  ||  req.url == '/api/sign-up'){
      res.user == null
      next();
    }
		else {
	    fn(req, res, function(){
				console.log('hi');
	      next();
	    })
		}
  }
}

//Middleware
app.use(handleUrl(require('./handlers/token').requireValidToken))

//Include Routes
app.use('/api', require('./routes/routes'))


module.exports = app
