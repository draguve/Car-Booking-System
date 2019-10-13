var mongoose = require('mongoose');
Schema = mongoose.Schema;


// Setup schema
var carSchema = mongoose.Schema({
    number: {
        type: String,
        required: true,
        unique: true
    },
    model: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    cost_per_day: {
        type: Number,
        required: true
    },
    added_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    reserved: [
        {
            from: Date,
            to: Date,
            customerID: {
                type: Schema.Types.ObjectId, 
                ref: 'User' 
            }
        }
    ]
});
// Export Car model
var Car = module.exports = mongoose.model('Car', carSchema);
