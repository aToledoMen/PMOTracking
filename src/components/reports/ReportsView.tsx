import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WeeklyReport } from './WeeklyReport';
import { ExecutiveSummary } from './ExecutiveSummary';
import { ReportBuilder } from './ReportBuilder';
import { FileBarChart, LayoutDashboard, Wrench } from 'lucide-react';

export function ReportsView() {
  return (
    <Tabs defaultValue="weekly" className="space-y-6">
      <TabsList className="bg-slate-100 p-1">
        <TabsTrigger value="weekly" className="gap-2 data-[state=active]:bg-white">
          <FileBarChart className="w-4 h-4" />
          Weekly Report
        </TabsTrigger>
        <TabsTrigger value="executive" className="gap-2 data-[state=active]:bg-white">
          <LayoutDashboard className="w-4 h-4" />
          Executive Summary
        </TabsTrigger>
        <TabsTrigger value="builder" className="gap-2 data-[state=active]:bg-white">
          <Wrench className="w-4 h-4" />
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
