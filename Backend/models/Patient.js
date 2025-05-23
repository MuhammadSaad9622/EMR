const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    emergencyContact: {
        name: String,
        relationship: String,
        phone: String
    },
    insurance: {
        provider: String,
        policyNumber: String,
        groupNumber: String,
        expiryDate: Date
    },
    medicalHistory: [{
        condition: String,
        diagnosisDate: Date,
        status: String,
        notes: String
    }],
    allergies: [{
        allergen: String,
        reaction: String,
        severity: {
            type: String,
            enum: ['mild', 'moderate', 'severe']
        }
    }],
    medications: [{
        name: String,
        dosage: String,
        frequency: String,
        startDate: Date,
        endDate: Date,
        prescribedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    visits: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Visit'
    }],
    labReports: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LabReport'
    }],
    documents: [{
        type: String,
        name: String,
        uploadDate: Date,
        category: String
    }],
    status: {
        type: String,
        enum: ['active', 'inactive', 'deceased'],
        default: 'active'
    },
    notes: String
}, {
    timestamps: true
});

// Index for faster queries
patientSchema.index({ user: 1 });
patientSchema.index({ 'insurance.policyNumber': 1 });

module.exports = mongoose.model('Patient', patientSchema); 