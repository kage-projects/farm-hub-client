/**
 * Google Maps Places API Service
 * For fetching nearby places using Places API Nearby Search
 * 
 * Menggunakan backend endpoint untuk keamanan API key dan best practices.
 */

// Hardcoded base URL untuk fetch-suppliers endpoint
const FETCH_SUPPLIERS_BASE_URL = 'http://localhost:5000/api';

// Backend API Response Types
interface BackendSupplierResponse {
  id: string;
  namaToko: string;
  alamat: string;
  lat: string; // number as string
  lang: string; // number as string
  noHp?: string;
  rating?: number;
}

interface BackendSuppliersApiResponse {
  success: boolean;
  count: number;
  data: BackendSupplierResponse[];
}

/**
 * Supplier Location Interface
 */
export interface SupplierLocation {
  id: string;
  name: string;
  type: 'bibit' | 'pakan' | 'pasar' | 'peralatan';
  address: string;
  coordinates?: { lat: number; lng: number };
  distance?: string;
  contact?: string;
  rating?: number;
}

/**
 * Convert backend supplier response to SupplierLocation format
 */
const convertBackendSupplierToSupplierLocation = (
  supplier: BackendSupplierResponse,
  type: SupplierLocation['type'],
  centerLocation?: { lat: number; lng: number }
): SupplierLocation => {
  const lat = parseFloat(supplier.lat);
  const lng = parseFloat(supplier.lang);
  const coordinates = !isNaN(lat) && !isNaN(lng) ? { lat, lng } : undefined;

  // Calculate distance if center location is provided
  let distance: string | undefined;
  if (coordinates && centerLocation) {
    const dist = calculateDistance(
      centerLocation.lat,
      centerLocation.lng,
      coordinates.lat,
      coordinates.lng
    );
    distance = dist < 1 ? `${Math.round(dist * 1000)} m` : `${dist.toFixed(1)} km`;
  }

  return {
    id: supplier.id,
    name: supplier.namaToko,
    type,
    address: supplier.alamat || 'Alamat tidak tersedia',
    coordinates,
    distance,
    contact: supplier.noHp,
    rating: supplier.rating,
  };
};

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Map supplier type to tipeProduk parameter for backend API
 */
const mapTypeToTipeProduk = (type: SupplierLocation['type']): string => {
  const mapping: Record<SupplierLocation['type'], string> = {
    bibit: 'bibit',
    pakan: 'pakan',
    pasar: 'pasar',
    peralatan: 'peralatan',
  };
  return mapping[type] || type;
};

/**
 * Search suppliers by type and location using backend API
 */
export const searchSuppliers = async (
  types: Array<{ type: SupplierLocation['type']; keyword: string }>,
  location: { lat: number; lng: number },
  _radius: number = 10000, // 10km default (not used by backend currently)
  jenisIkan?: string,
  kota?: string
): Promise<SupplierLocation[]> => {
  const allSuppliers: SupplierLocation[] = [];

  // Search for each type using backend endpoint
  for (const { type } of types) {
    try {
      const tipeProduk = mapTypeToTipeProduk(type);
      
      // Build query parameters
      const params: Record<string, string> = {
        tipeProduk: tipeProduk,
      };

      if (jenisIkan) {
        params.jenisIkan = jenisIkan.toLowerCase();
      }

      if (kota) {
        params.kota = kota;
      }

      // Build query string
      const queryParams = new URLSearchParams(params).toString();
      const url = `${FETCH_SUPPLIERS_BASE_URL}/fetch-suppliers?${queryParams}`;
      
      console.log('searchSuppliers: Calling fetch-suppliers dengan URL:', url);

      // Call backend API directly with fetch (hardcoded base URL)
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const suppliersData: BackendSuppliersApiResponse = await response.json();
      console.log('searchSuppliers: Response:', suppliersData);

      if (suppliersData?.success && suppliersData.data && Array.isArray(suppliersData.data)) {
        const suppliers = suppliersData.data.map((supplier: BackendSupplierResponse) =>
          convertBackendSupplierToSupplierLocation(supplier, type, location)
        );
        allSuppliers.push(...suppliers);
        console.log(`searchSuppliers: Found ${suppliers.length} suppliers untuk type ${type}`);
      } else {
        console.warn(`searchSuppliers: Tidak ada data atau format response tidak valid untuk type ${type}:`, suppliersData);
      }
    } catch (error) {
      console.error(`Error searching for ${type}:`, error);
    }
  }

  return allSuppliers;
};

