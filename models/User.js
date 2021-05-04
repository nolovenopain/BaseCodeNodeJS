const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema({
    first_name: { 
        type: String,
        default: ''        
    },
    last_name: { 
        type: String,
        default: ''        
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true, 
        trim: true
    },
    password: {
        type: String,
        required: true, 
    },
    phone: { 
        type: String,
        default: ''        
    },
    address: { 
        type: String,
        default: ''        
    },
    avatar: {
        type: String,
        default: ''
    },
    role: String,
    birthday: {
        type: Date,
        default: Date.now
    },
    active: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

UserSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
        next()
    } catch (error) {
        next(error)
    }
})

UserSchema.methods.isValidPassword = async function (password) {
    try { 
        return await bcrypt.compare(password, this.password)
    } catch (error) {
        throw error
    }
}


module.exports = mongoose.model('Users', UserSchema)