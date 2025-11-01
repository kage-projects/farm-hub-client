/**
 * Adaptive Roadmap Utilities
 * Memberikan saran penyesuaian roadmap berdasarkan issue yang dilaporkan
 */

import type { RoadmapIssue, RoadmapTahapan } from '../../store/roadmapStore';

export interface AdaptiveRecommendation {
  adjustment: string;
  reason: string;
  priority: 'low' | 'medium' | 'high';
  affectedSteps?: string[];
}

/**
 * Generate adaptive recommendations based on reported issues
 */
export function generateAdaptiveRecommendations(
  issue: RoadmapIssue,
  currentTahap: RoadmapTahapan
): AdaptiveRecommendation[] {
  const recommendations: AdaptiveRecommendation[] = [];

  switch (issue.type) {
    case 'problem':
      // Masalah/kendala - berikan saran penyesuaian
      if (issue.title.toLowerCase().includes('air') || issue.description.toLowerCase().includes('air')) {
        recommendations.push({
          adjustment: 'Tambahkan pengecekan kualitas air harian sebelum penebaran benih',
          reason: 'Kualitas air yang tidak optimal dapat menyebabkan masalah kesehatan ikan',
          priority: 'high',
          affectedSteps: ['Persiapan Infrastruktur dan Kemitraan'],
        });
        recommendations.push({
          adjustment: 'Perpanjang masa fermentasi dan pembentukan flok menjadi 3 minggu',
          reason: 'Memberikan waktu lebih untuk stabilisasi sistem bioflok',
          priority: 'medium',
        });
      }

      if (issue.title.toLowerCase().includes('suhu') || issue.description.toLowerCase().includes('suhu')) {
        recommendations.push({
          adjustment: 'Tambahkan monitoring suhu air setiap 6 jam',
          reason: 'Suhu yang tidak stabil dapat mempengaruhi pertumbuhan ikan',
          priority: 'high',
        });
        recommendations.push({
          adjustment: 'Pertimbangkan penggunaan pemanas/penutup kolam jika suhu terlalu rendah',
          reason: 'Suhu optimal diperlukan untuk metabolisme ikan',
          priority: 'medium',
        });
      }

      if (issue.title.toLowerCase().includes('pakan') || issue.description.toLowerCase().includes('pakan')) {
        recommendations.push({
          adjustment: 'Kurangi jumlah pakan awal menjadi 80% dari rekomendasi',
          reason: 'Sistem bioflok membutuhkan waktu untuk stabil sebelum pemberian pakan penuh',
          priority: 'medium',
        });
        recommendations.push({
          adjustment: 'Tingkatkan frekuensi pemberian pakan menjadi 4-5 kali sehari dengan porsi kecil',
          reason: 'Pemberian pakan bertahap membantu sistem bioflok beradaptasi',
          priority: 'low',
        });
      }

      if (issue.title.toLowerCase().includes('mortalitas') || issue.description.toLowerCase().includes('mati')) {
        recommendations.push({
          adjustment: 'Lakukan sortir dan isolasi ikan yang menunjukkan gejala sakit',
          reason: 'Mencegah penyebaran penyakit ke ikan sehat',
          priority: 'high',
        });
        recommendations.push({
          adjustment: 'Perpanjang masa aklimatisasi menjadi 3 hari dengan monitoring intensif',
          reason: 'Memberikan waktu lebih untuk adaptasi ikan terhadap lingkungan baru',
          priority: 'high',
        });
      }

      // Generic problem
      if (recommendations.length === 0) {
        recommendations.push({
          adjustment: 'Tambahkan monitoring harian yang lebih intensif untuk tahap ini',
          reason: 'Memantau perkembangan lebih dekat untuk mendeteksi masalah lebih awal',
          priority: 'medium',
        });
      }
      break;

    case 'delay':
      recommendations.push({
        adjustment: `Perpanjang durasi tahap menjadi ${currentTahap.durasi_minggu + 1} minggu`,
        reason: 'Memberikan waktu lebih untuk menyelesaikan semua kegiatan',
        priority: 'medium',
      });
      recommendations.push({
        adjustment: 'Prioritaskan kegiatan yang paling kritis terlebih dahulu',
        reason: 'Memastikan output utama tetap tercapai meskipun ada keterlambatan',
        priority: 'high',
      });
      break;

    case 'resource':
      if (issue.description.toLowerCase().includes('modal') || issue.description.toLowerCase().includes('dana')) {
        recommendations.push({
          adjustment: 'Pertimbangkan untuk mengurangi jumlah kolam atau skala awal',
          reason: 'Mulai dengan skala lebih kecil untuk memastikan keberlanjutan finansial',
          priority: 'high',
        });
      }

      if (issue.description.toLowerCase().includes('tenaga') || issue.description.toLowerCase().includes('karyawan')) {
        recommendations.push({
          adjustment: 'Sederhanakan kegiatan yang membutuhkan banyak tenaga',
          reason: 'Optimalkan penggunaan sumber daya yang tersedia',
          priority: 'medium',
        });
      }

      if (recommendations.length === 0) {
        recommendations.push({
          adjustment: 'Cari alternatif supplier atau metode yang lebih efisien',
          reason: 'Mengoptimalkan penggunaan resource yang tersedia',
          priority: 'medium',
        });
      }
      break;

    case 'question':
      // Untuk pertanyaan, berikan informasi edukatif
      if (issue.description.toLowerCase().includes('bioflok')) {
        recommendations.push({
          adjustment: 'Pastikan kepadatan flok terjaga dengan molase dan probiotik berkala',
          reason: 'Flok yang sehat adalah kunci keberhasilan sistem bioflok',
          priority: 'low',
        });
      }
      break;
  }

  return recommendations;
}

/**
 * Format recommendations into adjustment strings for tahap
 */
export function formatAdjustments(recommendations: AdaptiveRecommendation[]): string[] {
  return recommendations.map((rec) => `${rec.adjustment} (${rec.reason})`);
}

/**
 * Get priority color for recommendation
 */
export function getRecommendationPriorityColor(priority: AdaptiveRecommendation['priority']) {
  switch (priority) {
    case 'high':
      return 'red';
    case 'medium':
      return 'orange';
    case 'low':
      return 'blue';
  }
}


