//npm install -g forever
// forever start server.js

require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
//const requirejs = require('requirejs');


var helmet = require('helmet')
app = express(helmet());

//Destroy MongoDB Process sudo killall -15 mongod

//Creating a static folder for static files(css, images)
app.use(express.static(__dirname + '/public'));

//Use body parser to get infromation from forms
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

//Added methodOverride to  Update, and Delete
app.use(methodOverride('_method'));

// For website
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


//importing controllers
const dreams = require('./controllers/dream')
const auth = require('./controllers/auth-controller')
const profile = require('./controllers/profile')
const user = require('./controllers/user')

//importing models
const Dream = require('./models/dream')
const User = require('./models/user')

//Obtaining token from client to pass to api calls
const checkAuth = function(req, res, next){
	console.log("checkAuth - req.url : ", req.url)
	//Set user(token info) to none if on login
	if(req.url == '/api/login'  ||  req.url == '/api/sign-up'){
		req.user == null
		next();
	}
	else {
		//Get token
	 var token = req.body.token || req.query.token || req.headers['x-access-token'];
	 if (token){ //Decode nToken
		 var decodedToken = jwt.decode(token, { complete: true } || {});

		 try {
			req.user = decodedToken.payload;
			next();
		 }
		 catch(err){
			 console.log("Token is not decodable error: no user")
			 res.status(403).json({ message:'User token error' });
		 }
 		}
		else {
			res.status(403).json({ message:'forbidden request' });
		}
		//Check if route is a posting route or a profile router
		}
}

//Middleware
app.use(checkAuth);
app.use('/api', dreams); // Route for CRUDDING dreams
app.use('/api', auth); //Login and Signup router
app.use('/api', profile) //User Profile and settings
app.use('/api', user)

//Setting up database
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI,"mongodb://localhost/dream-jounal" , {useMongoClient: true})
// .then(()=>{
// 	console.log('conected to database sucessfully');
// }).catch((err)=>{
// 	console.log(err, "\ncould not start databse");
// });

var listener = app.listen(process.env.PORT || 3000, () => {
	console.log('app running on port', listener.address().port)
})

module.exports = app
