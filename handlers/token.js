const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = mongoose.model('User')
const {errorResponse} = require('./jsonResponse/jsonResponse')

/*
  Handle incoming tokens by storing to request
  or invalidating token
*/

exports.requireValidToken = function(req, res, next) {
  //Get token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  if(!token){
    return res.status(401).json(errorResponse("Please login to obtain access to this resource","1352",'self'))
  }
  //Decode nToken and verify
  //Verify token user/  TODO: handle expired token
  jwt.verify(token, process.env.SECRET, function(err, decodedToken) {
    if (!decodedToken) {
      return res.status(401).json(errorResponse("Session expired, please re-login","1355" ,{self:"/api" + req.url}));
    }
    console.log('found token');
    req.user = decodedToken;
    return next();
  })
}
