import { Provider } from '@/components/ui/provider';
import { OceanBackground } from './components/layout/OceanBackground';
import { UIShowcase } from './pages/UIShowcase';

/**
 * Main App Component
 * - Wraps entire app with Provider for Chakra UI
 * - Uses OceanBackground for glassmorphism theme
 * - Displays UIShowcase page
 */
function App() {
  return (
    <Provider>
      <OceanBackground>
        <UIShowcase />
      </OceanBackground>
    </Provider>
  );
}

export default App;
