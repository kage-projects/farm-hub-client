/**
 * QC Sampling utilities
 * - Calculate sampling size (1-2% of quantity)
 * - Minimum sampling rules
 */

export interface SamplingResult {
  sampleSize: number;
  percentage: number;
  minSampleSize: number;
  recommended: boolean;
}

/**
 * Calculate sampling size based on quantity
 * - 1-2% of total quantity
 * - Minimum sample size: 10 (configurable)
 */
export function calculateSampling(
  quantity: number,
  minSampleSize: number = 10,
  samplingPercentage: number = 0.015 // 1.5% default
): SamplingResult {
  const calculated = Math.ceil(quantity * samplingPercentage);
  const sampleSize = Math.max(calculated, minSampleSize);
  const percentage = (sampleSize / quantity) * 100;

  return {
    sampleSize,
    percentage,
    minSampleSize,
    recommended: sampleSize >= minSampleSize && percentage >= 1 && percentage <= 2,
  };
}

/**
 * Get sampling recommendation based on item type
 */
export function getSamplingRecommendation(
  itemType: 'bibit' | 'pakan' | 'obat' | 'logistik',
  quantity: number
): SamplingResult {
  // Different sampling rules per item type
  const rules: Record<string, { percentage: number; minSample: number }> = {
    bibit: { percentage: 0.02, minSample: 20 }, // 2%, min 20 ekor
    pakan: { percentage: 0.01, minSample: 5 }, // 1%, min 5 sak
    obat: { percentage: 0.01, minSample: 3 }, // 1%, min 3 paket
    logistik: { percentage: 0.005, minSample: 2 }, // 0.5%, min 2 item
  };

  const rule = rules[itemType] || rules.bibit;
  return calculateSampling(quantity, rule.minSample, rule.percentage);
}


