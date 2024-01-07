const jwt = require('jsonwebtoken');
const JWT_KEY = process.env.JWT_KEY

function generateAccessToken(user){
    const {id, username, role} = user
    return jwt.sign({ id, username, role}, JWT_KEY);
}
function verifyAccessToken(access_token){
    return jwt.verify(access_token, JWT_KEY);
}

module.exports = {generateAccessToken, verifyAccessToken}