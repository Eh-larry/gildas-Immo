const mongoose = require('mongoose')

async function connectDB() {
    try {
        await mongoose.connect(process.env.DB_URI, {
            serverSelectionTimeoutMS:5000,
            tls:true,
            tlsAllowInvalidCertificates:false,
        })
        console.log('la db est connectée')
    } catch (error) {
        console.log('une erreur est survenue lors de la connexion à la db', error)
    }
}

module.exports = {connectDB}