const mongoose = require('mongoose')

const propertySchema = new mongoose.Schema({
    type:String,
    status:String,
    title:String,
    surface:Number,
    location:String,
    price:Number,
    description:String,
    images:[],
    createdAt:{type:Date, default:Date.now()}
})
const Property = mongoose.model('Property', propertySchema)

module.exports = {Property}