import { useMemo, useRef } from 'react';
import { ProjectTaskWithStatus } from '@/data/project-types';

interface GanttViewProps {
  flat: ProjectTaskWithStatus[];
}

const statusColors: Record<string, string> = {
  'Not Started': '#94a3b8',
  'In Progress': '#3b82f6',
  'Done': '#10b981',
  'Pending Approval': '#f59e0b',
  'Approved': '#059669',
};

export function GanttView({ flat }: GanttViewProps) {
  const tasks = flat.filter(t => t.start && t.finish);
  const containerRef = useRef<HTMLDivElement>(null);

  const { minDate, weeks, totalDays } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    for (const t of tasks) {
      const s = new Date(t.baselineStart || t.start).getTime();
      const e = new Date(t.baselineFinish || t.finish).getTime();
      const s2 = new Date(t.start).getTime();
      const e2 = new Date(t.finish).getTime();
      if (s < min) min = s;
      if (s2 < min) min = s2;
      if (e > max) max = e;
      if (e2 > max) max = e2;
    }
    const pad = 7 * 86400000;
    min -= pad;
    max += pad;
    const totalDays = Math.ceil((max - min) / 86400000);
    const weeks: { label: string; start: number; width: number }[] = [];
    const d = new Date(min);
    d.setDate(d.getDate() - d.getDay());
    while (d.getTime() < max) {
      const ws = d.getTime();
      d.setDate(d.getDate() + 7);
      weeks.push({
        label: new Date(ws).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        start: (ws - min) / 86400000,
        width: 7,
      });
    }
    return { minDate: min, maxDate: max, weeks, totalDays };
  }, [tasks]);

  const dayWidth = 8;
  const rowHeight = 32;
  const headerHeight = 36;
  const chartWidth = totalDays * dayWidth;

  function dateToX(dateStr: string): number {
    return ((new Date(dateStr).getTime() - minDate) / 86400000) * dayWidth;
  }

  function barWidth(start: string, end: string): number {
    const d = (new Date(end).getTime() - new Date(start).getTime()) / 86400000;
    return Math.max(d * dayWidth, 4);
  }

  if (tasks.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-md p-12 text-center">
        <p className="text-[13px] text-slate-400">No tasks to display</p>
      </div>
    );
  }

  const todayX = ((Date.now() - minDate) / 86400000) * dayWidth;

  return (
    <div className="bg-white border border-slate-200 rounded-md">
      {/* Legend */}
      <div className="flex items-center gap-5 px-4 py-2 border-b border-slate-200">
        <div className="flex items-center gap-1.5">
          <div className="flex flex-col gap-0.5">
            <div className="w-8 h-1.5 rounded-sm bg-slate-400 opacity-60" />
            <div className="w-10 h-2.5 rounded-sm bg-blue-500" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-slate-400 leading-tight">Baseline (top)</span>
            <span className="text-[9px] text-slate-600 leading-tight">Actual (bottom)</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0.5 bg-red-500 opacity-60" />
          <span className="text-[9px] text-slate-500">Slippage</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 border-l-2 border-red-400 border-dashed" style={{ height: 10 }} />
          <span className="text-[9px] text-slate-500">Today</span>
        </div>
        <div className="w-px h-4 bg-slate-200" />
        {['Not Started', 'In Progress', 'Done', 'Pending Approval', 'Approved'].map(s => (
          <div key={s} className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: statusColors[s] }} />
            <span className="text-[9px] text-slate-500">{s}</span>
          </div>
        ))}
      </div>

      <div ref={containerRef} className="overflow-auto" style={{ maxHeight: '500px' }}>
        <div style={{ width: chartWidth, position: 'relative' }}>
          {/* Week headers */}
          <div className="flex sticky top-0 bg-white z-10 border-b border-slate-200" style={{ height: headerHeight }}>
            {weeks.map((w, i) => (
              <div
                key={i}
                className="text-[9px] text-slate-500 border-r border-slate-100 flex items-end pb-1 pl-1 tabular-nums"
                style={{ width: w.width * dayWidth, minWidth: w.width * dayWidth }}
              >
                {w.label}
              </div>
            ))}
          </div>

          {/* Rows */}
          {tasks.map((task, i) => {
            const color = statusColors[task.status] || statusColors['Not Started'];
            const hasStarted = task.status !== 'Not Started';
            const bx = dateToX(task.baselineStart || task.start);
            const bw = barWidth(task.baselineStart || task.start, task.baselineFinish || task.finish);
            const ax = dateToX(task.start);
            const aw = barWidth(task.start, task.finish);
            const progressW = aw * (task.actualProgress / 100);
            const hasSlippage = task.baselineFinish && task.finish !== task.baselineFinish;
            const showBaseline = !!hasSlippage;
            const y = headerHeight + i * rowHeight;

            return (
              <div
                key={task.id}
                className="absolute flex items-center"
                style={{ top: y, height: rowHeight, width: chartWidth }}
              >
                {/* Grid lines */}
                <div className="absolute inset-0 border-b border-slate-50" />

                {/* Baseline bar (top half) — only for tasks that have started */}
                {showBaseline && (
                  <div
                    className="absolute rounded-sm"
                    style={{
                      left: bx,
                      width: bw,
                      height: task.summary ? 4 : 5,
                      top: task.summary ? 4 : 3,
                      backgroundColor: '#cbd5e1',
                      border: '1px solid #94a3b8',
                      opacity: 0.7,
                    }}
                  />
                )}

                {/* Actual bar (bottom half) */}
                <div
                  className="absolute rounded-sm"
                  style={{
                    left: ax,
                    width: aw,
                    height: task.summary ? 6 : 10,
                    top: task.summary ? 12 : 12,
                    backgroundColor: `${color}33`,
                    border: `1px solid ${color}88`,
                  }}
                >
                  {/* Progress fill */}
                  <div
                    className="h-full rounded-sm"
                    style={{
                      width: progressW,
                      backgroundColor: color,
                      borderRadius: '2px 0 0 2px',
                    }}
                  />
                </div>

                {/* Slippage indicator: red for actual, orange dashed for projected */}
                {showBaseline && ax + aw > bx + bw + 2 && (
                  <div
                    className="absolute"
                    style={{
                      left: bx + bw,
                      width: (ax + aw) - (bx + bw),
                      height: 2,
                      top: 7,
                      backgroundColor: hasStarted ? '#dc2626' : '#f59e0b',
                      opacity: hasStarted ? 0.6 : 0.4,
                    }}
                  />
                )}

                {/* Task label */}
                <span
                  className="absolute text-[9px] text-slate-600 truncate pointer-events-none"
                  style={{ left: ax + aw + 4, top: (rowHeight - 14) / 2, lineHeight: '14px', maxWidth: 150 }}
                >
                  {task.summary ? '' : task.name}
                </span>
              </div>
            );
          })}

          {/* Today line */}
          <div
            className="absolute border-l-2 border-dashed border-red-400 z-20 pointer-events-none"
            style={{
              left: todayX,
              top: headerHeight,
              height: tasks.length * rowHeight,
            }}
          />

          {/* Spacer for scroll */}
          <div style={{ height: headerHeight + tasks.length * rowHeight }} />
        </div>
      </div>
    </div>
  );
}
