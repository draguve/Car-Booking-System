var mongoose = require('mongoose');
// Setup schema
var userSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    passhash: {
        type: String,
        required: true
    }
});
// Export User model
var User = module.exports = mongoose.model('user', userSchema);