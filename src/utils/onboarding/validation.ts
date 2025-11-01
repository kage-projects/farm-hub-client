/**
 * Onboarding validation utilities
 * - Validate stocking density vs pond volume
 * - Check input reasonableness
 * - Generate warnings
 */

export interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
}

export interface PondInput {
  pondType: 'terpal' | 'beton';
  length: number; // meters
  width: number; // meters
  depth: number; // meters
  stockingDensity: number; // fish per m2
  species: string;
}

/**
 * Calculate pond volume in cubic meters
 */
export function calculateVolume(input: { length: number; width: number; depth: number }): number {
  return input.length * input.width * input.depth;
}

/**
 * Calculate surface area in square meters
 */
export function calculateSurfaceArea(input: { length: number; width: number }): number {
  return input.length * input.width;
}

/**
 * Recommended stocking density per species (fish per m2)
 */
const RECOMMENDED_STOCKING: Record<string, { min: number; max: number }> = {
  lele: { min: 50, max: 100 },
  nila: { min: 20, max: 50 },
  patin: { min: 15, max: 30 },
  gurame: { min: 10, max: 20 },
  mas: { min: 20, max: 40 },
};

/**
 * Validate stocking density against recommended ranges
 */
export function validateStockingDensity(input: PondInput): ValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];
  
  const surfaceArea = calculateSurfaceArea({ length: input.length, width: input.width });
  const recommended = RECOMMENDED_STOCKING[input.species] || { min: 20, max: 50 };
  
  if (input.stockingDensity < recommended.min) {
    warnings.push(
      `Padat tebar terlalu rendah untuk ${input.species}. Rekomendasi: ${recommended.min}-${recommended.max} ekor/m²`
    );
  }
  
  if (input.stockingDensity > recommended.max * 1.2) {
    errors.push(
      `Padat tebar terlalu tinggi! Maksimal untuk ${input.species}: ${recommended.max} ekor/m². Nilai saat ini dapat menyebabkan kepadatan berlebihan dan risiko kematian tinggi.`
    );
  } else if (input.stockingDensity > recommended.max) {
    warnings.push(
      `Padat tebar di atas rekomendasi untuk ${input.species}. Rekomendasi: ${recommended.min}-${recommended.max} ekor/m². Risiko penyakit meningkat.`
    );
  }
  
  // Check total fish count
  const totalFish = surfaceArea * input.stockingDensity;
  if (totalFish > 10000 && input.pondType === 'terpal') {
    warnings.push('Jumlah ikan > 10,000 ekor pada kolam terpal memerlukan perawatan ekstra.');
  }
  
  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  };
}

/**
 * Validate pond dimensions
 */
export function validatePondDimensions(input: { length: number; width: number; depth: number }): ValidationResult {
  const warnings: string[] = [];
  const errors: string[] = [];
  
  if (input.length < 2 || input.width < 2) {
    errors.push('Ukuran kolam terlalu kecil. Minimum 2m x 2m.');
  }
  
  if (input.depth < 0.5 || input.depth > 3) {
    errors.push('Kedalaman kolam harus antara 0.5m - 3m.');
  }
  
  const volume = calculateVolume(input);
  if (volume < 5) {
    warnings.push('Volume kolam < 5m³. Perawatan akan lebih intensif.');
  }
  
  if (volume > 1000) {
    warnings.push('Volume kolam > 1000m³. Pertimbangkan multiple kolam kecil untuk efisiensi.');
  }
  
  return {
    isValid: errors.length === 0,
    warnings,
    errors,
  };
}

/**
 * Combined validation
 */
export function validatePondInput(input: PondInput): ValidationResult {
  const dimensionValidation = validatePondDimensions(input);
  const densityValidation = validateStockingDensity(input);
  
  return {
    isValid: dimensionValidation.isValid && densityValidation.isValid,
    warnings: [...dimensionValidation.warnings, ...densityValidation.warnings],
    errors: [...dimensionValidation.errors, ...densityValidation.errors],
  };
}

