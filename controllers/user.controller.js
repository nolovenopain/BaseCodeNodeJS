const User = require('../models/User');
const createError = require('http-errors');
const { authSchema, validPwSchema } = require('../helpers/validation');
const response = require('../helpers/response');
const bcrypt = require('bcrypt');

module.exports = {
    listAll: async (req, res, next) => {
        try {
            const users = await User.find()
                                    .sort({ createdAt: -1 })
            response.success(res, { list: users, total: users.length })
        } catch (error) {
            next(error)
        }
    },
    listFilterPaging: async(req, res, next) => { 
        try {
            let page = req.body.page && parseInt(req.body.page) > 0 ? parseInt(req.body.page) : 1
            let pageSize = req.body.pageSize && parseInt(req.body.pageSize) > 0 ? parseInt(req.body.pageSize) : 10
            let users = []

            if(req.body.keyword && req.body.keyword != '') {
                users = await User.find({ email: { $regex: req.body.keyword } })
                                .skip(page * pageSize - pageSize)
                                .limit(pageSize)
                                .sort({ createdAt: -1 })
            } else {
                users = await User.find()
                                .skip(page * pageSize - pageSize)
                                .limit(pageSize)
                                .sort({ createdAt: -1 })
            }

            response.success(res, { list: users, page })
        } catch (error) {
            next(error)
        }
    },
    createNew: async (req, res, next) => {
        try {
            const result = await authSchema.validateAsync(req.body)
            result.role = 'user'

            const doesExist = await User.findOne({ email: result.email })
            if(doesExist) throw createError('This email existed')

            const user = new User(result);
            const saveUser = user.save();
            response.success(res, { user: saveUser }, 'Create new account successful !!!')
        } catch (error) {
            if(error.isJoi === true) error.status = 422
            next(error)
        }     
    },
    findById: async (req, res, next) => {
        try {
            const user = await User.findById(req.params.userId);
            if(!user) {
                response.success(res, {}, 'Can not found user')
            }
            else {
                response.success(res, user)
            }
        } catch (error) {
            next(error)
        }
    },
    delete: async (req, res, next) => {
        try {
            const user = await User.findByIdAndDelete(req.body.userId);
            if(!user) {
                response.success(res, {}, 'Can not found and delete user')
            } else {
                response.success(res, user)
            }
        } catch (error) {
            next(error)
        }
    },
    update: async (req, res, next) => {
        try {
            const user = req.body;
            user.avatar = req.file.filename
            const oldUser = await User.findById(userId);
            const updateUser = await User.updateOne(
                { _id: user.userId }, 
                { 
                    $set: { 
                        avatar: user.avatar && user.avatar != '' ? user.avatar : oldUser.avatar, 
                        address: user.address && user.address != '' ? user.address : oldUser.address,
                        phone: user.phone && user.phone != '' ? user.phone : oldUser.phone,
                        first_name: user.first_name && user.first_name != '' ? user.first_name : oldUser.first_name,
                        last_name: user.last_name && user.last_name != '' ? user.last_name : oldUser.last_name,
                        birthday: user.birthday && user.birthday != '' ? new Date(user.birthday) : oldUser.birthday
                    } 
                }
            )
            if(!updateUser) {
                response.success(res, {}, 'Can not found and update user')
            } else {
                response.success(res, updateUser)
            }
        } catch (error) {
            next(error)
        }
    },
    changePassword: async (req, res, next) => {
        try {
            const params = req.body
            await validPwSchema.validateAsync(params.oldPassword)
            await validPwSchema.validateAsync(params.newPassword)
            const user = await User.findById(params.userId)
            if(!user) throw createError.NotFound("User not registered")

            const isMatch = await user.isValidPassword(params.oldPassword)
            if(!isMatch) throw createError.Unauthorized('Password not valid');

            // hash pw
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(params.newPassword, salt)
            
            const updateUser = await User.updateOne(
                { _id: params.userId }, 
                { 
                    $set: { 
                        password: hashedPassword, 
                    } 
                }
            );
            if(!updateUser) {
                response.success(res, {}, 'Update password fail. Can not found user and update password')
            } else {
                response.success(res, updateUser)
            }
        } catch (error) {
            next(error)
        }
    }
}