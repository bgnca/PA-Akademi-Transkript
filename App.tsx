
import React, { useState, useEffect } from 'react';
import UserWorkspace from './components/UserWorkspace';
import LandingPage from './components/LandingPage';
import AuthLogin from './components/AuthLogin';
import AdminPanel from './components/AdminPanel';
import PrivacySecurity from './components/PrivacySecurity';
import PublicPricing from './components/PublicPricing';
import SampleReportView from './components/SampleReportView';
import { TermsConditions, ContactPage } from './components/TermsContact';
import { User, PlanConfig } from './types';

// Default Plans Configuration
const DEFAULT_PLANS: PlanConfig[] = [
  {
    id: 'plan_starter',
    name: 'Giriş',
    type: 'Giriş',
    minutes: 300,
    price: '₺299',
    features: ['Aylık 300 Dakika', 'Temel Döküm', 'E-posta Desteği'],
    color: 'bg-blue-50 text-blue-600',
    icon: 'Zap'
  },
  {
    id: 'plan_standard',
    name: 'Standart',
    type: 'Standart',
    minutes: 500,
    price: '₺499',
    features: ['Aylık 500 Dakika', 'AI Seans Raporu', 'Öncelikli Destek', 'Düzenlenebilir Metin'],
    color: 'bg-indigo-50 text-indigo-600',
    icon: 'Star',
    recommended: true
  },
  {
    id: 'plan_pro',
    name: 'Gelişmiş',
    type: 'Gelişmiş',
    minutes: 2000,
    price: '₺1499',
    features: ['Aylık 2000 Dakika', 'Gelişmiş AI Analizi', '7/24 Canlı Destek', 'Sınırsız Arşiv'],
    color: 'bg-purple-50 text-purple-600',
    icon: 'Crown'
  }
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [view, setView] = useState<'landing' | 'login' | 'register' | 'privacy' | 'public_pricing' | 'sample_report' | 'terms' | 'contact'>('landing');
  
  // Centralized Plan State
  const [plans, setPlans] = useState<PlanConfig[]>(DEFAULT_PLANS);

  // Check for session persistence
  useEffect(() => {
    const savedUser = localStorage.getItem('psikoscribe_user_session');
    const savedPlans = localStorage.getItem('psikoscribe_plans');
    
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    if (savedPlans) {
      setPlans(JSON.parse(savedPlans));
    }
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('psikoscribe_user_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('psikoscribe_user_session');
    setView('landing');
  };

  const handleUpdatePlans = (newPlans: PlanConfig[]) => {
    setPlans(newPlans);
    localStorage.setItem('psikoscribe_plans', JSON.stringify(newPlans));
  };

  // --- ROUTING LOGIC ---

  // 1. Authenticated Routes
  if (currentUser) {
    if (currentUser.role === 'admin') {
      return (
        <AdminPanel 
          onLogout={handleLogout} 
          plans={plans}
          onUpdatePlans={handleUpdatePlans}
        />
      );
    }
    return (
      <UserWorkspace 
        user={currentUser} 
        onLogout={handleLogout} 
        plans={plans}
      />
    );
  }

  // 2. Public Routes
  switch (view) {
    case 'login':
    case 'register':
      return (
        <AuthLogin 
          onLoginSuccess={handleLoginSuccess} 
          onNavigateToRegister={() => setView('register')} 
        />
      );
    case 'privacy':
      return <PrivacySecurity onBack={() => setView('landing')} />;
    case 'public_pricing':
      return <PublicPricing plans={plans} onBack={() => setView('landing')} onRegister={() => setView('register')} />;
    case 'sample_report':
      return <SampleReportView onBack={() => setView('landing')} />;
    case 'terms':
      return <TermsConditions onBack={() => setView('landing')} />;
    case 'contact':
      return <ContactPage onBack={() => setView('landing')} />;
    case 'landing':
    default:
      return (
        <LandingPage 
          onLogin={() => setView('login')} 
          onRegister={() => setView('register')} 
          onViewPricing={() => setView('public_pricing')}
          onViewSample={() => setView('sample_report')}
          onViewPrivacy={() => setView('privacy')}
          onViewTerms={() => setView('terms')}
          onViewContact={() => setView('contact')}
        />
      );
  }
};

export default App;
