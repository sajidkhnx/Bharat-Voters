const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const bcrypt = require('bcrypt');
// const {jwtAuthMiddleware, generateToken} = require('./../jwt');
const jwt = require('jsonwebtoken');

// route to home page
router.get('/home',  verifyToken , async (req, res) => {
    try {
        const decoded = jwt.verify(req.session.token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        res.render('loggedhome', { user });
      } catch (err) {
        console.error(err);
        res.redirect('/user/login');
      }
  });

// POST route to add a person
router.get('/signup', (req, res) => {
    res.render('signup');
  });
  
router.post('/signup', async (req, res) =>{
    try{
        const data = req.body // Assuming the request body contains the User data

        // Check if there is already an admin user
        const adminUser = await User.findOne({ role: 'admin' });
        if (data.role === 'admin' && adminUser) {
            return res.status(400).json({ error: 'Admin user already exists' });
        }

        // Validate Aadhar Card Number must have exactly 12 digit
        if (!/^\d{12}$/.test(data.aadharCardNumber)) {
            return res.status(400).json({ error: 'Aadhar Card Number must be exactly 12 digits' });
        }

        // Check if a user with the same Aadhar Card Number already exists
        const existingUser = await User.findOne({ aadharCardNumber: data.aadharCardNumber });
        if (existingUser) {
            return res.status(400).json({ error: 'User with the same Aadhar Card Number already exists' });
        }

        // Create a new User document using the Mongoose model
        const newUser = new User(data);

        // Save the new user to the database
        const response = await newUser.save();
        console.log('data saved');

        const payload = {
            id: response.id
        }
        console.log(JSON.stringify(payload));
        // const token = generateToken(payload);
        res.send('Account created successfully');
        // res.status(200).json({response: response, token: token});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

// Login Route
router.get('/login', (req, res) => {
    res.render('login');
  });
  
router.post('/login', async(req, res) => {
    try{
        // Extract aadharCardNumber and password from request body
        const {aadharCardNumber, password} = req.body;

        // Check if aadharCardNumber or password is missing
        if (!aadharCardNumber || !password) {
            return res.status(400).json({ error: 'Aadhar Card Number and password are required' });
        }

        // Find the user by aadharCardNumber
        const user = await User.findOne({aadharCardNumber: aadharCardNumber});

        // If user does not exist or password does not match, return error
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            req.session.token = token;
            res.redirect('/user/home');
          } else {
            res.redirect('/user/login');
          }
        
    }catch(err){
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// about route

router.get('/about' , (req, res) => {
    
    
        res.render('aboutpage');
})

// Profile route

router.get('/profile',verifyToken ,async (req, res) => {
    try {
        const decoded = jwt.verify(req.session.token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        res.render('profile', { user });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      }
})

router.put('/profile/password', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id; // Extract the id from the token
        const { currentPassword, newPassword } = req.body; // Extract current and new passwords from request body

        // Check if currentPassword and newPassword are present in the request body
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Both currentPassword and newPassword are required' });
        }

        // Find the user by userID
        const user = await User.findById(userId);

        // If user does not exist or password does not match, return error
        if (!user || !(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ error: 'Invalid current password' });
        }

        // Update the user's password
        user.password = newPassword;
        await user.save();

        console.log('password updated');
        res.status(200).json({ message: 'Password updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/bharatvoter');
  });
  
  function verifyToken(req, res, next) {
    const token = req.session.token;
    if (!token) return res.redirect('/user/login');
    next();
  }
module.exports = router;