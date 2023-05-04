/** Configure Environment variables */
require('dotenv').config();
const cors = require('cors');
const cookieParser = require('cookie-parser');

/** Routes */
const authRoutes = require('./auth/authRoutes');
const documentationRoutes = require('./documentation/documentationRoutes');
const userRoutes = require('./user/userRoutes');

/** Initialize Express */
const express = require('express');
const app = express();

/** Setup midleware */
app.use(express.json());

let corsOptions = {
    origin: '*',
};

app.use(cors(corsOptions));
app.use(cookieParser());

// app.post('/code/test', (req, res) => {
//     try {
//         const {code} = req.body;
//         console.log(code.split(/\n/));
//         res.status(200).json({
//             code: code,
//         })
//     } catch (error) {
//         res.status(400).json({
//             message: "Error: " + error.message,
//         })
//     }
// })

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
