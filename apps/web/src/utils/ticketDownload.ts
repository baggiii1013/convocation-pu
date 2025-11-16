import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface TicketData {
  name: string;
  enrollmentId: string;
  course: string;
  school: string;
  degree: string;
  allocation: {
    enclosure: string;
    row: string;
    seat: number;
  };
  verificationToken: string;
}

export const generateQRCodeDataUrl = (token: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const size = 300;
    
    canvas.width = size;
    canvas.height = size;
    
    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }
    
    // Create QR code image
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Fill white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);
      
      // Draw QR code
      ctx.drawImage(img, 15, 15, size - 30, size - 30);
      
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error('Failed to load QR code'));
    
    const qrData = encodeURIComponent(token);
    img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size - 30}x${size - 30}&data=${qrData}`;
  });
};

export const createTicketHTML = (ticketData: TicketData, qrCodeDataUrl: string): string => {
  return `
    <div style="
      width: 1000px;
      height: 700px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20px;
      padding: 50px;
      color: white;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      position: relative;
      overflow: visible;
      box-sizing: border-box;
    ">
      <!-- Background pattern -->
      <div style="
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
                          radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%);
        border-radius: 20px;
      "></div>
      
      <!-- Header -->
      <div style="position: relative; z-index: 2; height: 100%;">
        <div style="text-align: center; margin-bottom: 35px;">
          <h1 style="font-size: 36px; margin: 0; font-weight: bold; line-height: 1.2;">CONVOCATION TICKET</h1>
          <p style="font-size: 18px; margin: 10px 0 0 0; opacity: 0.9;">Parul University</p>
        </div>
        
        <!-- Main content -->
        <div style="display: flex; gap: 50px; align-items: flex-start; height: calc(100% - 150px);">
          <!-- Left side - Details -->
          <div style="flex: 1; min-height: 100%;">
            <div style="background: rgba(255,255,255,0.1); border-radius: 15px; padding: 35px; backdrop-filter: blur(10px); margin-bottom: 25px;">
              <h2 style="font-size: 28px; margin: 0 0 25px 0; font-weight: 600; line-height: 1.2; word-wrap: break-word;">${ticketData.name}</h2>
              
              <div>
                <div style="margin-bottom: 20px;">
                  <div style="font-size: 14px; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Enrollment ID</div>
                  <div style="font-size: 20px; font-weight: 600; line-height: 1.3; word-wrap: break-word;">${ticketData.enrollmentId}</div>
                </div>
                
                <div style="margin-bottom: 20px;">
                  <div style="font-size: 14px; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Course</div>
                  <div style="font-size: 18px; font-weight: 600; line-height: 1.3; word-wrap: break-word;">${ticketData.course}</div>
                </div>
                
                <div style="margin-bottom: 20px;">
                  <div style="font-size: 14px; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">School</div>
                  <div style="font-size: 18px; font-weight: 600; line-height: 1.3; word-wrap: break-word;">${ticketData.school}</div>
                </div>
                
                <div style="margin-bottom: 0;">
                  <div style="font-size: 14px; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Degree</div>
                  <div style="font-size: 18px; font-weight: 600; line-height: 1.3; word-wrap: break-word;">${ticketData.degree}</div>
                </div>
              </div>
            </div>
            
            <!-- Seat info -->
            <div style="background: rgba(255,255,255,0.15); border-radius: 15px; padding: 25px;">
              <div style="font-size: 14px; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px; text-align: center;">Seat Assignment</div>
              <div style="font-size: 26px; font-weight: bold; text-align: center; line-height: 1.2;">
                ${ticketData.allocation.enclosure} - Row ${ticketData.allocation.row} - Seat ${ticketData.allocation.seat}
              </div>
            </div>
          </div>
          
          <!-- Right side - QR Code -->
          <div style="text-align: center; flex-shrink: 0;">
            <div style="background: rgba(255,255,255,0.1); border-radius: 15px; padding: 30px; backdrop-filter: blur(10px);">
              <div style="font-size: 14px; opacity: 0.8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px;">Verification QR Code</div>
              <img src="${qrCodeDataUrl}" style="width: 280px; height: 280px; border-radius: 10px; display: block; margin: 0 auto;" alt="QR Code" />
              <p style="font-size: 13px; opacity: 0.7; margin: 20px 0 0 0; max-width: 280px; line-height: 1.4;">
                Show this QR code at the venue for entry verification
              </p>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; opacity: 0.7; position: absolute; bottom: 20px; left: 50px; right: 50px;">
          <p style="font-size: 12px; margin: 0; line-height: 1.4;">This is an official digital ticket for Parul University Convocation</p>
          <p style="font-size: 12px; margin: 5px 0 0 0; line-height: 1.4;">Please keep this ticket safe and present it at the venue</p>
        </div>
      </div>
    </div>
  `;
};

export const downloadTicketAsPDF = async (ticketData: TicketData): Promise<void> => {
  try {
    // Generate QR code
    const qrCodeDataUrl = await generateQRCodeDataUrl(ticketData.verificationToken);
    
    // Create temporary div with ticket HTML
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-10000px';
    tempDiv.style.top = '-10000px';
    tempDiv.style.width = '1000px';
    tempDiv.style.height = '700px';
    tempDiv.innerHTML = createTicketHTML(ticketData, qrCodeDataUrl);
    document.body.appendChild(tempDiv);

    // Wait a moment for fonts and images to load
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Convert to canvas with better settings
    const canvas = await html2canvas(tempDiv.firstElementChild as HTMLElement, {
      width: 1000,
      height: 700,
      scale: 2,
      backgroundColor: null,
      logging: false,
      allowTaint: false,
      useCORS: true,
      onclone: (clonedDoc) => {
        // Ensure all images are loaded in the cloned document
        const images = clonedDoc.querySelectorAll('img');
        images.forEach(img => {
          img.style.display = 'block';
        });
      }
    });
    
    // Remove temporary element
    document.body.removeChild(tempDiv);
    
    // Create PDF with A4 landscape dimensions
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    // A4 landscape dimensions: 297mm x 210mm
    const pageWidth = 297;
    const pageHeight = 210;
    
    // Calculate dimensions to fit the content properly with margins
    const margin = 10;
    const availableWidth = pageWidth - (2 * margin);
    const availableHeight = pageHeight - (2 * margin);
    
    // Calculate scaling to fit within available space
    const widthRatio = availableWidth / (canvas.width / canvas.height * availableHeight);
    const heightRatio = availableHeight / (canvas.height / canvas.width * availableWidth);
    const scale = Math.min(widthRatio, heightRatio, 1);
    
    const imgWidth = (canvas.width / canvas.height) * availableHeight * scale;
    const imgHeight = availableHeight * scale;
    
    // Center the content
    const x = margin + (availableWidth - imgWidth) / 2;
    const y = margin + (availableHeight - imgHeight) / 2;
    
    pdf.addImage(
      canvas.toDataURL('image/png', 1.0), 
      'PNG', 
      x, 
      y, 
      imgWidth, 
      imgHeight
    );
    
    // Download
    const fileName = `convocation-ticket-${ticketData.enrollmentId}.pdf`;
    pdf.save(fileName);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const downloadTicketAsImage = async (ticketData: TicketData): Promise<void> => {
  try {
    // Generate QR code
    const qrCodeDataUrl = await generateQRCodeDataUrl(ticketData.verificationToken);
    
    // Create temporary div with ticket HTML
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-10000px';
    tempDiv.style.top = '-10000px';
    tempDiv.style.width = '1000px';
    tempDiv.style.height = '700px';
    tempDiv.innerHTML = createTicketHTML(ticketData, qrCodeDataUrl);
    document.body.appendChild(tempDiv);

    // Wait a moment for fonts and images to load
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Convert to canvas with better settings
    const canvas = await html2canvas(tempDiv.firstElementChild as HTMLElement, {
      width: 1000,
      height: 700,
      scale: 2,
      backgroundColor: null,
      logging: false,
      allowTaint: false,
      useCORS: true,
      onclone: (clonedDoc) => {
        // Ensure all images are loaded in the cloned document
        const images = clonedDoc.querySelectorAll('img');
        images.forEach(img => {
          img.style.display = 'block';
        });
      }
    });
    
    // Remove temporary element
    document.body.removeChild(tempDiv);
    
    // Create download link with high quality PNG
    const link = document.createElement('a');
    link.download = `convocation-ticket-${ticketData.enrollmentId}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
};