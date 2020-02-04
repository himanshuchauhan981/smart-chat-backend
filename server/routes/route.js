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

    return router
}