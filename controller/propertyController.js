const sharp = require('sharp')
const imageKit = require('../config/imageKit')
const { Property } = require("../models/propertyModel")
const { User } = require("../models/userModel")

module.exports.postProperty = async (req, res, next) => {
    try {
        let search = await User.findById(req.user.id)
        if (search && search.email === "larrypaul601@gmail.com" && search.place === "here") {
            if (!req.files) {
                return res.status(400).json({error:'images manquantes'})
            }
            let {type, statut, title, surface, location, price, description} = req.body
            let property = new Property({
                type,
                statut,
                title,
                surface : (surface!=="")?surface:undefined,
                location,
                price,
                description
            })
            await property.save()

            //sharp compression && image upload
            let results = await Promise.all(
             req.files.map(async(file) => {
                try {
                    let processed = await sharp(file.buffer)
                    .resize(400)
                    .avif({quality:60})
                    .toBuffer()
                    let uploadStream = await imageKit.upload({
                        file:processed.toString('base64'),
                        fileName:`gildasImmo-${Date.now()}.avif`,
                        folder:"GildasImmo"
                    })
                    return {
                        url: uploadStream.url,
                        fileId:uploadStream.fileId
                    }
                } catch (error) {
                    await Property.findByIdAndDelete(property.id)
                    console.log("erreur survenue lors de l'envoie de photo", error)
                    return res.status(400).json({error:"une erreur est survenue lors de l'ajout d'image, veuillez verifier votre connexion ou votre formule."})
                }
            })
        )
            property.images = results
            await property.save()
            res.status(201).json({message:'propriété crée.'})
        } else {
            res.status(400).json({error:"access non autorisé."})
        }
        } catch (error) {
            res.status(400).json({error:"Une erreur est survenue lors de la création de la propriété, veuillez réessayer plus tard."})
        }
}


module.exports.getProperties = async (req, res, next) => {
    try {
        let {page, limit} = req.query
        page = parseInt(page)
        limit = parseInt(limit)
        const skip = (page-1)*limit
        let properties = await Property.find().sort({createdAt:-1}).skip(skip).limit(12)
        res.status(200).json({properties:properties})
    } catch (error) {
        res.status(400).json({error})
    }
}

module.exports.deleteOne = async (req, res, next) => {
    try {
        let user = req.user
        let search = await User.findById(user.id)
        if (search && search.email === 'larrypaul601@gmail.com' && search.place=='here') {
            let {id} = req.query
            let prop = await Property.findById(id)
            if (!prop) {
                return res.status(400).json({error:'bien inexistant ou déjà supprimé.'})
            } else {
                await Promise.all(
                    prop.images.map(async (img) => {
                        console.log(img)
                        try {
                            return await imageKit.deleteFile(img.fileId)
                            console.log('image supprimée')
                        } catch (error) {
                            console.log(error)
                        }
                    })
                )
                console.log('c est ok')
                await Property.findByIdAndDelete(id)
                res.status(200).json({message:'bien supprimé avec succès'})
            }
        } else {
            res.status(400).json({error:"autorisation requise."})
        }
    } catch {
        res.status(400).json({error:"une erreur est survenue lors de la suppression du bien veuillez réessayer plus tard"})
    }
}
