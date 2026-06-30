import { useState } from 'react';
import { Table, LayoutGrid, Search, Trash2, ShieldAlert, Award, FileText, Edit2, History } from 'lucide-react';

export default function StudentList({ students = [], onDeleteStudent, onEditStudent }) {
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'pass', 'fail'
  const [sortBy, setSortBy] = useState('roll'); // 'roll', 'name', 'marks'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'

  // Get initials for card avatars
  const getInitials = (name) => {
    return name
      .trim()
      .split(/\s+/)
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate a distinct gradient based on the student's Roll Number
  const getAvatarGradient = (roll) => {
    const gradients = [
      'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', // Indigo to Purple
      'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', // Blue to Cyan
      'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)', // Emerald to Blue
      'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', // Amber to Red
      'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)', // Pink to Rose
      'linear-gradient(135deg, #14b8a6 0%, #059669 100%)', // Teal to Emerald
    ];
    const index = parseInt(roll, 10) || 0;
    return gradients[index % gradients.length];
  };

  // Generate a creative qualitative remark based on marks
  const getRemarks = (marks) => {
    if (marks >= 90) return { text: 'Excellent', color: 'var(--success)' };
    if (marks >= 75) return { text: 'Very Good', color: 'var(--success)' };
    if (marks >= 50) return { text: 'Good Progress', color: 'var(--primary)' };
    if (marks >= 40) return { text: 'Passed', color: 'var(--secondary)' };
    return { text: 'Needs Effort', color: 'var(--danger)' };
  };

  // Search, Filter and Sort operations
  const filteredStudents = students
    .filter(student => {
      const nameMatch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
      const rollMatch = String(student.roll).includes(searchTerm);
      return nameMatch || rollMatch;
    })
    .filter(student => {
      if (filterStatus === 'pass') return student.marks >= 40;
      if (filterStatus === 'fail') return student.marks < 40;
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'roll') {
        comparison = parseInt(a.roll, 10) - parseInt(b.roll, 10);
      } else if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'marks') {
        comparison = a.marks - b.marks;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="glass-card" style={{ height: '100%' }}>
      {/* List Header controls */}
      <div className="filters-bar">
        {/* Search */}
        <div className="search-box">
          <Search className="search-icon" size={18} />
          <input
            type="text"
            className="search-input"
            placeholder="Search by name or roll..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters and View Toggles */}
        <div className="controls-group">
          {/* Status Filter */}
          <select
            className="select-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Students</option>
            <option value="pass">Passed (≥ 40)</option>
            <option value="fail">Failed (&lt; 40)</option>
          </select>

          {/* Sort Selection */}
          <select
            className="select-filter"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="roll">Sort by Roll No</option>
            <option value="name">Sort by Name</option>
            <option value="marks">Sort by Marks</option>
          </select>

          {/* Sort Order Toggle */}
          <button
            className="btn-secondary"
            style={{ padding: '0.75rem 1rem' }}
            onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
            title={`Toggle sort order (Currently ${sortOrder.toUpperCase()})`}
          >
            {sortOrder === 'asc' ? '▲' : '▼'}
          </button>

          {/* View Toggle (Table / Card) */}
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <Table size={18} />
            </button>
            <button
              className={`view-btn ${viewMode === 'card' ? 'active' : ''}`}
              onClick={() => setViewMode('card')}
              title="Card View"
            >
              <LayoutGrid size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Student list display */}
      {filteredStudents.length === 0 ? (
        <div className="empty-state">
          <FileText className="empty-state-icon" size={48} />
          <h4 className="empty-state-title">No Students Found</h4>
          <p className="empty-state-desc">
            {students.length === 0 
              ? "Start adding students using the form or click 'Load Sample Data'."
              : "No records match your search or filter settings."}
          </p>
        </div>
      ) : viewMode === 'table' ? (
        /* Table View */
        <div className="table-container">
          <table className="student-table">
            <thead>
              <tr>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('roll')}>
                  Roll Number {sortBy === 'roll' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('name')}>
                  Full Name {sortBy === 'name' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
                </th>
                <th style={{ cursor: 'pointer' }} onClick={() => toggleSort('marks')}>
                  Marks Obtained {sortBy === 'marks' && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
                </th>
                <th>Status</th>
                <th>Remarks</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => {
                const isPassed = student.marks >= 40;
                const remark = getRemarks(student.marks);
                return (
                  <tr key={student.roll}>
                    <td>#{student.roll}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div 
                          className="student-avatar" 
                          style={{ 
                            background: getAvatarGradient(student.roll),
                            width: '2rem',
                            height: '2rem',
                            fontSize: '0.75rem'
                          }}
                        >
                          {getInitials(student.name)}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span>{student.name}</span>
                          {student.history && student.history.length > 0 && (
                            <div className="history-badge-container">
                              <span className="history-tooltip-trigger" title="View exam history">
                                <History size={13} style={{ color: 'var(--primary)' }} />
                              </span>
                              <div className="history-tooltip">
                                <div className="history-title">Marks Performance History</div>
                                {student.history.map((h, i) => (
                                  <div key={i} className="history-item">
                                    <span>{h.date} ({h.reason}):</span>
                                    <span>{h.marks}%</span>
                                  </div>
                                ))}
                                <div className="history-item" style={{ fontWeight: '700', marginTop: '0.35rem', paddingTop: '0.35rem', borderTop: '1px dashed var(--border-color)' }}>
                                  <span>Current Score:</span>
                                  <span>
                                    {student.marks}%
                                    {(() => {
                                      const prevMarks = student.history[student.history.length - 1].marks;
                                      const diff = student.marks - prevMarks;
                                      if (diff > 0) return <span className="delta-pill delta-up">+{diff}</span>;
                                      if (diff < 0) return <span className="delta-pill delta-down">{diff}</span>;
                                      return null;
                                    })()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>{student.marks} / 100</td>
                    <td>
                      <span className={`badge ${isPassed ? 'badge-success' : 'badge-danger'}`}>
                        {isPassed ? <Award size={12} /> : <ShieldAlert size={12} />}
                        {isPassed ? 'Pass' : 'Fail'}
                      </span>
                    </td>
                    <td style={{ color: remark.color, fontWeight: '600' }}>{remark.text}</td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.25rem' }}>
                        <button
                          className="btn-icon"
                          onClick={() => onEditStudent(student)}
                          title="Edit Details / Re-exam Marks"
                          style={{ color: 'var(--primary)' }}
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          className="btn-icon"
                          onClick={() => onDeleteStudent(student.roll)}
                          title="Delete Record"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        /* Card View */
        <div className="cards-grid">
          {filteredStudents.map((student) => {
            const isPassed = student.marks >= 40;
            const remark = getRemarks(student.marks);
            return (
              <div key={student.roll} className="student-card">
                <div className="student-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div className="student-avatar" style={{ background: getAvatarGradient(student.roll) }}>
                      {getInitials(student.name)}
                    </div>
                    {student.history && student.history.length > 0 && (
                      <div className="history-badge-container">
                        <span className="history-tooltip-trigger">
                          <History size={14} style={{ color: 'var(--primary)' }} />
                        </span>
                        <div className="history-tooltip" style={{ bottom: '135%' }}>
                          <div className="history-title">Marks Performance History</div>
                          {student.history.map((h, i) => (
                            <div key={i} className="history-item">
                              <span>{h.date} ({h.reason}):</span>
                              <span>{h.marks}%</span>
                            </div>
                          ))}
                          <div className="history-item" style={{ fontWeight: '700', marginTop: '0.35rem', paddingTop: '0.35rem', borderTop: '1px dashed var(--border-color)' }}>
                            <span>Current Score:</span>
                            <span>
                              {student.marks}%
                              {(() => {
                                const prevMarks = student.history[student.history.length - 1].marks;
                                const diff = student.marks - prevMarks;
                                if (diff > 0) return <span className="delta-pill delta-up">+{diff}</span>;
                                if (diff < 0) return <span className="delta-pill delta-down">{diff}</span>;
                                return null;
                              })()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button
                      className="btn-icon"
                      onClick={() => onEditStudent(student)}
                      title="Edit Details / Re-exam Marks"
                      style={{ color: 'var(--primary)' }}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => onDeleteStudent(student.roll)}
                      title="Delete Record"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="student-info-main">
                  <h4 className="student-card-name">{student.name}</h4>
                  <span className="student-card-roll">Roll Number: #{student.roll}</span>
                </div>

                <div className="student-card-details">
                  <div className="student-card-marks">
                    <span className="marks-val">{student.marks}%</span>
                    <span className="marks-label">Score</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                    <span className={`badge ${isPassed ? 'badge-success' : 'badge-danger'}`}>
                      {isPassed ? <Award size={10} /> : <ShieldAlert size={10} />}
                      {isPassed ? 'Pass' : 'Fail'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: remark.color, fontWeight: '700', marginTop: '0.15rem' }}>
                      {remark.text}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}