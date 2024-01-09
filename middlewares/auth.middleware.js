const { verifyAccessToken } = require("../helper/jwt");
const { User } = require("../models");

module.exports = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
    if (!access_token) {
      throw {
        name: "NoToken",
        errors: [
          {
            message: "Invalid access token",
          },
        ],
      };
    }
    const payload = verifyAccessToken(access_token);

    const verifyUser = await User.findByPk(payload.id);
    if (!verifyUser) {
      throw {
        name: "Unauthorized",
        errors: [
          {
            message: "Unauthorized user",
          },
        ],
      };
    }
    req.user = {
      id: verifyUser.id,
      email: verifyUser.email,
      name: verifyUser.name,
      role: verifyUser.role,
    };
    next()
  } catch (error) {
    console.log("cek isi", error);
    next(error);
  }
};
