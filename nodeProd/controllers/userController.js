// controllers/userController.js
const UserModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
require('dotenv').config();


// Create a JWT token with no expiration time (exp claim is omitted)
function generateAuthToken(data) {
  const token = jwt.sign(data, process.env.jwt_secret);
  return token;
}



class UserController {
  static async getAllUsers(req, res) {
    const users = await UserModel.getAllUsers();
    res.json(users);
  }

  static async addUser(req, res) {
    const name = req.body;
    const hashedPassword = await bcrypt.hash(name.password, saltRounds);
    name.password = hashedPassword
    await UserModel.addUser(name);
    res.status(201).json(name.email);
  }


  static async deleteUser(req, res) {
    const name = req.body;
    await UserModel.deleteUser(name.email);
    res.status(201).json(name.email);
  }

  static async loginUser(req, res) {
    const name = req.body;
    const expectedUser = await UserModel.loginUser(name);
    console.log(expectedUser);
    const isPasswordMatch = await bcrypt.compare(name.password, expectedUser.password);
    console.log("isPasswordMatch", isPasswordMatch);
    if (isPasswordMatch) {
      const payload = {
        time: new Date(),
        email: name.email
      }
      const access_token = generateAuthToken(payload)
      res.status(201).json({ email: expectedUser.email, username: expectedUser.username, access_token: access_token });
    } else {
      res.status(401).json({ status: "Credential Not valid" });
    }

  }


  static async protectedRoute(req, res) {
    try {
      const bearerToken = req.header('authorization');
      const refresh_token = bearerToken.split(' ')[1];
      const payload = jwt.verify(refresh_token, process.env.jwt_secret);
      if (payload) {
        const IsAutharized = await UserModel.checkForValidToken(refresh_token)
       if(IsAutharized){ 
        res.status(201).json({ status: "success" });
      } else {
        res.status(401).json({ status: "Unauthorised User" });
      }
    }
    }
    catch (err) {
      res.status(401).json({ status: err });
    }
  }


  static async logoutUser(req, res) {
    try {
      const bearerToken = req.header('authorization');
      const refresh_token = bearerToken.split(' ')[1];
      const payload = jwt.verify(refresh_token, process.env.jwt_secret);
      if (payload) {
        await UserModel.addIntoBlackList(refresh_token)
        res.status(201).json({ status: `Logout success of ${payload.email}` });
      } else {
        res.status(401).json({ status: "Unauthorised User" });
      }
    }
    catch (err) {
      res.status(401).json({ status: err });
    }
  }





}




module.exports = UserController;
