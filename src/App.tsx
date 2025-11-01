import { Provider } from '@/components/ui/provider';
import { OceanBackground } from './components/layout/OceanBackground';
import { AppRouter } from './router';

/**
 * Main App Component
 * - Wraps entire app with Provider for Chakra UI
 * - Uses OceanBackground for glassmorphism theme
 * - Router handles all page navigation
 */
function App() {
  return (
    <Provider>
      <OceanBackground>
        <AppRouter />
      </OceanBackground>
    </Provider>
  );
}

export default App;
