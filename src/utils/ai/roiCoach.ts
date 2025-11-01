/**
 * ROI Coach utilities
 * - 3 skenario dengan sensitivitas
 * - Driver utama calculation
 * - Generate summary text
 */

import { ROIParameters, generateThreeScenarios, type ROIResult } from '../onboarding/roiCalculator';

export interface ROISensitivity {
  parameter: string;
  deltaROI: number; // change in ROI for ±10% change
  impact: 'high' | 'medium' | 'low';
}

export interface ROICoachResult {
  scenarios: {
    conservative: ROIResult;
    moderate: ROIResult;
    aggressive: ROIResult;
  };
  sensitivities: ROISensitivity[];
  summary: string;
  mainDrivers: string[];
}

/**
 * Calculate sensitivity analysis
 */
function calculateSensitivity(
  baseParams: ROIParameters,
  baseResults: ROIResult
): ROISensitivity[] {
  const sensitivities: ROISensitivity[] = [];
  const deltaPercent = 0.1; // ±10%

  // Sensitivity to SR
  const srParams = { ...baseParams, sr: baseParams.sr * (1 + deltaPercent) };
  const srResults = generateThreeScenarios(srParams);
  const deltaROISR = srResults.moderate.roi - baseResults.roi;
  sensitivities.push({
    parameter: 'SR (Survival Rate)',
    deltaROI: deltaROISR,
    impact: Math.abs(deltaROISR) > 5 ? 'high' : Math.abs(deltaROISR) > 2 ? 'medium' : 'low',
  });

  // Sensitivity to FCR
  const fcrParams = { ...baseParams, fcr: baseParams.fcr * (1 - deltaPercent) };
  const fcrResults = generateThreeScenarios(fcrParams);
  const deltaROIFCR = fcrResults.moderate.roi - baseResults.roi;
  sensitivities.push({
    parameter: 'FCR (Feed Conversion Ratio)',
    deltaROI: deltaROIFCR,
    impact: Math.abs(deltaROIFCR) > 5 ? 'high' : Math.abs(deltaROIFCR) > 2 ? 'medium' : 'low',
  });

  // Sensitivity to feed price
  const feedPriceParams = { ...baseParams, feedPricePerKg: baseParams.feedPricePerKg * (1 - deltaPercent) };
  const feedPriceResults = generateThreeScenarios(feedPriceParams);
  const deltaROIFeedPrice = feedPriceResults.moderate.roi - baseResults.roi;
  sensitivities.push({
    parameter: 'Harga Pakan',
    deltaROI: deltaROIFeedPrice,
    impact: Math.abs(deltaROIFeedPrice) > 5 ? 'high' : Math.abs(deltaROIFeedPrice) > 2 ? 'medium' : 'low',
  });

  // Sensitivity to selling price
  const sellingPriceParams = { ...baseParams, sellingPricePerKg: baseParams.sellingPricePerKg * (1 + deltaPercent) };
  const sellingPriceResults = generateThreeScenarios(sellingPriceParams);
  const deltaROISellingPrice = sellingPriceResults.moderate.roi - baseResults.roi;
  sensitivities.push({
    parameter: 'Harga Jual',
    deltaROI: deltaROISellingPrice,
    impact: Math.abs(deltaROISellingPrice) > 5 ? 'high' : Math.abs(deltaROISellingPrice) > 2 ? 'medium' : 'low',
  });

  return sensitivities;
}

/**
 * Generate ROI Coach result with sensitivities and summary
 */
export function calculateROICoach(params: ROIParameters): ROICoachResult {
  const scenarios = generateThreeScenarios(params);
  const sensitivities = calculateSensitivity(params, scenarios.moderate);

  // Sort by absolute impact
  sensitivities.sort((a, b) => Math.abs(b.deltaROI) - Math.abs(a.deltaROI));

  // Get main drivers (top 3)
  const mainDrivers = sensitivities.slice(0, 3).map((s) => s.parameter);

  // Calculate feed cost percentage
  const totalFeed = scenarios.moderate.totalFeed;
  const feedCost = totalFeed * params.feedPricePerKg;
  const feedCostPercentage = params.totalCost > 0 ? (feedCost / params.totalCost) * 100 : 0;

  // Generate summary text
  const summary = generateSummary(scenarios, feedCostPercentage, params, mainDrivers);

  return {
    scenarios,
    sensitivities,
    summary,
    mainDrivers,
  };
}

/**
 * Generate natural language summary
 */
function generateSummary(
  scenarios: {
    conservative: ROIResult;
    moderate: ROIResult;
    aggressive: ROIResult;
  },
  feedCostPercentage: number,
  params: ROIParameters,
  mainDrivers: string[]
): string {
  const bep = scenarios.moderate.bepPerKg;
  const roi = scenarios.moderate.roi;
  const feedPct = feedCostPercentage.toFixed(0);

  let summary = `Dalam kondisi input Anda, `;
  
  if (feedCostPercentage > 50) {
    summary += `biaya terbesar adalah pakan (${feedPct}% dari total biaya). `;
  } else {
    summary += `komponen biaya cukup seimbang. `;
  }

  summary += `Titik impas (BEP) di Rp ${bep.toLocaleString('id-ID')}/kg. `;

  if (roi > 30) {
    summary += `ROI moderat ${roi.toFixed(1)}% menunjukkan proyek cukup menguntungkan. `;
  } else if (roi > 15) {
    summary += `ROI moderat ${roi.toFixed(1)}% menunjukkan proyek layak dengan margin yang wajar. `;
  } else {
    summary += `ROI moderat ${roi.toFixed(1)}% menunjukkan proyek memiliki risiko yang perlu dipertimbangkan. `;
  }

  summary += `Skenario aman: SR ≥ ${(params.sr * 0.9 * 100).toFixed(0)}% & harga jual ≥ Rp ${(params.sellingPricePerKg * 0.9).toLocaleString('id-ID')}/kg. `;

  if (mainDrivers.length > 0) {
    summary += `Faktor kunci yang paling berpengaruh: ${mainDrivers.join(', ')}.`;
  }

  return summary;
}

