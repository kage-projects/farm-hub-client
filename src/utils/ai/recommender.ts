/**
 * AI Supplier Recommender (Heuristic-based)
 * - Score = 0.2·Sertifikasi + 0.25·On-time + 0.15·Return-Rate(1−r) + 0.2·Stabilitas Harga + 0.2·Rating − 0.1·(Jarak Normalized)
 * - Top-3 supplier dengan alasan
 * - Prediksi SLA (p50/p90)
 */

import type { SupplierData } from '../../data/mockSuppliers';
import type { SupplierScore } from '../supplier/scoring';
import { calculateSupplierScore } from '../supplier/scoring';

export interface RecommendationReason {
  type: 'certification' | 'on-time' | 'return-rate' | 'price-stability' | 'rating' | 'distance';
  label: string;
  impact: 'positive' | 'negative';
}

export interface SupplierRecommendation {
  supplier: SupplierData;
  score: SupplierScore;
  distance: number; // km
  etaP50: number; // hours (median)
  etaP90: number; // hours (90th percentile)
  reasons: RecommendationReason[];
  rank: number;
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Normalize distance (0-1, where 1 is closest)
 * Max distance assumed: 100km
 */
function normalizeDistance(distance: number, maxDistance: number = 100): number {
  return Math.max(0, 1 - distance / maxDistance);
}

/**
 * Generate recommendation reasons
 */
function generateReasons(
  supplier: SupplierData,
  score: SupplierScore,
  distance: number
): RecommendationReason[] {
  const reasons: RecommendationReason[] = [];

  if (supplier.certification.hasCertification) {
    reasons.push({
      type: 'certification',
      label: 'Memiliki sertifikasi resmi',
      impact: 'positive',
    });
  }

  if (supplier.sla.onTimePercentage >= 0.95) {
    reasons.push({
      type: 'on-time',
      label: `Ketepatan waktu ${(supplier.sla.onTimePercentage * 100).toFixed(0)}%`,
      impact: 'positive',
    });
  }

  if (supplier.returnRate < 0.03) {
    reasons.push({
      type: 'return-rate',
      label: 'Return rate rendah',
      impact: 'positive',
    });
  }

  if (supplier.priceStability >= 0.85) {
    reasons.push({
      type: 'price-stability',
      label: 'Harga stabil',
      impact: 'positive',
    });
  }

  if (supplier.rating >= 4.5) {
    reasons.push({
      type: 'rating',
      label: `Rating tinggi (${supplier.rating.toFixed(1)}/5)`,
      impact: 'positive',
    });
  }

  if (distance < 20) {
    reasons.push({
      type: 'distance',
      label: `Dekat (${distance.toFixed(1)} km)`,
      impact: 'positive',
    });
  } else if (distance > 50) {
    reasons.push({
      type: 'distance',
      label: `Jarak cukup jauh (${distance.toFixed(1)} km)`,
      impact: 'negative',
    });
  }

  return reasons;
}

/**
 * Calculate ETA percentiles based on historical data
 */
function calculateETA(supplier: SupplierData): { p50: number; p90: number } {
  // Use average delivery time as p50
  const p50 = supplier.sla.averageDeliveryTime;
  // p90 is typically 1.5-2x average for normal distribution
  const p90 = p50 * 1.8;

  return { p50, p90 };
}

/**
 * Recommend top suppliers with adjusted score (including distance)
 */
export function recommendSuppliers(
  suppliers: SupplierData[],
  userLocation: { lat: number; lng: number },
  category?: SupplierData['category'],
  topN: number = 3
): SupplierRecommendation[] {
  // Filter by category if specified
  const filtered = category
    ? suppliers.filter((s) => s.category === category)
    : suppliers;

  // Calculate recommendations with distance adjustment
  const recommendations: SupplierRecommendation[] = filtered.map((supplier) => {
    const baseScore = calculateSupplierScore(supplier);
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      supplier.location.coordinates.lat,
      supplier.location.coordinates.lng
    );

    // Adjust score with distance penalty (-0.1 * normalized distance)
    const distanceAdjustment = 0.1 * normalizeDistance(distance, 100);
    const adjustedScore = {
      ...baseScore,
      totalScore: baseScore.totalScore - distanceAdjustment,
    };

    const eta = calculateETA(supplier);
    const reasons = generateReasons(supplier, adjustedScore, distance);

    return {
      supplier,
      score: adjustedScore,
      distance,
      etaP50: eta.p50,
      etaP90: eta.p90,
      reasons,
      rank: 0, // Will be set after sorting
    };
  });

  // Sort by adjusted score (descending)
  recommendations.sort((a, b) => b.score.totalScore - a.score.totalScore);

  // Assign ranks
  recommendations.forEach((rec, idx) => {
    rec.rank = idx + 1;
  });

  // Return top N
  return recommendations.slice(0, topN);
}

