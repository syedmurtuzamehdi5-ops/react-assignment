import { BarChart3 } from 'lucide-react';

export default function GradeChart({ students = [] }) {
  // Define categories
  const categories = [
    { label: 'A (90+)', min: 90, max: 100, color: '#818cf8' },
    { label: 'B (80-89)', min: 80, max: 89, color: '#38bdf8' },
    { label: 'C (70-79)', min: 70, max: 79, color: '#34d399' },
    { label: 'D (60-69)', min: 60, max: 69, color: '#fbbf24' },
    { label: 'E (40-59)', min: 40, max: 59, color: '#f97316' },
    { label: 'F (<40)', min: 0, max: 39, color: '#f87171' }
  ];

  // Calculate student counts for each category
  const data = categories.map(cat => {
    const count = students.filter(s => s.marks >= cat.min && s.marks <= cat.max).length;
    return { ...cat, count };
  });

  const maxCount = Math.max(...data.map(d => d.count), 1); // Avoid division by zero

  // SVG Chart Config
  const width = 600;
  const height = 220;
  const paddingLeft = 50;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 40;
  
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  
  const barWidth = 45;
  const gap = (chartWidth - (barWidth * data.length)) / (data.length - 1);

  // Generate gridline levels
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(pct => Math.round(maxCount * pct));
  const uniqueYTicks = Array.from(new Set(yTicks)).sort((a, b) => a - b);

  return (
    <div className="chart-container">
      <h4 className="chart-title">
        <BarChart3 size={18} color="var(--primary)" />
        Grade Distribution Analysis
      </h4>

      {students.length === 0 ? (
        <div style={{ height: '170px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          No grade distribution data available.
        </div>
      ) : (
        <svg viewBox={`0 0 ${width} ${height}`} className="svg-chart">
          {/* Y Axis Gridlines and Labels */}
          {uniqueYTicks.map((tick, i) => {
            const yRatio = tick / maxCount;
            const yPos = height - paddingBottom - (yRatio * chartHeight);
            return (
              <g key={i}>
                <line
                  x1={paddingLeft}
                  y1={yPos}
                  x2={width - paddingRight}
                  y2={yPos}
                  className="chart-grid-line"
                />
                <text
                  x={paddingLeft - 12}
                  y={yPos + 4}
                  textAnchor="end"
                  className="chart-axis-text"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Draw Bars */}
          {data.map((item, index) => {
            const xPos = paddingLeft + index * (barWidth + gap);
            const yRatio = item.count / maxCount;
            const barHeight = yRatio * chartHeight;
            const yPos = height - paddingBottom - barHeight;

            return (
              <g key={index}>
                {/* Bar */}
                <rect
                  x={xPos}
                  y={yPos}
                  width={barWidth}
                  height={Math.max(barHeight, 4)} // Give 4px min height so there's always a sliver visible
                  rx="6"
                  ry="6"
                  fill={item.color}
                  opacity={item.count > 0 ? 0.9 : 0.25}
                  className="bar-rect"
                />

                {/* Count value label above bar */}
                {item.count > 0 && (
                  <text
                    x={xPos + barWidth / 2}
                    y={yPos - 6}
                    className="chart-bar-value"
                  >
                    {item.count}
                  </text>
                )}

                {/* X Axis Label */}
                <text
                  x={xPos + barWidth / 2}
                  y={height - paddingBottom + 18}
                  textAnchor="middle"
                  className="chart-axis-text"
                  style={{ fontWeight: 600 }}
                >
                  {item.label.split(' ')[0]}
                </text>

                {/* X Axis Range Subtext */}
                <text
                  x={xPos + barWidth / 2}
                  y={height - paddingBottom + 30}
                  textAnchor="middle"
                  className="chart-axis-text"
                  style={{ opacity: 0.6, fontSize: '8px' }}
                >
                  {item.label.split(' ')[1] || ''}
                </text>
              </g>
            );
          })}

          {/* X Axis Line */}
          <line
            x1={paddingLeft}
            y1={height - paddingBottom}
            x2={width - paddingRight}
            y2={height - paddingBottom}
            stroke="var(--border-color)"
            strokeWidth="1"
          />
        </svg>
      )}
    </div>
  );
}