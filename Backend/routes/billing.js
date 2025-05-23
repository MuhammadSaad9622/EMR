const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Billing = require('../models/Billing');
const Patient = require('../models/Patient');

// Get all bills
router.get('/', auth, async (req, res) => {
    try {
        let query = {};
        
        // If user is a patient, only show their bills
        if (req.user.role === 'patient') {
            const patient = await Patient.findOne({ user: req.user._id });
            if (patient) {
                query.patient = patient._id;
            }
        }

        const bills = await Billing.find(query)
            .populate('patient', 'user')
            .populate('visit')
            .populate('labReport')
            .sort('-createdAt');
        
        res.json(bills);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bills' });
    }
});

// Get single bill
router.get('/:id', auth, async (req, res) => {
    try {
        const bill = await Billing.findById(req.params.id)
            .populate('patient', 'user')
            .populate('visit')
            .populate('labReport')
            .populate('createdBy', 'firstName lastName');

        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        // Check permissions
        if (req.user.role === 'patient') {
            const patient = await Patient.findOne({ user: req.user._id });
            if (patient && bill.patient.toString() !== patient._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to view this bill' });
            }
        }

        res.json(bill);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bill' });
    }
});

// Create new bill
router.post('/', auth, authorize('admin', 'doctor'), async (req, res) => {
    try {
        const {
            patientId,
            visitId,
            labReportId,
            items,
            tax,
            discount,
            insurance,
            dueDate,
            notes
        } = req.body;

        const bill = new Billing({
            patient: patientId,
            visit: visitId,
            labReport: labReportId,
            items,
            tax,
            discount,
            insurance,
            dueDate,
            notes,
            createdBy: req.user._id
        });

        await bill.save();
        res.status(201).json(bill);
    } catch (error) {
        res.status(500).json({ message: 'Error creating bill' });
    }
});

// Update bill
router.put('/:id', auth, authorize('admin', 'doctor'), async (req, res) => {
    try {
        const {
            items,
            tax,
            discount,
            insurance,
            paymentStatus,
            dueDate,
            notes
        } = req.body;

        const bill = await Billing.findById(req.params.id);
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        // Update fields
        if (items) bill.items = items;
        if (tax) bill.tax = tax;
        if (discount) bill.discount = discount;
        if (insurance) bill.insurance = insurance;
        if (paymentStatus) bill.paymentStatus = paymentStatus;
        if (dueDate) bill.dueDate = dueDate;
        if (notes) bill.notes = notes;

        await bill.save();
        res.json(bill);
    } catch (error) {
        res.status(500).json({ message: 'Error updating bill' });
    }
});

// Add payment to bill
router.post('/:id/payments', auth, async (req, res) => {
    try {
        const { amount, method, reference, notes } = req.body;

        const bill = await Billing.findById(req.params.id);
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        // Add payment
        bill.payments.push({
            amount,
            date: new Date(),
            method,
            reference,
            notes
        });

        // Update payment status
        const totalPaid = bill.payments.reduce((sum, payment) => sum + payment.amount, 0);
        if (totalPaid >= bill.total) {
            bill.paymentStatus = 'paid';
        } else if (totalPaid > 0) {
            bill.paymentStatus = 'partial';
        }

        await bill.save();
        res.json(bill);
    } catch (error) {
        res.status(500).json({ message: 'Error adding payment' });
    }
});

// Update insurance claim status
router.put('/:id/insurance', auth, authorize('admin', 'doctor'), async (req, res) => {
    try {
        const { claimStatus, claimNumber, coverageAmount, patientResponsibility } = req.body;

        const bill = await Billing.findById(req.params.id);
        if (!bill) {
            return res.status(404).json({ message: 'Bill not found' });
        }

        // Update insurance fields
        if (claimStatus) bill.insurance.claimStatus = claimStatus;
        if (claimNumber) bill.insurance.claimNumber = claimNumber;
        if (coverageAmount) bill.insurance.coverageAmount = coverageAmount;
        if (patientResponsibility) bill.insurance.patientResponsibility = patientResponsibility;

        await bill.save();
        res.json(bill);
    } catch (error) {
        res.status(500).json({ message: 'Error updating insurance claim' });
    }
});

module.exports = router; 