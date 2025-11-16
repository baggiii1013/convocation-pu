/**
 * Attendance API Testing Script
 * 
 * This script tests the Attendance API endpoints
 * Run with: node test-attendance-api.js
 * 
 * Prerequisites:
 * 1. API server running on localhost:3001
 * 2. Valid authentication token
 * 3. Test attendee in database
 */

const API_BASE = 'http://localhost:3001/api/v1';

// Replace with your actual token and IDs
const AUTH_TOKEN = 'your_auth_token_here';
const TEST_ATTENDEE_ID = 'your_attendee_id_here';
const TEST_VERIFICATION_TOKEN = 'your_verification_token_here';
const STAFF_ID = 'your_staff_id_here';
const STAFF_NAME = 'Test Staff';

// Helper function for API calls
async function apiCall(endpoint, method = 'GET', body = null, auth = true) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  if (auth) {
    headers['Authorization'] = `Bearer ${AUTH_TOKEN}`;
  }
  
  const options = {
    method,
    headers,
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { error: error.message };
  }
}

// Test 1: Create manual attendance
async function testCreateAttendance() {
  console.log('\n📝 Test 1: Create Manual Attendance');
  console.log('-----------------------------------');
  
  const result = await apiCall('/attendance', 'POST', {
    attendeeId: TEST_ATTENDEE_ID,
    status: 'PRESENT',
    verificationMethod: 'MANUAL',
    location: 'Test Gate A',
    confirmedBy: STAFF_ID,
    confirmedByName: STAFF_NAME,
    notes: 'Test attendance record'
  });
  
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  
  if (result.data?.data?.id) {
    console.log('✅ Attendance created successfully!');
    return result.data.data.id;
  } else {
    console.log('❌ Failed to create attendance');
    return null;
  }
}

// Test 2: Get all attendance records
async function testGetAllAttendance() {
  console.log('\n📋 Test 2: Get All Attendance Records');
  console.log('------------------------------------');
  
  const result = await apiCall('/attendance?page=1&limit=5');
  
  console.log('Status:', result.status);
  console.log('Total Records:', result.data?.pagination?.total);
  console.log('Records:', result.data?.data?.length);
  
  if (result.data?.success) {
    console.log('✅ Retrieved attendance records successfully!');
  } else {
    console.log('❌ Failed to retrieve attendance records');
  }
}

// Test 3: Get attendance by ID
async function testGetAttendanceById(attendanceId) {
  if (!attendanceId) {
    console.log('\n⏭️  Skipping Test 3: No attendance ID available');
    return;
  }
  
  console.log('\n🔍 Test 3: Get Attendance by ID');
  console.log('-------------------------------');
  
  const result = await apiCall(`/attendance/${attendanceId}`);
  
  console.log('Status:', result.status);
  console.log('Attendance ID:', result.data?.data?.id);
  console.log('Status:', result.data?.data?.status);
  console.log('Method:', result.data?.data?.verificationMethod);
  
  if (result.data?.success) {
    console.log('✅ Retrieved attendance by ID successfully!');
  } else {
    console.log('❌ Failed to retrieve attendance by ID');
  }
}

// Test 4: Get attendee history
async function testGetAttendeeHistory() {
  console.log('\n📚 Test 4: Get Attendee History');
  console.log('-------------------------------');
  
  const result = await apiCall(`/attendance/attendee/${TEST_ATTENDEE_ID}?page=1&limit=5`);
  
  console.log('Status:', result.status);
  console.log('Records:', result.data?.data?.length);
  
  if (result.data?.success) {
    console.log('✅ Retrieved attendee history successfully!');
  } else {
    console.log('❌ Failed to retrieve attendee history');
  }
}

// Test 5: Get attendance statistics
async function testGetStatistics() {
  console.log('\n📊 Test 5: Get Attendance Statistics');
  console.log('-----------------------------------');
  
  const result = await apiCall('/attendance/statistics');
  
  console.log('Status:', result.status);
  console.log('Statistics:', JSON.stringify(result.data?.data, null, 2));
  
  if (result.data?.success) {
    console.log('✅ Retrieved statistics successfully!');
  } else {
    console.log('❌ Failed to retrieve statistics');
  }
}

// Test 6: Update attendance
async function testUpdateAttendance(attendanceId) {
  if (!attendanceId) {
    console.log('\n⏭️  Skipping Test 6: No attendance ID available');
    return;
  }
  
  console.log('\n✏️  Test 6: Update Attendance');
  console.log('----------------------------');
  
  const result = await apiCall(`/attendance/${attendanceId}`, 'PUT', {
    notes: 'Updated test note'
  });
  
  console.log('Status:', result.status);
  console.log('Updated:', result.data?.data?.notes);
  
  if (result.data?.success) {
    console.log('✅ Updated attendance successfully!');
  } else {
    console.log('❌ Failed to update attendance');
  }
}

// Test 7: Mark attendance by QR code
async function testMarkByQRCode() {
  console.log('\n📱 Test 7: Mark Attendance by QR Code');
  console.log('------------------------------------');
  
  const result = await apiCall('/attendance/mark-by-qr', 'POST', {
    verificationToken: TEST_VERIFICATION_TOKEN,
    location: 'QR Test Gate',
    confirmedBy: STAFF_ID,
    confirmedByName: STAFF_NAME
  }, false); // No auth required for QR endpoint
  
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  
  if (result.data?.success) {
    console.log('✅ Marked attendance by QR successfully!');
  } else {
    console.log('❌ Failed to mark attendance by QR');
  }
}

// Test 8: Bulk mark attendance
async function testBulkMarkAttendance() {
  console.log('\n📦 Test 8: Bulk Mark Attendance');
  console.log('-------------------------------');
  
  const result = await apiCall('/attendance/bulk', 'POST', {
    attendances: [
      {
        attendeeId: TEST_ATTENDEE_ID,
        status: 'PRESENT',
        verificationMethod: 'MANUAL',
        location: 'Bulk Test Gate'
      }
    ],
    confirmedBy: STAFF_ID,
    confirmedByName: STAFF_NAME
  });
  
  console.log('Status:', result.status);
  console.log('Success Count:', result.data?.data?.successCount);
  console.log('Failed Count:', result.data?.data?.failedCount);
  
  if (result.data?.success) {
    console.log('✅ Bulk marked attendance successfully!');
  } else {
    console.log('❌ Failed to bulk mark attendance');
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Attendance API Tests');
  console.log('================================\n');
  
  console.log('Configuration:');
  console.log('API Base:', API_BASE);
  console.log('Test Attendee ID:', TEST_ATTENDEE_ID);
  console.log('Auth Token:', AUTH_TOKEN ? 'Configured ✓' : 'Missing ✗');
  console.log('Verification Token:', TEST_VERIFICATION_TOKEN ? 'Configured ✓' : 'Missing ✗');
  
  try {
    // Run tests sequentially
    const attendanceId = await testCreateAttendance();
    await testGetAllAttendance();
    await testGetAttendanceById(attendanceId);
    await testGetAttendeeHistory();
    await testGetStatistics();
    await testUpdateAttendance(attendanceId);
    // await testMarkByQRCode(); // Uncomment if you have a valid verification token
    // await testBulkMarkAttendance(); // Uncomment to test bulk operations
    
    console.log('\n✅ All tests completed!');
    console.log('=======================\n');
  } catch (error) {
    console.error('\n❌ Test error:', error);
  }
}

// Check if configuration is complete
if (!AUTH_TOKEN || AUTH_TOKEN === 'your_auth_token_here') {
  console.log('⚠️  Please configure AUTH_TOKEN before running tests');
  console.log('Get your token by logging in through the /api/v1/auth/login endpoint\n');
}

if (!TEST_ATTENDEE_ID || TEST_ATTENDEE_ID === 'your_attendee_id_here') {
  console.log('⚠️  Please configure TEST_ATTENDEE_ID before running tests');
  console.log('Create an attendee through the /api/v1/attendees endpoint first\n');
}

// Run tests if properly configured
if (AUTH_TOKEN && AUTH_TOKEN !== 'your_auth_token_here' &&
    TEST_ATTENDEE_ID && TEST_ATTENDEE_ID !== 'your_attendee_id_here') {
  runAllTests();
} else {
  console.log('Please configure the required variables at the top of this file and run again.');
}
