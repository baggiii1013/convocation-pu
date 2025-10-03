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
  enclosure: string;
  convocationEligible?: boolean;
  convocationRegistered?: boolean;
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
    
    // Map to expected format
    return data.map((row: any) => ({
      enrollmentId: row['enrollmentId'] || row['Enrollment ID'],
      name: row['name'] || row['Name'],
      email: row['email'] || row['Email'] || undefined,
      phone: row['phone'] || row['Phone'] || undefined,
      school: row['school'] || row['School'],
      course: row['course'] || row['Course'],
      degree: row['degree'] || row['Degree'],
      crr: row['crr'] || row['CRR'],
      enclosure: row['enclosure'] || row['Enclosure'],
      convocationEligible: parseBoolean(row['convocationEligible'] || row['Convocation Eligible']),
      convocationRegistered: parseBoolean(row['convocationRegistered'] || row['Convocation Registered'])
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
