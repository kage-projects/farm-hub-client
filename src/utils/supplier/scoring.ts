/**
 * Supplier Scoring Algorithm
 * - Komponen: Sertifikasi (20%), SLA Tepat Waktu (25%), Return Rate (15%), Harga Stabil (20%), Rating (20%)
 * - Normalisasi dan weight calculation
 */

import type { SupplierData } from '../../data/mockSuppliers';

export type SupplierScore = {
  supplierId: string;
  totalScore: number; // 0-1
  components: {
    certification: number; // 0-1
    sla: number; // 0-1
    returnRate: number; // 0-1 (inverted - lower is better)
    priceStability: number; // 0-1
    rating: number; // 0-1 (normalized from 0-5)
  };
};

/**
 * Calculate normalized score component
 */
function normalize(value: number, min: number, max: number, invert: boolean = false): number {
  if (max === min) return 0.5;
  const normalized = (value - min) / (max - min);
  return invert ? 1 - normalized : normalized;
}

/**
 * Calculate supplier score based on weighted components
 */
export function calculateSupplierScore(supplier: SupplierData): SupplierScore {
  // Component scores (0-1)
  const certificationScore = supplier.certification.hasCertification ? 1 : 0;
  const slaScore = supplier.sla.onTimePercentage; // already 0-1
  const returnRateScore = 1 - supplier.returnRate; // invert (lower return rate is better)
  const priceStabilityScore = supplier.priceStability; // already 0-1
  const ratingScore = supplier.rating / 5; // normalize from 0-5 to 0-1

  // Weighted components (from FRD spec)
  const weights = {
    certification: 0.20,
    sla: 0.25,
    returnRate: 0.15,
    priceStability: 0.20,
    rating: 0.20,
  };

  // Calculate weighted total
  const totalScore =
    certificationScore * weights.certification +
    slaScore * weights.sla +
    returnRateScore * weights.returnRate +
    priceStabilityScore * weights.priceStability +
    ratingScore * weights.rating;

  return {
    supplierId: supplier.id,
    totalScore,
    components: {
      certification: certificationScore,
      sla: slaScore,
      returnRate: returnRateScore,
      priceStability: priceStabilityScore,
      rating: ratingScore,
    },
  };
}

/**
 * Calculate scores for all suppliers
 */
export function calculateAllScores(suppliers: SupplierData[]): Map<string, SupplierScore> {
  const scores = new Map<string, SupplierScore>();
  suppliers.forEach((supplier) => {
    scores.set(supplier.id, calculateSupplierScore(supplier));
  });
  return scores;
}

/**
 * Sort suppliers by score (descending)
 */
export function sortByScore(suppliers: SupplierData[], scores: Map<string, SupplierScore>): SupplierData[] {
  return [...suppliers].sort((a, b) => {
    const scoreA = scores.get(a.id)?.totalScore || 0;
    const scoreB = scores.get(b.id)?.totalScore || 0;
    return scoreB - scoreA;
  });
}

/**
 * Filter suppliers by category
 */
export function filterByCategory(
  suppliers: SupplierData[],
  category: SupplierData['category'] | 'all'
): SupplierData[] {
  if (category === 'all') return suppliers;
  return suppliers.filter((s) => s.category === category);
}

