const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Middleware to validate signup data
const validateSignup = [
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').isIn(['admin', 'doctor', 'patient']).withMessage('Invalid role'),
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required')
];

// Middleware to validate login data
const validateLogin = [
    body('email').trim().notEmpty().withMessage('Email or username is required'),
    body('password').notEmpty().withMessage('Password is required')
];

// Signup route
router.post('/signup', validateSignup, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        const { username, firstName, lastName, email, password, role } = req.body;
        
        console.log('Signup attempt:', {
            username,
            email,
            passwordLength: password.length,
            role,
            timestamp: new Date().toISOString()
        });

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            console.log('User already exists:', {
                email: existingUser.email,
                username: existingUser.username
            });
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user with plain password
        const user = new User({
            username,
            firstName,
            lastName,
            email,
            password, // Will be hashed by the pre-save hook
            role: role || 'patient'
        });

        console.log('Created user object before save:', {
            username: user.username,
            email: user.email,
            passwordLength: user.password.length,
            role: user.role
        });

        // Save user (this will trigger the pre-save hook for password hashing)
        await user.save();

        // Verify the password was hashed
        console.log('User saved successfully:', {
            id: user._id,
            username: user.username,
            email: user.email,
            hashedPasswordLength: user.password.length,
            role: user.role
        });

        // Test password comparison immediately after save
        const testMatch = await user.comparePassword(password);
        console.log('Password verification after save:', {
            originalLength: password.length,
            hashedLength: user.password.length,
            matches: testMatch
        });

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
});

// Login route
router.post('/login', validateLogin, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array()[0].msg });
        }

        const { email, password } = req.body;
        console.log('Login attempt:', { 
            email,
            passwordLength: password.length,
            timestamp: new Date().toISOString()
        });

        // Check if user exists by email or username
        const user = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { username: email.toLowerCase() }
            ]
        });

        console.log('User found:', user ? {
            id: user._id,
            email: user.email,
            username: user.username,
            role: user.role,
            hasPassword: !!user.password,
            storedPasswordLength: user.password.length,
            isBcryptHash: user.password.startsWith('$2a$')
        } : 'No');

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // bcrypt.compare will handle the password comparison internally
        console.log('Attempting password comparison...');
        const isMatch = await user.comparePassword(password);
        console.log('Password match:', isMatch ? 'Yes' : 'No');

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not set in environment variables');
            return res.status(500).json({ message: 'Server configuration error' });
        }

        try {
            // Generate JWT token
            const token = jwt.sign(
                { 
                    userId: user._id, 
                    role: user.role,
                    email: user.email
                },
                process.env.JWT_SECRET,
                { 
                    expiresIn: '24h',
                    algorithm: 'HS256'
                }
            );

            console.log('Login successful:', {
                userId: user._id,
                role: user.role,
                timestamp: new Date().toISOString()
            });

            res.json({
                token,
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (jwtError) {
            console.error('JWT signing error:', jwtError);
            return res.status(500).json({ message: 'Error generating authentication token' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

// Get current user
router.get('/me', async (req, res) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
});

// Reset password route (temporary for testing)
router.post('/reset-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        
        console.log('Password reset attempt:', {
            email,
            newPasswordLength: newPassword.length
        });

        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            console.log('User not found for password reset');
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('User found for password reset:', {
            id: user._id,
            email: user.email,
            currentPasswordLength: user.password.length
        });

        // Update password (will be hashed by pre-save hook)
        user.password = newPassword;
        await user.save();

        console.log('Password reset successful:', {
            userId: user._id,
            newHashedPasswordLength: user.password.length
        });

        // Verify the new password works
        const testMatch = await user.comparePassword(newPassword);
        console.log('Password verification after reset:', {
            matches: testMatch,
            newPasswordLength: newPassword.length,
            hashedLength: user.password.length
        });

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Password reset error:', error);
        res.status(500).json({ message: 'Error resetting password' });
    }
});

module.exports = router; 