import { jsPDF } from 'jspdf';
import { Patient, Visit } from '../types/patient';

export const generatePatientSummary = (patient: Patient): string => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.setTextColor(0, 66, 130);
  doc.text('Conexem EMR', 105, 20, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Patient Summary', 105, 30, { align: 'center' });
  
  // Add patient info
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Patient: ${patient.firstName} ${patient.lastName}`, 20, 50);
  doc.text(`DOB: ${new Date(patient.dateOfBirth).toLocaleDateString()}`, 20, 60);
  doc.text(`Gender: ${patient.gender}`, 20, 70);
  doc.text(`Phone: ${patient.phone}`, 20, 80);
  doc.text(`Email: ${patient.email}`, 20, 90);
  
  doc.text('Address:', 20, 105);
  doc.text(`${patient.address.street}`, 30, 115);
  doc.text(`${patient.address.city}, ${patient.address.state} ${patient.address.zipCode}`, 30, 125);
  
  // Medical conditions
  doc.setFontSize(14);
  doc.text('Medical Conditions', 20, 145);
  doc.setFontSize(12);
  
  let yPosition = 155;
  if (patient.medicalHistory?.chronicConditions.length) {
    patient.medicalHistory.chronicConditions.forEach((condition, index) => {
      doc.text(`${index + 1}. ${condition}`, 30, yPosition);
      yPosition += 10;
    });
  } else {
    doc.text('No chronic conditions recorded', 30, yPosition);
    yPosition += 10;
  }
  
  // Allergies
  yPosition += 10;
  doc.setFontSize(14);
  doc.text('Allergies', 20, yPosition);
  doc.setFontSize(12);
  
  yPosition += 10;
  if (patient.medicalHistory?.allergies.length) {
    patient.medicalHistory.allergies.forEach((allergy, index) => {
      doc.text(`${index + 1}. ${allergy}`, 30, yPosition);
      yPosition += 10;
    });
  } else {
    doc.text('No allergies recorded', 30, yPosition);
    yPosition += 10;
  }
  
  // Medications
  yPosition += 10;
  doc.setFontSize(14);
  doc.text('Current Medications', 20, yPosition);
  doc.setFontSize(12);
  
  yPosition += 10;
  if (patient.medicalHistory?.medications.length) {
    patient.medicalHistory.medications.forEach((medication, index) => {
      doc.text(`${index + 1}. ${medication.name} - ${medication.dosage} ${medication.frequency}`, 30, yPosition);
      yPosition += 10;
    });
  } else {
    doc.text('No medications recorded', 30, yPosition);
    yPosition += 10;
  }
  
  // Recent Visits
  yPosition += 10;
  doc.setFontSize(14);
  doc.text('Recent Visits', 20, yPosition);
  doc.setFontSize(12);
  
  yPosition += 10;
  if (patient.visits.length) {
    patient.visits.slice(0, 3).forEach((visit, index) => {
      doc.text(`${new Date(visit.date).toLocaleDateString()} - ${visit.type} with ${visit.provider}`, 30, yPosition);
      yPosition += 10;
      doc.text(`Assessment: ${visit.notes.assessment}`, 40, yPosition);
      yPosition += 10;
    });
  } else {
    doc.text('No visits recorded', 30, yPosition);
    yPosition += 10;
  }
  
  // Footer
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const today = new Date().toLocaleDateString();
  doc.text(`Generated on ${today} by Conexem EMR`, 105, 280, { align: 'center' });
  
  // Get the PDF as base64 string
  const pdfBase64 = doc.output('datauristring');
  return pdfBase64;
};

export const generateVisitSummary = (patient: Patient, visit: Visit): string => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(20);
  doc.setTextColor(0, 66, 130);
  doc.text('Conexem EMR', 105, 20, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('Visit Summary', 105, 30, { align: 'center' });
  
  // Add patient info
  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Patient: ${patient.firstName} ${patient.lastName}`, 20, 50);
  doc.text(`DOB: ${new Date(patient.dateOfBirth).toLocaleDateString()}`, 20, 60);
  
  // Visit details
  doc.setFontSize(14);
  doc.text('Visit Information', 20, 80);
  doc.setFontSize(12);
  doc.text(`Date: ${new Date(visit.date).toLocaleDateString()}`, 30, 90);
  doc.text(`Provider: ${visit.provider}`, 30, 100);
  doc.text(`Type: ${visit.type} Visit`, 30, 110);
  
  // SOAP Notes
  doc.setFontSize(14);
  doc.text('SOAP Notes', 20, 130);
  doc.setFontSize(12);
  
  doc.text('Subjective:', 30, 140);
  doc.text(visit.notes.subjective, 40, 150, { maxWidth: 150 });
  
  let yPosition = 170;
  doc.text('Objective:', 30, yPosition);
  yPosition += 10;
  doc.text(visit.notes.objective, 40, yPosition, { maxWidth: 150 });
  
  yPosition += 30;
  doc.text('Assessment:', 30, yPosition);
  yPosition += 10;
  doc.text(visit.notes.assessment, 40, yPosition, { maxWidth: 150 });
  
  yPosition += 30;
  doc.text('Plan:', 30, yPosition);
  yPosition += 10;
  doc.text(visit.notes.plan, 40, yPosition, { maxWidth: 150 });
  
  // Footer
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  const today = new Date().toLocaleDateString();
  doc.text(`Generated on ${today} by Conexem EMR`, 105, 280, { align: 'center' });
  
  // Get the PDF as base64 string
  const pdfBase64 = doc.output('datauristring');
  return pdfBase64;
};