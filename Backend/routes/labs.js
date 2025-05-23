const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const LabReport = require('../models/LabReport');
const Patient = require('../models/Patient');
const PDFGenerator = require('../utils/pdfGenerator');

// Get all lab reports
router.get('/', auth, async (req, res) => {
    try {
        let query = {};
        
        // If user is a patient, only show their reports
        if (req.user.role === 'patient') {
            const patient = await Patient.findOne({ user: req.user._id });
            if (patient) {
                query.patient = patient._id;
            }
        }

        const reports = await LabReport.find(query)
            .populate('patient', 'user')
            .populate('orderedBy', 'firstName lastName')
            .sort('-createdAt');
        
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lab reports' });
    }
});

// Get single lab report
router.get('/:id', auth, async (req, res) => {
    try {
        const report = await LabReport.findById(req.params.id)
            .populate('patient', 'user')
            .populate('orderedBy', 'firstName lastName');

        if (!report) {
            return res.status(404).json({ message: 'Lab report not found' });
        }

        // Check permissions
        if (req.user.role === 'patient') {
            const patient = await Patient.findOne({ user: req.user._id });
            if (patient && report.patient.toString() !== patient._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to view this report' });
            }
        }

        res.json(report);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching lab report' });
    }
});

// Create new lab report
router.post('/', auth, authorize('admin', 'doctor'), async (req, res) => {
    try {
        const {
            patientId,
            testName,
            testType,
            results,
            referenceRange,
            interpretation,
            notes,
            status
        } = req.body;

        const report = new LabReport({
            patient: patientId,
            testName,
            testType,
            results,
            referenceRange,
            interpretation,
            notes,
            status,
            orderedBy: req.user._id
        });

        await report.save();
        res.status(201).json(report);
    } catch (error) {
        res.status(500).json({ message: 'Error creating lab report' });
    }
});

// Update lab report
router.put('/:id', auth, authorize('admin', 'doctor'), async (req, res) => {
    try {
        const {
            testName,
            testType,
            results,
            referenceRange,
            interpretation,
            notes,
            status
        } = req.body;

        const report = await LabReport.findById(req.params.id);
        if (!report) {
            return res.status(404).json({ message: 'Lab report not found' });
        }

        // Update fields
        if (testName) report.testName = testName;
        if (testType) report.testType = testType;
        if (results) report.results = results;
        if (referenceRange) report.referenceRange = referenceRange;
        if (interpretation) report.interpretation = interpretation;
        if (notes) report.notes = notes;
        if (status) report.status = status;

        await report.save();
        res.json(report);
    } catch (error) {
        res.status(500).json({ message: 'Error updating lab report' });
    }
});

// Generate lab report PDF
router.get('/:id/pdf', auth, async (req, res) => {
    try {
        const report = await LabReport.findById(req.params.id)
            .populate('patient', 'user')
            .populate('orderedBy', 'firstName lastName');

        if (!report) {
            return res.status(404).json({ message: 'Lab report not found' });
        }

        // Check permissions
        if (req.user.role === 'patient') {
            const patient = await Patient.findOne({ user: req.user._id });
            if (patient && report.patient.toString() !== patient._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to view this report' });
            }
        }

        // Generate PDF
        const pdfPath = await PDFGenerator.generateLabReport(report);
        
        // Send PDF file
        res.download(pdfPath, `lab-report-${report._id}.pdf`, (err) => {
            if (err) {
                res.status(500).json({ message: 'Error sending PDF file' });
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error generating lab report PDF' });
    }
});

module.exports = router; 