/**
 * ETP (Estimated Time to Proper Size) Calculator
 * - Calculate harvest date based on species, starting size, target size
 * - Growth rate models per species
 */

export interface ETPInput {
  species: string;
  startingWeight: number; // grams
  targetWeight: number; // grams
  startDate: Date;
  waterTemperature?: number; // celsius (optional, for more accurate calculation)
  feedQuality?: 'standard' | 'premium'; // optional
}

export interface ETPResult {
  estimatedDays: number;
  estimatedDate: Date;
  estimatedWeeks: number;
  confidence: 'high' | 'medium' | 'low';
  notes: string[];
}

/**
 * Growth rates per species (grams per week) - simplified linear model
 */
const GROWTH_RATES: Record<string, { weekly: number; notes: string }> = {
  lele: {
    weekly: 10, // ~10g per week under ideal conditions
    notes: 'Growth rate: 10g/minggu. Dapat dipanen 8-12 minggu dari benih.',
  },
  nila: {
    weekly: 15,
    notes: 'Growth rate: 15g/minggu. Dapat dipanen 12-16 minggu dari benih.',
  },
  patin: {
    weekly: 20,
    notes: 'Growth rate: 20g/minggu. Dapat dipanen 16-20 minggu dari benih.',
  },
  gurame: {
    weekly: 8,
    notes: 'Growth rate: 8g/minggu. Dapat dipanen 20-24 minggu dari benih.',
  },
  mas: {
    weekly: 12,
    notes: 'Growth rate: 12g/minggu. Dapat dipanen 10-14 minggu dari benih.',
  },
};

/**
 * Calculate ETP based on growth rate
 */
export function calculateETP(input: ETPInput): ETPResult {
  const growthRate = GROWTH_RATES[input.species] || GROWTH_RATES.lele;
  
  // Calculate weight gain needed
  const weightGain = input.targetWeight - input.startingWeight;
  
  // Adjust growth rate based on conditions
  let adjustedRate = growthRate.weekly;
  
  // Water temperature adjustment (optimal: 28-30°C)
  if (input.waterTemperature) {
    if (input.waterTemperature < 24 || input.waterTemperature > 32) {
      adjustedRate *= 0.8; // 20% slower if temperature not optimal
    } else if (input.waterTemperature >= 28 && input.waterTemperature <= 30) {
      adjustedRate *= 1.1; // 10% faster in optimal range
    }
  }
  
  // Feed quality adjustment
  if (input.feedQuality === 'premium') {
    adjustedRate *= 1.15; // 15% faster with premium feed
  }
  
  // Calculate weeks needed
  const weeksNeeded = Math.ceil(weightGain / adjustedRate);
  const daysNeeded = weeksNeeded * 7;
  
  // Calculate estimated date
  const estimatedDate = new Date(input.startDate);
  estimatedDate.setDate(estimatedDate.getDate() + daysNeeded);
  
  // Confidence level based on input completeness
  let confidence: 'high' | 'medium' | 'low' = 'medium';
  if (input.waterTemperature && input.feedQuality) {
    confidence = 'high';
  } else if (!input.waterTemperature && !input.feedQuality) {
    confidence = 'low';
  }
  
  const notes: string[] = [growthRate.notes];
  if (input.waterTemperature && (input.waterTemperature < 24 || input.waterTemperature > 32)) {
    notes.push('Perhatian: Suhu air di luar range optimal (24-32°C) dapat memperlambat pertumbuhan.');
  }
  if (input.feedQuality === 'premium') {
    notes.push('Dengan pakan premium, pertumbuhan dapat lebih cepat.');
  }
  
  return {
    estimatedDays: daysNeeded,
    estimatedDate,
    estimatedWeeks: weeksNeeded,
    confidence,
    notes,
  };
}

/**
 * Get recommended harvest window (flexible dates)
 */
export function getHarvestWindow(etpResult: ETPResult, flexibilityDays: number = 7): {
  earliest: Date;
  latest: Date;
  optimal: Date;
} {
  const optimal = new Date(etpResult.estimatedDate);
  const earliest = new Date(optimal);
  earliest.setDate(earliest.getDate() - flexibilityDays);
  const latest = new Date(optimal);
  latest.setDate(latest.getDate() + flexibilityDays);
  
  return { earliest, latest, optimal };
}

