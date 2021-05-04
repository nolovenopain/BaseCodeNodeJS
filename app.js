const express = require('express');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv/config');
require('./helpers/mongoose');
const { verifyAccessToken } = require('./helpers/jwt');

const app = express();
app.use(morgan('dev'))

// Get images
app.use(express.static(__dirname + '/uploads'));

// Middlewares
app.use(bodyParser.json());
app.use(cors())

// Route
app.get('/', (req, res, next) => {
    res.send('Home page')
})

// Import route
const postRoute = require('./controllers/posts');
const userRoute = require('./router/user.route');
const authRoute = require('./router/auth.route');

app.use('/posts', postRoute);
app.use('/users', userRoute);
app.use('/auth', authRoute);

// Error
app.use(async (req, res, next) => {
    next(createError.NotFound())
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message
        }
    })
})

// listening to server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log('Server running on port: ', PORT)
})