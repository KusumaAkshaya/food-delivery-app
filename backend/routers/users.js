import express from "express"
const router = express.Router();
import User from '../model/User.js';
import bcrypt from 'bcrypt'

router.post('/register', async (req, res) => {
    const {name, email, password} = req.body;
    try{
        const exist = await User.findOne({ email });

        if(exist)
        {
          return res.status(401).json({ message: 'Already email existed, Try login or use different email'})
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt)

        const registar = new User({name, email, password: hash}); 
        await registar.save();
        res.status(200).json({message: 'You are Registered Successfully!'});
    }
    catch (error) {
        res.status(400).json({error: error.message})
        console.log(error, "error in registering")
    }
})

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const userDetails = await User.findOne({email});
    
    const isTruePassword = await bcrypt.compare(password, userDetails.password)
    if(!userDetails || isTruePassword )
    {
        return  res.status(401).json({message: 'Invalid user credentials'});  
    }
    else
    {
        res.status(200).json({message: 'Succefully logged in', userDetails});
    }
})

export default router;

