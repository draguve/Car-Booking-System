var mongoose = require('mongoose');
UserModel = require("../models/customerModel.js");
CarModel = require("../models/carModel.js");


module.exports = {
    AddCar: async (req, res) => {
        try {
            const {number, model,capacity,cost_per_day,_id } = req.body;
            if(await CarModel.findOne({ number: number })){
                return res.json({
                    error: {
                        error: true,
                        message: 'Car Already Exists'
                    }
                });
            }

            //Create new car 
            const car = new CarModel({
                number: number.replace(/ /g,'').toLowerCase(),
                model: model,
                capacity: capacity,
                cost_per_day: cost_per_day,
                added_by: mongoose.Types.ObjectId(_id),
                reserved: []
            });


            car.save(function(err,newUser) {
                if (err) throw Error(`Error occurred while saving ${err}`);
                return res.status(200).json({
                    error: {
                        error: false,
                        message: ''
                    },
                    message: "added successfully"
                });
            });
        } catch (err) {
            return res.status(500).json({
                error: {
                    error: true,
                    message: err.message
                },
                results: {}
            });
        }
    },
    GetCars: async (req, res) => {
        try {
            CarModel.find({
                model: new RegExp('^'+req.body.model+'$', "i"),
                capacity: {$gte: req.body.capacity},
                cost_per_day: {$gte: req.body.priceRange.lower, $lte: req.body.priceRange.upper},
                reserved: { 
                    $not: {
                        $elemMatch: {from: {$lt: req.body.to.substring(0,10)}, to: {$gt: req.body.from.substring(0,10)}}
                    }
    
                }
            },function(error, cars){
                if (error) throw Error(`Error occurred ${error}`);
                return res.status(200).json({
                    error: {
                        error: false,
                        message: ''
                    },
                    results: cars
                });
            })
        } catch (err) {
            return res.status(500).json({
                error: {
                    error: true,
                    message: err.message
                },
                results: {}
            });
        }
    }
}   