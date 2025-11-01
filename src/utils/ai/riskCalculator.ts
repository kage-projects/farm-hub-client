/**
 * Risk Score Calculator (0-100)
 * - 5 komponen berbobot
 * - Tight cashflow (30%), Biaya pakan & FCR (25%), Kepadatan (15%), Akses pasar (15%), Supplier QC (15%)
 */

export interface RiskCalculatorInput {
  modal: number; // rupiah
  biayaTotal: number; // rupiah (initial + operational until harvest)
  siklusPanen: number; // days
  pakanTotal: number; // kg
  biayaPakan: number; // rupiah
  fcr: number; // Feed Conversion Ratio
  kepadatanTebar: number; // fish per m²
  recommendedMax: number; // max recommended density for species
  luasLahan: number; // m²
  jarakPasar: number; // km
  ongkir: number; // rupiah per kg
  supplierScore: number; // 0-1 (from supplier scoring)
}

export interface RiskResult {
  score: number; // 0-100 (higher = more risky)
  label: 'Rendah' | 'Sedang' | 'Tinggi';
  alasanTop3: string[];
  components: {
    tightCashflow: number; // 0-30
    biayaPakanFCR: number; // 0-25
    kepadatan: number; // 0-15
    aksesPasar: number; // 0-15
    supplierQC: number; // 0-15
  };
}

/**
 * Calculate risk score based on 5 weighted components
 */
export function calculateRiskScore(input: RiskCalculatorInput): RiskResult {
  const components: RiskResult['components'] = {
    tightCashflow: 0,
    biayaPakanFCR: 0,
    kepadatan: 0,
    aksesPasar: 0,
    supplierQC: 0,
  };

  const alasan: Array<{ score: number; text: string }> = [];

  // 1. Tight cashflow (30%) - Check if modal cukup sampai panen
  const modalBuffer = input.modal - input.biayaTotal;
  const modalRatio = input.biayaTotal / input.modal;
  
  if (modalRatio > 1) {
    // Modal tidak cukup
    components.tightCashflow = 30;
    alasan.push({ score: 30, text: `Modal tidak mencukupi. Kekurangan: Rp ${(input.biayaTotal - input.modal).toLocaleString('id-ID')}` });
  } else if (modalRatio > 0.9) {
    components.tightCashflow = 25;
    alasan.push({ score: 25, text: 'Modal pas-pasan untuk menutup biaya hingga panen' });
  } else if (modalRatio > 0.8) {
    components.tightCashflow = 18;
    alasan.push({ score: 18, text: 'Modal cukup namun buffer terbatas' });
  } else if (modalRatio > 0.7) {
    components.tightCashflow = 10;
  } else {
    components.tightCashflow = 5;
  }

  // 2. Biaya pakan & FCR (25%)
  const pakanRatio = input.biayaPakan / input.biayaTotal;
  const fcrRisk = input.fcr > 1.8 ? 10 : input.fcr > 1.5 ? 6 : input.fcr > 1.3 ? 3 : 0;
  
  components.biayaPakanFCR = Math.min(25, Math.round(pakanRatio * 15) + fcrRisk);
  
  if (pakanRatio > 0.6) {
    alasan.push({ 
      score: components.biayaPakanFCR, 
      text: `Biaya pakan ${(pakanRatio * 100).toFixed(0)}% dari total; FCR ${input.fcr.toFixed(2)} (${input.fcr > 1.7 ? 'tinggi' : input.fcr > 1.4 ? 'sedang' : 'normal'})` 
    });
  } else if (fcrRisk > 5) {
    alasan.push({ 
      score: components.biayaPakanFCR, 
      text: `FCR tinggi (${input.fcr.toFixed(2)}) meningkatkan konsumsi pakan` 
    });
  }

  // 3. Kepadatan tebar & area (15%)
  const densityRatio = input.kepadatanTebar / input.recommendedMax;
  if (densityRatio > 1.2) {
    components.kepadatan = 15;
    alasan.push({ 
      score: 15, 
      text: `Kepadatan tebar ${Math.round(densityRatio * 100)}% dari rekomendasi maksimal (${input.recommendedMax} ekor/m²)` 
    });
  } else if (densityRatio > 1.0) {
    components.kepadatan = 10;
    alasan.push({ 
      score: 10, 
      text: `Kepadatan tebar di atas rekomendasi standar` 
    });
  } else if (densityRatio < 0.7) {
    components.kepadatan = 5;
    alasan.push({ 
      score: 5, 
      text: `Kepadatan tebar rendah - mungkin kurang optimal` 
    });
  } else {
    components.kepadatan = 2;
  }

  // 4. Akses pasar & ongkir (15%)
  let pasarRisk = 0;
  if (input.jarakPasar > 50) {
    pasarRisk = 15;
    alasan.push({ score: 15, text: `Jarak pasar ${input.jarakPasar} km menambah ongkir dan risiko distribusi` });
  } else if (input.jarakPasar > 30) {
    pasarRisk = 10;
    alasan.push({ score: 10, text: `Jarak pasar ${input.jarakPasar} km - ongkir perlu dipertimbangkan` });
  } else if (input.jarakPasar > 15) {
    pasarRisk = 6;
  } else {
    pasarRisk = 2;
  }

  const ongkirPerKg = input.ongkir;
  if (ongkirPerKg > 2000) {
    pasarRisk = Math.max(pasarRisk, 12);
    if (pasarRisk <= 6) {
      alasan.push({ score: 12, text: `Ongkir tinggi (Rp ${ongkirPerKg.toLocaleString('id-ID')}/kg) mempengaruhi margin` });
    }
  }

  components.aksesPasar = pasarRisk;

  // 5. Reputasi supplier & QC (15%)
  const supplierRisk = Math.round((1 - input.supplierScore) * 15);
  components.supplierQC = supplierRisk;
  
  if (supplierRisk > 10) {
    alasan.push({ 
      score: supplierRisk, 
      text: `Kualitas supplier rendah (score ${(input.supplierScore * 100).toFixed(0)}) - risiko QC dan on-time delivery` 
    });
  } else if (supplierRisk > 5) {
    alasan.push({ 
      score: supplierRisk, 
      text: `Supplier dengan track record sedang` 
    });
  }

  // Calculate total score
  const totalScore = Math.min(100, Math.round(
    components.tightCashflow +
    components.biayaPakanFCR +
    components.kepadatan +
    components.aksesPasar +
    components.supplierQC
  ));

  // Determine label
  let label: 'Rendah' | 'Sedang' | 'Tinggi';
  if (totalScore < 34) {
    label = 'Rendah';
  } else if (totalScore < 67) {
    label = 'Sedang';
  } else {
    label = 'Tinggi';
  }

  // Get top 3 reasons (sorted by score)
  const sortedReasons = alasan.sort((a, b) => b.score - a.score);
  const alasanTop3 = sortedReasons.slice(0, 3).map(r => r.text);

  // Fill with general reasons if less than 3
  if (alasanTop3.length < 3 && totalScore > 20) {
    if (totalScore > 50 && !alasanTop3.some(a => a.includes('modal'))) {
      alasanTop3.push('Perlu perhatian khusus pada manajemen modal dan cashflow');
    }
    if (totalScore > 40 && !alasanTop3.some(a => a.includes('pakan'))) {
      alasanTop3.push('Monitoring biaya pakan secara berkala direkomendasikan');
    }
  }

  return {
    score: totalScore,
    label,
    alasanTop3,
    components,
  };
}


