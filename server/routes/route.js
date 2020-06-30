const express = require('express')

const { userController } = require('../controllers')
const { userHandler } = require('../handlers')

module.exports = () =>{
    const router = express.Router()

    router.post('/signup',
        userController.signUp
    )

    router.post('/login',
        userController.login
    )

    router.get('/validateToken',
        userController.validateToken
    )

    router.get('/logout',
        userController.logoutExistingUser
    )

    router.get('/users',
        userController.getAllUsersNames
    )

    return router
}