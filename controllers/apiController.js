var mongoose = require('mongoose');
UserModel = require("../models/customerModel.js");
CarModel = require("../models/carModel.js");


module.exports = {
    AddCar: async (req, res) => {
        try {
            const {number, model,capacity,cost_per_day,_id } = req.body;
            let num =  number.replace(/ /g,'').toLowerCase()
            if(await CarModel.findOne({ number: num})){
                return res.json({
                    error: {
                        error: true,
                        message: 'Car Already Exists'
                    }
                });
            }

            //Create new car 
            const car = new CarModel({
                number: num,
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
            const {model,capacity,priceRange,_id,from,to} = req.body;

            query = {};
            if(model){
                query["model"] =  new RegExp('^'+model+'$', "i");
            }
            if(capacity){
                query["capacity"] = {};
                query["capacity"]["$gte"] = capacity;
            }
            if(priceRange){
                query["cost_per_day"] = {}
                if(priceRange.lower){
                    query["cost_per_day"]["$gte"] = priceRange.lower;
                }
                if(priceRange.upper){
                    query["cost_per_day"]["$lte"] = priceRange.upper;
                }
            }
            //Date validation
            if(to || from){ 
                query["reserved"] = {};
                query["reserved"]["$not"] = {};
                query["reserved"]["$not"]["$elemMatch"] = {};
                if(to){
                    query["reserved"]["$not"]["$elemMatch"]["from"] = {$lt: new Date(to)};
                }
                if(from){
                    query["reserved"]["$not"]["$elemMatch"]["to"] = {$gt: new Date(to)};
                }
            }
            CarModel.find(query,function(error, cars){
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