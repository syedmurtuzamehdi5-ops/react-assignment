import { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

export default function EditStudentModal({ student, onClose, onUpdate }) {
  const [name, setName] = useState(student?.name ?? '');
  const [marks, setMarks] = useState(student?.marks ?? '');
  const [reason, setReason] = useState('Re-exam');
  const [errors, setErrors] = useState({});

  if (!student) return null;

  const validate = () => {
    const newErrors = {};

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
      onUpdate(student.roll, {
        name: name.trim(),
        marks: Number(marks)
      }, reason);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-card modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h3>Update Student Details</h3>
          <button className="btn-icon" onClick={onClose} title="Close Modal">
            <X size={20} />
          </button>
        </div>

        {/* Info */}
        <p className="modal-sub">
          Modifying record for <strong>Roll #{student.roll}</strong>. Previous scores are recorded in the history log.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Name Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="edit-name">Full Name</label>
            <input
              id="edit-name"
              type="text"
              className="form-input"
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

          {/* Marks Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="edit-marks">Marks Obtained</label>
            <input
              id="edit-marks"
              type="number"
              min="0"
              max="100"
              className="form-input"
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

          {/* Reason Select */}
          <div className="form-group">
            <label className="form-label" htmlFor="edit-reason">Reason for Update</label>
            <select
              id="edit-reason"
              className="select-filter"
              style={{ width: '100%' }}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="Re-exam">Re-exam</option>
              <option value="Paper Recounting">Paper Recounting</option>
              <option value="Grace Marks">Grace Marks</option>
              <option value="Administrative Correction">Administrative Correction</option>
            </select>
          </div>

          {/* Submit Actions */}
          <div className="modal-actions" style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 2 }}>
              <Save size={18} />
              Save Updates
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}