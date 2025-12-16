import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Dynamically import jsPDF to avoid serverless issues
    const { jsPDF } = await import('jspdf');
    
    const body = await request.json();
    
    // Create PDF document
    const doc = new jsPDF();
    
    // Set initial position
    let yPos = 20;
    
    // Title
    doc.setFontSize(22);
    doc.text('CURRICULUM VITAE', 105, yPos, { align: 'center' });
    yPos += 15;
    
    // Personal Information
    doc.setFontSize(16);
    doc.text('Personal Information', 20, yPos);
    yPos += 10;
    
    doc.setFontSize(12);
    doc.text(`Name: ${body.name || 'Not provided'}`, 20, yPos);
    yPos += 7;
    
    doc.text(`Email: ${body.email || 'Not provided'}`, 20, yPos);
    yPos += 7;
    
    if (body.phone) {
      doc.text(`Phone: ${body.phone}`, 20, yPos);
      yPos += 7;
    }
    
    yPos += 5;
    
    // Professional Summary
    if (body.summary) {
      doc.setFontSize(16);
      doc.text('Professional Summary', 20, yPos);
      yPos += 10;
      
      doc.setFontSize(12);
      const summaryLines = doc.splitTextToSize(body.summary, 170);
      doc.text(summaryLines, 20, yPos);
      yPos += (summaryLines.length * 7) + 5;
    }
    
    // Experience
    if (body.experience && body.experience.length > 0) {
      doc.setFontSize(16);
      doc.text('Experience', 20, yPos);
      yPos += 10;
      
      doc.setFontSize(12);
      body.experience.forEach((exp: any) => {
        if (exp.jobTitle || exp.company) {
          const title = `${exp.jobTitle || ''}${exp.company ? ' at ' + exp.company : ''}`;
          doc.setFont('helvetica', 'bold');
          doc.text(title, 20, yPos);
          doc.setFont('helvetica', 'normal');
          yPos += 7;
          
          if (exp.description) {
            const descLines = doc.splitTextToSize(exp.description, 170);
            doc.text(descLines, 20, yPos);
            yPos += (descLines.length * 7) + 3;
          }
          yPos += 3;
        }
      });
    }
    
    // Skills
    if (body.skills) {
      doc.setFontSize(16);
      doc.text('Skills', 20, yPos);
      yPos += 10;
      
      doc.setFontSize(12);
      const skillsLines = doc.splitTextToSize(body.skills, 170);
      doc.text(skillsLines, 20, yPos);
    }
    
    // Get PDF as ArrayBuffer
    const pdfOutput = doc.output('arraybuffer');
    
    // Convert to Buffer for NextResponse
    const buffer = Buffer.from(pdfOutput);
    
    // Return PDF as response
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="cv.pdf"',
      },
    });
    
  } catch (error: any) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF', details: error.message },
      { status: 500 }
    );
  }
}