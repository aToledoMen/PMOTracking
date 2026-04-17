import { useCallback, useEffect, useState } from 'react';
import {
  fetchTemplates, fetchOverrides,
  TemplateDB, OverrideDB,
  TemplateWithDocId, OverrideWithDocId,
  MilestoneTemplateRecord, MilestoneOverrideRecord,
} from '@/data/domo-api';
import { stageGates } from '@/data/stage-gates';

export function useMilestoneConfig() {
  const [templates, setTemplates] = useState<TemplateWithDocId[]>([]);
  const [overrides, setOverrides] = useState<OverrideWithDocId[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let tpls: TemplateWithDocId[] = [];
      try {
        tpls = await fetchTemplates();
      } catch { /* empty */ }

      // Auto-seed from hardcoded stage-gates if empty
      if (tpls.length === 0) {
        const seeds: MilestoneTemplateRecord[] = stageGates.flatMap(g =>
          g.milestones.map(m => ({ phaseId: g.phaseId, milestoneId: m.id, label: m.label }))
        );
        try {
          await TemplateDB.bulkCreate(seeds);
          tpls = await fetchTemplates();
        } catch {
          tpls = seeds.map(s => ({ ...s, _docId: undefined }));
        }
      }

      let ovrs: OverrideWithDocId[] = [];
      try { ovrs = await fetchOverrides(); } catch { /* empty */ }

      if (!cancelled) {
        setTemplates(tpls);
        setOverrides(ovrs);
        setLoaded(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const addMilestone = useCallback(async (phaseId: number, label: string) => {
    const rec: MilestoneTemplateRecord = {
      phaseId,
      milestoneId: `g-custom-${Date.now()}`,
      label,
    };
    setTemplates(prev => [...prev, { ...rec, _docId: undefined }]);
    try {
      const doc = await TemplateDB.create(rec);
      setTemplates(prev => prev.map(t =>
        t.milestoneId === rec.milestoneId ? { ...t, _docId: doc.id } : t
      ));
    } catch (e) { console.error('[Template] Create failed', e); }
  }, []);

  const removeMilestone = useCallback(async (milestoneId: string) => {
    const tpl = templates.find(t => t.milestoneId === milestoneId);
    setTemplates(prev => prev.filter(t => t.milestoneId !== milestoneId));
    if (tpl?._docId) {
      try { await TemplateDB.remove(tpl._docId); }
      catch (e) { console.error('[Template] Remove failed', e); }
    }
  }, [templates]);

  const addOverride = useCallback(async (projectId: string, phaseId: number, action: 'add' | 'remove', milestoneId: string, label?: string) => {
    const rec: MilestoneOverrideRecord = {
      projectId,
      phaseId,
      milestoneId: action === 'add' ? `ovr-${Date.now()}` : milestoneId,
      action,
      label,
    };
    setOverrides(prev => [...prev, { ...rec, _docId: undefined }]);
    try {
      const doc = await OverrideDB.create(rec);
      setOverrides(prev => prev.map(o =>
        o.milestoneId === rec.milestoneId && o.projectId === rec.projectId ? { ...o, _docId: doc.id } : o
      ));
    } catch (e) { console.error('[Override] Create failed', e); }
  }, []);

  const removeOverride = useCallback(async (milestoneId: string, projectId: string) => {
    const ovr = overrides.find(o => o.milestoneId === milestoneId && o.projectId === projectId);
    setOverrides(prev => prev.filter(o => !(o.milestoneId === milestoneId && o.projectId === projectId)));
    if (ovr?._docId) {
      try { await OverrideDB.remove(ovr._docId); }
      catch (e) { console.error('[Override] Remove failed', e); }
    }
  }, [overrides]);

  const toggleGlobalForProject = useCallback(async (projectId: string, phaseId: number, milestoneId: string) => {
    const existing = overrides.find(o => o.projectId === projectId && o.milestoneId === milestoneId && o.action === 'remove');
    if (existing) {
      await removeOverride(milestoneId, projectId);
    } else {
      await addOverride(projectId, phaseId, 'remove', milestoneId);
    }
  }, [overrides, addOverride, removeOverride]);

  // Get effective milestones for a project
  const getMilestonesForProject = useCallback((phaseId: number, projectId?: string) => {
    const global = templates.filter(t => t.phaseId === phaseId);
    if (!projectId) return global.map(g => ({ id: g.milestoneId, label: g.label }));

    const projOverrides = overrides.filter(o => o.projectId === projectId && o.phaseId === phaseId);
    const removes = new Set(projOverrides.filter(o => o.action === 'remove').map(o => o.milestoneId));
    const adds = projOverrides.filter(o => o.action === 'add');

    const effective = global
      .filter(g => !removes.has(g.milestoneId))
      .map(g => ({ id: g.milestoneId, label: g.label }));

    for (const a of adds) {
      effective.push({ id: a.milestoneId, label: a.label || '' });
    }

    return effective;
  }, [templates, overrides]);

  // Get phases from stageGates definition
  const phases = stageGates.map(g => ({ phaseId: g.phaseId, phaseName: g.phaseName, nextPhaseName: g.nextPhaseName }));

  return {
    templates, overrides, phases, loaded,
    addMilestone, removeMilestone,
    addOverride, removeOverride, toggleGlobalForProject,
    getMilestonesForProject,
  };
}
