const PDFDocument = require('pdfkit');
const fs = require('fs');

class PDFGenerator {
    static async generateVisitReport(visit, patient, doctor) {
        const doc = new PDFDocument();
        const filename = `visit-report-${visit._id}.pdf`;
        const stream = fs.createWriteStream(filename);

        doc.pipe(stream);

        // Header
        doc.fontSize(20).text('Medical Visit Report', { align: 'center' });
        doc.moveDown();

        // Patient Information
        doc.fontSize(16).text('Patient Information');
        doc.fontSize(12)
            .text(`Name: ${patient.firstName} ${patient.lastName}`)
            .text(`Date of Birth: ${patient.dateOfBirth.toLocaleDateString()}`)
            .text(`Gender: ${patient.gender}`);
        doc.moveDown();

        // Visit Information
        doc.fontSize(16).text('Visit Details');
        doc.fontSize(12)
            .text(`Date: ${visit.visitDate.toLocaleDateString()}`)
            .text(`Doctor: Dr. ${doctor.firstName} ${doctor.lastName}`)
            .text(`Type: ${visit.visitType}`);
        doc.moveDown();

        // SOAP Notes
        doc.fontSize(16).text('SOAP Notes');
        
        // Subjective
        doc.fontSize(14).text('Subjective');
        doc.fontSize(12)
            .text(`Chief Complaint: ${visit.subjective.chiefComplaint}`)
            .text(`History of Present Illness: ${visit.subjective.historyOfPresentIllness}`);
        doc.moveDown();

        // Objective
        doc.fontSize(14).text('Objective');
        doc.fontSize(12)
            .text('Vital Signs:')
            .text(`Blood Pressure: ${visit.objective.vitalSigns.bloodPressure}`)
            .text(`Heart Rate: ${visit.objective.vitalSigns.heartRate}`)
            .text(`Temperature: ${visit.objective.vitalSigns.temperature}`)
            .text(`Respiratory Rate: ${visit.objective.vitalSigns.respiratoryRate}`)
            .text(`Oxygen Saturation: ${visit.objective.vitalSigns.oxygenSaturation}`);
        doc.moveDown();

        // Assessment
        doc.fontSize(14).text('Assessment');
        doc.fontSize(12);
        visit.assessment.diagnosis.forEach(diagnosis => {
            doc.text(`- ${diagnosis.condition} (${diagnosis.icd10Code}) - ${diagnosis.status}`);
        });
        doc.moveDown();

        // Plan
        doc.fontSize(14).text('Plan');
        doc.fontSize(12);
        
        // Medications
        doc.text('Medications:');
        visit.plan.medications.forEach(med => {
            doc.text(`- ${med.name}: ${med.dosage} ${med.frequency} for ${med.duration}`);
        });
        doc.moveDown();

        // Follow-up
        if (visit.plan.followUp) {
            doc.text('Follow-up:')
                .text(`Date: ${visit.plan.followUp.date.toLocaleDateString()}`)
                .text(`Type: ${visit.plan.followUp.type}`)
                .text(`Instructions: ${visit.plan.followUp.instructions}`);
        }

        // Footer
        doc.fontSize(10)
            .text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' })
            .text('This is an official medical document', { align: 'center' });

        doc.end();

        return new Promise((resolve, reject) => {
            stream.on('finish', () => resolve(filename));
            stream.on('error', reject);
        });
    }

    static async generateLabReport(labReport, patient, doctor) {
        const doc = new PDFDocument();
        const filename = `lab-report-${labReport._id}.pdf`;
        const stream = fs.createWriteStream(filename);

        doc.pipe(stream);

        // Header
        doc.fontSize(20).text('Laboratory Report', { align: 'center' });
        doc.moveDown();

        // Patient Information
        doc.fontSize(16).text('Patient Information');
        doc.fontSize(12)
            .text(`Name: ${patient.firstName} ${patient.lastName}`)
            .text(`Date of Birth: ${patient.dateOfBirth.toLocaleDateString()}`)
            .text(`Gender: ${patient.gender}`);
        doc.moveDown();

        // Lab Information
        doc.fontSize(16).text('Test Information');
        doc.fontSize(12)
            .text(`Lab: ${labReport.labName}`)
            .text(`Report Date: ${labReport.reportDate.toLocaleDateString()}`)
            .text(`Test Date: ${labReport.testDate.toLocaleDateString()}`)
            .text(`Ordering Doctor: Dr. ${doctor.firstName} ${doctor.lastName}`);
        doc.moveDown();

        // Test Results
        doc.fontSize(16).text('Test Results');
        doc.fontSize(12);

        // Create table header
        const tableTop = doc.y;
        const tableLeft = 50;
        const colWidth = 100;

        doc.text('Test', tableLeft, tableTop)
            .text('Result', tableLeft + colWidth, tableTop)
            .text('Unit', tableLeft + colWidth * 2, tableTop)
            .text('Reference Range', tableLeft + colWidth * 3, tableTop);

        doc.moveDown();

        // Add test results
        labReport.tests.forEach(test => {
            doc.text(test.name, tableLeft)
                .text(test.result, tableLeft + colWidth)
                .text(test.unit, tableLeft + colWidth * 2)
                .text(`${test.referenceRange.low} - ${test.referenceRange.high}`, tableLeft + colWidth * 3)
                .moveDown();
        });

        // Notes
        if (labReport.notes) {
            doc.moveDown()
                .fontSize(14)
                .text('Notes')
                .fontSize(12)
                .text(labReport.notes);
        }

        // Footer
        doc.fontSize(10)
            .text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' })
            .text('This is an official medical document', { align: 'center' });

        doc.end();

        return new Promise((resolve, reject) => {
            stream.on('finish', () => resolve(filename));
            stream.on('error', reject);
        });
    }
}

module.exports = PDFGenerator; 