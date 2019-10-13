const jwt = require("jsonwebtoken");

module.exports = {
    AuthenticateUserToken: function(req, res, next) {
        const token = req.headers.authorization;
        if (token) {
            jwt.verify(token.split(' ')[1], process.env.SECRET_KEY, function(err, decoded) {
                if(err) {
                    return res.json({
                        error: {
                            error: true,
                            message: "Failed to authenticate user"
                        },
                        data: {}
                    });
                } else {
                    req._id = decoded._id;                    
                    next();
                }   
            });
        } else {
            return res.status(403).json({
                error: {
                    error: true,
                    message: "Route forbidden! Login to continue"
                },
                data: {}
            });
        }
    }
};
