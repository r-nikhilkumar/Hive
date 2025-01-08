const jwt = require("jsonwebtoken")

const getUserFromToken = (token)=>{
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        return decodedToken;
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            throw new Error("Token has expired. Please login again.");
        }
        if (error.name === "JsonWebTokenError") {
            throw new Error("Invalid token. Authentication failed.");
        }
        throw new Error("Error verifying token: " + error.message);
    }
}

module.exports = { getUserFromToken};