const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    name: {type: String, required: true},
    type: {type: String, required: true},
    data: {type: Date, default: Date.now},
    owner: {type: Types.ObjectId, ref: 'User'}
})

module.exports = model('Image', schema)