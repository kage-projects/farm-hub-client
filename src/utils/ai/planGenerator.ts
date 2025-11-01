/**
 * AI Plan Generator
 * - Input: lokasi, modal, luas_lahan, jenis_ikan
 * - Output: 3 plans (Utama, Aman, Agresif)
 * - Integrates: risk calculator, ROI calculator, ETP, supplier recommender, deal advisor
 */

import type { SpeciesType } from '../onboarding/pondLayout';
import { calculatePondLayout } from '../onboarding/pondLayout';
import { calculateRiskScore } from './riskCalculator';
import { calculateROI, generateThreeScenarios, type ROIParameters } from '../onboarding/roiCalculator';
import { calculateETP, getHarvestWindow } from '../harvest/etpCalculator';
import { recommendSuppliers } from './recommender';
import { recommendPriceModel, calculateVolatility30d } from './dealAdvisor';
import { mockSuppliers } from '../../data/mockSuppliers';

export interface PlanInput {
  lokasi: string; // kecamatan/kota atau koordinat
  modal: number; // rupiah
  luas_lahan: number; // m²
  jenis_ikan: SpeciesType;
  coordinates?: { lat: number; lng: number }; // optional, for distance calculation
}

export interface PondLayout {
  jumlah_kolam: number;
  ukuran_per_kolam: string;
  kedalaman_default: string;
  alasan_pemilihan: string;
}

export interface PlanBiaya {
  benih: number;
  pakan: number;
  obat_utilitas: number;
  ongkir: number;
  total: number;
}

export interface PlanHasil {
  ROI: number; // percentage
  BEP_perkg: number; // rupiah per kg
}

export interface PlanRisiko {
  score_0_100: number;
  label: 'Rendah' | 'Sedang' | 'Tinggi';
  alasan_top3: string[];
  components?: {
    tightCashflow: number; // 0-30
    biayaPakanFCR: number; // 0-25
    kepadatan: number; // 0-15
    aksesPasar: number; // 0-15
    supplierQC: number; // 0-15
  };
}

export interface SaranHargaPakan {
  model: 'fixed_4w' | 'indexed';
  alasan: string;
}

export interface SupplierTop3 {
  id: string;
  jarak_km: number;
  badge: string[];
  alasan: string[];
}

export interface PlanAssumption {
  FCR_default: number;
  SR_default: number;
  harga_pakan_perkg: number;
  harga_jual_perkg: number;
  catatan: string;
}

export interface Plan {
  variant: 'utama' | 'aman' | 'agresif';
  layout_kolam: PondLayout;
  kapasitas_tebar: number; // ekor total
  siklus_panen: {
    minggu: number;
    hari: number;
    ETP: string; // ISO date
    window_days: [number, number]; // [earliest_offset, latest_offset]
  };
  pakan_total_kg: number;
  biaya: PlanBiaya;
  pendapatan: number;
  hasil: PlanHasil;
  risiko: PlanRisiko;
  saran_harga_pakan: SaranHargaPakan;
  supplier_top3: SupplierTop3[];
  assumption_log: PlanAssumption;
}

export interface PlanGenerationResult {
  plans: Plan[];
  input: PlanInput;
}

/**
 * Generate 3 plans (Utama, Aman, Agresif) from 4 simple inputs
 */
export function generatePlans(input: PlanInput): PlanGenerationResult {
  try {
    const { lokasi, modal, luas_lahan, jenis_ikan, coordinates } = input;

    // Validate inputs
    if (!lokasi || !modal || !luas_lahan || !jenis_ikan) {
      throw new Error('Input tidak lengkap');
    }

    if (modal <= 0 || luas_lahan <= 0) {
      throw new Error('Modal dan luas lahan harus lebih dari 0');
    }

    if (!['lele', 'nila', 'gurame'].includes(jenis_ikan)) {
      throw new Error('Jenis ikan tidak valid');
    }

    // 1. Calculate pond layout (auto-inferred)
    const layout = calculatePondLayout(luas_lahan, jenis_ikan);

  // 2. Set defaults based on species
  let fcr = 1.3;
  let sr = 0.8;
  let hargaPakanPerKg = 11000;
  let hargaJualPerKg = 28000;
  let seedPricePerFish = 300;
  let targetWeight = 110; // grams
  let otherCosts = 1800000;
  let freightCost = 500000;

  if (jenis_ikan === 'lele') {
    fcr = 1.2;
    sr = 0.85;
    hargaPakanPerKg = 11000;
    hargaJualPerKg = 28000;
    seedPricePerFish = 300;
    targetWeight = 110;
    otherCosts = 1800000;
    freightCost = 500000;
  } else if (jenis_ikan === 'nila') {
    fcr = 1.5;
    sr = 0.80;
    hargaPakanPerKg = 12000;
    hargaJualPerKg = 32000;
    seedPricePerFish = 500;
    targetWeight = 200;
    otherCosts = 2000000;
    freightCost = 600000;
  } else if (jenis_ikan === 'gurame') {
    fcr = 1.8;
    sr = 0.75;
    hargaPakanPerKg = 13000;
    hargaJualPerKg = 35000;
    seedPricePerFish = 600;
    targetWeight = 850;
    otherCosts = 2500000;
    freightCost = 700000;
  }

  // 3. Calculate ETP (Estimated Time to Proper Size) - targetWeight sudah di-set di atas
  const startDate = new Date();
  const etpResult = calculateETP({
    species: jenis_ikan,
    startingWeight: 5,
    targetWeight,
    startDate,
  });
  const harvestWindow = getHarvestWindow(etpResult);

  // 4. Get supplier recommendations
  const userLocation = coordinates || { lat: -0.94924, lng: 100.35427 }; // default Padang
  const suppliers = recommendSuppliers(
    mockSuppliers.filter(s => s.category === 'bibit' || s.category === 'pakan'),
    userLocation,
    undefined,
    3
  );

  // 5. Calculate volatility for price model recommendation (mock 30-day prices)
  const mockPriceHistory = Array.from({ length: 30 }, (_, i) => {
    const basePrice = hargaPakanPerKg;
    const variation = (Math.random() - 0.5) * 0.1; // ±5% variation
    return basePrice * (1 + variation);
  });
  const volatility = calculateVolatility30d(mockPriceHistory);
  const horizonWeeks = Math.ceil(etpResult.estimatedWeeks);

  // 6. Recommend price model
  const priceModelRec = recommendPriceModel({
    item: 'pakan',
    horizonWeeks,
    volatility30d: volatility,
    volume: 500, // default volume estimate
    riskAppetite: 'medium',
  });

  // 7. Generate 3 variants with different stocking densities
  const baseDensity = jenis_ikan === 'lele' ? 80 : jenis_ikan === 'nila' ? 30 : 12; // ekor per m²
  const variants: Array<{ name: 'utama' | 'aman' | 'agresif'; densityMultiplier: number }> = [
    { name: 'utama', densityMultiplier: 1.0 },
    { name: 'aman', densityMultiplier: 0.85 }, // -15%
    { name: 'agresif', densityMultiplier: 1.15 }, // +15%
  ];

  const plans: Plan[] = variants.map((variant) => {
    const stockingDensity = Math.round(baseDensity * variant.densityMultiplier);
    const kapasitasTebar = Math.round(stockingDensity * layout.totalLuasKolam);

    // Calculate ROI parameters
    const roiParams: ROIParameters = {
      stockingDensity,
      surfaceArea: layout.totalLuasKolam,
      sr,
      fcr,
      feedPricePerKg: hargaPakanPerKg,
      seedPricePerFish,
      sellingPricePerKg: hargaJualPerKg,
      averageWeightAtHarvest: targetWeight,
      otherCosts,
      freightCost,
    };

    // Adjust for variant
    let adjustedSr = sr;
    let adjustedFcr = fcr;
    let adjustedSellingPrice = hargaJualPerKg;
    let adjustedFeedPrice = hargaPakanPerKg;

    if (variant.name === 'aman') {
      adjustedSr = sr * 0.95; // -5%
      adjustedFcr = fcr * 1.05; // +5%
      adjustedSellingPrice = hargaJualPerKg * 0.95; // -5%
    } else if (variant.name === 'agresif') {
      adjustedSr = sr * 1.05; // +5%
      adjustedFcr = fcr * 0.95; // -5%
      adjustedSellingPrice = hargaJualPerKg * 1.05; // +5%
    }

    const roiParamsAdjusted: ROIParameters = {
      ...roiParams,
      sr: adjustedSr,
      fcr: adjustedFcr,
      sellingPricePerKg: adjustedSellingPrice,
      feedPricePerKg: adjustedFeedPrice,
    };

    // Calculate actual values
    const totalFish = kapasitasTebar;
    const survivedFish = Math.floor(totalFish * adjustedSr);
    const totalBiomass = (survivedFish * targetWeight) / 1000; // kg
    const pakanTotalKg = totalBiomass * adjustedFcr;

    const biayaBenih = totalFish * seedPricePerFish;
    const biayaPakan = pakanTotalKg * adjustedFeedPrice;
    const biayaObatUtilitas = otherCosts; // Already set based on species above
    const ongkirEstimate = totalBiomass * 2000; // estimate Rp 2000/kg ongkir
    const biayaTotal = biayaBenih + biayaPakan + biayaObatUtilitas + ongkirEstimate;

    const pendapatan = totalBiomass * adjustedSellingPrice;
    const profit = pendapatan - biayaTotal;
    const roi = biayaTotal > 0 ? (profit / biayaTotal) * 100 : 0;
    const bepPerKg = totalBiomass > 0 ? biayaTotal / totalBiomass : 0;

    // Calculate risk score
    const recommendedMax = jenis_ikan === 'lele' ? 100 : jenis_ikan === 'nila' ? 50 : 20;
    const jarakPasar = 15; // default, bisa dari coordinates
    const supplierScore = suppliers[0]?.score.totalScore || 0.7;

    const riskResult = calculateRiskScore({
      modal,
      biayaTotal,
      siklusPanen: etpResult.estimatedDays,
      pakanTotal: pakanTotalKg,
      biayaPakan,
      fcr: adjustedFcr,
      kepadatanTebar: stockingDensity,
      recommendedMax,
      luasLahan: luas_lahan,
      jarakPasar,
      ongkir: 2000,
      supplierScore,
    });

    // Format supplier top 3
    const supplierTop3: SupplierTop3[] = suppliers.slice(0, 3).map((rec, idx) => {
      const badges: string[] = [];
      if (rec.supplier.certification.hasCertification) {
        badges.push('Terverifikasi');
      }
      if (rec.supplier.sla.onTimePercentage >= 0.95) {
        badges.push(`On-time ${(rec.supplier.sla.onTimePercentage * 100).toFixed(0)}%`);
      }
      if (rec.supplier.priceStability >= 0.85) {
        badges.push('Harga stabil');
      }

      const alasan: string[] = [];
      if (rec.distance < 20) {
        alasan.push(`dekat ${rec.distance.toFixed(1)} km`);
      }
      if (rec.supplier.priceStability >= 0.85) {
        alasan.push('harga stabil');
      }
      if (rec.supplier.rating >= 4.5) {
        alasan.push('rating tinggi');
      }

      return {
        id: rec.supplier.id,
        jarak_km: Math.round(rec.distance),
        badge: badges,
        alasan,
      };
    });

    // Price model recommendation (map to fixed_4w or indexed)
    const saranHargaPakan: SaranHargaPakan = {
      model: priceModelRec.recommendation === 'fixed' ? 'fixed_4w' : 'indexed',
      alasan: priceModelRec.reasons.join('; '),
    };

    return {
      variant: variant.name,
      layout_kolam: {
        jumlah_kolam: layout.jumlah_kolam,
        ukuran_per_kolam: layout.ukuran_per_kolam,
        kedalaman_default: layout.kedalaman_default,
        alasan_pemilihan: layout.alasan_pemilihan,
      },
      kapasitas_tebar: kapasitasTebar,
      siklus_panen: {
        minggu: etpResult.estimatedWeeks,
        hari: etpResult.estimatedDays,
        ETP: etpResult.estimatedDate.toISOString().split('T')[0],
        window_days: [
          Math.floor((harvestWindow.earliest.getTime() - etpResult.estimatedDate.getTime()) / (1000 * 60 * 60 * 24)),
          Math.floor((harvestWindow.latest.getTime() - etpResult.estimatedDate.getTime()) / (1000 * 60 * 60 * 24)),
        ],
      },
      pakan_total_kg: Math.round(pakanTotalKg),
      biaya: {
        benih: biayaBenih,
        pakan: biayaPakan,
        obat_utilitas: biayaObatUtilitas,
        ongkir: ongkirEstimate,
        total: biayaTotal,
      },
      pendapatan: Math.round(pendapatan),
      hasil: {
        ROI: Math.round(roi * 100) / 100,
        BEP_perkg: Math.round(bepPerKg),
      },
      risiko: {
        score_0_100: riskResult.score,
        label: riskResult.label,
        alasan_top3: riskResult.alasanTop3,
        components: riskResult.components, // Include full breakdown
      },
      saran_harga_pakan: saranHargaPakan,
      supplier_top3: supplierTop3,
      assumption_log: {
        FCR_default: adjustedFcr,
        SR_default: adjustedSr,
        harga_pakan_perkg: adjustedFeedPrice,
        harga_jual_perkg: adjustedSellingPrice,
        catatan: `Nilai default berdasarkan data lokal ${lokasi}. FCR dan SR dapat bervariasi tergantung kondisi lapangan.`,
      },
    };
  });

    return {
      plans,
      input,
    };
  } catch (error) {
    console.error('Error in generatePlans:', error);
    throw error; // Re-throw untuk ditangani di caller
  }
}

