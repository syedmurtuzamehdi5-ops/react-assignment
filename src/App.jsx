import { useState, useEffect } from 'react';
import { GraduationCap, Sun, Moon, Database, Download } from 'lucide-react';
import StatsDashboard from './components/StatsDashboard';
import StudentForm from './components/StudentForm';
import StudentList from './components/StudentList';
import GradeChart from './components/GradeChart';
import EditStudentModal from './components/EditStudentModal';

const SAMPLE_STUDENTS = [
  { roll: '101', name: 'Sarah', marks: 92, history: [] },
  { roll: '102', name: 'Jayanth', marks: 35, history: [] },
  { roll: '103', name: 'Berlin', marks: 78, history: [] },
  { roll: '104', name: 'Klaus', marks: 64, history: [] },
  { roll: '105', name: 'Sarim', marks: 83, history: [] },
  { roll: '106', name: 'jhonny', marks: 55, history: [] }
];

export default function App() {
  // Persistence using LocalStorage for students and theme
    const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('students');
    return saved ? JSON.parse(saved) : SAMPLE_STUDENTS; // Now defaults to your sample list!
  });

  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'dark';
  });

  // Edit Modal State
  const [editingStudent, setEditingStudent] = useState(null);

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Sync students array with localStorage
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Add new student record
  const handleAddStudent = (newStudent) => {
    setStudents(prev => [...prev, { ...newStudent, history: [] }]);
  };

  // Update existing student details & log history
  const handleUpdateStudent = (roll, updatedFields, reason) => {
    setStudents(prev => prev.map(s => {
      if (String(s.roll) === String(roll)) {
        const oldMarks = s.marks;
        const newMarks = Number(updatedFields.marks);
        const nameChanged = s.name !== updatedFields.name;
        const marksChanged = oldMarks !== newMarks;

        if (marksChanged) {
          const historyEntry = {
            marks: oldMarks,
            date: new Date().toLocaleDateString(),
            reason: reason
          };
          const updatedHistory = s.history ? [...s.history, historyEntry] : [historyEntry];
          return {
            ...s,
            name: updatedFields.name,
            marks: newMarks,
            history: updatedHistory
          };
        } else if (nameChanged) {
          return {
            ...s,
            name: updatedFields.name
          };
        }
      }
      return s;
    }));
    setEditingStudent(null);
  };

  // Delete student record
  const handleDeleteStudent = (roll) => {
    if (window.confirm(`Are you sure you want to delete student with Roll Number #${roll}?`)) {
      setStudents(prev => prev.filter(s => s.roll !== roll));
    }
  };

  // Pre-populate database with dummy data
  const handleLoadSampleData = () => {
    if (students.length > 0) {
      if (!window.confirm('This will append sample students to your current database. Proceed?')) {
        return;
      }
    }
    // Filter out duplicates before loading
    const uniqueSamples = SAMPLE_STUDENTS.filter(
      sample => !students.some(s => String(s.roll) === String(sample.roll))
    );
    
    if (uniqueSamples.length === 0) {
      alert('All sample records are already present in the database!');
      return;
    }

    setStudents(prev => [...prev, ...uniqueSamples]);
  };

  // Export database as CSV file
  const handleExportCSV = () => {
    if (students.length === 0) {
      alert('There are no student records to export!');
      return;
    }

    const headers = ['Roll Number', 'Name', 'Marks Obtained', 'Status', 'Performance Evaluation'];
    const rows = students.map(s => {
      const isPassed = s.marks >= 40;
      let evalText = 'Needs Effort';
      if (s.marks >= 90) evalText = 'Excellent';
      else if (s.marks >= 75) evalText = 'Very Good';
      else if (s.marks >= 50) evalText = 'Good Progress';
      else if (s.marks >= 40) evalText = 'Passed';

      return [
        s.roll,
        `"${s.name.replace(/"/g, '""')}"`,
        s.marks,
        isPassed ? 'Pass' : 'Fail',
        evalText
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `academia_records_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-container">
      {/* Header Area */}
      <header className="app-header">
        <div className="app-title-container">
          <div className="app-logo">
            <GraduationCap size={24} />
          </div>
          <h1 className="app-title">Student Management System</h1>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </header>

      {/* Metrics Dashboard */}
      <StatsDashboard students={students} />

      {/* Main Form and Analytics / Records Section */}
      <div className="dashboard-layout">
        {/* Left Side: Form and Database actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <StudentForm onAddStudent={handleAddStudent} existingStudents={students} />
          
          <div className="glass-card">
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Database Utilities</h4>
            <div className="actions-row">
              <button onClick={handleLoadSampleData} className="btn-secondary">
                <Database size={15} />
                Load Sample Data
              </button>
              <button onClick={handleExportCSV} className="btn-secondary" disabled={students.length === 0}>
                <Download size={15} />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: List and custom Grade Analytics chart */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <StudentList 
            students={students} 
            onDeleteStudent={handleDeleteStudent} 
            onEditStudent={setEditingStudent} 
          />
          <GradeChart students={students} />
        </div>
      </div>

      {/* Advanced Record Update Modal Overlay */}
      <EditStudentModal
        student={editingStudent}
        onClose={() => setEditingStudent(null)}
        onUpdate={handleUpdateStudent}
      />
    </div>
  );
}