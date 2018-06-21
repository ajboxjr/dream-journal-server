const express = require('express')
const router = express.Router()

//importing controllers
const dreams = require('../controllers/dream')
const auth = require('../controllers/auth-controller')
const user = require('../controllers/user')

//AUTH ROUTES
router.post('/login', auth.login)
router.post('/sign-up', auth.register)

//Dream Routes
router.get('/dream', dreams.getDreamList)
router.post('/dream/new', dreams.createDream)
router.get('/dream/:dreamId', dreams.getDream)
router.delete('/dream/:dreamId/delete', dreams.deleteDream)
router.post('/dream/:dreamId/edit', dreams.editDream)

//User ROUTES
router.delete('/user/delete', user.deleteUser)
router.post('/user/change-password', user.changeUserPassword)
router.get('/logout', user.logoutUser)

module.exports = router
