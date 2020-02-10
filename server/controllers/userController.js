const { userHandler }  = require('../handlers')

let userController = {
    saveNewUsers : async (req,res) =>{
        let response = await userHandler.saveNewUsers(req,res)
        return response
    },

    loginExisitngUser : async (req,res) =>{
        let response = await userHandler.loginExistingUser(req,res)
        res.status(200).send(response)
    },

    validateToken : async (req,res) =>{
        let response = await userHandler.validateToken(req,res)
        res.status(200).send(response)
    },

    logoutExistingUser : async (req,res)=>{
        let response = await userHandler.logoutExistingUser(req,res)
        res.status(200).send(response)
    }
}

module.exports = userController