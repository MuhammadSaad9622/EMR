const mongoose = require('mongoose');

const labReportSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    orderingDoctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    labName: {
        type: String,
        required: true
    },
    reportDate: {
        type: Date,
        required: true
    },
    testDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    },
    tests: [{
        name: String,
        code: String,
        result: String,
        unit: String,
        referenceRange: {
            low: Number,
            high: Number
        },
        flag: {
            type: String,
            enum: ['normal', 'high', 'low', 'critical']
        },
        notes: String
    }],
    attachments: [{
        type: String,
        name: String,
        uploadDate: Date,
        category: String
    }],
    notes: String,
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewDate: Date,
    reviewNotes: String,
    billing: {
        amount: Number,
        insuranceClaimed: Boolean,
        status: {
            type: String,
            enum: ['pending', 'billed', 'paid', 'denied'],
            default: 'pending'
        }
    }
}, {
    timestamps: true
});

// Indexes for faster queries
labReportSchema.index({ patient: 1, reportDate: -1 });
labReportSchema.index({ orderingDoctor: 1, reportDate: -1 });
labReportSchema.index({ status: 1 });

module.exports = mongoose.model('LabReport', labReportSchema); 