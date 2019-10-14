const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
UserModel = require("../models/customerModel.js");
const { struct } = require('superstruct'); 

module.exports = {
    Register: async (req, res) => {
        try {
            const User = struct({
                username: 'string',
                password: 'string'
              });
            const { username, password } = User(req.body);
            if(await UserModel.findOne({ username: username })){
                return res.json({
                    error: {
                        error: true,
                        message: 'username already exists'
                    }
                });
            }
            const hash = await bcrypt.hash(password, 10);
            const user = new UserModel({username: req.body.username, passhash: hash })
            user.save(function(err,newUser) {
                if (err) throw Error(`Error occurred while saving ${err}`);
                let tok = jwt.sign( { _id: newUser._id }, process.env.SECRET_KEY, {expiresIn: 1440 })
                return res.json({
                    error: {
                        error: false,
                        message: ''
                    },
                    token: tok
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
    
    Login: async(req, res) => {
        try {
            const User = struct({
                username: 'string',
                password: 'string'
            });
            const { username, password } = User(req.body);
            UserModel.findOne({ username: username },async(error, user) => {
                if (error) throw Error(`Error occurred ${error}`);
                if (!user) {
                    throw new Error("User not registered");
                  }
                  const result = await bcrypt.compare(password, user.passhash);
                  if (!result) {
                    throw new Error("Password is incorrect");
                  }
                  return res.json({
                      error: {
                          error: false,
                          message: ''
                      },
                      token: jwt.sign({ _id: user._id.toString() }, process.env.SECRET_KEY, {expiresIn: 1440 })
                      
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