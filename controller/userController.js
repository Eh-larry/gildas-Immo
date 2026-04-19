const { User } = require("../models/userModel");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');


module.exports.register = async (req, res, next) => {
    try {
        console.log('start')
        let {name, email, password} = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({error:'certains champs sont manquants'})
        }
        let search = await User.findOne({email:email})
        if (!search) {
            console.log('pas search')
            let newPass = await bcrypt.hash(password, 12)
            if (email === 'larrypaul601@gmail.com') {
                let user = await User.create({
                    name:name,
                    email:email,
                    password:newPass,
                    place:'here'
                })
                console.log('utilisateur crée')
                let aleatory = jwt.sign({id:user._id, place:user.place, email},process.env.ACCESS_KEY, {"expiresIn":'30min'})
                res.status(201).json({message:'utilisateur créé', user:{email:user.email, role:user.role}, aleatory})
            } else {
                let user = await User.create({
                    name:name,
                    email:email,
                    password:newPass,
                    place:'not'
                })
                let aleatory = jwt.sign({id:user._id, place:user.place, email}, process.env.ACCESS_KEY, {"expiresIn":"30min"})
                res.status(201).json({message:'utilisateur créé', aleatory})
            }
        } else {
            res.status(400).json({error:'email déjà utilisé'})
        }
    } catch (error) {
        console.log(error)
        res.status(400).json({error:'quelque chose à mal tourné, veuillez réessayer plus tard'})
    }
}

module.exports.login = async (req, res, next) => {
    try {
        let {email, password} = req.body
        if (!email || !password) {
            return res.status(400).json({error:'certains champs sont manquants'})
        }
        let search = await User.findOne({email:email})
        let confirm = await bcrypt.compare(password, search.password)
        if (search && confirm) {
            let aleatory = jwt.sign({id:search._id, place:search.place, email}, ACCESS_KEY, {"expiresIn":"30min"})
            res.status(200).json({message:'connexion réussie', aleatory})
        } else {
            res.status(400).json({error:'email ou mot de passe incorrect'})
        }
    } catch (error) {
        res.status(400).json({error:'quelque chose à mal tourné, veuillez réessayer plus tard'})
    }
}