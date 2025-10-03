import ExcelJS from 'exceljs';

export class ExcelService {
  static async generateTemplate(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    
    // Create data sheet
    const dataSheet = workbook.addWorksheet('Student Data');
    
    // Define columns
    dataSheet.columns = [
      { header: 'enrollmentId', key: 'enrollmentId', width: 20 },
      { header: 'name', key: 'name', width: 30 },
      { header: 'email', key: 'email', width: 30 },
      { header: 'phone', key: 'phone', width: 15 },
      { header: 'school', key: 'school', width: 30 },
      { header: 'course', key: 'course', width: 30 },
      { header: 'degree', key: 'degree', width: 15 },
      { header: 'crr', key: 'crr', width: 25 },
      { header: 'enclosure', key: 'enclosure', width: 12 },
      { header: 'convocationEligible', key: 'convocationEligible', width: 20 },
      { header: 'convocationRegistered', key: 'convocationRegistered', width: 22 }
    ];
    
    // Style header row
    dataSheet.getRow(1).font = { bold: true };
    dataSheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    
    // Add sample data
    dataSheet.addRows([
      {
        enrollmentId: 'PU2024001234',
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+919876543210',
        school: 'School of Engineering',
        course: 'Computer Science',
        degree: 'B.Tech',
        crr: '507f1f77bcf86cd799439011',
        enclosure: 'A',
        convocationEligible: true,
        convocationRegistered: false
      },
      {
        enrollmentId: 'PU2024001235',
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+919876543211',
        school: 'School of Business',
        course: 'Business Administration',
        degree: 'MBA',
        crr: '507f1f77bcf86cd799439012',
        enclosure: 'B',
        convocationEligible: true,
        convocationRegistered: false
      }
    ]);
    
    // Create instructions sheet
    const instructionSheet = workbook.addWorksheet('Instructions');
    instructionSheet.addRows([
      ['Student Data Upload Template'],
      [''],
      ['Required Fields:'],
      ['- enrollmentId: Unique student enrollment ID'],
      ['- name: Full name of the student'],
      ['- school: Name of the school/department'],
      ['- course: Course name'],
      ['- degree: Degree type (B.Tech, MBA, etc.)'],
      ['- crr: Reference ID (24-character MongoDB ObjectId)'],
      ['- enclosure: Allocated enclosure code'],
      [''],
      ['Optional Fields:'],
      ['- email: Student email address'],
      ['- phone: Contact number'],
      ['- convocationEligible: true/false'],
      ['- convocationRegistered: true/false'],
      [''],
      ['Data Format Guidelines:'],
      ['- enrollmentId must be unique'],
      ['- email must be in valid format'],
      ['- phone should include country code'],
      ['- Boolean fields accept: true/false, yes/no, 1/0'],
      [''],
      ['Upload Process:'],
      ['1. Fill the Student Data sheet with your data'],
      ['2. Save the file'],
      ['3. Upload through the admin dashboard'],
      ['4. Review validation results'],
      ['5. Confirm import']
    ]);
    
    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
