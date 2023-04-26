/** Configure Environment variables */
require('dotenv').config();

/** Initialize Express */
const express = require('express');
const app = express();

/** Setup midleware */
app.use(express.json());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

/** Routes */
const authRoutes = require('./auth/authRoutes');
const documentationRoutes = require('./documentation/documentationRoutes');
const userRoutes = require('./user/userRoutes');

app.get('/', (req, res) => {
    res.send("Welcome to the Calm platform!");
});

app.use(authRoutes);
app.use('/user', userRoutes);
app.use('/documentation', documentationRoutes);


/** Server */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
});