const ImageKit = require('imagekit')

const imageKit = new ImageKit({
    publicKey:process.env.IMGKIT_PUBLIC_KEY,
    privateKey:process.env.IMGKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMGKIT_ENDPOINT,
})

module.exports = imageKit