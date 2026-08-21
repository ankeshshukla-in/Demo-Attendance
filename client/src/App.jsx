import { useMemo, useState } from "react";

const initialStudents = [
  { id: 1, roll: "VES001", name: "Aarav Sharma", present: true },
  { id: 2, roll: "VES002", name: "Ananya Patel", present: true },
  { id: 3, roll: "VES003", name: "Rohan Shah", present: false },
  { id: 4, roll: "VES004", name: "Priya Nair", present: true },
  { id: 5, roll: "VES005", name: "Aditya Mehta", present: true }
];

function App() {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState("");
  const [saved, setSaved] = useState(false);

  const filteredStudents = useMemo(
    () => students.filter((student) =>
      `${student.name} ${student.roll}`.toLowerCase().includes(search.toLowerCase())
    ),
    [students, search]
  );

  const presentCount = students.filter((student) => student.present).length;
  const percentage = Math.round((presentCount / students.length) * 100);

  const toggleAttendance = (id) => {
    setSaved(false);
    setStudents((current) => current.map((student) =>
      student.id === id ? { ...student, present: !student.present } : student
    ));
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <div className="eyebrow">VES COLLEGE</div>
          <h1>Attendance Management</h1>
        </div>
        <div className="date-pill">BSc IT · Semester 5</div>
      </header>

      <main className="content">
        <section className="hero">
          <div>
            <p className="eyebrow">TODAY'S OVERVIEW</p>
            <h2>Good morning, Faculty.</h2>
            <p>Manage student attendance quickly and keep your class records accurate.</p>
          </div>
          <div className="percentage-card">
            <span>Class Attendance</span>
            <strong>{percentage}%</strong>
          </div>
        </section>

        <section className="stats">
          <div><span>Total Students</span><strong>{students.length}</strong></div>
          <div><span>Present</span><strong>{presentCount}</strong></div>
          <div><span>Absent</span><strong>{students.length - presentCount}</strong></div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <div>
              <h3>Mark Attendance</h3>
              <p>Click a status to switch between Present and Absent.</p>
            </div>
            <input
              aria-label="Search students"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search student..."
            />
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Roll No.</th><th>Student</th><th>Status</th></tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{student.roll}</td>
                    <td>{student.name}</td>
                    <td>
                      <button
                        className={`status ${student.present ? "present" : "absent"}`}
                        onClick={() => toggleAttendance(student.id)}
                      >
                        {student.present ? "Present" : "Absent"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="actions">
            <span>{saved ? "Attendance saved locally." : "Review the list before saving."}</span>
            <button className="save" onClick={() => setSaved(true)}>Save Attendance</button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
