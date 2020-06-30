const { userHandler,userListHandler }  = require('../handlers')

let userController = {
    signUp : async (req,res) =>{
        let response = await userHandler.signUp(req,res)
        return response
    },

    login : async (req,res) =>{
        let values = req.body
        let response = await userHandler.login(values)
        res.status(200).send(response)
    },

    validateToken : async (req,res) =>{
        let response = await userHandler.validateToken(req,res)
        res.status(200).send(response)
    },

    logoutExistingUser : async (req,res)=>{
        let response = await userHandler.logoutExistingUser(req,res)
        res.status(200).send(response)
    },

    getAllUsersName : async (req,res) =>{
        let response = await userListHandler.showAllUserNames(req,res)
        res.status(200).send(response)
    }
}

module.exports = userController