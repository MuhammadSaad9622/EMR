const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Visit = require('../models/Visit');
const Patient = require('../models/Patient');
const PDFGenerator = require('../utils/pdfGenerator');

// Get all visits
router.get('/', auth, async (req, res) => {
    try {
        let query = {};
        
        // If user is a patient, only show their visits
        if (req.user.role === 'patient') {
            const patient = await Patient.findOne({ user: req.user._id });
            if (patient) {
                query.patient = patient._id;
            }
        }
        
        // If user is a doctor, only show their visits
        if (req.user.role === 'doctor') {
            query.doctor = req.user._id;
        }

        const visits = await Visit.find(query)
            .populate('patient', 'user')
            .populate('doctor', 'firstName lastName')
            .sort('-visitDate');
        
        res.json(visits);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching visits' });
    }
});

// Get single visit
router.get('/:id', auth, async (req, res) => {
    try {
        const visit = await Visit.findById(req.params.id)
            .populate('patient', 'user')
            .populate('doctor', 'firstName lastName');

        if (!visit) {
            return res.status(404).json({ message: 'Visit not found' });
        }

        // Check permissions
        if (req.user.role === 'patient') {
            const patient = await Patient.findOne({ user: req.user._id });
            if (patient && visit.patient.toString() !== patient._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to view this visit' });
            }
        }

        res.json(visit);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching visit' });
    }
});

// Create new visit
router.post('/', auth, authorize('admin', 'doctor'), async (req, res) => {
    try {
        const {
            patientId,
            doctorId,
            visitType,
            visitDate,
            subjective,
            objective,
            assessment,
            plan,
            notes
        } = req.body;

        const visit = new Visit({
            patient: patientId,
            doctor: doctorId,
            visitType,
            visitDate,
            subjective,
            objective,
            assessment,
            plan,
            notes
        });

        await visit.save();

        // Update patient's visits array
        await Patient.findByIdAndUpdate(patientId, {
            $push: { visits: visit._id }
        });

        res.status(201).json(visit);
    } catch (error) {
        res.status(500).json({ message: 'Error creating visit' });
    }
});

// Update visit
router.put('/:id', auth, authorize('admin', 'doctor'), async (req, res) => {
    try {
        const {
            visitType,
            visitDate,
            status,
            subjective,
            objective,
            assessment,
            plan,
            notes
        } = req.body;

        const visit = await Visit.findById(req.params.id);
        if (!visit) {
            return res.status(404).json({ message: 'Visit not found' });
        }

        // Update fields
        if (visitType) visit.visitType = visitType;
        if (visitDate) visit.visitDate = visitDate;
        if (status) visit.status = status;
        if (subjective) visit.subjective = subjective;
        if (objective) visit.objective = objective;
        if (assessment) visit.assessment = assessment;
        if (plan) visit.plan = plan;
        if (notes) visit.notes = notes;

        await visit.save();
        res.json(visit);
    } catch (error) {
        res.status(500).json({ message: 'Error updating visit' });
    }
});

// Generate visit report PDF
router.get('/:id/report', auth, async (req, res) => {
    try {
        const visit = await Visit.findById(req.params.id)
            .populate('patient', 'user')
            .populate('doctor', 'firstName lastName');

        if (!visit) {
            return res.status(404).json({ message: 'Visit not found' });
        }

        // Check permissions
        if (req.user.role === 'patient') {
            const patient = await Patient.findOne({ user: req.user._id });
            if (patient && visit.patient.toString() !== patient._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to view this report' });
            }
        }

        const filename = await PDFGenerator.generateVisitReport(
            visit,
            visit.patient,
            visit.doctor
        );

        res.download(filename);
    } catch (error) {
        res.status(500).json({ message: 'Error generating report' });
    }
});

module.exports = router; 