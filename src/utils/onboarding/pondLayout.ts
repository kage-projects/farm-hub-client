/**
 * Pond Layout Auto-Inference
 * - Auto-calculate jumlah kolam, ukuran, kedalaman dari luas_lahan dan jenis_ikan
 * - Tidak ada input manual dari user
 */

export type SpeciesType = 'lele' | 'nila' | 'gurame';

export interface PondLayoutResult {
  jumlah_kolam: number;
  ukuran_per_kolam: string; // e.g., "3x3 m"
  luas_per_kolam: number; // m²
  kedalaman_default: string; // e.g., "80-100 cm"
  kedalaman_m: number; // meters (average)
  alasan_pemilihan: string;
  totalLuasKolam: number; // m² (jumlah × luas_per_kolam)
  areaUtilization: number; // percentage of lahan used
}

/**
 * Species-specific defaults
 */
const SPECIES_DEFAULTS: Record<SpeciesType, {
  kolamSizeMin: number; // m² per kolam minimum
  kolamSizeOptimal: number; // m² per kolam optimal
  kedalaman: { min: number; max: number }; // cm
  recommendedKolamCount?: number; // jika null, dihitung dari luas
}> = {
  lele: {
    kolamSizeMin: 9, // 3x3 m minimum
    kolamSizeOptimal: 12, // 3x4 m atau 4x3 m
    kedalaman: { min: 80, max: 100 },
  },
  nila: {
    kolamSizeMin: 12, // 3x4 m minimum
    kolamSizeOptimal: 20, // 4x5 m atau 5x4 m
    kedalaman: { min: 100, max: 150 },
  },
  gurame: {
    kolamSizeMin: 20, // 4x5 m minimum
    kolamSizeOptimal: 30, // 5x6 m atau 6x5 m
    kedalaman: { min: 100, max: 150 },
    recommendedKolamCount: 2, // gurame butuh kolam lebih besar
  },
};

/**
 * Calculate optimal pond layout from land area and species
 */
export function calculatePondLayout(
  luasLahan: number, // m²
  jenisIkan: SpeciesType
): PondLayoutResult {
  const defaults = SPECIES_DEFAULTS[jenisIkan];
  
  // Calculate number of ponds
  let jumlahKolam: number;
  let luasPerKolam: number;
  let ukuranPerKolam: string;

  if (jenisIkan === 'gurame' && luasLahan >= 60) {
    // Gurame: prefer 2 larger ponds
    jumlahKolam = 2;
    luasPerKolam = Math.floor((luasLahan * 0.8) / jumlahKolam); // 80% utilization
    // Round to nearest optimal size
    luasPerKolam = Math.max(defaults.kolamSizeMin, Math.min(luasPerKolam, defaults.kolamSizeOptimal * 1.5));
  } else if (luasLahan >= 100) {
    // Large area: use optimal size, calculate count
    jumlahKolam = Math.floor((luasLahan * 0.8) / defaults.kolamSizeOptimal);
    jumlahKolam = Math.max(2, Math.min(jumlahKolam, 5)); // between 2-5 ponds
    luasPerKolam = Math.floor((luasLahan * 0.8) / jumlahKolam);
  } else if (luasLahan >= 50) {
    // Medium area: 2-3 ponds
    jumlahKolam = luasLahan >= 75 ? 3 : 2;
    luasPerKolam = Math.floor((luasLahan * 0.85) / jumlahKolam);
  } else {
    // Small area: 1-2 ponds
    jumlahKolam = 1;
    luasPerKolam = Math.min(luasLahan * 0.9, defaults.kolamSizeOptimal);
  }

  // Ensure minimum size
  luasPerKolam = Math.max(defaults.kolamSizeMin, luasPerKolam);

  // Calculate dimensions (prefer square-ish rectangles)
  const sideLength = Math.sqrt(luasPerKolam);
  let panjang = Math.ceil(sideLength);
  let lebar = Math.ceil(luasPerKolam / panjang);
  
  // Adjust to make it more practical (e.g., 3x3, 3x4, 4x5)
  if (panjang === lebar) {
    ukuranPerKolam = `${panjang}x${lebar} m`;
  } else {
    // Ensure panjang >= lebar (convention)
    if (panjang < lebar) {
      [panjang, lebar] = [lebar, panjang];
    }
    ukuranPerKolam = `${panjang}x${lebar} m`;
  }

  // Actual luas might differ slightly from calculated
  const actualLuasPerKolam = panjang * lebar;
  const totalLuasKolam = actualLuasPerKolam * jumlahKolam;
  const areaUtilization = (totalLuasKolam / luasLahan) * 100;

  // Kedalaman
  const kedalamanAvg = (defaults.kedalaman.min + defaults.kedalaman.max) / 2;
  const kedalamanDefault = `${defaults.kedalaman.min}-${defaults.kedalaman.max} cm`;
  const kedalamanM = kedalamanAvg / 100;

  // Alasan pemilihan
  let alasan = '';
  if (jumlahKolam === 1) {
    alasan = `Lahan ${luasLahan} m² optimal untuk 1 kolam ${ukuranPerKolam}.`;
  } else {
    alasan = `Lahan ${luasLahan} m² dioptimalkan menjadi ${jumlahKolam} kolam ${ukuranPerKolam} untuk efisiensi dan manajemen.`;
  }
  
  if (jenisIkan === 'lele') {
    alasan += ' Kolam lele relatif kecil dengan siklus cepat.';
  } else if (jenisIkan === 'nila') {
    alasan += ' Kolam nila membutuhkan area lebih luas dengan kedalaman sedang.';
  } else if (jenisIkan === 'gurame') {
    alasan += ' Kolam gurame lebih besar karena siklus panjang dan kebutuhan ruang gerak.';
  }

  if (areaUtilization > 90) {
    alasan += ' Area lahan digunakan hampir maksimal.';
  } else if (areaUtilization < 70) {
    alasan += ` Area tersisa ${(luasLahan - totalLuasKolam).toFixed(0)} m² dapat digunakan untuk fasilitas pendukung.`;
  }

  return {
    jumlah_kolam: jumlahKolam,
    ukuran_per_kolam: ukuranPerKolam,
    luas_per_kolam: actualLuasPerKolam,
    kedalaman_default: kedalamanDefault,
    kedalaman_m: kedalamanM,
    alasan_pemilihan: alasan,
    totalLuasKolam,
    areaUtilization,
  };
}

