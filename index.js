require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
app = express();

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
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/dream-journal', {useMongoClient: true});

//importing controllers
const dreams = require('./controllers/dream')
const auth = require('./controllers/auth-controller')
const profile = require('./controllers/profile')
const about = require('./controllers/about')

//importing models
const Dream = require('./models/dream')
const User = require('./models/user')

// Check whether user has logged in based on cookies.
const checkAuth = function(req, res, next){
	if(req.cookies.nToken === undefined || req.cookies.nToken === null){
		req.user = null
		req.bodyClass = " "
		//Check if route is a posting route or a profile router
		if(req.url == '/profile'|| req.url=='/dream/new'){
			return res.redirect('/login')
		}
	} else {
		var token = req.cookies.nToken
		var decodedToken = jwt.decode(token, {complete: true} || {});
		req.user = decodedToken.payload;
		req.bodyClass = " loggedin"
		console.log("checkAuth - req.url : ", req.url)
	}
	next();
}



//Middleware
app.use(checkAuth);
app.use('/', dreams); // Route for CRUDDING dreams
app.use('/', auth); //Login and Signup router
app.use('/', profile) //User Profile and settings
app.use('/', about)

app.get('/', (req, res) => {
	let bodyClass = "home"
	bodyClass += req.bodyClass
	console.log(bodyClass)
	Dream.find({}, (err, dreams) => {
  	res.render('index', { bodyClass, user: req.user, dreams })
	})
})

app.get('/home', (req, res) =>{
	let bodyClass = "home"
	bodyClass += req.bodyClass
	if (req.user){
		Dream.find({author: req.user._id}, (err, dreams) => {
	  	res.render('dreams', { bodyClass, user: req.user, dreams })
		})
	}
	else {
		res.render('index', {bodyClass})
	}
})

app.listen(3000, () => {
  console.log('app running on port 3000.')
})
