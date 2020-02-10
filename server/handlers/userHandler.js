const bcryptjs = require('bcryptjs')

const { users,userOnlineStatus } = require('../models')
const { factories } = require('../factories')
const { tokenUtil } = require('../utils')
const { makeUserOffline } = require('./userListHandler')

checkExistingUsers = async (username,email)=>{
    let existingUserStatus = await users.find({$or:[{"username":username},{"email":email}]})
    return existingUserStatus
}

generateHashedPassword = async (password) =>{
    let salt = bcryptjs.genSaltSync(10)
    let hashedPassword = bcryptjs.hashSync(password,salt)
    return hashedPassword
}

checkHashedPassword = async(password,hashedPassword)=>{
    let status = bcryptjs.compareSync(password,hashedPassword)
    return status
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
        else res.status(200).send({ status: 200, signUpStatus: false, msg:'User already existed' })
    },

    loginExistingUser : async (req,res)=>{
        let existingUser = await users.findOne({"username":req.body.loginusername})

        if(existingUser != null){
            if(checkHashedPassword(req.body.loginpassword,existingUser.password)){
                let token = tokenUtil.createJWTToken(existingUser._id)
                await userOnlineStatus.updateOne({username:existingUser.username},{$set:{isActive:'online'}})
                return { status: 200, loginStatus: true,token: token }
            }
        }
        return { status: 200, loginStatus: false,loginError:'Incorrect Credentials'}
    },

    validateToken : async (req,res)=>{
        let token = req.headers.authorization
        let decodedToken = tokenUtil.decodeJWTToken(token)
        let usernameObject = await users.findById(decodedToken.id).select({username:1})
        return { status:200, username: usernameObject.username}
    },

    logoutExistingUser : async (req,res)=>{
        let token = req.headers.authorization

        let decodedToken = tokenUtil.decodeJWTToken(token)
        let usernameObject = await users.findById(decodedToken.id).select({username:1})
        
        await makeUserOffline(usernameObject.username)
        return { status: 200, msg:'User Logout sucessfully' }
    }
}

module.exports = userHandler