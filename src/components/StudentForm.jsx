import { useState } from 'react';
import { UserPlus, AlertCircle, RefreshCw } from 'lucide-react';

export default function StudentForm({ onAddStudent, existingStudents = [] }) {
  const [roll, setRoll] = useState('');
  const [name, setName] = useState('');
  const [marks, setMarks] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    // Roll number validation
    if (!roll.trim()) {
      newErrors.roll = 'Roll Number is required';
    } else if (!/^\d+$/.test(roll)) {
      newErrors.roll = 'Roll Number must be a positive integer';
    } else if (existingStudents.some(student => String(student.roll) === roll.trim())) {
      newErrors.roll = 'Roll Number already exists';
    }

    // Name validation
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters long';
    } else if (!/^[A-Za-z\s]+$/.test(name)) {
      newErrors.name = 'Name must contain only alphabets and spaces';
    }

    // Marks validation
    if (marks === '') {
      newErrors.marks = 'Marks are required';
    } else {
      const marksNum = Number(marks);
      if (isNaN(marksNum) || !Number.isInteger(marksNum)) {
        newErrors.marks = 'Marks must be an integer';
      } else if (marksNum < 0 || marksNum > 100) {
        newErrors.marks = 'Marks must be between 0 and 100';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onAddStudent({
        roll: roll.trim(),
        name: name.trim(),
        marks: Number(marks)
      });
      // Reset form
      setRoll('');
      setName('');
      setMarks('');
      setErrors({});
    }
  };

  const handleReset = () => {
    setRoll('');
    setName('');
    setMarks('');
    setErrors({});
  };

  return (
    <div className="glass-card">
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <UserPlus size={20} color="var(--primary)" />
        Add New Student
      </h3>
      <form onSubmit={handleSubmit} noValidate>
        {/* Roll Number Input */}
        <div className="form-group">
          <label className="form-label" htmlFor="roll">Roll Number</label>
          <input
            id="roll"
            type="text"
            className="form-input"
            placeholder="e.g. 59"
            value={roll}
            onChange={(e) => {
              setRoll(e.target.value);
              if (errors.roll) setErrors(prev => ({ ...prev, roll: '' }));
            }}
          />
          {errors.roll && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.roll}
            </span>
          )}
        </div>

        {/* Name Input */}
        <div className="form-group">
          <label className="form-label" htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            className="form-input"
            placeholder="e.g. Syed Murtuza"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
            }}
          />
          {errors.name && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.name}
            </span>
          )}
        </div>

        {/* Marks Input */}
        <div className="form-group">
          <label className="form-label" htmlFor="marks">Marks Obtained</label>
          <input
            id="marks"
            type="number"
            min="0"
            max="100"
            className="form-input"
            placeholder="0 to 100"
            value={marks}
            onChange={(e) => {
              setMarks(e.target.value);
              if (errors.marks) setErrors(prev => ({ ...prev, marks: '' }));
            }}
          />
          {errors.marks && (
            <span className="error-text">
              <AlertCircle size={14} />
              {errors.marks}
            </span>
          )}
        </div>

        {/* Button Actions */}
        <button type="submit" className="btn-primary">
          <UserPlus size={18} />
          Register Student
        </button>
        
        <button type="button" className="btn-secondary" style={{ marginTop: '0.75rem', width: '100%' }} onClick={handleReset}>
          <RefreshCw size={14} />
          Reset Form
        </button>
      </form>
    </div>
  );
}