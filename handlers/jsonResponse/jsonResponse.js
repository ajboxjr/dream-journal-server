var JSONAPISerializer = require('jsonapi-serializer').Serializer;
const _ = require("underscore")

var JSONAPIError = require('jsonapi-serializer').Error;

/*
  JSON API version header
*/
const jsonHeader = (body) => {
  return _.extend({
    "jsonapi": {
      "version": "1.0"
    }
  }, body)
}

/*
  Universal errors
*/
const errorResponse = (error, code=null,links=null) => {
  var error = new JSONAPIError({detail: error, code:code, links:links});
  return jsonHeader(error);
}

/* Authentication */
const tokenReponse = (token) => {
  var TokenSerializer = new JSONAPISerializer('token', {
    attributes: ['access_token', 'expires_in', 'token_type']
  });
  const tokenJSON = TokenSerializer.serialize({token_type: 'bearer_token',
                                              access_token: token, 'expires_in': process.env.TOKEN_EXP})
  return jsonHeader(tokenJSON);
}

/*
  Dreams
*/
const dreamResponse = (dreams) => {
  var DreamSerializer = new JSONAPISerializer('dreams', {
    attributes: [
      'createdAt',
      'updatedAt',
      'author',
      'title',
      'entry',
      'tags'
    ]
  });
  const tokenJSON = DreamSerializer.serialize(dreams)
  return jsonHeader(tokenJSON);
}

exports.userResponse = (response) => {

}
module.exports = {
  jsonHeader: jsonHeader,
  errorResponse: errorResponse,
  tokenReponse: tokenReponse,
  dreamResponse: dreamResponse
}
