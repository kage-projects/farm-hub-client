/**
 * Price Model utilities
 * - Spot, Fixed, Indexed models
 * - Validity periods
 * - Floor/Ceiling for indexed
 */

export type PriceModel = 'spot' | 'fixed' | 'indexed';

export type SpotPrice = {
  model: 'spot';
  basePrice: number;
  validityDays: number; // 3-7 days
  validFrom: Date;
  validTo: Date;
};

export type FixedPrice = {
  model: 'fixed';
  basePrice: number;
  validityWeeks: number; // 4-8 weeks
  validFrom: Date;
  validTo: Date;
  reopenThreshold?: number; // percentage increase to trigger reopen
};

export type IndexedPrice = {
  model: 'indexed';
  basePrice: number;
  indexRef: string; // reference index name
  formula: string; // formula for calculation
  floor: number; // minimum price
  ceiling: number; // maximum price
  repricingWindow: number; // days between repricing (e.g., 14)
  validFrom: Date;
  validTo: Date;
};

export type PriceModelData = SpotPrice | FixedPrice | IndexedPrice;

/**
 * Calculate price model validity period
 */
export function calculateValidityPeriod(model: PriceModel, duration: number): { from: Date; to: Date } {
  const from = new Date();
  const to = new Date();

  if (model === 'spot') {
    to.setDate(to.getDate() + duration); // days
  } else if (model === 'fixed') {
    to.setDate(to.getDate() + duration * 7); // weeks to days
  } else {
    // indexed - typically longer period
    to.setDate(to.getDate() + duration * 7);
  }

  return { from, to };
}

/**
 * Check if price model is valid (within validity period)
 */
export function isPriceModelValid(priceData: PriceModelData): boolean {
  const now = new Date();
  const validFrom = new Date(priceData.validFrom);
  const validTo = new Date(priceData.validTo);

  return now >= validFrom && now <= validTo;
}

/**
 * Get remaining validity time in hours
 */
export function getRemainingValidityHours(priceData: PriceModelData): number {
  if (!isPriceModelValid(priceData)) return 0;
  
  const now = new Date();
  const validTo = new Date(priceData.validTo);
  const diffMs = validTo.getTime() - now.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
}

/**
 * Format price model description
 */
export function formatPriceModel(priceData: PriceModelData): string {
  switch (priceData.model) {
    case 'spot':
      return `Spot - Berlaku ${priceData.validityDays} hari`;
    case 'fixed':
      return `Fixed - ${priceData.validityWeeks} minggu`;
    case 'indexed':
      return `Indexed - Floor: ${priceData.floor}, Ceiling: ${priceData.ceiling}`;
  }
}

