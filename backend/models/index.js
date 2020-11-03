const mongoose = require('mongoose')
const dbConfig = require("../config/db.config.js");

mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
if (process.env.NODE_ENV !== 'production') {
    db.mongoose.set("debug", true)
}
db.url = dbConfig.url;

    // require('./user')
    // require('./board')
module.exports = db;
