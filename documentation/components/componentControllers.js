const prisma = require('../../prisma/prismaClient');

module.exports.get_all_components = async (req, res) =>{
    try {

        const components = await prisma.components.findMany();

        res.status(200).json({
            success: true,
            message: "Components fetched successfully",
            data: components,
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Couldn't get all components: " + error.message,
            data: {}
        })
    }
}

module.exports.get_component = async (req, res) =>{
    try {
        const name = req.query.name;

        if(!name) throw new Error("No name provided");

        const component = await prisma.components.findUnique({
            where: {
                name,
            }
        })

        if(!component) throw new Error("Record not found");

        res.status(301).json({
            success: true,
            message: "Component successfully fetched",
            data: component,
        })
    } catch (error) {

        res.status(400).json({
            success: false,
            message: "Couldn't fetch the component: " + error.message,
            data: {}
        })
    }
}

module.exports.add_component = async (req, res) => {
    try {
        const {name, category, description, imagepath, imageHeight} = req.body;

        if(!name) throw new Error("No name provided");
        if(!description) throw new Error("No description provided");
        if(!category) throw new Error("No category provided");
        if(!imagepath) throw new Error("No image path provided");

        const component = await prisma.components.create({
            data: {
                name, description, category, imagepath, imageHeight
            }
        })

        res.status(301).json({
            success: true,
            message: "Component successfully added",
            data: component,
        })
    } catch (error) {

        res.status(400).json({
            success: false,
            message: "Couldn't add the new component: " + error.message,
            data: {}
        })
    }
}

module.exports.edit_component = async (req, res) => {
    try{
        const name = req.query.name;
        const {description, category, imagepath, imageHeight} = req.body;

        if(!name) throw new Error("No name provided");

        const component = await prisma.components.findUnique({
            where: {
                name,
            }
        })

        const newComponent = await prisma.components.update({
            where: {
                name,
            },
            data: {
                name: name || component.name,
                description: description || component.description, 
                category: category || component.category,
                imagepath: imagepath || component.imagepath,
                imageHeight: imageHeight || component.imageHeight,
            }
        })

        res.status(301).json({
            success: true,
            message: "Component successfully updated",
            data: newComponent,
        })
    } catch (error) {
        
        if(error.code = "P2025"){
            error.message = "Record to delete not found";
        }

        res.status(400).json({
            success: false,
            message: "Couldn't edit the component: " + error.message,
            data: {}
        })
    }
}

module.exports.delete_component = async (req, res) => {
    try{
        const name = req.query.name;

        if(!name) throw new Error("No name provided");

        const component = await prisma.components.delete({
            where: {
                name,
            }
        })

        res.status(301).json({
            success: true,
            message: "Component successfully deleted",
            data: component,
        })
    } catch (error) {
        if(error.code = "P2025"){
            error.message = "Record to delete not found";
        }

        res.status(400).json({
            success: false,
            message: "Couldn't delete the component: " + error.message,
            data: {}
        })
    }
}