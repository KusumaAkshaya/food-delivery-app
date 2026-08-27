import jwt from "jsonwebtoken";

// 🔴 NEW
// Creates the authentication token for a user
export const generateToken = (userId) => {

    return jwt.sign(
        { userId },              // information stored inside token
        process.env.JWT_SECRET,  // secret used to sign token
        {
            expiresIn: "7d"
        }
    );
};