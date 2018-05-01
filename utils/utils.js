//Original :   // var regex = /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[~`<>#?!@$%^\'\"&*\-_]).{8,}$/g

//Return array of non matching conditions
const isValidPassword = (pass) => {
  var passArr = [/^(?=.*?[0-9])/g, /^(?=.*?[A-Z])/g, /^(?=.*?[\W])/g,/^(?=.{8,}$)/g];
  var invalidConditions = []
  if (!passArr[0].test(pass)){
      invalidConditions.push("Must contain number 0-9")
  }
  if (!passArr[1].test(pass)) {
      invalidConditions.push("Must container capital A-Z")
  }
  if (!passArr[2].test(pass)) {
      invalidConditions.push("Must contain special character excluding")
  }
  if (!passArr[3].test(pass)) {
      invalidConditions.push("Must be at least 8 characters long")
  }
  return invalidConditions
}
module.exports = {
  isValidPassword:isValidPassword
}
