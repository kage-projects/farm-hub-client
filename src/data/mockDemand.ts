/**
 * Mock demand data
 * - Buyer demand postings
 * - Matching dengan harvest schedule
 */

export type DemandStatus = 'open' | 'matched' | 'fulfilled' | 'cancelled';

export interface DemandPosting {
  id: string;
  buyerName: string;
  buyerType: 'penadah' | 'umkm' | 'restoran' | 'distributor';
  item: {
    species: string;
    minWeight: number; // grams
    maxWeight?: number; // grams (optional)
    quantity: number; // kg
  };
  preferredDate: Date;
  flexibleWindow: number; // days (±)
  maxPrice: number; // IDR per kg
  location: {
    address: string;
    coordinates: { lat: number; lng: number };
  };
  status: DemandStatus;
  createdAt: Date;
  matchedHarvestId?: string;
}

export const mockDemands: DemandPosting[] = [
  {
    id: 'd1',
    buyerName: 'Toko Ikan Segar Padang',
    buyerType: 'penadah',
    item: {
      species: 'lele',
      minWeight: 100,
      maxWeight: 150,
      quantity: 500, // kg
    },
    preferredDate: new Date(Date.now() + 10 * 7 * 24 * 60 * 60 * 1000), // 10 weeks from now
    flexibleWindow: 14, // ±14 days
    maxPrice: 28000,
    location: {
      address: 'Pasar Raya Padang, Sumatra Barat',
      coordinates: { lat: -0.94924, lng: 100.35427 },
    },
    status: 'open',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
  },
  {
    id: 'd2',
    buyerName: 'Restoran Seafood Makmur',
    buyerType: 'restoran',
    item: {
      species: 'nila',
      minWeight: 200,
      maxWeight: 300,
      quantity: 200, // kg
    },
    preferredDate: new Date(Date.now() + 12 * 7 * 24 * 60 * 60 * 1000), // 12 weeks
    flexibleWindow: 7,
    maxPrice: 32000,
    location: {
      address: 'Jl. Sudirman, Padang, Sumatra Barat',
      coordinates: { lat: -0.94924, lng: 100.35427 },
    },
    status: 'open',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 'd3',
    buyerName: 'Distributor Ikan Fresh',
    buyerType: 'distributor',
    item: {
      species: 'patin',
      minWeight: 250,
      maxWeight: 400,
      quantity: 1000, // kg
    },
    preferredDate: new Date(Date.now() + 16 * 7 * 24 * 60 * 60 * 1000), // 16 weeks
    flexibleWindow: 21,
    maxPrice: 35000,
    location: {
      address: 'Gudang Distribusi, Padang, Sumatra Barat',
      coordinates: { lat: -0.94924, lng: 100.35427 },
    },
    status: 'open',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
];

/**
 * Match harvest date dengan demand postings
 */
export function matchHarvestToDemand(
  harvestDate: Date,
  species: string,
  quantity: number,
  flexibleDays: number = 7
): DemandPosting[] {
  return mockDemands.filter((demand) => {
    // Match species
    if (demand.item.species !== species) return false;
    
    // Match quantity (demand harus >= harvest quantity atau bisa partial)
    if (demand.item.quantity < quantity * 0.5) return false; // minimum 50% match
    
    // Match date within flexible window
    const demandEarliest = new Date(demand.preferredDate);
    demandEarliest.setDate(demandEarliest.getDate() - demand.flexibleWindow);
    const demandLatest = new Date(demand.preferredDate);
    demandLatest.setDate(demandLatest.getDate() + demand.flexibleWindow);
    
    const harvestEarliest = new Date(harvestDate);
    harvestEarliest.setDate(harvestEarliest.getDate() - flexibleDays);
    const harvestLatest = new Date(harvestDate);
    harvestLatest.setDate(harvestLatest.getDate() + flexibleDays);
    
    // Check if date ranges overlap
    const datesOverlap = 
      (harvestEarliest <= demandLatest && harvestLatest >= demandEarliest);
    
    // Only open demands
    return demand.status === 'open' && datesOverlap;
  });
}


