/**
 * Google Maps API Loader Utility
 * Ensures Google Maps JavaScript API is loaded only once
 */

declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options?: any) => any;
        Marker: new (options?: any) => any;
        InfoWindow: new (options?: any) => any;
        LatLngBounds: new () => any;
        LatLng: new (lat: number, lng: number) => any;
        SymbolPath: {
          CIRCLE: any;
        };
        places: {
          PlacesService: new (map: any) => any;
          PlacesServiceStatus: {
            OK: string;
            ZERO_RESULTS: string;
            [key: string]: string;
          };
        };
        event: {
          addListener: (instance: any, eventName: string, handler: (e: any) => void) => void;
          removeListener: (instance: any, eventName: string, handler: (e: any) => void) => void;
          trigger: (instance: any, eventName: string, ...args: any[]) => void;
        };
      };
    };
  }
}

let loadingPromise: Promise<void> | null = null;
let isLoaded = false;

/**
 * Load Google Maps JavaScript API
 * Returns a promise that resolves when API is loaded
 * Will only load once, even if called multiple times
 */
export const loadGoogleMapsAPI = (): Promise<void> => {
  // If already loaded, return resolved promise
  if (isLoaded && window.google?.maps) {
    return Promise.resolve();
  }

  // If currently loading, return the existing promise
  if (loadingPromise) {
    return loadingPromise;
  }

  // Check if script already exists in DOM
  const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
  if (existingScript) {
    // Script exists but might not be loaded yet
    loadingPromise = new Promise((resolve) => {
      const checkLoaded = () => {
        if (window.google?.maps) {
          isLoaded = true;
          loadingPromise = null;
          resolve();
        } else {
          // Wait a bit and check again
          existingScript.addEventListener('load', () => {
            isLoaded = true;
            loadingPromise = null;
            resolve();
          });
          existingScript.addEventListener('error', () => {
            loadingPromise = null;
            resolve(); // Resolve anyway to avoid hanging
          });
        }
      };
      checkLoaded();
    });
    return loadingPromise;
  }

  // Create new script and load
  loadingPromise = new Promise((resolve, reject) => {
    const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY';
    const script = document.createElement('script');
    // Use callback parameter for async loading best practice
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.id = 'google-maps-script'; // Add ID to prevent duplicate

    script.onload = () => {
      isLoaded = true;
      loadingPromise = null;
      resolve();
    };

    script.onerror = () => {
      loadingPromise = null;
      const error = new Error('Failed to load Google Maps API');
      console.error(error);
      reject(error);
    };

    document.head.appendChild(script);
  });

  return loadingPromise;
};

/**
 * Check if Google Maps API is loaded
 */
export const isGoogleMapsLoaded = (): boolean => {
  return isLoaded && !!window.google?.maps;
};

