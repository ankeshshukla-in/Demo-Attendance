import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const API = 'http://localhost:5000/api';

function App() {
  const [students, setStudents] = useState([]);
  const [records, setRecords] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [form, setForm] = useState({ rollNo: '', name: '', email: '', course: '' });
  const [message, setMessage] = useState('');

  const load = async () => {
    const [studentRes, attendanceRes] = await Promise.all([
      fetch(`${API}/students`),
      fetch(`${API}/attendance?date=${date}`)
    ]);
    setStudents(await studentRes.json());
    setRecords(await attendanceRes.json());
  };

  useEffect(() => { load().catch(() => setMessage('Start the backend server first.')); }, [date]);

  const stats = useMemo(() => {
    const present = records.filter((r) => r.status === 'Present').length;
    return { total: students.length, present, absent: Math.max(students.length - present, 0) };
  }, [students, records]);

  const addStudent = async (event) => {
    event.preventDefault();
    const response = await fetch(`${API}/students`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
    });
    const data = await response.json();
    if (!response.ok) return setMessage(data.message || 'Could not add student.');
    setForm({ rollNo: '', name: '', email: '', course: '' });
    setMessage('Student added.');
    load();
  };

  const mark = async (studentId, status) => {
    await fetch(`${API}/attendance/mark`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student: studentId, date, status })
    });
    load();
  };

  const statusFor = (studentId) => records.find((r) => r.student?._id === studentId)?.status;

  return <main className="container">
    <header><div><p className="eyebrow">MERN APPLICATION</p><h1>Attendance Management</h1><p className="muted">Manage students and record daily attendance.</p></div><label>Date<input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label></header>
    <section className="stats"><article><span>Students</span><strong>{stats.total}</strong></article><article><span>Present</span><strong>{stats.present}</strong></article><article><span>Absent</span><strong>{stats.absent}</strong></article></section>
    <section className="grid">
      <form className="card" onSubmit={addStudent}><h2>Add Student</h2>{['rollNo','name','email','course'].map((field) => <input key={field} required={field === 'rollNo' || field === 'name'} placeholder={field === 'rollNo' ? 'Roll number' : field[0].toUpperCase() + field.slice(1)} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />)}<button>Add Student</button>{message && <p className="muted">{message}</p>}</form>
      <section className="card"><div className="section-head"><h2>Today's Attendance</h2><span className="pill">{date}</span></div>{students.length === 0 ? <p className="muted">No students yet.</p> : <div className="list">{students.map((student) => <div className="student" key={student._id}><div><strong>{student.name}</strong><small>{student.rollNo} · {student.course || 'Course not set'}</small></div><div className="actions"><button className={statusFor(student._id) === 'Present' ? 'active' : ''} onClick={() => mark(student._id, 'Present')}>Present</button><button className={statusFor(student._id) === 'Absent' ? 'danger active' : 'danger'} onClick={() => mark(student._id, 'Absent')}>Absent</button></div></div>)}</div>}</section>
    </section>
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
