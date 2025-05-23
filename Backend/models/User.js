const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'doctor', 'patient'],
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        console.log('Password not modified, skipping hash');
        return next();
    }
    
    try {
        console.log('Hashing password:', {
            originalLength: this.password.length,
            isModified: this.isModified('password')
        });

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        
        console.log('Password hashed successfully:', {
            hashedLength: this.password.length,
            saltRounds: 10
        });
        
        next();
    } catch (error) {
        console.error('Error hashing password:', error);
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        if (!candidatePassword || !this.password) {
            console.log('Missing password data:', {
                hasCandidate: !!candidatePassword,
                hasStored: !!this.password
            });
            return false;
        }

        // Log the comparison process
        console.log('Password comparison process:', {
            // Don't log the actual passwords for security
            candidateLength: candidatePassword.length,
            storedHashLength: this.password.length,
            storedHashPrefix: this.password.substring(0, 10) + '...',
            isBcryptHash: this.password.startsWith('$2a$') // Check if stored password is a bcrypt hash
        });
        
        // bcrypt.compare will handle the hashing of the candidate password internally
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        
        console.log('Password comparison result:', {
            matches: isMatch,
            candidateLength: candidatePassword.length,
            storedHashLength: this.password.length
        });
        
        return isMatch;
    } catch (error) {
        console.error('Error comparing passwords:', error);
        return false;
    }
};

module.exports = mongoose.model('User', userSchema); 