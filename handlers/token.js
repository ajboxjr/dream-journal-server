const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = mongoose.model('User')

/*
  // TODO: Store expired token to mongodb to
  to prevent reuse
*/

const garbageToken = async (token) => {
  return new Promise((resolve, reject) => {
    //// TODO: Store token to used database
    User.findOne({token: "token"}, function(err, user){
      console.log(user);
      if(!err){
        user.token = undefined;
        console.log('successfuly removed token');
        user.save()
        resolve()
      }
      else {
        console.log('error');
        reject()
      }
    })
  })
}

/*
  Handle incoming tokens by storing to request
  or invalidating token
*/
exports.requireValidToken = function(req,res,next) {
  //Get token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  console.log(token);
  if (token){ //Decode nToken and verify
   //Verify token user/ // TODO: handle expired token
   jwt.verify(token, process.env.SECRET , function(err, decodedToken) {
     if(decodedToken){
       console.log(decodedToken);
       req.user = decodedToken;
       next();
     }
     else {
       //send invalid token and delete token fuction.
       garbageToken().then(()=> {
         console.log('sucess duplicate');
       }).catch(()=> {
         console.log('not success');
       })
       console.log('bob');
       res.status(402).json({ tokenErr: 'Inavlid or expired token'})
    }
    })
  }
  else {
    res.status(403).json({ message: 'This path requires a token'});
  }
}
