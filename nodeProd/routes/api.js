// routes/api.js
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');

// Define API routes
router.post('/login', UserController.loginUser);
router.get('/protected', UserController.protectedRoute);
router.get('/users', UserController.getAllUsers);
router.post('/user', UserController.addUser);
router.delete('/user', UserController.deleteUser);
router.get('/logout', UserController.logoutUser);


module.exports = router;