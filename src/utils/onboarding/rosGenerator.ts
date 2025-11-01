/**
 * ROS (Rencana Operasional Siklus) Generator
 * - Generate 12-week operational plan
 * - Weekly schedule: feeding, water change, treatment
 * - Total feed requirement calculation
 */

export interface ROSWeek {
  week: number;
  phase: 'initial' | 'growing' | 'maturing' | 'harvest';
  feeding: {
    frequency: number; // times per day
    amountPerDay: number; // kg
    totalPerWeek: number; // kg
  };
  waterChange: {
    frequency: number; // times per week
    percentage: number; // percentage of water
  };
  treatment: string[]; // treatment notes
  biosecurity: string[]; // biosecurity notes
  notes: string;
}

export interface ROSInput {
  species: string;
  totalFish: number;
  surfaceArea: number;
  targetHarvestWeight: number; // grams
  targetHarvestDate: Date;
  startDate: Date;
}

export interface ROSResult {
  weeks: ROSWeek[];
  totalFeedRequired: number; // kg
  estimatedHarvestDate: Date;
  estimatedTimeToProperSize: number; // days
}

/**
 * Calculate estimated time to proper size (ETP) based on species and target weight
 */
function calculateETP(species: string, targetWeight: number): number {
  // Growth rate per week (grams) - simplified linear model
  const growthRates: Record<string, number> = {
    lele: 10, // ~10g per week
    nila: 15,
    patin: 20,
    gurame: 8,
    mas: 12,
  };
  
  const growthRate = growthRates[species] || 10;
  const initialWeight = 5; // typical seed weight in grams
  const weightGain = targetWeight - initialWeight;
  const weeks = Math.ceil(weightGain / growthRate);
  return weeks * 7; // convert to days
}

/**
 * Generate feeding amount based on week and phase
 */
function calculateFeedingAmount(
  week: number,
  phase: ROSWeek['phase'],
  totalFish: number,
  averageWeight: number
): { amountPerDay: number; frequency: number } {
  // FCR varies by phase: initial (1.5), growing (1.2), maturing (1.5)
  const fcrByPhase: Record<string, number> = {
    initial: 1.5,
    growing: 1.2,
    maturing: 1.5,
  };
  
  const fcr = fcrByPhase[phase] || 1.2;
  const dailyWeightGain = averageWeight * 0.02; // 2% daily weight gain estimate
  const totalDailyWeightGain = totalFish * dailyWeightGain / 1000; // kg
  const dailyFeedRequired = totalDailyWeightGain * fcr;
  
  // Feeding frequency: initial (4x/day), growing (3x/day), maturing (2x/day)
  const frequencyByPhase: Record<string, number> = {
    initial: 4,
    growing: 3,
    maturing: 2,
  };
  
  return {
    amountPerDay: Math.round(dailyFeedRequired * 100) / 100,
    frequency: frequencyByPhase[phase] || 3,
  };
}

/**
 * Generate ROS 12 weeks
 */
export function generateROS(input: ROSInput): ROSResult {
  const weeks: ROSWeek[] = [];
  const etp = calculateETP(input.species, input.targetHarvestWeight);
  const estimatedHarvestDate = new Date(input.startDate);
  estimatedHarvestDate.setDate(estimatedHarvestDate.getDate() + etp);
  
  let totalFeed = 0;
  
  for (let week = 1; week <= 12; week++) {
    let phase: ROSWeek['phase'];
    if (week <= 3) phase = 'initial';
    else if (week <= 8) phase = 'growing';
    else phase = 'maturing';
    
    // Estimate average weight at this week
    const weightGainPerWeek = input.targetHarvestWeight / 12;
    const averageWeight = 5 + (weightGainPerWeek * week); // starting from 5g
    
    const feeding = calculateFeedingAmount(week, phase, input.totalFish, averageWeight);
    const totalPerWeek = feeding.amountPerDay * 7;
    totalFeed += totalPerWeek;
    
    // Water change schedule
    let waterChangeFrequency = 2; // default
    let waterChangePercentage = 30;
    if (phase === 'initial') {
      waterChangeFrequency = 3;
      waterChangePercentage = 50;
    } else if (phase === 'maturing') {
      waterChangeFrequency = 1;
      waterChangePercentage = 20;
    }
    
    // Treatment and biosecurity notes
    const treatment: string[] = [];
    const biosecurity: string[] = [];
    
    if (week === 1) {
      treatment.push('Probiotik starter');
      biosecurity.push('Sterilisasi kolam sebelum tebar');
    }
    if (week === 4 || week === 8) {
      treatment.push('Treatment preventif penyakit');
    }
    if (week % 2 === 0) {
      biosecurity.push('Pemantauan kualitas air (pH, DO, NH₃)');
    }
    
    weeks.push({
      week,
      phase,
      feeding: {
        frequency: feeding.frequency,
        amountPerDay: feeding.amountPerDay,
        totalPerWeek: Math.round(totalPerWeek * 100) / 100,
      },
      waterChange: {
        frequency: waterChangeFrequency,
        percentage: waterChangePercentage,
      },
      treatment,
      biosecurity,
      notes: phase === 'harvest' ? 'Persiapan panen' : `Fase ${phase}`,
    });
  }
  
  return {
    weeks,
    totalFeedRequired: Math.round(totalFeed * 100) / 100,
    estimatedHarvestDate,
    estimatedTimeToProperSize: etp,
  };
}

