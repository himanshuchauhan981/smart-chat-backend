const { userHandler }  = require('../handlers')

let userController = {
    saveNewUsers : async (req,res) =>{
        let response = await userHandler.saveNewUsers(req,res)
        return response
    }
}

module.exports = userController