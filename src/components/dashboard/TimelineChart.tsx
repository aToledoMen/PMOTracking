import { getUpcomingGoLives } from '@/data/mock-data';
import { getCountryCode } from '@/lib/country-code';
import { cn } from '@/lib/utils';

const ragStyles = {
  Green: { dot: 'bg-emerald-600', label: 'text-emerald-700' },
  Amber: { dot: 'bg-amber-600', label: 'text-amber-700' },
  Red: { dot: 'bg-red-700', label: 'text-red-700' },
};

export function TimelineChart() {
  const upcoming = getUpcomingGoLives(60);

  return (
    <div className="bg-white border border-slate-200 rounded-md">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
        <div>
          <h3 className="text-[13px] font-semibold text-slate-900">Upcoming Go-Lives</h3>
          <p className="text-[11px] text-slate-500">Next 60 days · {upcoming.length} deployments</p>
        </div>
      </div>
      <div className="divide-y divide-slate-100">
        {upcoming.length === 0 ? (
          <p className="text-[12px] text-slate-400 text-center py-6">No go-lives in the next 60 days</p>
        ) : (
          upcoming.slice(0, 6).map((country) => {
            const daysLeft = Math.ceil((new Date(country.goLiveDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            const rs = ragStyles[country.ragStatus];
            return (
              <div key={country.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors">
                <span className="inline-flex items-center justify-center w-7 h-5 rounded-sm bg-slate-100 text-[10px] font-semibold text-slate-700 border border-slate-200 tracking-wider">
                  {getCountryCode(country.id)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-slate-900 truncate">{country.name}</p>
                  <p className="text-[10px] text-slate-500">{country.partner}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={cn('w-1.5 h-1.5 rounded-full', rs.dot)} />
                  <span className={cn('text-[10px] font-medium uppercase tracking-wider', rs.label)}>
                    {country.ragStatus}
                  </span>
                </div>
                <div className="text-right min-w-[55px]">
                  <p className="text-[12px] font-semibold text-slate-900 tabular-nums leading-none">{daysLeft}d</p>
                  <p className="text-[9px] text-slate-400 tabular-nums mt-0.5">{country.goLiveDate}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
