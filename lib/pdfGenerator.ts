import { jsPDF } from 'jspdf';
import { CVData } from '@/types/cv';

export async function generatePDF(cvData: CVData): Promise<Blob> {
  const doc = new jsPDF();
  
  // Set document properties
  doc.setProperties({
    title: `CV - ${cvData.personalInfo.fullName}`,
    subject: 'Professional CV',
    author: cvData.personalInfo.fullName,
  });

  // Add content
  let yPos = 20;

  // Header
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text(cvData.personalInfo.fullName, 20, yPos);
  yPos += 10;

  // Contact info
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  const contactInfo = [
    cvData.personalInfo.email,
    cvData.personalInfo.phone,
    cvData.personalInfo.address,
  ].filter(Boolean).join(' | ');
  doc.text(contactInfo, 20, yPos);
  yPos += 15;

  // Summary
  if (cvData.summary) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Professional Summary', 20, yPos);
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const summaryLines = doc.splitTextToSize(cvData.summary, 170);
    doc.text(summaryLines, 20, yPos);
    yPos += summaryLines.length * 6 + 10;
  }

  // Experience
  if (cvData.experience.length > 0) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Work Experience', 20, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    cvData.experience.forEach((exp) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFont('helvetica', 'bold');
      doc.text(`${exp.jobTitle}`, 20, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(`${exp.company} | ${exp.location}`, 20, yPos + 6);
      doc.text(`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`, 20, yPos + 12);
      
      const descLines = doc.splitTextToSize(exp.description, 170);
      doc.text(descLines, 20, yPos + 20);
      yPos += 30 + (descLines.length * 5);
    });
    yPos += 10;
  }

  // Convert to blob
  const pdfBlob = doc.output('blob');
  return pdfBlob;
}