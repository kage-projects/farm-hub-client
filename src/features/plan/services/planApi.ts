/**
 * Plan API Service
 * Handles plan detail streaming and data fetching
 */

import { streamPost, type SSEStreamHandler } from '../../../services/apiService';

export interface PlanDetailData {
  informasi_teknis: {
    spesifikasi_kolam: any;
    kualitas_air: any;
    spesifikasi_benih: any;
    spesifikasi_pakan: any;
    manajemen_kesehatan: any;
    teknologi_pendukung: any;
  };
  roadmap: {
    step: number;
    judul: string;
    tujuan: string;
    durasi_bulan: number;
    tahapan: Array<{
      nomor: number;
      nama_tahap: string;
      deskripsi: string;
      durasi_minggu: number;
      kegiatan: string[];
      output: string;
    }>;
    risiko_dan_mitigasi: Array<{
      risiko: string;
      dampak: string;
      mitigasi: string;
    }>;
    success_criteria: string;
  };
  analisis_finansial: {
    rincian_modal_awal: any;
    biaya_operasional: any;
    analisis_roi: any;
    analisis_bep: any;
    proyeksi_pendapatan: any;
  };
}

export interface PlanStreamEvent {
  type: 'status' | 'chunk' | 'result' | 'completed' | 'saved';
  message?: string;
  text?: string;
  progress?: number;
  section?: string;
  data?: any;
  success?: boolean;
}

/**
 * Get plan detail with SSE streaming
 */
export const getPlanDetailStream = async (
  projectId: string,
  handlers: SSEStreamHandler
): Promise<void> => {
  const endpoint = `/project/${projectId}/plan/stream`;
  await streamPost(endpoint, {}, handlers);
};


