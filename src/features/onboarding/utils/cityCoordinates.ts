/**
 * City Coordinates for Sumatera Barat
 * Koordinat default untuk setiap kabupaten/kota
 */

export interface CityCoordinate {
  name: string;
  lat: number;
  lng: number;
}

export const cityCoordinates: Record<string, CityCoordinate> = {
  'Padang': {
    name: 'Padang',
    lat: -0.94924,
    lng: 100.35427,
  },
  'Bukittinggi': {
    name: 'Bukittinggi',
    lat: -0.305556,
    lng: 100.369167,
  },
  'Solok': {
    name: 'Solok',
    lat: -0.801667,
    lng: 100.656944,
  },
  'Payakumbuh': {
    name: 'Payakumbuh',
    lat: -0.219167,
    lng: 100.630833,
  },
  'Padang Panjang': {
    name: 'Padang Panjang',
    lat: -0.466667,
    lng: 100.416667,
  },
  'Sawahlunto': {
    name: 'Sawahlunto',
    lat: -0.680833,
    lng: 100.776389,
  },
  'Pariaman': {
    name: 'Pariaman',
    lat: -0.626667,
    lng: 100.118333,
  },
  'Agam': {
    name: 'Agam',
    lat: -0.3,
    lng: 100.2,
  },
  'Pesisir Selatan': {
    name: 'Pesisir Selatan',
    lat: -1.35,
    lng: 100.55,
  },
  'Sijunjung': {
    name: 'Sijunjung',
    lat: -1.2,
    lng: 100.8,
  },
  'Tanah Datar': {
    name: 'Tanah Datar',
    lat: -0.45,
    lng: 100.6,
  },
  'Padang Pariaman': {
    name: 'Padang Pariaman',
    lat: -0.6,
    lng: 100.3,
  },
  'Pasaman': {
    name: 'Pasaman',
    lat: 0.15,
    lng: 100.1,
  },
  'Pasaman Barat': {
    name: 'Pasaman Barat',
    lat: 0.05,
    lng: 99.85,
  },
  'Mentawai': {
    name: 'Mentawai',
    lat: -1.5,
    lng: 99.0,
  },
  'Dharmasraya': {
    name: 'Dharmasraya',
    lat: -1.05,
    lng: 101.55,
  },
  'Solok Selatan': {
    name: 'Solok Selatan',
    lat: -1.0,
    lng: 101.1,
  },
  'Kepulauan Mentawai': {
    name: 'Kepulauan Mentawai',
    lat: -2.0,
    lng: 99.5,
  },
};

/**
 * Get coordinates for a city
 */
export function getCityCoordinates(cityName: string): CityCoordinate | null {
  return cityCoordinates[cityName] || null;
}

/**
 * Get default center coordinates (Padang)
 */
export function getDefaultCoordinates(): CityCoordinate {
  return cityCoordinates['Padang'];
}

