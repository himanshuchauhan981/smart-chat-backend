const bcryptjs = require('bcryptjs')

const { users,userOnlineStatus } = require('../models')
const { factories } = require('../factories')

checkExistingUsers = async (username,email)=>{
    let existingUserStatus = await users.find({$or:[{"username":username},{"email":email}]})
    return existingUserStatus
}

generateHashedPassword = async (password) =>{
    let salt = bcryptjs.genSaltSync(10)
    let hashedPassword = bcryptjs.hashSync(password,salt)
    return hashedPassword
}

let userHandler = {
    saveNewUsers : async (req,res) =>{
        let existingUser = await checkExistingUsers(req.body.signupusername,req.body.signupemail)

        if(existingUser.length === 0){
            req.body.signuppassword =await generateHashedPassword(req.body.signuppassword)
            let userObject = factories.createUserObject(req.body)
            let signupdata = new users(userObject)
            let savedUserData =await signupdata.save()
            
            let userLoginData = factories.userLoginStatusObject(savedUserData.username,null)
            let loginStatusData = new userOnlineStatus(userLoginData)
            await loginStatusData.save()
            res.status(200).send({ status: 200, signUpStatus: true })
        }
        else res.status(200).send({ status: 200, signUpStatus: false })
    }
}

module.exports = userHandler