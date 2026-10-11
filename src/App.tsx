import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import GhatsPage from '@/pages/GhatsPage';
import GhatDetailPage from '@/pages/GhatDetailPage';
import RecommendationPage from '@/pages/RecommendationPage';
import SafetyPage from '@/pages/SafetyPage';
import PujasPage from '@/pages/PujasPage';
import FoodPage from '@/pages/FoodPage';
import CrowdMapPage from '@/pages/CrowdMapPage';
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-cream">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/ghats" element={<GhatsPage />} />
              <Route path="/ghats/:id" element={<GhatDetailPage />} />
              <Route path="/crowd-map" element={<CrowdMapPage />} />
              <Route path="/recommendation" element={<RecommendationPage />} />
              <Route path="/safety" element={<SafetyPage />} />
              <Route path="/pujas" element={<PujasPage />} />
              <Route path="/food" element={<FoodPage />} />
              <Route path="/pilgrim/login" element={<LoginPage />} />
              <Route path="/pilgrim/dashboard" element={<DashboardPage />} />
              <Route path="/login" element={<Navigate to="/pilgrim/login" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
