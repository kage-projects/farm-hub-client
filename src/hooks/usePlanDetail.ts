/**
 * Hook untuk menangani plan detail dengan data dummy
 */

import { useState, useCallback } from 'react';
import { dummyPlanDetailData } from '../data/planDetailDummy';

export interface PlanDetailState {
  // Streaming state
  isLoading: boolean;
  progress: number;
  statusMessage: string;
  currentSection: string;
  
  // Data state
  informasiTeknis: any;
  roadmap: any;
  analisisFinansial: any;
  
  // Completed state
  isCompleted: boolean;
  error: string | null;
}

const initialState: PlanDetailState = {
  isLoading: false,
  progress: 0,
  statusMessage: '',
  currentSection: 'all',
  informasiTeknis: null,
  roadmap: null,
  analisisFinansial: null,
  isCompleted: false,
  error: null,
};

export const usePlanDetail = () => {
  const [state, setState] = useState<PlanDetailState>(initialState);

  const startStreaming = useCallback(async (projectId: string) => {
    // Reset state
    setState({
      ...initialState,
      isLoading: true,
      statusMessage: 'Memulai analisis...',
      progress: 0,
      currentSection: 'all',
    });

    // Simulasi alur data sesuai format SSE yang diberikan user
    
    // 1. Status: Mengirim request ke AI
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        progress: 5,
        statusMessage: 'Mengirim request ke AI untuk analisis detail...',
        currentSection: 'all',
      }));
    }, 300);

    // 2. Status: Menerima response dari AI
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        progress: 20,
        statusMessage: 'Menerima response dari AI...',
        currentSection: 'all',
      }));
    }, 600);

    // 3. Chunk streaming (simulasi beberapa chunk)
    const chunkDelays = [900, 1200, 1500, 1800, 2100, 2400, 2700, 3000, 3300, 3600, 3900, 4200, 4500, 4800, 5100, 5400, 5700, 6000, 6300, 6600, 6900, 7200, 7500];
    const chunkProgresses = [35, 40, 45, 50, 55, 60, 65, 70, 75, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 30, 35, 40, 45];
    
    chunkDelays.forEach((delay, index) => {
      setTimeout(() => {
        setState((prev) => ({
          ...prev,
          progress: chunkProgresses[index] || prev.progress,
          currentSection: 'all',
        }));
      }, delay);
    });

    // 4. Status: Memproses response
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        progress: 80,
        statusMessage: 'Memproses response...',
        currentSection: 'all',
      }));
    }, 7800);

    // 5. Status: Menyelesaikan analisis
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        progress: 90,
        statusMessage: 'Menyelesaikan analisis...',
        currentSection: 'all',
      }));
    }, 8100);

    // 6. Result: Informasi Teknis (progress 95, section: informasi_teknis)
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        progress: 95,
        statusMessage: 'Memproses informasi teknis...',
        currentSection: 'informasi_teknis',
        informasiTeknis: dummyPlanDetailData.informasi_teknis,
      }));
    }, 8400);

    // 7. Result: Roadmap (progress 95, section: roadmap)
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        progress: 95,
        statusMessage: 'Memproses roadmap...',
        currentSection: 'roadmap',
        roadmap: dummyPlanDetailData.roadmap,
      }));
    }, 8700);

    // 8. Result: Analisis Finansial (progress 95, section: analisis_finansial)
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        progress: 95,
        statusMessage: 'Memproses analisis finansial...',
        currentSection: 'analisis_finansial',
        analisisFinansial: dummyPlanDetailData.analisis_finansial,
      }));
    }, 9000);

    // 9. Completed: Semua data selesai (progress 100)
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        progress: 100,
        statusMessage: 'Analisis selesai',
        currentSection: 'all',
        isCompleted: true,
        informasiTeknis: dummyPlanDetailData.informasi_teknis,
        roadmap: dummyPlanDetailData.roadmap,
        analisisFinansial: dummyPlanDetailData.analisis_finansial,
        error: null,
      }));
    }, 9300);

    // 10. Saved: Data berhasil disimpan (opsional - hanya untuk info)
    setTimeout(() => {
      // Status sudah completed, tidak perlu update lagi
      // Hanya log untuk debugging jika diperlukan
    }, 9600);
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    startStreaming,
    reset,
  };
};

