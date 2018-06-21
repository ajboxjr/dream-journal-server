require('dotenv').config()
const mongoose = require('mongoose')

//Importing models
const Dream = require('./models/dream')
const User = require('./models/user')

//Import Routes & Middleware
const app = require('./app')

//Setting up database
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/dream-jounal" , {useMongoClient: true})
.then(()=>{
	console.log('conected to database sucessfully');
}).catch((err)=>{
	console.log(err, "\ncould not start databse");
});

var listener = app.listen(process.env.PORT || 3030, () => {
	console.log('app running on port', listener.address().port)
})

module.exports = app
