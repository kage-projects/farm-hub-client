/**
 * Mock QC Specifications
 * - Per item type (bibit, pakan, obat, logistik)
 * - Toleransi, criteria, penalty rules
 */

export type QCSpec = {
  itemType: 'bibit' | 'pakan' | 'obat' | 'logistik';
  criteria: {
    mortalityMax?: number; // percentage
    sizeTolerance?: number; // percentage (±)
    weightTolerance?: number; // percentage (±)
    expiryCheck?: boolean;
    packagingCheck?: boolean;
  };
  penalties: {
    mortalityExcess: number; // percentage penalty per 1% excess
    sizeMismatch: number; // percentage penalty per 1% mismatch
    weightShortage: number; // percentage penalty per 1% shortage
  };
  requiredChecks: string[];
};

export const mockQCSpecs: Record<string, QCSpec> = {
  bibit: {
    itemType: 'bibit',
    criteria: {
      mortalityMax: 3, // 3% max
      sizeTolerance: 5, // ±5%
    },
    penalties: {
      mortalityExcess: 2, // 2% penalty per 1% excess mortality
      sizeMismatch: 1, // 1% penalty per 1% size mismatch
      weightShortage: 0, // not applicable
    },
    requiredChecks: ['Ukuran rata-rata', 'Mortalitas', 'Foto/video bukti'],
  },
  pakan: {
    itemType: 'pakan',
    criteria: {
      weightTolerance: 2, // ±2%
      expiryCheck: true,
      packagingCheck: true,
    },
    penalties: {
      weightShortage: 3, // 3% penalty per 1% weight shortage
      mortalityExcess: 0, // not applicable
      sizeMismatch: 0, // not applicable
    },
    requiredChecks: ['Berat bersih', 'Tanggal produksi/exp', 'Kondisi kemasan'],
  },
  obat: {
    itemType: 'obat',
    criteria: {
      expiryCheck: true,
      packagingCheck: true,
    },
    penalties: {
      weightShortage: 5, // 5% penalty for any issue
      mortalityExcess: 0,
      sizeMismatch: 0,
    },
    requiredChecks: ['Tanggal exp', 'Kondisi kemasan', 'Label dan sertifikasi'],
  },
  logistik: {
    itemType: 'logistik',
    criteria: {
      weightTolerance: 5, // ±5%
      packagingCheck: true,
    },
    penalties: {
      weightShortage: 2,
      mortalityExcess: 0,
      sizeMismatch: 0,
    },
    requiredChecks: ['Kondisi fisik', 'Fungsi', 'Dokumentasi'],
  },
};

/**
 * Get QC spec for item type
 */
export function getQCSpec(itemType: string): QCSpec {
  return mockQCSpecs[itemType] || mockQCSpecs.bibit;
}

