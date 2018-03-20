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
var flash = require('express-flash');
var helmet = require('helmet')
app = express(helmet());

app.use(flash())
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

//Setting up database
mongoose.Promise = global.Promise;
console.log(process.env.MONGODB_URI);
// if( process.env.NODE_ENV == 'test'){
// 	mongoose.connect('mongodb://localhost/dream-journal-test', {useMongoClient: true});
// }
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/dream-journal', {useMongoClient: true});

//importing controllers
const dreams = require('./controllers/dream')
const auth = require('./controllers/auth-controller')
const profile = require('./controllers/profile')

//importing models
const Dream = require('./models/dream')
const User = require('./models/user')

// var isUser = (token) => {
// 	User.find({_id: token._id}, (err, user) => {
// 		if(user){
// 			return true
// 		}
// 		else{
// 			console.log(err);
// 			return false
// 		}
// 	})
// }

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
		 //grab store payload as user
		 // if (isUser(decodedToken.payload)) {
			 req.user = decodedToken.payload;
		 // }
		 //Check if user in database l8r babe
		 next();
 		}
		else {
			res.sendStatus(403).json({ message:'forbidden request' });
			next();
		}
		//Check if route is a posting route or a profile router
		}
}




//Middleware
app.use(checkAuth);
app.use('/api', dreams); // Route for CRUDDING dreams
app.use('/api', auth); //Login and Signup router
app.use('/api', profile) //User Profile and settings

// app.get('/', (req, res) => {
// 	let bodyClass = "home"
// 	bodyClass += req.bodyClass
// 	console.log(bodyClass)
// 	Dream.find({}, (err, dreams) => {
// 		res.send(dreams)
//   	//res.render('index', { bodyClass, user: req.user, dreams })
// 	})
// })

// app.get('/home', (req, res) =>{
// 	let bodyClass = "home"
// 	bodyClass += req.bodyClass
// 	if (req.user){
// 		Dream.find({author: req.user._id}, (err, dreams) => {
// 	  	//res.render('dreams', { bodyClass, user: req.user, dreams })
// 		})
// 	}
// 	else {
// 		//res.render('index', {bodyClass})
// 	}
// })
console.log(process.env.NODE_ENV);
app.listen(process.env.PORT || 3000, () => {
  console.log('app running on port',app.get('port'))
})

module.exports = app
