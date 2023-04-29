//importing prisma Client
const jwt = require('jsonwebtoken');
const prisma = require('../prisma/prismaClient');
const bcrypt = require('bcrypt');
const fs = require('fs');

//Global constants
const jwt_maxAge = 1000 * 60 * 60 * 24; //1 day

//register controlllers
module.exports.get_register = async (req, res) => {
    res.send("This is the Calm sign in page");
}

module.exports.post_register = async (req, res) => {
    try {
        //get data from the request body
        const {email, password} = req.body;
        if(!/^[A-Za-z0-9+_.-]+@(.+)$/.test(email)){
            throw new Error('Invalid email format')
        }

        //checking if the email and password are given
        if(!email) throw new Error('No email provided');
        if(!password) throw new Error('No password provided');

        //encrypt the password before creating the account using bcrypt
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        //saving the data into the database
        const user = await prisma.calm_users.create({
            data: {
                email, password: hashedPassword,
            }
        });

        //Create a JWT token for the user & set the cookie
        const token = jwt.sign({email}, process.env.JWT_SECRET, {expiresIn: jwt_maxAge});
        res.cookie('jwt', token, { httpOnly: true, jwt_maxAge});

        //Send the response
        res.status(200).json({
            success: true,
            message: 'register successful',
            data: user,
        });

    } catch (error) {
        //send Error message
        if(error.code === "P2002") error.message = "Email already registered";


        res.status(400).json({
            success: false,
            message: error.message,
            data: {},
        })
    }
}

//Login controllers
module.exports.get_login = async (req, res) => {
    res.send("This is the Calm login page");
}

module.exports.post_login = async (req, res) => {
    try {
        //get the email address
        const { email, password } = req.body;
        
        //checking if the email and password are given
        if(!email) throw new Error('No email provided');
        if(!password) throw new Error('No password provided');
        
        //search for the user in the database
        const user = await prisma.calm_users.findUnique({
            where: {
                email
            }
        })

        //checking if there's an answer from the database
        if(!user) throw new Error('Incorrect email');

        //user found, now checking the password
        //** Check if there's a way to declare static methods on the user schmea in prisma */
        const auth = await bcrypt.compare(password, user.password);
        if(!auth) throw new Error('Incorrect password');
        
        //user successfully authenticated, now create the jwt token
        const token = jwt.sign({username: user.username, email}, process.env.JWT_SECRET, {expiresIn: jwt_maxAge});
        res.cookie('jwt', token, { httpOnly: true, jwt_maxAge});

        //send the response
        res.status(200).json({
            success: true,
            message: 'login successful',
            data: user
        })

    } catch (error) {
        
        //send Error message
        res.status(404).json({
            success: false,
            message: error.message,
            data: {},
        })
    }
}

module.exports.post_logout = (req, res) => {
    //set the cookie to '' and set a short expiry duration
    res.cookie('jwt', '', { maxAge: 1 });

    //redirect to the home page
    res.redirect('/');
}

module.exports.get_test = async(req, res)=>{
    try {
        fs.readFile('./prisma/schema.prisma', 'utf-8', (e, data) => {
            if (e) throw e;
            console.log(data);
            res.status(200).json({
                success: true,
                message: "file was successfully read",
                data: data,
            })
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
            data: {},
        })
    }
}