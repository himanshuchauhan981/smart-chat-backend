const express = require('express')

const { userController } = require('../controllers')

module.exports = () =>{
    const router = express.Router()

    router.post('/signup',
        userController.saveNewUsers
    )

    router.post('/login',
        userController.loginExisitngUser
    )

    router.get('/validateToken',
        userController.validateToken
    )

    router.get('/logout',
        userController.logoutExistingUser
    )

    return router
}