const jwt = require('jsonwebtoken')
const { User } = require('../models/userModel')

async function authMiddleware(req, res, next) {
    let authHeader = req.headers.authorization
    let token = (authHeader)? authHeader.split(' ')[1] :undefined
    console.log(authHeader)
    if (!token) {
        return res.status(401).json({error:'acces non autorisé, token manquant'})
    } else {
        let decode = jwt.decode(token)
        console.log(decode)
        let user = await User.findById(decode.id)
        if (user && user.email == process.env.EMAIL && user.place == 'here') {
            console.log('autorisé')
            req.user = decode
            next()   
        } else {
            console.log('non autorisé')
            return res.status(400).json({error:"acces non autorisé"})
        }
    }
}

module.exports = {authMiddleware}