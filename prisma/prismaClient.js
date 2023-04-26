const Prisma = require('prisma/prisma-client');

const prismaClient = new Prisma.PrismaClient({
    errorFormat: 'minimal'
});

module.exports = prismaClient;