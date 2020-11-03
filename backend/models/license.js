var mongoose = require('mongoose');
const { Schema } = mongoose

var licenseSchema = new Schema({    
    name: { type: String},
    email: { type: String},
    mid: { type: String},
    serial: { type: String},
    expiry: { type: Number, default: 0},
    status : { type: Boolean, default: 0},
    reqTime: { type: Date}
});

module.exports = mongoose.model('License', licenseSchema);