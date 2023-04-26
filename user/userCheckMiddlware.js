const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');


module.exports = async (req, res, next) => {
    // res.locals.user will be used to store the data of the logged-in user

    //get the token from the cookies
    const jwtToken = req.cookies.jwt;

    if(!jwtToken){
        res.locals.user = null;
    }
    else{
        //Token exists, verify it
        jwt.verify(jwtToken, process.env.JWT_SECRET, async (err, decodedToken) => {

            if(err){
                //Invalid token
                res.locals.user = null;
            }
            else{
                //the token is valid, fetch user data from database
                const user = await prisma.user.findUnique({
                    where: {
                        email: decodedToken.email
                    }
                })
                res.locals.user = user;
            }
        })
    }
    next();
}