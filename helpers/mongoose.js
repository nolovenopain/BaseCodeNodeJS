const mongoose = require('mongoose');

mongoose.connect(
    process.env.DB_URI, 
    {   
        dbName: process.env.DB_NAME,
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }  
)
.then(() => console.log('Connect successfull'))
.catch(err => console.log(err.message))

mongoose.connection.on('connected', () => {
    console.log('mongoose connected to db')
})

mongoose.connection.on('error', err => {
    console.log(err.message)
})

mongoose.connection.on('disconnected', () => {
    console.log('mongoose connection is disconnected')
})

process.on('SIGINT', async () => {
    await mongoose.connection.close()
    process.exit()
})