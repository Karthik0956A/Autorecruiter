const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

let authToken = '';

// Test functions
async function testRegister() {
  console.log('\n🔵 Testing User Registration...');
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Test Recruiter',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    });
    authToken = response.data.token;
    console.log('✅ Registration successful');
    console.log('Token:', authToken);
    return response.data;
  } catch (error) {
    console.log('❌ Registration failed:', error.response?.data || error.message);
  }
}

async function testJDAnalysis() {
  console.log('\n🔵 Testing JD Analysis...');
  try {
    const response = await axios.post(`${BASE_URL}/jd/analyze`, {
      jd_text: 'We are looking for a Frontend Developer with 3-5 years of experience. Must have strong skills in React, JavaScript, TypeScript, and CSS. Good to have: Redux, Next.js, AWS experience.'
    });
    console.log('✅ JD Analysis successful');
    console.log('Analysis:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.log('❌ JD Analysis failed:', error.response?.data || error.message);
  }
}

async function testCreateJD(jdData) {
  console.log('\n🔵 Testing Create JD...');
  try {
    const response = await axios.post(`${BASE_URL}/jd`, jdData, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ JD created successfully');
    console.log('JD ID:', response.data.data.jd_id);
    return response.data.data.jd_id;
  } catch (error) {
    console.log('❌ Create JD failed:', error.response?.data || error.message);
  }
}

async function testUploadCandidates(jdId) {
  console.log('\n🔵 Testing Upload Candidates...');
  try {
    const response = await axios.post(`${BASE_URL}/candidates/upload`, {
      jd_id: jdId,
      candidates: [
        {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          resume_text: 'Experienced Frontend Developer with 4 years of experience. Skills: React, JavaScript, TypeScript, Redux, Node.js, CSS, HTML. Built multiple web applications using React and modern frameworks.'
        },
        {
          name: 'Jane Smith',
          email: 'jane@example.com',
          phone: '+1987654321',
          resume_text: 'Senior Frontend Developer with 6 years of experience. Expert in React, TypeScript, Redux, Next.js, GraphQL, AWS. Led frontend architecture for multiple projects.'
        }
      ]
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Candidates uploaded successfully');
    console.log('Saved count:', response.data.data.saved_count);
    return response.data;
  } catch (error) {
    console.log('❌ Upload candidates failed:', error.response?.data || error.message);
  }
}

async function testGetMatches(jdId) {
  console.log('\n🔵 Testing Get Matches...');
  try {
    const response = await axios.get(`${BASE_URL}/match?jd_id=${jdId}`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Matches retrieved successfully');
    console.log('Candidates:', response.data.data.candidates.length);
    response.data.data.candidates.forEach(c => {
      console.log(`  - ${c.name}: ${c.match_score}% match`);
    });
    return response.data.data.candidates;
  } catch (error) {
    console.log('❌ Get matches failed:', error.response?.data || error.message);
  }
}

async function testSubmitFeedback(jdId, candidateId) {
  console.log('\n🔵 Testing Submit Feedback...');
  try {
    const response = await axios.post(`${BASE_URL}/feedback`, {
      jd_id: jdId,
      candidate_id: candidateId,
      action: 'shortlisted',
      notes: 'Great candidate!'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Feedback submitted successfully');
    return response.data;
  } catch (error) {
    console.log('❌ Submit feedback failed:', error.response?.data || error.message);
  }
}

async function testAnalytics() {
  console.log('\n🔵 Testing Analytics...');
  try {
    const response = await axios.get(`${BASE_URL}/analytics/overview`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Analytics retrieved successfully');
    console.log('Overview:', response.data.data);
    return response.data.data;
  } catch (error) {
    console.log('❌ Analytics failed:', error.response?.data || error.message);
  }
}

async function testHealthCheck() {
  console.log('\n🔵 Testing Health Check...');
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed');
    console.log('Status:', response.data.status);
    return response.data;
  } catch (error) {
    console.log('❌ Health check failed:', error.response?.data || error.message);
  }
}

// Run all tests
async function runTests() {
  console.log('═══════════════════════════════════════');
  console.log('  TalentSense AI - Backend API Tests  ');
  console.log('═══════════════════════════════════════');

  try {
    await testHealthCheck();
    await testRegister();
    const jdData = await testJDAnalysis();
    
    if (authToken && jdData) {
      const jdId = await testCreateJD(jdData);
      
      if (jdId) {
        await testUploadCandidates(jdId);
        const candidates = await testGetMatches(jdId);
        
        if (candidates && candidates.length > 0) {
          await testSubmitFeedback(jdId, candidates[0].candidate_id);
        }
        
        await testAnalytics();
      }
    }

    console.log('\n═══════════════════════════════════════');
    console.log('  ✅ All tests completed!              ');
    console.log('═══════════════════════════════════════\n');
  } catch (error) {
    console.log('\n❌ Test suite failed:', error.message);
  }
}

// Wait for server to start
setTimeout(() => {
  runTests();
}, 2000);
