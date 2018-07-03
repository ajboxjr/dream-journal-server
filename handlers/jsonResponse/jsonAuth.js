var JSONAPISerializer = require('jsonapi-serializer').Serializer;
// var JSONAPIError = require('jsonapi-serializer').Serializer;

exports.tokenReponse = (token) => {
  var TokenSerializer = new JSONAPISerializer('token', {
    attributes: ['access_token', 'expires_in', 'token_type']
  });
  return TokenSerializer.serialize({token_type: 'bearer_token', access_token: token, 'expires_in': process.env.TOKEN_EXP})
}

exports.tokenErrorResponse = (error) => {
  var JsonTokenError = require('jsonapi-serializer').Error;
  var error = new JsonTokenError({detail: error});
  return error;
}
