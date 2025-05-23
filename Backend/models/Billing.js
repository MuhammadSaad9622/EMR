const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient',
        required: true
    },
    visit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Visit'
    },
    labReport: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LabReport'
    },
    items: [{
        description: String,
        quantity: Number,
        unitPrice: Number,
        total: Number,
        category: {
            type: String,
            enum: ['consultation', 'procedure', 'lab', 'medication', 'other']
        }
    }],
    subtotal: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        required: true
    },
    insurance: {
        provider: String,
        policyNumber: String,
        claimNumber: String,
        claimStatus: {
            type: String,
            enum: ['pending', 'submitted', 'approved', 'denied', 'paid'],
            default: 'pending'
        },
        coverageAmount: Number,
        patientResponsibility: Number
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'partial', 'paid', 'overdue'],
        default: 'pending'
    },
    payments: [{
        amount: Number,
        date: Date,
        method: {
            type: String,
            enum: ['cash', 'credit', 'debit', 'insurance', 'check']
        },
        reference: String,
        notes: String
    }],
    dueDate: Date,
    notes: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Indexes for faster queries
billingSchema.index({ patient: 1, createdAt: -1 });
billingSchema.index({ 'insurance.claimStatus': 1 });
billingSchema.index({ paymentStatus: 1 });
billingSchema.index({ dueDate: 1 });

// Calculate total before saving
billingSchema.pre('save', function(next) {
    if (this.items && this.items.length > 0) {
        this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
        this.total = this.subtotal + this.tax - this.discount;
    }
    next();
});

module.exports = mongoose.model('Billing', billingSchema); 