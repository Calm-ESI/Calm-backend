const prisma = require('../../prisma/prismaClient');

module.exports.get_all_addressing_modes = async (req, res) =>{
    try {

        const addressingModes = await prisma.addressing_modes.findMany();

        res.status(200).json({
            success: true,
            message: "Addressing modes fetched successfully",
            data: addressingModes,
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Couldn't get all addressing modes: " + error.message,
            data: {}
        })
    }
}

module.exports.get_addressing_mode = async (req, res) =>{
    try {
        const name = req.query.name;

        if(!name) throw new Error("No name provided");

        const addressingMode = await prisma.addressing_modes.findUnique({
            where: {
                name,
            }
        })

        res.status(200).json({
            success: true,
            message: "Addressing mode successfully fetched",
            data: addressingMode,
        })
    } catch (error) {

        res.status(400).json({
            success: false,
            message: "Couldn't fetch the addressing mode: " + error.message,
            data: {}
        })
    }
}

module.exports.add_addressing_mode = async (req, res) => {
    try {
        const {name, description} = req.body;

        if(!name) throw new Error("No name provided");
        if(!description) throw new Error("No description provided");

        const addressingMode = await prisma.addressing_modes.create({
            data: {
                name, description,
            }
        })

        res.status(200).json({
            success: true,
            message: "Addressing mode successfully added",
            data: addressingMode,
        })
    } catch (error) {

        res.status(400).json({
            success: false,
            message: "Couldn't add the new addressing mode: " + error.message,
            data: {}
        })
    }
}

module.exports.edit_addressing_mode = async (req, res) => {
    try{
        const name = req.query.name;
        const description = req.body.description;

        if(!name) throw new Error("No name provided");

        const addressingMode = await prisma.addressing_modes.findUnique({
            where: {
                name,
            }
        })

        const newAddressingMode = await prisma.addressing_modes.update({
            where: {
                name,
            },
            data: {
                name: name || addressingMode.name,
                description: description || addressingMode.description,
            }
        })

        res.status(200).json({
            success: true,
            message: "Addressing mode successfully updated",
            data: newAddressingMode,
        })
    } catch (error) {

        res.status(400).json({
            success: false,
            message: "Couldn't edit the addressing mode: " + error.message,
            data: {}
        })
    }
}

module.exports.delete_addressing_mode = async (req, res) => {
    try{
        const name = req.query.name;

        if(!name) throw new Error("No name provided");

        const addressingMode = await prisma.addressing_modes.delete({
            where: {
                name,
            }
        })

        res.status(200).json({
            success: true,
            message: "Addressing mode successfully delted",
            data: addressingMode,
        })
    } catch (error) {

        res.status(400).json({
            success: false,
            message: "Couldn't delete the addressing mode: " + error.message,
            data: {}
        })
    }
}