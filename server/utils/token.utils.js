const jwt = require('jsonwebtoken')

let tokenUtil = {
    createJWTToken : (id)=>{
        var token = jwt.sign({ id, expiresIn: '24h' }, new Buffer(process.env.SECRET, 'base64'));
        return token
    },

    decodeJWTToken : (token)=>{
        let tokenStatus = jwt.verify(token,new Buffer(process.env.SECRET,'base64'))
        return tokenStatus
    }    
}

module.exports = tokenUtil