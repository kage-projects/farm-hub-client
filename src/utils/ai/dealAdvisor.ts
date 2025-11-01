/**
 * AI Deal Advisor (Heuristic-based)
 * - Recommend price model (Spot/Fixed/Indexed) based on volatility, horizon, volume
 * - Explainability: why this model
 */

export interface DealAdvisorInput {
  item: string;
  horizonWeeks: number; // contract duration
  volatility30d: number; // price volatility (0-1 or percentage)
  volume: number;
  riskAppetite: 'low' | 'medium' | 'high';
}

export interface DealAdvisorRecommendation {
  recommendation: 'spot' | 'fixed' | 'indexed';
  confidence: number; // 0-1
  reasons: string[];
  alternatives?: Array<{
    model: 'spot' | 'fixed' | 'indexed';
    reason: string;
  }>;
}

/**
 * Recommend price model based on input parameters
 */
export function recommendPriceModel(input: DealAdvisorInput): DealAdvisorRecommendation {
  const { horizonWeeks, volatility30d, volume, riskAppetite } = input;
  const reasons: string[] = [];
  let recommendation: 'spot' | 'fixed' | 'indexed' = 'spot';
  let confidence = 0.7;

  // Rule 1: Spot for short horizon and low volatility
  if (horizonWeeks <= 1 && volatility30d < 0.1) {
    recommendation = 'spot';
    reasons.push('Horizon pendek (≤1 minggu)');
    reasons.push('Volatilitas rendah (<10%)');
    confidence = 0.9;
  }
  // Rule 2: Fixed for medium horizon and low-medium volatility
  else if (horizonWeeks <= 4 && volatility30d < 0.15) {
    recommendation = 'fixed';
    reasons.push('Horizon menengah (2-4 minggu)');
    reasons.push(`Volatilitas ${volatility30d < 0.1 ? 'rendah' : 'sedang'}`);
    if (volume > 500) {
      reasons.push('Volume besar → diskon fixed lebih menguntungkan');
    }
    confidence = 0.85;
  }
  // Rule 3: Indexed for longer horizon or high volatility
  else if (horizonWeeks > 4 || volatility30d >= 0.15) {
    recommendation = 'indexed';
    if (volatility30d >= 0.15) {
      reasons.push('Volatilitas tinggi (≥15%) → risiko harga berubah besar');
    }
    if (horizonWeeks > 4) {
      reasons.push('Horizon panjang (>4 minggu) → perlu fleksibilitas');
    }
    reasons.push('Floor/ceiling melindungi kedua pihak');
    confidence = volatility30d >= 0.2 ? 0.95 : 0.8;
  }
  // Rule 4: Risk appetite adjustment
  else {
    if (riskAppetite === 'low') {
      recommendation = 'fixed';
      reasons.push('Risk appetite rendah → fixed lebih aman');
      confidence = 0.75;
    } else if (riskAppetite === 'high') {
      recommendation = 'indexed';
      reasons.push('Risk appetite tinggi → indexed untuk potensi keuntungan');
      confidence = 0.7;
    } else {
      recommendation = 'fixed';
      reasons.push('Risk appetite sedang → fixed untuk balance');
      confidence = 0.7;
    }
  }

  // Volume-based adjustment
  if (volume > 1000 && recommendation !== 'indexed') {
    reasons.push('Volume besar → pertimbangkan diskon tier');
  }

  return {
    recommendation,
    confidence,
    reasons,
    alternatives: generateAlternatives(input, recommendation),
  };
}

/**
 * Generate alternative recommendations
 */
function generateAlternatives(
  input: DealAdvisorInput,
  primary: 'spot' | 'fixed' | 'indexed'
): Array<{ model: 'spot' | 'fixed' | 'indexed'; reason: string }> {
  const alternatives: Array<{ model: 'spot' | 'fixed' | 'indexed'; reason: string }> = [];

  if (primary !== 'fixed' && input.horizonWeeks <= 4) {
    alternatives.push({
      model: 'fixed',
      reason: 'Harga tetap 4 minggu cocok jika ingin stabilitas',
    });
  }

  if (primary !== 'indexed' && input.volatility30d >= 0.1) {
    alternatives.push({
      model: 'indexed',
      reason: 'Indexed dengan floor/ceiling melindungi dari fluktuasi',
    });
  }

  if (primary !== 'spot' && input.horizonWeeks <= 1) {
    alternatives.push({
      model: 'spot',
      reason: 'Spot untuk transaksi sekali atau horizon sangat pendek',
    });
  }

  return alternatives;
}

/**
 * Calculate volatility from price history (mock)
 */
export function calculateVolatility30d(priceHistory: number[]): number {
  if (priceHistory.length < 2) return 0.1; // default low volatility

  // Calculate standard deviation of percentage changes
  const changes: number[] = [];
  for (let i = 1; i < priceHistory.length; i++) {
    const change = (priceHistory[i] - priceHistory[i - 1]) / priceHistory[i - 1];
    changes.push(Math.abs(change));
  }

  const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;
  return Math.min(1, avgChange * 10); // normalize to 0-1 range
}

