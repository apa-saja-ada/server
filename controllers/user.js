const { generateAccessToken } = require("../helper/jwt");
const { User } = require("../models");
const bcrypt = require("bcrypt");

class UserController {
  static async createUser(req, res, next) {
    try {
      const { name, email, password, role } = req.body;

      const newUser = await User.create({ name, email, password, role });
      res.status(201).json({
        status: true,
        message: "Succesfully create new user",
        statusCode: "OK",
        response: newUser,
      });
    } catch (error) {
      console.log(">>", error, "<<");
      next(error);
    }
  }

  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const verifyUser = await User.findOne({ where: { email } });
   
      if (!verifyUser || !bcrypt.compareSync(password, verifyUser.password)) {
        throw {
          name: "BadRequest",
          errors: [
            {
              message: "Invalid email/password",
            },
          ],
        };
      }

      const access_token = generateAccessToken(verifyUser);
      res.status(200).json({
        status: true,
        message: "Login has been succesfully",
        statusCode: "OK",
        response: access_token,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UserController;
