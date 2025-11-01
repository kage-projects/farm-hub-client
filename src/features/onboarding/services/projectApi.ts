/**
 * Project API Service
 * Handles all project-related API calls
 */

import { post, get, patch } from '../../../services/apiService';

export interface CreateProjectRequest {
  jenis_ikan: 'NILA' | 'LELE' | 'GURAME';
  modal: number;
  kabupaten_id: string;
  resiko: 'KONSERVATIF' | 'MODERAT' | 'AGRESIF';
  lang?: number;
  lat?: number;
}

export interface ProjectData {
  id: string;
  project_name: string;
  jenis_ikan: string;
  jumlah_team: number;
  modal: number;
  kabupaten_id: string;
  resiko: string;
  user_id: string;
  lang?: number;
  lat?: number;
}

export interface ProjectSummary {
  id: string;
  project_name: string;
  kabupaten_id: string;
  resiko: string;
}

export interface RingkasanAwal {
  skor_kelayakan: number;
  potensi_pasar: string;
  estimasi_modal: number;
  estimasi_balik_modal: number;
  kesimpulan_ringkasan: string;
  ai_analysis?: {
    status?: string;
    model_used?: string;
    source?: string;
    message?: string;
  };
}

export interface ProjectResponse {
  success: boolean;
  message: string;
  data: ProjectData;
  ringkasan_awal: RingkasanAwal;
}

export type CreateProjectResponse = ProjectResponse;

/**
 * Create a new project
 */
export const createProject = async (
  data: CreateProjectRequest
): Promise<CreateProjectResponse> => {
  const response = await post<ProjectResponse>('/projects', data);
  const result = response.data;
  if (!result) {
    throw new Error('Response data tidak ditemukan');
  }
  return result;
};

export interface GetAllProjectsResponse {
  success: boolean;
  message: string;
  data: ProjectSummary[];
}

/**
 * Get project by ID
 */
export const getProject = async (
  projectId: string
): Promise<ProjectResponse> => {
  const apiResponse = await get<any>(`/project/${projectId}`);
  console.log('apiResponse dari get():', apiResponse);
  
  // apiResponse from get() is ApiResponse<any> = { success?: boolean, data?: any }
  // Server returns: { success: true, message: "...", data: ProjectData, ringkasan_awal: {...} }
  // So apiResponse might be:
  // 1. { success: true, data: { success: true, message: "...", data: {...}, ringkasan_awal: {...} } } - double wrapped
  // 2. { success: true, message: "...", data: {...}, ringkasan_awal: {...} } - direct ProjectResponse
  
  let result: any = apiResponse;
  
  // If apiResponse.data exists and has ProjectResponse structure, use that
  if (apiResponse?.data && typeof apiResponse.data === 'object' && 'data' in apiResponse.data && 'ringkasan_awal' in apiResponse.data) {
    result = apiResponse.data;
  }
  // Otherwise, if apiResponse itself has ProjectResponse structure, use that
  else if (apiResponse && typeof apiResponse === 'object' && 'data' in apiResponse && 'ringkasan_awal' in apiResponse) {
    result = apiResponse;
  }
  
  // Validate result has required fields
  if (!result || typeof result !== 'object' || !('data' in result) || !('ringkasan_awal' in result)) {
    console.error('Invalid response format:', result);
    throw new Error('Format response tidak valid: response harus memiliki data dan ringkasan_awal');
  }
  
  return result as ProjectResponse;
};

/**
 * Update project and regenerate analysis
 */
export const updateProject = async (
  projectId: string,
  data: Partial<CreateProjectRequest>
): Promise<ProjectResponse> => {
  const response = await patch<ProjectResponse>(`/projects/${projectId}`, data);
  const result = response.data;
  if (!result) {
    throw new Error('Response data tidak ditemukan');
  }
  return result;
};

/**
 * Get all projects (summary list)
 */
export const getAllProjects = async (): Promise<GetAllProjectsResponse> => {
  const response = await get<GetAllProjectsResponse>('/projects');
  // Response from get() is ApiResponse<GetAllProjectsResponse> = { success, data: GetAllProjectsResponse }
  // So response.data is GetAllProjectsResponse = { success, message, data: ProjectSummary[] }
  // But sometimes server might return the array directly, so we need to handle both cases
  const result = response.data;
  
  if (!result) {
    throw new Error('Response data tidak ditemukan');
  }
  
  // If result is already GetAllProjectsResponse format, return it
  if (typeof result === 'object' && 'data' in result && Array.isArray(result.data)) {
    return result as GetAllProjectsResponse;
  }
  
  // If result is an array, wrap it in GetAllProjectsResponse format
  if (Array.isArray(result)) {
    return {
      success: true,
      message: 'Berhasil mengambil projects',
      data: result,
    };
  }
  
  throw new Error('Format response tidak valid untuk getAllProjects');
};

