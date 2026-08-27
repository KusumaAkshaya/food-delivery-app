import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export const generateToken = (userId) => {
    
    return jwt.sign(
        { userId },              // information stored inside token
        process.env.JWT_KEY,  // secret used to sign token
        {
            expiresIn: "7d"
        }
    );
};