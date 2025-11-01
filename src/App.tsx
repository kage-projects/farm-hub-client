import { Provider } from '@/components/ui/provider';
import { OceanBackground } from './components/layout/OceanBackground';
import { AppRouter } from './router';
import { useAuthInitializer } from './hooks/useAuthInitializer';

/**
 * Main App Component
 * - Wraps entire app with Provider for Chakra UI
 * - Uses OceanBackground for glassmorphism theme
 * - Router handles all page navigation
 * - Initializes auth state from storage
 */
function App() {
  // Initialize auth state from localStorage on app load
  useAuthInitializer();

  return (
    <Provider>
      <OceanBackground>
        <AppRouter />
      </OceanBackground>
    </Provider>
  );
}

export default App;
