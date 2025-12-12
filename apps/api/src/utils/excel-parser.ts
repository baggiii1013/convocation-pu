import * as XLSX from 'xlsx';

interface ParsedRow {
  enrollmentId: string;
  name: string;
  email?: string;
  phone?: string;
  school: string;
  course: string;
  degree: string;
  crr: string;
  enclosure?: string;
  convocationEligible?: boolean;
  convocationRegistered?: boolean;
}

// Helper to find a value from multiple possible column names (case-insensitive)
function getColumnValue(row: any, ...possibleNames: string[]): string | undefined {
  for (const name of possibleNames) {
    // Check exact match
    if (row[name] !== undefined && row[name] !== null && row[name] !== '') {
      return String(row[name]);
    }
    // Check case-insensitive match
    const lowerName = name.toLowerCase();
    for (const key of Object.keys(row)) {
      if (key.toLowerCase() === lowerName && row[key] !== undefined && row[key] !== null && row[key] !== '') {
        return String(row[key]);
      }
    }
  }
  return undefined;
}

export class ExcelParser {
  static parse(buffer: Buffer): ParsedRow[] {
    // Read workbook from buffer
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    
    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      throw new Error('No sheets found in the Excel file');
    }
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) {
      throw new Error('Sheet not found in the Excel file');
    }
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(sheet, {
      raw: false,
      defval: undefined
    });
    
    // Log first row to see column names (for debugging)
    if (data.length > 0) {
      console.log('Excel columns found:', Object.keys(data[0] as object));
      console.log('First row data:', JSON.stringify(data[0], null, 2));
    }
    
    // Map to expected format with flexible column name matching
    return data.map((row: any) => ({
      enrollmentId: getColumnValue(row, 'enrollmentId', 'Enrollment ID', 'EnrollmentID', 'enrollment_id', 'ENROLLMENT ID', 'Enrollment Id', 'Enrollment', 'enrollment', 'ID', 'id', 'Student ID', 'StudentID') || '',
      name: getColumnValue(row, 'name', 'Name', 'NAME', 'Student Name', 'StudentName', 'student_name', 'Full Name', 'FullName', 'Student') || '',
      email: getColumnValue(row, 'email', 'Email', 'EMAIL', 'E-mail', 'e-mail', 'Email Address', 'EmailAddress', 'email_address'),
      phone: getColumnValue(row, 'phone', 'Phone', 'PHONE', 'Mobile', 'mobile', 'Phone Number', 'Contact', 'Mobile Number', 'MobileNumber', 'Contact Number'),
      school: getColumnValue(row, 'school', 'School', 'SCHOOL', 'Faculty', 'faculty', 'Institute', 'FACULTY', 'College') || '',
      course: getColumnValue(row, 'course', 'Course', 'COURSE', 'Program', 'program', 'Programme', 'PROGRAM', 'Branch', 'branch', 'BRANCH', 'Specialization', 'Stream') || '',
      degree: getColumnValue(row, 'degree', 'Degree', 'DEGREE', 'Qualification', 'qualification', 'QUALIFICATION', 'Course Type', 'CourseType', 'Type') || '',
      crr: getColumnValue(row, 'crr', 'CRR', 'Crr', 'CR No', 'CR NO', 'CRR No', 'CRR NO', 'CR Number', 'CRRNo', 'CR', 'Cr') || '',
      enclosure: getColumnValue(row, 'enclosure', 'Enclosure', 'ENCLOSURE', 'Encl', 'encl', 'ENCL'),
      convocationEligible: parseBoolean(getColumnValue(row, 'convocationEligible', 'Convocation Eligible', 'ConvocationEligible', 'Eligible', 'ELIGIBLE')),
      convocationRegistered: parseBoolean(getColumnValue(row, 'convocationRegistered', 'Convocation Registered', 'ConvocationRegistered', 'Registered', 'REGISTERED'))
    }));
  }
}

function parseBoolean(value: any): boolean | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    if (lower === 'true' || lower === 'yes' || lower === '1') return true;
    if (lower === 'false' || lower === 'no' || lower === '0') return false;
  }
  if (typeof value === 'number') {
    return value === 1;
  }
  return undefined;
}
