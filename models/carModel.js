var mongoose = require('mongoose');
Schema = mongoose.Schema;


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
            customerID: {
                type: Schema.Types.ObjectId, 
                ref: 'User' 
            }
        }
    ]
});
// Export Car model
var Car = module.exports = mongoose.model('Car', carSchema);
