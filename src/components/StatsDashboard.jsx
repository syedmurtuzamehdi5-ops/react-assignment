import { Users, GraduationCap, Award, Trophy } from 'lucide-react';

export default function StatsDashboard({ students = [] }) {
  const total = students.length;

  // Calculate Average
  const average = total > 0 
    ? (students.reduce((sum, s) => sum + Number(s.marks), 0) / total).toFixed(1) 
    : 0;

  // Calculate Pass Percentage (Passing score: 40)
  const passStudents = students.filter(s => Number(s.marks) >= 40);
  const passPercentage = total > 0 
    ? Math.round((passStudents.length / total) * 100) 
    : 0;

  // Find Top Performer
  const topPerformer = total > 0
    ? [...students].sort((a, b) => Number(b.marks) - Number(a.marks))[0]
    : null;

  return (
    <div className="stats-grid">
      {/* Card 1: Total Students */}
      <div className="glass-card stat-card">
        <div className="stat-icon" style={{ backgroundColor: 'var(--primary)', boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)' }}>
          <Users size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{total}</span>
          <span className="stat-label">Total Students</span>
        </div>
      </div>

      {/* Card 2: Class Average */}
      <div className="glass-card stat-card">
        <div className="stat-icon" style={{ backgroundColor: 'var(--secondary)', boxShadow: '0 8px 16px rgba(6, 182, 212, 0.3)' }}>
          <GraduationCap size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{average}%</span>
          <span className="stat-label">Class Average</span>
        </div>
      </div>

      {/* Card 3: Pass Percentage */}
      <div className="glass-card stat-card">
        <div className="stat-icon" style={{ backgroundColor: 'var(--success)', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)' }}>
          <Award size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-value">{passPercentage}%</span>
          <span className="stat-label">Pass Percentage</span>
        </div>
      </div>

      {/* Card 4: Top Performer */}
      <div className="glass-card stat-card">
        <div className="stat-icon" style={{ backgroundColor: 'var(--warning)', boxShadow: '0 8px 16px rgba(245, 158, 11, 0.3)' }}>
          <Trophy size={22} />
        </div>
        <div className="stat-info">
          <span className="stat-value" style={{ fontSize: topPerformer ? '1.15rem' : '1.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '140px' }}>
            {topPerformer ? topPerformer.name : 'N/A'}
          </span>
          <span className="stat-label">
            {topPerformer ? `Top Marks: ${topPerformer.marks}` : 'Top Performer'}
          </span>
        </div>
      </div>
    </div>
  );
}