/**
 * ROI Calculator utilities
 * - 3 skenario finansial (konservatif/moderat/agresif)
 * - Calculate ROI, BEP, margin
 */

export interface ROIParameters {
  stockingDensity: number; // fish per m2
  surfaceArea: number; // m2
  sr: number; // Survival Rate (0-1)
  fcr: number; // Feed Conversion Ratio
  feedPricePerKg: number; // IDR
  seedPricePerFish: number; // IDR
  sellingPricePerKg: number; // IDR
  averageWeightAtHarvest: number; // grams per fish
  otherCosts: number; // IDR (listrik, air, tenaga kerja)
  freightCost: number; // IDR
}

export interface ROIScenario {
  label: 'conservative' | 'moderate' | 'aggressive';
  sr: number;
  fcr: number;
  sellingPrice: number;
  feedPrice: number;
}

export interface ROIResult {
  totalFish: number;
  survivedFish: number;
  totalBiomass: number; // kg
  totalFeed: number; // kg
  totalCost: number; // IDR
  revenue: number; // IDR
  profit: number; // IDR
  roi: number; // percentage
  bepPerKg: number; // IDR per kg
  margin: number; // percentage
}

/**
 * Calculate ROI for a single scenario
 */
export function calculateROI(params: ROIParameters, scenario: ROIScenario): ROIResult {
  const totalFish = params.stockingDensity * params.surfaceArea;
  const survivedFish = Math.floor(totalFish * scenario.sr);
  const totalBiomass = (survivedFish * params.averageWeightAtHarvest) / 1000; // convert to kg
  
  const totalFeed = totalBiomass * scenario.fcr;
  const seedCost = totalFish * params.seedPricePerFish;
  const feedCost = totalFeed * scenario.feedPrice;
  const otherCost = params.otherCosts;
  const freightCost = params.freightCost;
  
  const totalCost = seedCost + feedCost + otherCost + freightCost;
  const revenue = totalBiomass * scenario.sellingPrice;
  const profit = revenue - totalCost;
  const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;
  const bepPerKg = totalBiomass > 0 ? totalCost / totalBiomass : 0;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
  
  return {
    totalFish,
    survivedFish,
    totalBiomass: Math.round(totalBiomass * 100) / 100,
    totalFeed: Math.round(totalFeed * 100) / 100,
    totalCost: Math.round(totalCost),
    revenue: Math.round(revenue),
    profit: Math.round(profit),
    roi: Math.round(roi * 100) / 100,
    bepPerKg: Math.round(bepPerKg),
    margin: Math.round(margin * 100) / 100,
  };
}

/**
 * Generate 3 scenarios based on base parameters
 */
export function generateThreeScenarios(baseParams: ROIParameters): {
  conservative: ROIResult;
  moderate: ROIResult;
  aggressive: ROIResult;
} {
  const scenarios: ROIScenario[] = [
    {
      label: 'conservative',
      sr: baseParams.sr * 0.9, // -10% survival
      fcr: baseParams.fcr * 1.1, // +10% FCR (lebih boros)
      sellingPrice: baseParams.sellingPricePerKg * 0.9, // -10% harga jual
      feedPrice: baseParams.feedPricePerKg * 1.05, // +5% harga pakan
    },
    {
      label: 'moderate',
      sr: baseParams.sr,
      fcr: baseParams.fcr,
      sellingPrice: baseParams.sellingPricePerKg,
      feedPrice: baseParams.feedPricePerKg,
    },
    {
      label: 'aggressive',
      sr: baseParams.sr * 1.1, // +10% survival
      fcr: baseParams.fcr * 0.9, // -10% FCR (lebih efisien)
      sellingPrice: baseParams.sellingPricePerKg * 1.1, // +10% harga jual
      feedPrice: baseParams.feedPricePerKg * 0.95, // -5% harga pakan
    },
  ];
  
  return {
    conservative: calculateROI(baseParams, scenarios[0]),
    moderate: calculateROI(baseParams, scenarios[1]),
    aggressive: calculateROI(baseParams, scenarios[2]),
  };
}

/**
 * Get default parameters based on species
 */
export function getDefaultParameters(species: string, surfaceArea: number): Partial<ROIParameters> {
  const defaults: Record<string, Partial<ROIParameters>> = {
    lele: {
      sr: 0.85,
      fcr: 1.2,
      feedPricePerKg: 11000,
      seedPricePerFish: 300,
      sellingPricePerKg: 28000,
      averageWeightAtHarvest: 120, // grams
      otherCosts: 1800000,
      freightCost: 500000,
    },
    nila: {
      sr: 0.80,
      fcr: 1.5,
      feedPricePerKg: 12000,
      seedPricePerFish: 500,
      sellingPricePerKg: 32000,
      averageWeightAtHarvest: 200,
      otherCosts: 2000000,
      freightCost: 600000,
    },
    patin: {
      sr: 0.75,
      fcr: 1.8,
      feedPricePerKg: 13000,
      seedPricePerFish: 600,
      sellingPricePerKg: 35000,
      averageWeightAtHarvest: 300,
      otherCosts: 2500000,
      freightCost: 700000,
    },
  };
  
  return {
    surfaceArea,
    ...(defaults[species] || defaults.lele),
  };
}

