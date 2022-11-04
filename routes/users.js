const express = require('express');
const user = require('../middleware/users')
const { ensureAuthentication } = require('../utilities')

usersRouter = express.Router()

// users CRUD
usersRouter.post('/logout', user.logoutUser)
usersRouter.post('/fetchUser', user.fetchUser)
usersRouter.post('/register', user.registerUser)
usersRouter.post('/login', user.loginUser)
//usersRouter.put('/users/:id', ensureAuthentication, users.updateUser)
//usersRouter.delete('/users/:id', ensureAuthentication, users.deleteUser)


module.exports = usersRouter