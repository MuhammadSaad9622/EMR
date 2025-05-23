const express = require('express');
const router = express.Router();
const { auth, authorize } = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');

// Get all appointments
router.get('/', auth, async (req, res) => {
    try {
        let query = {};
        
        // If user is a patient, only show their appointments
        if (req.user.role === 'patient') {
            const patient = await Patient.findOne({ user: req.user._id });
            if (patient) {
                query.patient = patient._id;
            }
        }
        
        // If user is a doctor, only show their appointments
        if (req.user.role === 'doctor') {
            query.doctor = req.user._id;
        }

        const appointments = await Appointment.find(query)
            .populate('patient', 'user')
            .populate('doctor', 'firstName lastName')
            .sort('date startTime');
        
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointments' });
    }
});

// Get single appointment
router.get('/:id', auth, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('patient', 'user')
            .populate('doctor', 'firstName lastName')
            .populate('visit');

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Check permissions
        if (req.user.role === 'patient') {
            const patient = await Patient.findOne({ user: req.user._id });
            if (patient && appointment.patient.toString() !== patient._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to view this appointment' });
            }
        }

        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching appointment' });
    }
});

// Create new appointment
router.post('/', auth, authorize('admin', 'doctor'), async (req, res) => {
    try {
        const { patientId, doctorId, date, startTime, endTime, type, reason, notes } = req.body;

        // Check for scheduling conflicts
        const conflictingAppointment = await Appointment.findOne({
            doctor: doctorId,
            date,
            $or: [
                {
                    startTime: { $lt: endTime },
                    endTime: { $gt: startTime }
                }
            ]
        });

        if (conflictingAppointment) {
            return res.status(400).json({ message: 'Time slot conflicts with existing appointment' });
        }

        const appointment = new Appointment({
            patient: patientId,
            doctor: doctorId,
            date,
            startTime,
            endTime,
            type,
            reason,
            notes,
            createdBy: req.user._id
        });

        await appointment.save();
        res.status(201).json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating appointment' });
    }
});

// Update appointment
router.put('/:id', auth, async (req, res) => {
    try {
        const { date, startTime, endTime, type, status, reason, notes } = req.body;

        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Check permissions
        if (req.user.role === 'patient') {
            const patient = await Patient.findOne({ user: req.user._id });
            if (patient && appointment.patient.toString() !== patient._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to update this appointment' });
            }
        }

        // Update fields
        if (date) appointment.date = date;
        if (startTime) appointment.startTime = startTime;
        if (endTime) appointment.endTime = endTime;
        if (type) appointment.type = type;
        if (status) appointment.status = status;
        if (reason) appointment.reason = reason;
        if (notes) appointment.notes = notes;

        await appointment.save();
        res.json(appointment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating appointment' });
    }
});

// Cancel appointment
router.delete('/:id', auth, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Check permissions
        if (req.user.role === 'patient') {
            const patient = await Patient.findOne({ user: req.user._id });
            if (patient && appointment.patient.toString() !== patient._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
            }
        }

        appointment.status = 'cancelled';
        appointment.cancelledBy = req.user._id;
        appointment.cancellationReason = req.body.reason;

        await appointment.save();
        res.json({ message: 'Appointment cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling appointment' });
    }
});

module.exports = router; 