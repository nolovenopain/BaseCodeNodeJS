const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { verifyAccessToken } = require('../helpers/jwt');
const upload = require('../helpers/uploadFile')

// GET LIST ALL
router.get('/listAll', UserController.listAll)

// GET LIST FILTER PAGING
router.post('/listFilterPaging', UserController.listFilterPaging)

// ADD
router.post('/create-new', UserController.createNew)

// FIND BY ID
router.get('/findById/:userId', UserController.findById)

// DELETE 
router.post('/delete', UserController.delete)

// UPDATE PROFILE
router.post('/update', verifyAccessToken, upload.uploadSingle.single('avatar'), UserController.update)

// CHANGE PASSWORD
router.post('/change-password', verifyAccessToken, UserController.changePassword)

module.exports = router;