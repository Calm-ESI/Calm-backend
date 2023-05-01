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
        
        //checking if the email and password are given
        if(!email) throw new Error('No email provided');
        if(!password) throw new Error('No password provided');
        
        //checking the format of the email
        if(!/^[A-Za-z0-9+_.-]+@(.+)$/.test(email)){
            throw new Error('Invalid email format')
        }
        
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

/*
module.exports.get_test = async(req, res)=>{
    try {
        // const data = [
        //     {
        //       name: 'Immediate',
        //       description: 'description for addressing 1',
        //       imagepath: "/assets/images/calm/addressing-modes/immediate.png"
        //     },
        //     {
        //       name: 'Direct',
        //       description: 'description for addressing 2',
        //       imagepath: "/assets/images/calm/addressing-modes/direct.png"
        //     },
        //     {
        //       name: 'Indirect',
        //       description: 'description for addressing 2',
        //       imagepath: "/assets/images/calm/addressing-modes/indirect.png"
        //     },
        //     {
        //       name: 'Based',
        //       description: 'description for addressing 2',
        //       imagepath: "/assets/images/calm/addressing-modes/based.png"
        //     },
        //     {
        //       name: 'Indexed',
        //       description: 'description for addressing 2',
        //       imagepath: "/assets/images/calm/addressing-modes/pointing.png"
        //     },
        //     {
        //       name: 'Based Indexed',
        //       description: 'description for addressing 2',
        //       imagepath: "/assets/images/calm/addressing-modes/basedIndexed.png"
        //     },
        //     {
        //       name: "Shift on 8 bits",
        //       description: 'description for addressing 2',
        //       imagepath: "/assets/images/calm/addressing-modes/right-arrow.png" 
        //     },
        //     {
        //       name: "Shift on 16 bits",
        //       description: 'description for addressing 2',
        //       imagepath: "/assets/images/calm/addressing-modes/double-right-arrow.png" 
        //     }
        // ];
        // const results = await prisma.addressing_modes.createMany({
        //     data,
        // })

        // const data = [
        // {   
        //     name: "Immediate",
        //     description:"Getting the information " +
        //         "immediately from the instruction code after decoding it, so the operand  would be in the second part of " +
        //         "the instruction (depending if where in the general format or the reduced format) to be used in the " +
        //         "execution with no memory access and that's why it's called immediate."
        // },
        // {   
        //     name: "Direct",
        //     description:"Getting the information directly from it's memory address that is " +
        //         "provided by the instruction, so here we'll have to do one memory access to " +
        //         "retrieve the information."
        // },
        // {   
        //     name: "Indirect",
        //     description:"Getting the information indirectly from the address that is stored in the address provided by the " +
        //         "instruction, at first it may sound a bit confusing but you'll see how much is this mode important when " +
        //         "you'll deal with pointers, no more spoils because you'll learn them in data structures, but I'll only want " +
        //         "you to remember that it's an memory address “pointing” the memory address that contains the information " +
        //         "that we want and so we'll have to do 2 memory accesses to get to it, the first one is to get the physical " +
        //         "address of the information and the second one is to retrieve the data."
        // },
        // {   
        //     name: "Based",
        //     description:"Getting the " +
        //         "information based on the address stored in the base register, so we'll have to do some " +
        //         "calculation by adding the value that we have in the instruction to the address found in the " +
        //         "base register to get the physical address of the data, it is used mostly to retrieve data from " +
        //         "arrays based on the first element of the array and it requires 1 memory access."
        // },
        // {
            
        //     name: "Based Indexed",
        //     description:"hello"
        // },
        // {  
        //     name:"Shift on 8 bits",
        //     description:"hello"
        // },
        // {
            
        //     name:"Shift on 16 bits",
        //     description:"hello"
        // }
        // ];

        // const promises = data.map(async o => {
        //     await prisma.addressing_modes.update({
        //         where:{
        //             name: o.name,
        //         },
        //         data: {
        //             description: o.description,
        //         }
        //     })
        // })

        // await Promise.all(promises)


        const components = [
            {
                name: "Instruction Pointer",
                description: 'desc',
                category: 'Memory Unit',
                imagepath: "/assets/images/calm/components/IP.svg",
            },
            {
                name: "Central Memory",
                description: 'desc',
                category: 'Memory Unit',
                imagepath: "/assets/images/calm/components/CmPic.svg",
                imageHeight: 65,
            },
            {
                name: "Memory Address Register",
                description: 'desc',
                category: 'Memory Unit',
                imagepath: "/assets/images/calm/components/MarPic.svg",
                imageHeight: 60,
            },
            {
                name: "Memory Data Register",
                description: 'desc',
                category: 'Memory Unit',
                imagepath: "/assets/images/calm/components/MdrPic.svg",
            },
            {
                name: "Data & address buses",
                description: 'desc',
                category: 'Memory Unit',
                imagepath: "/assets/images/calm/components/busPic.svg",
                imageHeight: 90,
            },
            {
                name: "Instruction Reception Unit",
                description: 'desc',
                category: 'Command Unit',
                imagepath: "/assets/images/calm/components/IRU.svg",
            },
            {
                name: "Sequencer",
                description: 'desc',
                category: 'Command Unit',
                imagepath: "/assets/images/calm/components/sequencerPic.svg",
            },
            {
                name: "ALU",
                description: 'desc',
                category: 'Processing Unit',
                imagepath: "/assets/images/calm/components/AluPic.svg",
            },
            {
                name: "Registers",
                description: 'desc',
                category: 'Processing Unit',
                imagepath: "/assets/images/calm/components/registersPic.svg",
            },
            {
                name: "Flag Register",
                description: 'desc',
                category: 'Processing Unit',
                imagepath: "/assets/images/calm/components/flagsPic.svg",
            },
            {
                name: "Buffer",
                description: 'desc',
                category: 'I/O Unit',
                imagepath: "/assets/images/calm/components/IOBuffer.svg",
                imageHeight: 60,
            },
            {
                name: "IO Controller",
                description: 'desc',
                category: 'I/O Unit',
                imagepath: "/assets/images/calm/components/IOController.svg",
                imageHeight: 60,
            },
        ]

        const result = await prisma.components.createMany({
            data: components,
        })

        res.status(200).json({
            success: true,
            message: "success",
            data: components,
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
            data: {},
        })
    }
}
*/