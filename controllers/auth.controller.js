const User = require('../models/User');
const createError = require('http-errors');
const { authSchema } = require('../helpers/validation');
const { 
    signAccessToken, 
    signRefreshToken, 
    verifyRefreshToken, 
    signEmailVerifyToken, 
    signResetPasswordToken,
    verifyEmailToken,
    verifyResetPasswordToken 
} = require('../helpers/jwt');
const response = require('../helpers/response');
const mailer = require('../helpers/mailer');

module.exports = {
    register: async (req, res, next) => { 
        try {
            const result = await authSchema.validateAsync(req.body); 
            result.role = 'user'
            
            const doesExist = await User.findOne({ email: result.email })
            if(doesExist) throw createError.Conflict('This email already has been registered')

            const user = new User(result); 
            const savedUser = await user.save(); 
            const emailToken = await signEmailVerifyToken(savedUser)
            const mailOptions = {
                from: process.env.GMAIL,
                to: result.email,
                subject: 'Account Verification Link',
                text: 'Please verify your account by clicking the link: \nhttp:\/\/' 
                        + req.headers.host + '\/auth\/verifyEmail\/' 
                        + emailToken + '\n\nThank You!\n'
            };
            mailer.sendEmailVerify(mailOptions)
            response.success(res, { user: savedUser }, 'Register Successful !!!');
        } catch (error) {
            if(error.isJoi === true) error.status = 422
            next(error);
        }     
    },
    verifyEmail: async (req, res, next) => {
        try {
            const token = req.params.token
            const id = await verifyEmailToken(token)
            const activeUser = await User.updateOne( 
                { _id: id }, 
                { 
                    $set: { 
                        active: true
                    } 
                }
            );
            if(!activeUser) throw createError.NotFound('Can not found and active user')
                
            response.success(res, activeUser, "Active this user successful")
        } catch (error) {
            next(error);
        } 
    },
    login: async (req, res, next) => {
        try {
            const result = await authSchema.validateAsync(req.body)
            const user = await User.findOne({ email: result.email })
            if(!user) throw createError.NotFound("User not registered")
    
            const isMatch = await user.isValidPassword(result.password)
            if(!isMatch) throw createError.Unauthorized('Username/Password not valid'); 
    
            const accessToken = await signAccessToken(user)
            const refreshToken = await signRefreshToken(user)
            response.success(res, { accessToken, user, refreshToken }, 'Login Successful !!!')
        } catch (error) { 
            if(error.isJoi === true) return next(createError.BadRequest("Invalid Username/Password"))
            next(error)
        }
    },
    refreshToken: async (req, res, next) => {
        try {
            const { refreshToken } = req.body
            if(!refreshToken) throw createError.BadRequest()
            const userId = await verifyRefreshToken(refreshToken)
            const user = await User.findById(userId)
            if(!user) throw createError.NotFound("User not registered")
    
            const accessToken = await signAccessToken(user)
            const refToken = await signRefreshToken(user)
            response.success(res, { accessToken: accessToken, refreshToken: refToken })
        } catch (error) {
            next(error)
        }
    },
    logout: async (req, res, next) => {
        try {
            const { refreshToken } = req.body
            if(!refreshToken) throw createError.BadRequest()
            const userId = await verifyRefreshToken(refreshToken)   
            response.success(res, {}, 'Log out success !!!')
        } catch (error) {
            next(error)
        }
    },
    forgotPassword: async (req, res, next) => {
        try {
            const user = await User.findOne({ email: req.body.email })
            if(!user) throw createError.NotFound("User with this email does not existed")

            const resetPasswordToken = await signResetPasswordToken(user)
            const mailOptions = {
                from: process.env.GMAIL,
                to: result.email,
                subject: 'Account Verification Link',
                text: 'Please click on given link to reset your password: \nhttp:\/\/' 
                        + req.headers.host + '\/auth\/directToResetPasswordPage\/' 
                        + resetPasswordToken + '\n\nThank You!\n'
            };
            mailer.sendEmailResetPassword(mailOptions)
            response.success(res, {}, 'Email has been sent. Please kindly follow the instructions')
        } catch (error) {
            next(error)
        }
    },
    directToResetPasswordPage: async (req, res, next) => {
        try {
            
        } catch (error) {
            next(error)
        }
    },
    resetPassword: async (req, res, next) => { 
        try {
            if(req.body.newPasword !== req.body.confirmPassword) throw createError.Conflict('New password and confirm password not equal')
            await validPwSchema.validateAsync(req.body.newPasword)
            await validPwSchema.validateAsync(req.body.confirmPassword)
            
            const token = req.params.token
            const id = await verifyResetPasswordToken(token)

            // hash pw
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(req.body.newPassword, salt)
            
            const resetPasswordUser = await User.updateOne( 
                { _id: id }, 
                { 
                    $set: { 
                        active: hashedPassword
                    } 
                }
            );
            if(!resetPasswordUser) throw createError.NotFound('Can not found and reset password of this user')

            response.success(res, resetPasswordUser, "Reset password this user successful")
        } catch (error) {
            next(error);
        } 
    }
}