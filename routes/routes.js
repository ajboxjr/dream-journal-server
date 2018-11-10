const express = require('express')
const router = express.Router()
const validate = require('express-validation')
//importing controllers
const dreams = require('../controllers/dream')
const auth = require('../controllers/auth-controller')
const user = require('../controllers/user')

//Token Verification Middleware
const { requireValidToken } = require('../handlers/token')
//Request Body Validation
const {handleValidation} = require('../handlers/validation/validate')
const {login,register} = require('../handlers/validation/validateAuth')
const {dreamEntry} = require('../handlers/validation/validateDream')
const {updatePassword, removeUser } = require('../handlers/validation/validateUser')


//AUTH ROUTES
router.post('/login', handleValidation(login),auth.login)
router.post('/sign-up', handleValidation(register), auth.register)

//Dream Routes
router.get('/dream', requireValidToken, dreams.getDreamList)
router.post('/dream/new', requireValidToken, handleValidation(dreamEntry), dreams.createDream)
router.get('/dream/:dreamId', requireValidToken, dreams.getDream)
router.delete('/dream/:dreamId/delete', requireValidToken, dreams.deleteDream)
router.post('/dream/:dreamId/edit', requireValidToken, handleValidation(dreamEntry), dreams.editDream)

//User ROUTES
router.delete('/user/delete', requireValidToken, handleValidation(removeUser), user.deleteUser)
router.post('/user/change-password', requireValidToken, handleValidation(updatePassword), user.changeUserPassword)
router.get('/logout', user.logoutUser)

module.exports = router
