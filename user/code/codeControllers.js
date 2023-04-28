const prisma = require('../../prisma/prismaClient');

module.exports.get_all_codes = async (req, res) =>{
    try {

        const user_id = Number(req.params.userId);
        const codes = await prisma.codes.findMany({
            where: {
                user_id,
            }
        });

        res.status(200).json({
            success: true,
            message: "Codes fetched successfully",
            data: codes,
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Couldn't get all codes: " + error.message,
            data: {}
        })
    }
}

module.exports.get_code = async (req, res) =>{
    try {
        const user_id = Number(req.params.userId);
        const id = Number(Number(req.query.id));

        if(!id) throw new Error("No code id provided");

        const code = await prisma.codes.findUnique({
            where: {
                id,
            }
        })

        if(code){
            if(code.user_id !== user_id) throw new Error("Unauthorized access");
        }

        res.status(200).json({
            success: true,
            message: "Code successfully fetched",
            data: code,
        })

    } catch (error) {

        res.status(400).json({
            success: false,
            message: "Couldn't fetch the code: " + error.message,
            data: {}
        })
    }
}

module.exports.add_code = async (req, res) => {
    try {
        const user_id = Number(req.params.userId);
        const content = req.body.content;

        console.log(user_id, content);
        if(!content) throw new Error("No content provided");

        const code = await prisma.codes.create({
            data: {
                user_id, content,
            }
        })

        res.status(200).json({
            success: true,
            message: "Code successfully added",
            data: code,
        })
    } catch (error) {

        res.status(400).json({
            success: false,
            message: "Couldn't add the new code: " + error.message,
            data: {}
        })
    }
}

module.exports.edit_code = async (req, res) => {
    try{
        const id = Number(req.query.id);
        const content = req.body.content;

        if(!id) throw new Error("No id provided");

        const code = await prisma.codes.findUnique({
            where: {
                id,
            }
        })

        const newcode = await prisma.codes.update({
            where: {
                id,
            },
            data: {
                content: content || code.content,
            }
        })

        res.status(200).json({
            success: true,
            message: "Code successfully updated",
            data: newcode,
        })
    } catch (error) {

        res.status(400).json({
            success: false,
            message: "Couldn't edit the code: " + error.message,
            data: {}
        })
    }
}

module.exports.delete_code = async (req, res) => {
    try{
        const user_id = Number(req.params.userId);
        const id = Number(req.query.id);

        if(!id) throw new Error("No id provided");

        const code = await prisma.codes.findUnique({
            where: {
                id,
            }
        })

        if(code.user_id !== user_id) throw new Error("Unauthorized operation");

        await prisma.codes.delete({
            where: {
                id,
            }
        })
        
        res.status(200).json({
            success: true,
            message: "Code successfully deleted",
            data: code,
        })

    } catch (error) {

        res.status(400).json({
            success: false,
            message: "Couldn't delete the code: " + error.message,
            data: {}
        })
    }
}