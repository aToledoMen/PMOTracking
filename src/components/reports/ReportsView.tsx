import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WeeklyReport } from './WeeklyReport';
import { ExecutiveSummary } from './ExecutiveSummary';
import { ReportBuilder } from './ReportBuilder';

export function ReportsView() {
  return (
    <Tabs defaultValue="weekly" className="space-y-4">
      <TabsList className="bg-white border border-slate-200 p-0.5 h-8">
        <TabsTrigger value="weekly" className="text-[12px] h-7 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">
          Weekly Report
        </TabsTrigger>
        <TabsTrigger value="executive" className="text-[12px] h-7 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">
          Executive Summary
        </TabsTrigger>
        <TabsTrigger value="builder" className="text-[12px] h-7 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900">
          Report Builder
        </TabsTrigger>
      </TabsList>

      <TabsContent value="weekly">
        <WeeklyReport />
      </TabsContent>

      <TabsContent value="executive">
        <ExecutiveSummary />
      </TabsContent>

      <TabsContent value="builder">
        <ReportBuilder />
      </TabsContent>
    </Tabs>
  );
}
