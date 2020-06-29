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

    getAllUsers : async (req,res) =>{
        let response = await userListHandler.showAllActiveUsers('himanshu')
        console.log(response)
        res.status(200).send(response)
    }
}

module.exports = userController