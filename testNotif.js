// Use fetch

async function testNotifications() {
  try {
    // We already have a Test Student and Test Activity from previous test.
    // Let's create an Admin/Teacher to approve it.
    let teacherToken = '';
    const regTeacher = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Teacher',
        email: 'teacher@test.com',
        password: 'password123',
        role: 'Teacher'
      })
    });
    let tData = await regTeacher.json();
    if (tData.token) teacherToken = tData.token;
    else {
      const loginTeacher = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'teacher@test.com', password: 'password123' })
      });
      tData = await loginTeacher.json();
      teacherToken = tData.token;
    }

    // Teacher gets pending activities
    const pendingRes = await fetch('http://localhost:5000/api/activities/pending', {
      headers: { Authorization: `Bearer ${teacherToken}` }
    });
    const pending = await pendingRes.json();
    console.log('Pending activities:', pending.length);

    if (pending.length > 0) {
      // Approve the first one
      const activityId = pending[0]._id;
      const approveRes = await fetch(`http://localhost:5000/api/activities/${activityId}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${teacherToken}` 
        },
        body: JSON.stringify({ status: 'Approved' })
      });
      const approveData = await approveRes.json();
      console.log('Approved:', approveData.message);
    }

    // Now login as the student who owned it, wait we don't know the exact student, but we can just login as Test Student
    const loginStudent = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@student.com', password: 'password123' })
    });
    const sData = await loginStudent.json();
    const studentToken = sData.token;

    // Check /auth/me for notifications
    const meRes = await fetch('http://localhost:5000/api/auth/me', {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    const me = await meRes.json();
    console.log('Student notifications:', me);
  } catch (err) {
    console.error(err);
  }
}
testNotifications();
