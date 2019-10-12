var mongoose = require('mongoose');
// Setup schema
var carSchema = mongoose.Schema({
    number: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    capacity: Number,
    cost_per_day: Number,
    reserved: [
        {
            from: String,
            to: String,
            customerID: String
        }
    ]
});
// Export Car model
var Car = module.exports = mongoose.model('car', carSchema);
