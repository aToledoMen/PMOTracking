import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getUpcomingGoLives } from '@/data/mock-data';
import { Calendar, ArrowRight } from 'lucide-react';

const ragColors = {
  Green: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Amber: 'bg-amber-100 text-amber-700 border-amber-200',
  Red: 'bg-red-100 text-red-700 border-red-200',
};

export function TimelineChart() {
  const upcoming = getUpcomingGoLives(60);

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Upcoming Go-Lives</h3>
          <p className="text-xs text-slate-500">Next 60 days</p>
        </div>
        <Calendar className="w-5 h-5 text-slate-400" />
      </div>
      <div className="space-y-3">
        {upcoming.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-4">No go-lives in the next 60 days</p>
        ) : (
          upcoming.map((country) => {
            const daysLeft = Math.ceil((new Date(country.goLiveDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
            return (
              <div key={country.id} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                <span className="text-xl">{country.flag}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{country.name}</p>
                  <p className="text-xs text-slate-500">{country.partner}</p>
                </div>
                <Badge variant="outline" className={ragColors[country.ragStatus]}>
                  {country.ragStatus}
                </Badge>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">{daysLeft}d</p>
                  <p className="text-[10px] text-slate-500">{country.goLiveDate}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
