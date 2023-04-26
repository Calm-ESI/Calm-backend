//importing prisma Client
const prisma = require('../prisma/prismaClient');

//SignUp controlllers
module.exports.get_user = async (req, res) => {
    try {
        
        const id = Number(req.params.userId);
        if( Number.isNaN(id) ) throw new Error("Invalid id");

        const user = await prisma.calm_users.findUnique({
            where: {
                id,
            }
        });

        res.status(200).json({
            success: true,
            message: "user data successfully fetched",
            data: user,
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Error fetching user: " + error.message,
            data: {}
        })
    }
}

module.exports.update_user = async (req, res) => {
    try {
        const id = Number(req.params.userId);
        
        const {email, password, score} = req.body;

        const user = await prisma.calm_users.findUnique({
            where: {
                id,
            }
        })

        if(user){
            if(password){
                const salt = await bcrypt.genSalt();
                password = await bcrypt.hash(req.body.password, salt);
            }

            const updatedUser = await prisma.calm_users.update({
                where: {
                    id,
                },
                data: {
                    email: email || user.email,
                    password: password || user.password,
                    score: score || user.score,
                },
            })
    
            res.status(200).json({
                success: true,
                message: "user updated successfully",
                data: updatedUser,
            })
            
        }else{
            res.status(404).json({
                success: true,
                message: "User not found",
                data: {},
            })
        }

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "error updating user info: "+error.message,
            data: {}
        })
    }
}

module.exports.delete_user = async (req, res) => {
    try {
        const id = Number(req.params.userId);

        const user = await prisma.calm_users.delete({
            where: {
                id,
            },
        })

        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
            data: user,
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error while deleting user: ' + error.message,
            data: {}
        })
    }
}
