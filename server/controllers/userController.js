const { userHandler }  = require('../handlers')

let userController = {
    saveNewUsers : async (req,res) =>{
        let response = await userHandler.saveNewUsers(req,res)
        return response
    },

    loginExisitngUser : async (req,res) =>{
        let response = await userHandler.loginExistingUser(req,res)
        res.status(200).send(response)
    }
}

module.exports = userController