var mongoose = require('mongoose');
UserModel = require("../models/customerModel.js");
CarModel = require("../models/carModel.js");
var ObjectId = mongoose.Types.ObjectId;

function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}

module.exports = {
    AddCar: async (req, res) => {
        try {
            const {number, model,capacity,cost_per_day } = req.body;
            const userid = req.id;
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
                added_by: ObjectId(userid),
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
            const {model,capacity,priceRange,from,to} = req.body;
            const id = req.id;

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
    },
    GetCar: async (req, res) => {
        try {
            CarModel.findById(req.params.carid,function(error, car){
                if (error) throw Error(`Error occurred ${error}`);
                return res.status(200).json({
                    error: {
                        error: false,
                        message: ''
                    },
                    results: car
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
    },UpdateCar: async (req, res) => {
        try {
            const {number,model,capacity,cost_per_day} = req.body;
            const userid = req.id;
            CarModel.findById(req.params.carid,function(error, car){
                if (error) throw Error(`Error occurred ${error}`);
                let currentDate = new Date();
                let check = true;
                car.reserved.forEach(function(entry) {
                    if(entry.from > currentDate){
                        check = false;
                    };
                });
                if(!check){
                    return res.status(400).json({
                        error: {
                            error: true,
                            message: "Cannot update a car that has a reservation in the future"
                        },
                        results: {}
                    }); 
                }
                if(!car.added_by.equals(userid)){
                    return res.status(400).json({
                        error: {
                            error: true,
                            message: "You cannot update a car not added by you"
                        },
                        results: {}
                    }); 
                }
                toUpdate = {};
                if(number){
                    toUpdate["number"] = number;
                }
                if(model){
                    toUpdate["model"] = model;
                }
                if(capacity){
                    toUpdate["capacity"] = capacity;
                }
                if(cost_per_day){
                    toUpdate["cost_per_day"] = cost_per_day;
                }

                CarModel.updateOne({ _id: new ObjectId(req.params.carid) },toUpdate,function(error, car){
                    if (error) throw Error(`Error occurred ${error}`);
                    return res.status(200).json({
                        error: {
                            error: false,
                            message: ''
                        },
                        results: car
                    });
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
    },DeleteCar: async (req, res) => {
        try {
            const userid = req.id;
            CarModel.findById(req.params.carid,function(error, car){
                if (error) throw Error(`Error occurred ${error}`);
                let currentDate = new Date();
                let check = true;
                car.reserved.forEach(function(entry) {
                    if(entry.from > currentDate){
                        check=false;
                    };
                });
                if(!check){
                    return res.status(400).json({
                        error: {
                            error: true,
                            message: "Cannot delete a car that has a reservation in the future"
                        },
                        results: {}
                    });
                }
                if(!car.added_by.equals(userid)){
                    return res.status(400).json({
                        error: {
                            error: true,
                            message: "You cannot delete a car not added by you"
                        },
                        results: {}
                    }); 
                }
                CarModel.findOneAndRemove({ _id: new ObjectId(req.params.carid) },function(error, car){
                    if (error) throw Error(`Error occurred ${error}`);
                    return res.status(200).json({
                        error: {
                            error: false,
                            message: ''
                        },
                        results: "Deleted car"
                    });
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
    },ReserveCar: async (req, res) => {
        try {
            const userid = req.id;
            const {to , from } = req.body;
            let toDate = new Date(to);
            let fromDate = new Date(from);
            let currentDate = new Date();
            if(!isValidDate(toDate) || !isValidDate(fromDate)){
                return res.status(400).json({
                    error: {
                        error: true,
                        message: "dates are not valid"
                    },
                    results: {}
                }); 
            }
            if(toDate<fromDate || toDate<currentDate || fromDate<currentDate){
                return res.status(400).json({
                    error: {
                        error: true,
                        message: "please check the dates specified"
                    },
                    results: {}
                }); 
            }
            let check = true;
            await CarModel.findById(req.params.carid,function(error, car){
                if (error) throw Error(`Error occurred ${error}`);
                let currentDate = new Date();
                car.reserved.forEach(function(entry) {
                    if(fromDate <= entry.to && toDate >= entry.from){
                        check = false;
                    };
                });
            });
            if(!check){    
                return res.status(400).json({
                    error: {
                        error: true,
                        message: "This car already has a reservation between those dates"
                    },
                    results: {}
                }); 
            }
            CarModel.findByIdAndUpdate(req.params.carid, {
                $push: {"reserved": {from: fromDate, to: toDate,customerID: new ObjectId(userid)}}
            }, function(err, car){
                if (err) throw Error(`Error occurred ${err}`);
                return res.status(200).json({
                    error: {
                        error: false,
                        message: ""
                    },
                    results: "Car Booked",
                    car
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
    }
}   