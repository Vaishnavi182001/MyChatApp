const jwt = require('jsonwebtoken');
const { dbConfig } = require('../config/secret');

module.exports = {
    VerifyToken:(req,res,next) =>{
        if(!req.headers.authorization){
            return res.status(403).json({message: 'No token provided'});
        }
        let token = req.headers.authorization;
        token = token.split(' ')[1];
      //  console.log(token);

        if(!token){
            return res.status(403).json({message: 'No token provided'});
        }

        return jwt.verify(token, dbConfig.secret, (err,decoded) =>{

            if(err){
                console.log('error ',err);
                if(err.expiredAt < new Date()){
                    console.log("Exp err");
                    return res.status(500).json({
                        message: 'Token has expired. Please login again',
                        token: null
                    })
                }

            }

            console.log('decoded',decoded)
            if (decoded && decoded.data) {
                req.user = decoded.data;

            } else {
                return res.status(401).json({ message: 'Invalid token data' }); // Ensure no further execution
            }
            next();
        });
    }
}