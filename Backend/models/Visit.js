const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    visitType: {
        type: String,
        enum: ['initial', 'follow-up', 'emergency', 'routine'],
        required: true
    },
    visitDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    // SOAP Notes
    subjective: {
        chiefComplaint: String,
        historyOfPresentIllness: String,
        pastMedicalHistory: String,
        familyHistory: String,
        socialHistory: String,
        reviewOfSystems: String
    },
    objective: {
        vitalSigns: {
            bloodPressure: String,
            heartRate: Number,
            temperature: Number,
            respiratoryRate: Number,
            oxygenSaturation: Number,
            weight: Number,
            height: Number
        },
        physicalExam: String,
        observations: String
    },
    assessment: {
        diagnosis: [{
            condition: String,
            icd10Code: String,
            status: {
                type: String,
                enum: ['confirmed', 'probable', 'rule-out']
            }
        }],
        differentialDiagnosis: [String]
    },
    plan: {
        medications: [{
            name: String,
            dosage: String,
            frequency: String,
            duration: String,
            instructions: String
        }],
        procedures: [{
            name: String,
            date: Date,
            notes: String
        }],
        followUp: {
            date: Date,
            type: String,
            instructions: String
        },
        patientInstructions: String,
        referrals: [{
            specialist: String,
            reason: String,
            priority: {
                type: String,
                enum: ['routine', 'urgent', 'emergency']
            }
        }]
    },
    attachments: [{
        type: String,
        name: String,
        uploadDate: Date,
        category: String
    }],
    billing: {
        amount: Number,
        insuranceClaimed: Boolean,
        status: {
            type: String,
            enum: ['pending', 'billed', 'paid', 'denied'],
            default: 'pending'
        }
    },
    notes: String
}, {
    timestamps: true
});

// Indexes for faster queries
visitSchema.index({ patient: 1, visitDate: -1 });
visitSchema.index({ doctor: 1, visitDate: -1 });
visitSchema.index({ status: 1 });

module.exports = mongoose.model('Visit', visitSchema); 