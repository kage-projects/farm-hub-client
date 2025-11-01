/**
 * Mock supplier data untuk demo
 * - Data historis untuk scoring
 * - Lokasi, rating, sertifikasi, SLA
 */

export type SupplierData = {
  id: string;
  name: string;
  category: 'bibit' | 'pakan' | 'obat' | 'logistik';
  location: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  certification: {
    hasCertification: boolean;
    type?: 'UPT' | 'mandiri';
  };
  sla: {
    averageDeliveryTime: number; // hours
    onTimePercentage: number; // 0-1
  };
  returnRate: number; // 0-1 (lower is better)
  priceStability: number; // 0-1 (higher is better, based on 30-day price variance)
  rating: number; // 0-5
  priceRange: {
    min: number;
    max: number;
    unit: string;
  };
  badges: string[]; // auto-calculated
  transactionCount: number;
};

export const mockSuppliers: SupplierData[] = [
  {
    id: 's1',
    name: 'Peternakan Ikan Lele Sumber Rezeki',
    category: 'bibit',
    location: {
      address: 'Jl. Raya Padang-Pariaman KM 12, Sumatera Barat',
      coordinates: { lat: -0.94924, lng: 100.35427 },
    },
    certification: {
      hasCertification: true,
      type: 'UPT',
    },
    sla: {
      averageDeliveryTime: 36,
      onTimePercentage: 0.96,
    },
    returnRate: 0.02,
    priceStability: 0.92,
    rating: 4.6,
    priceRange: {
      min: 250,
      max: 350,
      unit: 'per ekor',
    },
    badges: [],
    transactionCount: 245,
  },
  {
    id: 's2',
    name: 'Toko Pakan Ikan Makmur',
    category: 'pakan',
    location: {
      address: 'Jl. Ahmad Yani No. 45, Padang, Sumatera Barat',
      coordinates: { lat: -0.94924, lng: 100.35427 },
    },
    certification: {
      hasCertification: true,
      type: 'mandiri',
    },
    sla: {
      averageDeliveryTime: 24,
      onTimePercentage: 0.98,
    },
    returnRate: 0.01,
    priceStability: 0.88,
    rating: 4.8,
    priceRange: {
      min: 10500,
      max: 11500,
      unit: 'per kg',
    },
    badges: [],
    transactionCount: 512,
  },
  {
    id: 's3',
    name: 'Pasar Ikan Terpadu Padang',
    category: 'pakan',
    location: {
      address: 'Jl. Bung Hatta, Padang, Sumatera Barat',
      coordinates: { lat: -0.94924, lng: 100.35427 },
    },
    certification: {
      hasCertification: false,
    },
    sla: {
      averageDeliveryTime: 48,
      onTimePercentage: 0.85,
    },
    returnRate: 0.05,
    priceStability: 0.75,
    rating: 4.2,
    priceRange: {
      min: 10000,
      max: 12000,
      unit: 'per kg',
    },
    badges: [],
    transactionCount: 189,
  },
  {
    id: 's4',
    name: 'PT Peralatan Budidaya Indonesia',
    category: 'logistik',
    location: {
      address: 'Jl. Sudirman No. 88, Padang, Sumatera Barat',
      coordinates: { lat: -0.94924, lng: 100.35427 },
    },
    certification: {
      hasCertification: true,
      type: 'UPT',
    },
    sla: {
      averageDeliveryTime: 72,
      onTimePercentage: 0.92,
    },
    returnRate: 0.03,
    priceStability: 0.90,
    rating: 4.5,
    priceRange: {
      min: 50000,
      max: 200000,
      unit: 'per item',
    },
    badges: [],
    transactionCount: 156,
  },
  {
    id: 's5',
    name: 'UD Sumber Bibit Unggul',
    category: 'bibit',
    location: {
      address: 'Jl. Raya Bukittinggi-Padang, Sumatera Barat',
      coordinates: { lat: -0.94924, lng: 100.35427 },
    },
    certification: {
      hasCertification: true,
      type: 'mandiri',
    },
    sla: {
      averageDeliveryTime: 48,
      onTimePercentage: 0.94,
    },
    returnRate: 0.03,
    priceStability: 0.85,
    rating: 4.6,
    priceRange: {
      min: 280,
      max: 380,
      unit: 'per ekor',
    },
    badges: [],
    transactionCount: 198,
  },
  {
    id: 's6',
    name: 'Supplier Pakan Premium',
    category: 'pakan',
    location: {
      address: 'Jl. Gajah Mada No. 22, Padang, Sumatera Barat',
      coordinates: { lat: -0.94924, lng: 100.35427 },
    },
    certification: {
      hasCertification: true,
      type: 'UPT',
    },
    sla: {
      averageDeliveryTime: 18,
      onTimePercentage: 0.99,
    },
    returnRate: 0.005,
    priceStability: 0.95,
    rating: 4.9,
    priceRange: {
      min: 11000,
      max: 12500,
      unit: 'per kg',
    },
    badges: [],
    transactionCount: 678,
  },
  {
    id: 's7',
    name: 'Farm Supply Store',
    category: 'obat',
    location: {
      address: 'Jl. Merdeka No. 15, Padang, Sumatera Barat',
      coordinates: { lat: -0.94924, lng: 100.35427 },
    },
    certification: {
      hasCertification: true,
      type: 'mandiri',
    },
    sla: {
      averageDeliveryTime: 30,
      onTimePercentage: 0.93,
    },
    returnRate: 0.02,
    priceStability: 0.88,
    rating: 4.4,
    priceRange: {
      min: 50000,
      max: 500000,
      unit: 'per paket',
    },
    badges: [],
    transactionCount: 123,
  },
];

