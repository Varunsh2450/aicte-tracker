const fs = require('fs');

async function test() {
  try {
    let token = '';
    const regRes = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Student',
        usn: '12345',
        email: 'test@student.com',
        password: 'password123',
        role: 'Student'
      })
    });
    const regData = await regRes.json();
    
    if (regData.token) {
      token = regData.token;
    } else {
      const loginRes = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@student.com',
          password: 'password123'
        })
      });
      const loginData = await loginRes.json();
      token = loginData.token;
    }

    console.log('Token:', token.substring(0, 10) + '...');

    const form = new FormData();
    form.append('title', 'Test Activity');
    form.append('where', 'Test Location');
    form.append('description', 'Test Description');
    form.append('pointsRequested', "10");
    
    form.append('certificate', new Blob(['dummy content'], { type: 'application/pdf' }), 'dummy.pdf');

    const res = await fetch('http://localhost:5000/api/activities', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: form
    });
    
    const data = await res.json();
    console.log('Status:', res.status);
    console.log('Success:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
