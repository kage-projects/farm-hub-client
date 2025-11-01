/**
 * Roadmap Execution Store using Zustand
 * Untuk state management roadmap step-by-step dengan adaptive features
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface RoadmapTahapan {
  nomor: number;
  nama_tahap: string;
  deskripsi: string;
  durasi_minggu: number;
  kegiatan: string[];
  output: string;
  status?: 'pending' | 'in_progress' | 'completed' | 'blocked' | 'adjusted';
  startedAt?: Date;
  completedAt?: Date;
  issues?: RoadmapIssue[];
  adjustments?: string[];
}

export interface RoadmapIssue {
  id: string;
  type: 'question' | 'problem' | 'delay' | 'resource';
  title: string;
  description: string;
  reportedAt: Date;
  resolved?: boolean;
  resolution?: string;
  adjustedSteps?: string[];
}

export interface RoadmapStep {
  step: number;
  judul: string;
  tujuan: string;
  durasi_bulan: number;
  tahapan: RoadmapTahapan[];
  risiko_dan_mitigasi: Array<{
    risiko: string;
    dampak: string;
    mitigasi: string;
  }>;
  success_criteria: string;
}

export interface RoadmapExecution {
  id: string;
  projectId: string;
  currentStep: number;
  currentTahap: number | null; // null jika belum mulai
  roadmap: RoadmapStep;
  status: 'not_started' | 'in_progress' | 'paused' | 'completed' | 'blocked';
  startedAt?: Date;
  completedAt?: Date;
  selectedSuppliers?: {
    pakan?: string; // supplierId
    benih?: string;
    peralatan?: string;
  };
  issues: RoadmapIssue[];
  progress: {
    completedTahapan: number[];
    blockedTahapan: number[];
    adjustedTahapan: number[];
  };
}

interface RoadmapStore {
  // Active roadmap executions
  executions: RoadmapExecution[];

  // Actions
  createExecution: (data: {
    projectId: string;
    roadmap: RoadmapStep;
    selectedSuppliers?: {
      pakan?: string;
      benih?: string;
      peralatan?: string;
    };
  }) => RoadmapExecution;

  getExecution: (executionId: string) => RoadmapExecution | undefined;
  getExecutionByProject: (projectId: string) => RoadmapExecution | undefined;

  startTahap: (executionId: string, tahapNomor: number) => void;
  completeTahap: (executionId: string, tahapNomor: number) => void;
  reportIssue: (
    executionId: string,
    issue: Omit<RoadmapIssue, 'id' | 'reportedAt'>
  ) => RoadmapIssue;

  resolveIssue: (executionId: string, issueId: string, resolution: string, adjustedSteps?: string[]) => void;
  
  adjustTahap: (executionId: string, tahapNomor: number, adjustments: string[]) => void;

  getNextTahap: (executionId: string) => RoadmapTahapan | null;
  
  updateExecutionStatus: (executionId: string, status: RoadmapExecution['status']) => void;
}

export const useRoadmapStore = create<RoadmapStore>()(
  persist(
    (set, get) => ({
      // Initial state
      executions: [],

      // Actions
      createExecution: (data) => {
        const execution: RoadmapExecution = {
          id: `roadmap-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          projectId: data.projectId,
          currentStep: data.roadmap.step,
          currentTahap: null,
          roadmap: data.roadmap,
          status: 'not_started',
          selectedSuppliers: data.selectedSuppliers,
          issues: [],
          progress: {
            completedTahapan: [],
            blockedTahapan: [],
            adjustedTahapan: [],
          },
        };

        set((state) => ({
          executions: [...state.executions, execution],
        }));

        return execution;
      },

      getExecution: (executionId) => {
        return get().executions.find((e) => e.id === executionId);
      },

      getExecutionByProject: (projectId) => {
        return get().executions.find((e) => e.projectId === projectId);
      },

      startTahap: (executionId, tahapNomor) => {
        set((state) => ({
          executions: state.executions.map((exec) => {
            if (exec.id !== executionId) return exec;

            const updatedTahapan = exec.roadmap.tahapan.map((t) => {
              if (t.nomor === tahapNomor) {
                return {
                  ...t,
                  status: 'in_progress' as const,
                  startedAt: new Date(),
                };
              }
              return t;
            });

            return {
              ...exec,
              roadmap: {
                ...exec.roadmap,
                tahapan: updatedTahapan,
              },
              currentTahap: tahapNomor,
              status: 'in_progress' as const,
              startedAt: exec.startedAt || new Date(),
            };
          }),
        }));
      },

      completeTahap: (executionId, tahapNomor) => {
        set((state) => ({
          executions: state.executions.map((exec) => {
            if (exec.id !== executionId) return exec;

            const updatedTahapan = exec.roadmap.tahapan.map((t) => {
              if (t.nomor === tahapNomor) {
                return {
                  ...t,
                  status: 'completed' as const,
                  completedAt: new Date(),
                };
              }
              return t;
            });

            const completedTahapan = [...exec.progress.completedTahapan, tahapNomor];
            const allCompleted = updatedTahapan.every((t) => t.status === 'completed');

            return {
              ...exec,
              roadmap: {
                ...exec.roadmap,
                tahapan: updatedTahapan,
              },
              currentTahap: allCompleted ? null : tahapNomor + 1,
              progress: {
                ...exec.progress,
                completedTahapan,
              },
              status: allCompleted ? ('completed' as const) : exec.status,
              completedAt: allCompleted ? new Date() : exec.completedAt,
            };
          }),
        }));
      },

      reportIssue: (executionId, issue) => {
        const newIssue: RoadmapIssue = {
          ...issue,
          id: `issue-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          reportedAt: new Date(),
          resolved: false,
        };

        set((state) => ({
          executions: state.executions.map((exec) => {
            if (exec.id !== executionId) return exec;

            // If issue is blocking, mark current tahap as blocked
            const updatedTahapan = exec.roadmap.tahapan.map((t) => {
              if (t.nomor === exec.currentTahap && issue.type === 'problem') {
                return {
                  ...t,
                  status: 'blocked' as const,
                };
              }
              return t;
            });

            return {
              ...exec,
              roadmap: {
                ...exec.roadmap,
                tahapan: updatedTahapan,
              },
              issues: [...exec.issues, newIssue],
              status: issue.type === 'problem' ? ('blocked' as const) : exec.status,
              progress: {
                ...exec.progress,
                blockedTahapan: issue.type === 'problem' && exec.currentTahap
                  ? [...exec.progress.blockedTahapan, exec.currentTahap]
                  : exec.progress.blockedTahapan,
              },
            };
          }),
        }));

        return newIssue;
      },

      resolveIssue: (executionId, issueId, resolution, adjustedSteps) => {
        set((state) => ({
          executions: state.executions.map((exec) => {
            if (exec.id !== executionId) return exec;

            const updatedIssues = exec.issues.map((issue) => {
              if (issue.id === issueId) {
                return {
                  ...issue,
                  resolved: true,
                  resolution,
                  adjustedSteps,
                };
              }
              return issue;
            });

            // If issue was blocking and resolved, unblock tahap
            const resolvedIssue = exec.issues.find((i) => i.id === issueId);
            const wasBlocking = resolvedIssue?.type === 'problem';

            const updatedTahapan = exec.roadmap.tahapan.map((t) => {
              if (t.nomor === exec.currentTahap && wasBlocking) {
                return {
                  ...t,
                  status: t.status === 'blocked' ? ('in_progress' as const) : t.status,
                };
              }
              return t;
            });

            const newBlockedTahapan = exec.progress.blockedTahapan.filter(
              (tn) => !(tn === exec.currentTahap && wasBlocking)
            );

            return {
              ...exec,
              roadmap: {
                ...exec.roadmap,
                tahapan: updatedTahapan,
              },
              issues: updatedIssues,
              status: newBlockedTahapan.length === 0 ? ('in_progress' as const) : exec.status,
              progress: {
                ...exec.progress,
                blockedTahapan: newBlockedTahapan,
              },
            };
          }),
        }));
      },

      adjustTahap: (executionId, tahapNomor, adjustments) => {
        set((state) => ({
          executions: state.executions.map((exec) => {
            if (exec.id !== executionId) return exec;

            const updatedTahapan = exec.roadmap.tahapan.map((t) => {
              if (t.nomor === tahapNomor) {
                return {
                  ...t,
                  status: 'adjusted' as const,
                  adjustments: [...(t.adjustments || []), ...adjustments],
                };
              }
              return t;
            });

            return {
              ...exec,
              roadmap: {
                ...exec.roadmap,
                tahapan: updatedTahapan,
              },
              progress: {
                ...exec.progress,
                adjustedTahapan: exec.progress.adjustedTahapan.includes(tahapNomor)
                  ? exec.progress.adjustedTahapan
                  : [...exec.progress.adjustedTahapan, tahapNomor],
              },
            };
          }),
        }));
      },

      getNextTahap: (executionId) => {
        const exec = get().getExecution(executionId);
        if (!exec) return null;

        const nextTahap = exec.roadmap.tahapan.find(
          (t) => !['completed', 'blocked'].includes(t.status || 'pending')
        );

        return nextTahap || null;
      },

      updateExecutionStatus: (executionId, status) => {
        set((state) => ({
          executions: state.executions.map((exec) =>
            exec.id === executionId ? { ...exec, status } : exec
          ),
        }));
      },
    }),
    {
      name: 'roadmap-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);


