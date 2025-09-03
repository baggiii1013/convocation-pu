/**
 * API Testing Script for Attendee Management
 * 
 * This script tests the Attendee API endpoints to ensure they work correctly.
 * Run with: node test-attendee-api.js
 * 
 * Prerequisites:
 * 1. API server running on localhost:3001
 * 2. Database seeded with test accounts
 * 3. Valid authentication token
 */

const API_BASE = 'http://localhost:3001/api';

// Test data
const testAttendee = {
  enrollmentId: 'PU2024TEST001',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '9876543210',
  school: 'Engineering',
  course: 'Computer Science',
  degree: 'B.Tech',
  academicYear: '2023-2024',
  batchYear: 2024,
  rollNumber: 'CS2024001',
  cgpa: 8.5,
  convocationEligible: true,
  convocationRegistered: false,
  guardianName: 'Jane Doe',
  guardianPhone: '9876543211',
  address: '123 Main St, Test City',
  emergencyContact: '9876543212'
};

// Helper function to make API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      // Add your auth token here - replace with actual token from login
      'Authorization': 'Bearer YOUR_AUTH_TOKEN_HERE',
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    console.log(`\n🔵 ${options.method || 'GET'} ${endpoint}`);
    console.log(`Status: ${response.status} ${response.statusText}`);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    return { response, data };
  } catch (error) {
    console.error(`\n❌ Error with ${endpoint}:`, error.message);
    return { error };
  }
}

// Test functions
async function testHealthCheck() {
  console.log('\n=== Testing Health Check ===');
  await apiRequest('/health');
}

async function testAttendeeStatistics() {
  console.log('\n=== Testing Attendee Statistics ===');
  await apiRequest('/attendees/statistics');
}

async function testCreateAttendee() {
  console.log('\n=== Testing Create Attendee ===');
  const { data } = await apiRequest('/attendees', {
    method: 'POST',
    body: JSON.stringify(testAttendee)
  });
  
  if (data?.success && data?.data?.attendee) {
    console.log('✅ Attendee created successfully');
    return data.data.attendee.id;
  } else {
    console.log('❌ Failed to create attendee');
    return null;
  }
}

async function testGetAllAttendees() {
  console.log('\n=== Testing Get All Attendees ===');
  await apiRequest('/attendees?page=1&limit=10&sortBy=createdAt&sortOrder=desc');
}

async function testGetAttendeeById(attendeeId) {
  if (!attendeeId) {
    console.log('\n⚠️ Skipping get by ID test - no attendee ID available');
    return;
  }
  
  console.log('\n=== Testing Get Attendee by ID ===');
  await apiRequest(`/attendees/${attendeeId}`);
}

async function testGetAttendeeByEnrollmentId() {
  console.log('\n=== Testing Get Attendee by Enrollment ID ===');
  await apiRequest(`/attendees/enrollment/${testAttendee.enrollmentId}`);
}

async function testUpdateAttendee(attendeeId) {
  if (!attendeeId) {
    console.log('\n⚠️ Skipping update test - no attendee ID available');
    return;
  }
  
  console.log('\n=== Testing Update Attendee ===');
  const updateData = {
    cgpa: 9.0,
    convocationRegistered: true
  };
  
  await apiRequest(`/attendees/${attendeeId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });
}

async function testSearchAttendees() {
  console.log('\n=== Testing Search Attendees ===');
  await apiRequest('/attendees?search=John&school=Engineering&convocationEligible=true');
}

async function testFilterAttendees() {
  console.log('\n=== Testing Filter Attendees ===');
  await apiRequest('/attendees?school=Engineering&degree=B.Tech&page=1&limit=5');
}

async function testBulkCreateAttendees() {
  console.log('\n=== Testing Bulk Create Attendees ===');
  const bulkData = {
    attendees: [
      {
        ...testAttendee,
        enrollmentId: 'PU2024BULK001',
        name: 'Alice Smith',
        email: 'alice.smith@example.com'
      },
      {
        ...testAttendee,
        enrollmentId: 'PU2024BULK002',
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com'
      }
    ]
  };
  
  await apiRequest('/attendees/bulk', {
    method: 'POST',
    body: JSON.stringify(bulkData)
  });
}

async function testDeleteAttendee(attendeeId) {
  if (!attendeeId) {
    console.log('\n⚠️ Skipping delete test - no attendee ID available');
    return;
  }
  
  console.log('\n=== Testing Delete Attendee ===');
  await apiRequest(`/attendees/${attendeeId}`, {
    method: 'DELETE'
  });
}

// Main test execution
async function runTests() {
  console.log('🚀 Starting Attendee API Tests');
  console.log('=====================================');
  
  // Basic health check
  await testHealthCheck();
  
  // Get initial statistics
  await testAttendeeStatistics();
  
  // Create a test attendee
  const attendeeId = await testCreateAttendee();
  
  // Test retrieval operations
  await testGetAllAttendees();
  await testGetAttendeeById(attendeeId);
  await testGetAttendeeByEnrollmentId();
  
  // Test update operation
  await testUpdateAttendee(attendeeId);
  
  // Test search and filtering
  await testSearchAttendees();
  await testFilterAttendees();
  
  // Test bulk operations
  await testBulkCreateAttendees();
  
  // Get final statistics
  await testAttendeeStatistics();
  
  // Clean up (delete test attendee)
  // Note: Uncomment the line below if you want to clean up test data
  // await testDeleteAttendee(attendeeId);
  
  console.log('\n✅ All tests completed!');
  console.log('=====================================');
}

// Instructions for running the tests
console.log(`
📋 INSTRUCTIONS FOR RUNNING ATTENDEE API TESTS:

1. Make sure the API server is running:
   cd /mnt/240GB_SATA/Development/Parul/convocation-pu/apps/api
   bun run dev

2. Get an authentication token:
   - Use the /api/auth/login endpoint with valid credentials
   - Copy the access token from the response

3. Update the AUTH TOKEN in this file:
   - Replace 'YOUR_AUTH_TOKEN_HERE' with your actual token

4. Run this test script:
   node test-attendee-api.js

5. Expected Results:
   - All endpoints should return proper JSON responses
   - POST requests should create data successfully
   - GET requests should retrieve data with proper pagination
   - PUT requests should update data
   - Search and filtering should work correctly

Note: This script requires Node.js with fetch support (Node 18+) or install node-fetch
`);

// Only run tests if this file is executed directly
if (require.main === module) {
  // Check if AUTH token is updated
  if (apiRequest.toString().includes('YOUR_AUTH_TOKEN_HERE')) {
    console.log('\n⚠️ WARNING: Please update the AUTH token before running tests!');
    console.log('See instructions above for how to get and set the token.');
  } else {
    runTests().catch(console.error);
  }
}
