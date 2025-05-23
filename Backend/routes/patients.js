const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Patient = require('../models/Patient');
const User = require('../models/User');

// Get all patients (Doctor/Admin only)
router.get('/', auth, authorize('admin', 'doctor'), async (req, res) => {
    try {
        const patients = await Patient.find()
            .populate('user', 'firstName lastName email')
            .sort('-createdAt');
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching patients' });
    }
});

// Get single patient
router.get('/:id', auth, async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id)
            .populate('user', 'firstName lastName email')
            .populate('visits')
            .populate('labReports');
        
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Check if user has permission to view this patient
        if (req.user.role === 'patient' && patient.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this patient' });
        }

        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching patient' });
    }
});

// Create new patient
router.post('/', auth, authorize('admin', 'doctor'), async (req, res) => {
    try {
        const { userId, dateOfBirth, gender, address, emergencyContact, insurance } = req.body;

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if patient already exists for this user
        const existingPatient = await Patient.findOne({ user: userId });
        if (existingPatient) {
            return res.status(400).json({ message: 'Patient record already exists for this user' });
        }

        const patient = new Patient({
            user: userId,
            dateOfBirth,
            gender,
            address,
            emergencyContact,
            insurance
        });

        await patient.save();
        res.status(201).json(patient);
    } catch (error) {
        res.status(500).json({ message: 'Error creating patient' });
    }
});

// Update patient
router.put('/:id', auth, authorize('admin', 'doctor'), async (req, res) => {
    try {
        const { dateOfBirth, gender, address, emergencyContact, insurance, medicalHistory, allergies, medications, status, notes } = req.body;

        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Update fields
        if (dateOfBirth) patient.dateOfBirth = dateOfBirth;
        if (gender) patient.gender = gender;
        if (address) patient.address = address;
        if (emergencyContact) patient.emergencyContact = emergencyContact;
        if (insurance) patient.insurance = insurance;
        if (medicalHistory) patient.medicalHistory = medicalHistory;
        if (allergies) patient.allergies = allergies;
        if (medications) patient.medications = medications;
        if (status) patient.status = status;
        if (notes) patient.notes = notes;

        await patient.save();
        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: 'Error updating patient' });
    }
});

// Delete patient (Admin only)
router.delete('/:id', auth, authorize('admin'), async (req, res) => {
    try {
        const patient = await Patient.findById(req.params.id);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        await patient.remove();
        res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting patient' });
    }
});

module.exports = router; 