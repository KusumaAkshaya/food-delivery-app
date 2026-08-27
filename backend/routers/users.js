import express from "express";
import bcrypt from "bcrypt";
import User from "../model/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { generateToken } from "../utils/generateTokens.js"; // 🔴 NEW

const router = express.Router();


// ==================================================
// REGISTER
// ==================================================

router.post("/register", async (req, res) => {

    const { name, email, password } = req.body;

    try {

        const exist = await User.findOne({ email });

        if (exist) {
            return res.status(401).json({
                message: "Already email existed, Try login or use different email"
            });
        }


        // Password hashing
        const salt = await bcrypt.genSalt(10);

        const hash = await bcrypt.hash(password, salt);


        const register = new User({
            name,
            email,
            password: hash
        });

        await register.save();


        // 🟡 FOR NOW:
        // We are NOT automatically logging the user in after registration.
        // We'll add that later once basic authentication is working.

        res.status(200).json({
            message: "You are Registered Successfully!"
        });

    }
    catch (error) {

        console.log(error, "error in registering");

        res.status(400).json({
            error: error.message
        });
    }
});


// ==================================================
// LOGIN
// ==================================================

router.post("/login", async (req, res) => {

    const { email, password } = req.body;

    try {

        const userDetails = await User.findOne({ email });


        // User doesn't exist
        if (!userDetails) {

            return res.status(401).json({
                message: "Invalid user credentials"
            });
        }


        // Compare entered password with hashed password
        const isTruePassword =
            await bcrypt.compare(password, userDetails.password);


        // Wrong password
        if (!isTruePassword) {

            return res.status(401).json({
                message: "Invalid user credentials"
            });
        }


        // ==================================================
        // 🔴 NEW AUTHENTICATION CODE
        // ==================================================

        // Create JWT containing user's ID
        const token = generateToken(userDetails._id);
        console.log("token: ",process.env.NODE_ENV);

        // Put JWT inside an HttpOnly cookie
        res.cookie("token", token, {

            httpOnly: true,

            // 🔴 In development we're using HTTP localhost.
            // In production this becomes true because production
            // should use HTTPS.
            secure: process.env.NODE_ENV === "production",

            // Helps protect against CSRF
            sameSite: "lax",

            // Cookie expires after 7 days
            maxAge: 7 * 24 * 60 * 60 * 1000,

            path: "/"
        });


        // ==================================================
        // IMPORTANT:
        // Don't send password back to frontend.
        // ==================================================

        res.status(200).json({

            message: "Successfully logged in",

            user: {
                id: userDetails._id,
                name: userDetails.name,
                email: userDetails.email
            }
        });

    }
    catch (error) {

        console.log("Login error:", error);

        res.status(500).json({
            message: "Something went wrong"
        });
    }
});

router.get("/me", authMiddleware, async (req, res) => {

    try {

        const user = await User.findById(req.user.userId)
            .select("-password");

        if (!user) {
            return res.status(401).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            user
        });

    } catch (error) {

        console.log("Auth check error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/"
  });

  res.status(200).json({ message: "Logged out successfully" });
});

export default router;