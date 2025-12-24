
import React, { useState } from 'react';
import { Users, DollarSign, Activity, Settings, LogOut, Search, ShieldAlert, BarChart3, UserCheck, Trash2, Edit, CreditCard, Save, Bell, CheckSquare, X, Mail, Package, Plus, Minus, Tag, Calendar, Check } from 'lucide-react';
import { User, PlanConfig, PlanType } from '../types';

interface AdminPanelProps {
  onLogout: () => void;
  plans: PlanConfig[];
  onUpdatePlans: (plans: PlanConfig[]) => void;
}

// Mock Data
const MOCK_USERS: User[] = [
  { id: '1', name: 'Dr. Ayşe Yılmaz', email: 'ayse@klinik.com', role: 'user', plan: 'Standart', joinedDate: '2023-01-15' },
  { id: '2', name: 'Psk. Mehmet Demir', email: 'mehmet@terapi.net', role: 'user', plan: 'Gelişmiş', joinedDate: '2023-02-20' },
  { id: '3', name: 'Klinik Psk. Zeynep Kaya', email: 'zeynep@mail.com', role: 'user', plan: 'Free', joinedDate: '2023-03-10' },
  { id: '4', name: 'Dr. Caner Erkin', email: 'caner@psiko.com', role: 'user', plan: 'Giriş', joinedDate: '2023-05-05' },
  { id: '5', name: 'Admin User', email: 'admin@psikolojiagi.com', role: 'admin', plan: 'Gelişmiş', joinedDate: '2022-01-01' },
];

const MOCK_TRANSACTIONS = [
    { id: 1, user: 'Dr. Ayşe Yılmaz', amount: '₺499', date: 'Bugün, 14:30', plan: 'Standart' },
    { id: 2, user: 'Psk. Mehmet Demir', amount: '₺1499', date: 'Dün, 09:15', plan: 'Gelişmiş' },
    { id: 3, user: 'Dr. Caner Erkin', amount: '₺299', date: '12 Ekim', plan: 'Giriş' },
];

type AdminTab = 'dashboard' | 'users' | 'finance' | 'settings' | 'packages';

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout, plans, onUpdatePlans }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal States
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = (id: string) => {
    if (confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) {
      setUsers(users.filter(u => u.id !== id));
      if (editingUser?.id === id) setEditingUser(null);
    }
  };

  const handleSaveUser = (updatedUser: User) => {
      setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
      setEditingUser(null);
      alert("Kullanıcı bilgileri güncellendi.");
  };

  const handleSendEmail = (e: React.FormEvent) => {
      e.preventDefault();
      alert(`E-posta gönderildi!\nKime: ${editingUser?.email}\nKonu: ${emailSubject}`);
      setShowEmailModal(false);
      setEmailSubject("");
      setEmailMessage("");
  };

  // --- PLAN MANAGEMENT FUNCTIONS ---

  const handleUpdatePlanField = (id: string, field: keyof PlanConfig, value: any) => {
      const updated = plans.map(p => p.id === id ? { ...p, [field]: value } : p);
      onUpdatePlans(updated);
  };

  const handleUpdateFeature = (planId: string, featureIndex: number, newValue: string) => {
      const updated = plans.map(p => {
          if (p.id === planId) {
              const newFeatures = [...p.features];
              newFeatures[featureIndex] = newValue;
              return { ...p, features: newFeatures };
          }
          return p;
      });
      onUpdatePlans(updated);
  };

  const handleAddFeature = (planId: string) => {
      const updated = plans.map(p => {
          if (p.id === planId) {
              return { ...p, features: [...p.features, "Yeni Özellik"] };
          }
          return p;
      });
      onUpdatePlans(updated);
  };

  const handleRemoveFeature = (planId: string, index: number) => {
       const updated = plans.map(p => {
          if (p.id === planId) {
              const newFeatures = p.features.filter((_, i) => i !== index);
              return { ...p, features: newFeatures };
          }
          return p;
      });
      onUpdatePlans(updated);
  };

  const handleCreatePlan = () => {
    const newPlan: PlanConfig = {
        id: `plan_${Date.now()}`,
        name: 'Yeni Paket',
        type: 'Custom',
        minutes: 100,
        price: '₺0',
        features: ['Özellik 1', 'Özellik 2'],
        color: 'bg-slate-50 text-slate-600',
        icon: 'Star'
    };
    onUpdatePlans([...plans, newPlan]);
  };

  const handleDeletePlan = (planId: string) => {
    if (confirm("Bu paketi silmek istediğinize emin misiniz?")) {
        onUpdatePlans(plans.filter(p => p.id !== planId));
    }
  };

  const handleUpdateCampaign = (planId: string, field: string, value: any) => {
      const updated = plans.map(p => {
          if (p.id === planId) {
              const currentCampaign = p.campaign || { active: false, discountText: '', validUntil: '' };
              return { ...p, campaign: { ...currentCampaign, [field]: value } };
          }
          return p;
      });
      onUpdatePlans(updated);
  };

  const handleSavePlan = (planName: string) => {
      // In a real app, this would make an API call.
      // Here we just simulate success feedback
      alert(`${planName} başarıyla güncellendi ve yayına alındı!`);
  };

  const NavButton = ({ tab, icon: Icon, label }: { tab: AdminTab, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveTab(tab)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm ${
        activeTab === tab 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20' 
          : 'text-slate-400 hover:text-white hover:bg-slate-800'
      }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col flex-shrink-0 h-screen sticky top-0">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-indigo-400" />
            Admin Panel
          </h1>
        </div>
        
        <nav className="flex-grow p-4 space-y-2">
          <NavButton tab="dashboard" icon={BarChart3} label="Genel Bakış" />
          <NavButton tab="users" icon={Users} label="Kullanıcılar" />
          <NavButton tab="packages" icon={Package} label="Paket Yönetimi" />
          <NavButton tab="finance" icon={DollarSign} label="Finansal Rapor" />
          <NavButton tab="settings" icon={Settings} label="Ayarlar" />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-red-400 transition-colors w-full px-4 py-2 text-sm font-medium"
          >
            <LogOut className="w-5 h-5" />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 overflow-y-auto h-screen relative">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">
                    {activeTab === 'dashboard' && 'Genel Bakış'}
                    {activeTab === 'users' && 'Kullanıcı Yönetimi'}
                    {activeTab === 'packages' && 'Paket & Ücretlendirme'}
                    {activeTab === 'finance' && 'Finansal Raporlar'}
                    {activeTab === 'settings' && 'Sistem Ayarları'}
                </h2>
                <p className="text-slate-500 text-sm">Hoş geldin, Admin. Sistem durumu stabil.</p>
            </div>
            <div className="flex items-center gap-4">
                <button className="p-2 text-slate-400 hover:bg-white hover:text-indigo-600 rounded-full transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    A
                </div>
            </div>
        </div>

        {/* --- VIEW: DASHBOARD --- */}
        {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-500 font-medium">Toplam Gelir</h3>
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                            <DollarSign className="w-5 h-5" />
                        </div>
                        </div>
                        <p className="text-3xl font-bold text-slate-900">₺45,250</p>
                        <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                        <Activity className="w-3 h-3" /> +12% bu ay
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-500 font-medium">Aktif Üyeler</h3>
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <Users className="w-5 h-5" />
                        </div>
                        </div>
                        <p className="text-3xl font-bold text-slate-900">1,240</p>
                        <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                        <UserCheck className="w-3 h-3" /> +54 yeni üye
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                        <h3 className="text-slate-500 font-medium">İşlenen Seans</h3>
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <Activity className="w-5 h-5" />
                        </div>
                        </div>
                        <p className="text-3xl font-bold text-slate-900">8,502</p>
                        <p className="text-sm text-slate-500 mt-1">Bugün: 142 seans</p>
                    </div>
                </div>
            </div>
        )}

        {/* --- VIEW: PACKAGES --- */}
        {activeTab === 'packages' && (
             <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                 <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                     <div className="flex items-center gap-2">
                         <Package className="w-6 h-6 text-indigo-600" />
                         <div>
                            <h3 className="text-xl font-bold text-slate-800">Üyelik Paketleri</h3>
                            <p className="text-sm text-slate-500">Tüm paketleri, özellikleri ve kampanyaları buradan yönetin.</p>
                         </div>
                     </div>
                     <button 
                        onClick={handleCreatePlan}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors"
                     >
                         <Plus className="w-4 h-4" /> Yeni Paket Oluştur
                     </button>
                 </div>

                 <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                     {plans.map((plan) => (
                         <div key={plan.id} className="border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden flex flex-col">
                             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                 <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${plan.color} bg-white border border-slate-200 shadow-sm`}>
                                        <Package className="w-5 h-5" />
                                    </div>
                                    <input 
                                        type="text" 
                                        value={plan.name} 
                                        onChange={(e) => handleUpdatePlanField(plan.id, 'name', e.target.value)}
                                        className="font-bold text-lg bg-transparent border-b border-transparent hover:border-slate-300 focus:border-indigo-500 outline-none w-40"
                                    />
                                 </div>
                                 <div className="flex items-center gap-2">
                                     <button 
                                        onClick={() => handleSavePlan(plan.name)}
                                        className="text-green-600 hover:bg-green-50 p-2 rounded-lg transition-colors flex items-center gap-1 text-sm font-bold"
                                        title="Değişiklikleri Kaydet"
                                     >
                                         <Save className="w-4 h-4" /> Kaydet
                                     </button>
                                     <button 
                                        onClick={() => handleDeletePlan(plan.id)}
                                        className="text-red-400 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                        title="Paketi Sil"
                                     >
                                         <Trash2 className="w-4 h-4" />
                                     </button>
                                 </div>
                             </div>
                             
                             <div className="p-6 space-y-6 flex-grow">
                                 {/* Basic Info */}
                                 <div className="grid grid-cols-2 gap-4">
                                     <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Fiyat (₺)</label>
                                        <input 
                                            type="text" 
                                            value={plan.price} 
                                            onChange={(e) => handleUpdatePlanField(plan.id, 'price', e.target.value)}
                                            className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                     </div>
                                     <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Dakika Limiti</label>
                                        <input 
                                            type="number" 
                                            value={plan.minutes} 
                                            onChange={(e) => handleUpdatePlanField(plan.id, 'minutes', parseInt(e.target.value))}
                                            className="w-full p-2 border border-slate-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                        />
                                     </div>
                                 </div>
                                 
                                 {/* Features */}
                                 <div>
                                     <div className="flex justify-between items-center mb-2">
                                         <label className="block text-xs font-bold text-slate-500 uppercase">Özellikler</label>
                                         <button 
                                            onClick={() => handleAddFeature(plan.id)}
                                            className="text-xs text-indigo-600 hover:text-indigo-800 flex items-center gap-1 font-medium"
                                         >
                                             <Plus className="w-3 h-3" /> Özellik Ekle
                                         </button>
                                     </div>
                                     <ul className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                         {plan.features.map((feature, idx) => (
                                             <li key={idx} className="flex gap-2 items-center group">
                                                 <span className="text-slate-400 text-xs w-4">{idx + 1}.</span>
                                                 <input 
                                                    type="text" 
                                                    value={feature}
                                                    onChange={(e) => handleUpdateFeature(plan.id, idx, e.target.value)}
                                                    className="w-full p-1.5 border border-slate-300 rounded text-sm focus:border-indigo-500 outline-none"
                                                 />
                                                 <button 
                                                    onClick={() => handleRemoveFeature(plan.id, idx)}
                                                    className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                 >
                                                     <X className="w-4 h-4" />
                                                 </button>
                                             </li>
                                         ))}
                                     </ul>
                                 </div>

                                 {/* Campaign Section */}
                                 <div className="bg-amber-50 rounded-lg p-4 border border-amber-100">
                                     <div className="flex items-center justify-between mb-3">
                                         <h4 className="text-sm font-bold text-amber-800 flex items-center gap-2">
                                             <Tag className="w-4 h-4" /> Kampanya Ayarları
                                         </h4>
                                         <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                checked={plan.campaign?.active || false} 
                                                onChange={(e) => handleUpdateCampaign(plan.id, 'active', e.target.checked)}
                                                className="sr-only peer" 
                                            />
                                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                                        </label>
                                     </div>

                                     {plan.campaign?.active && (
                                         <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-1">
                                             <div>
                                                 <label className="block text-[10px] font-bold text-amber-700 uppercase mb-1">İndirim Metni</label>
                                                 <input 
                                                    type="text" 
                                                    placeholder="%20 İndirim"
                                                    value={plan.campaign?.discountText || ''}
                                                    onChange={(e) => handleUpdateCampaign(plan.id, 'discountText', e.target.value)}
                                                    className="w-full p-2 border border-amber-200 rounded text-sm focus:ring-1 focus:ring-amber-500 outline-none"
                                                 />
                                             </div>
                                             <div>
                                                 <label className="block text-[10px] font-bold text-amber-700 uppercase mb-1">Bitiş Tarihi</label>
                                                 <input 
                                                    type="date" 
                                                    value={plan.campaign?.validUntil || ''}
                                                    onChange={(e) => handleUpdateCampaign(plan.id, 'validUntil', e.target.value)}
                                                    className="w-full p-2 border border-amber-200 rounded text-sm focus:ring-1 focus:ring-amber-500 outline-none"
                                                 />
                                             </div>
                                         </div>
                                     )}
                                 </div>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>
        )}

        {/* --- VIEW: USERS --- */}
        {activeTab === 'users' && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                <div className="p-6 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="İsim veya E-posta ara..." 
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                    </div>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-lg shadow-sm flex items-center gap-2">
                        <Plus className="w-4 h-4" /> Yeni Kullanıcı
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider text-xs">
                        <tr>
                        <th className="px-6 py-4">Kullanıcı</th>
                        <th className="px-6 py-4">Rol</th>
                        <th className="px-6 py-4">Paket</th>
                        <th className="px-6 py-4">Katılım Tarihi</th>
                        <th className="px-6 py-4 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-xs">
                                {user.name.charAt(0)}
                                </div>
                                <div>
                                <p className="font-medium text-slate-900">{user.name}</p>
                                <p className="text-slate-400 text-xs">{user.email}</p>
                                </div>
                            </div>
                            </td>
                            <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
                                {user.role.toUpperCase()}
                            </span>
                            </td>
                            <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded text-xs font-bold bg-slate-100 text-slate-600`}>
                                {user.plan}
                            </span>
                            </td>
                            <td className="px-6 py-4">{user.joinedDate}</td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    <button 
                                        onClick={() => setEditingUser(user)}
                                        className="text-slate-400 hover:text-indigo-600 p-2 rounded-full hover:bg-indigo-50 transition-colors"
                                        title="Düzenle / Detay"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteUser(user.id)}
                                        className="text-slate-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                                        title="Sil"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* --- VIEW: FINANCE --- */}
        {activeTab === 'finance' && (
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 animate-in fade-in slide-in-from-bottom-2">
                 <div className="flex items-center gap-4 mb-8">
                     <div className="p-3 bg-green-100 text-green-700 rounded-xl">
                         <DollarSign className="w-8 h-8" />
                     </div>
                     <div>
                         <h3 className="text-xl font-bold text-slate-800">Gelir Tablosu</h3>
                         <p className="text-slate-500">Aylık finansal akış özeti</p>
                     </div>
                 </div>
                 <div className="space-y-4">
                     {MOCK_TRANSACTIONS.map(t => (
                         <div key={t.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
                             <div>
                                 <p className="font-bold text-slate-700">{t.user}</p>
                                 <p className="text-xs text-slate-500">ID: #TRX-{9900+t.id}</p>
                             </div>
                             <div className="text-right">
                                 <p className="font-bold text-slate-800">{t.amount}</p>
                                 <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-bold">Ödendi</span>
                             </div>
                         </div>
                     ))}
                 </div>
             </div>
        )}

        {/* --- VIEW: SETTINGS --- */}
        {activeTab === 'settings' && (
             <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 animate-in fade-in slide-in-from-bottom-2 max-w-2xl">
                 <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                     <Settings className="w-5 h-5 text-slate-500" />
                     Sistem Yapılandırması
                 </h3>
                 <div className="space-y-6">
                     <div>
                         <label className="block text-sm font-bold text-slate-700 mb-2">Site Başlığı</label>
                         <input type="text" defaultValue="Psikoloji Ağı Transkript" className="w-full px-4 py-2 border border-slate-300 rounded-lg" />
                     </div>
                     <button className="flex items-center justify-center gap-2 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors">
                         <Save className="w-4 h-4" />
                         Ayarları Kaydet
                     </button>
                 </div>
             </div>
        )}

      </main>

      {/* --- MODAL: EDIT USER --- */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
                <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-lg">Kullanıcı Yönetimi</h3>
                    <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold">
                            {editingUser.name.charAt(0)}
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-lg">{editingUser.name}</h4>
                            <p className="text-slate-500">{editingUser.email}</p>
                            <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600 mt-1 inline-block">ID: {editingUser.id}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <p className="text-xs text-slate-500 uppercase font-bold">Toplam Seans</p>
                            <p className="text-xl font-bold text-slate-800">24</p>
                        </div>
                         <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <p className="text-xs text-slate-500 uppercase font-bold">Kalan Kredi</p>
                            <p className="text-xl font-bold text-slate-800">120 dk</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-1">Üyelik Paketi</label>
                            <select 
                                value={editingUser.plan}
                                onChange={(e) => setEditingUser({ ...editingUser, plan: e.target.value as PlanType })}
                                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                <option value="Free">Free</option>
                                <option value="Giriş">Giriş</option>
                                <option value="Standart">Standart</option>
                                <option value="Gelişmiş">Gelişmiş</option>
                            </select>
                        </div>

                        <button 
                            onClick={() => setShowEmailModal(true)}
                            className="w-full flex items-center justify-center gap-2 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
                        >
                            <Mail className="w-4 h-4" />
                            Kullanıcıya E-posta Gönder
                        </button>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
                    <button onClick={() => setEditingUser(null)} className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium">Vazgeç</button>
                    <button onClick={() => handleSaveUser(editingUser)} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold shadow-sm">Kaydet</button>
                </div>
            </div>
        </div>
      )}

      {/* --- MODAL: SEND EMAIL --- */}
      {showEmailModal && (
          <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
               <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-in zoom-in duration-200">
                   <div className="p-4 border-b border-slate-200 flex justify-between items-center">
                       <h3 className="font-bold text-slate-800">E-posta Gönder</h3>
                       <button onClick={() => setShowEmailModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
                   </div>
                   <form onSubmit={handleSendEmail} className="p-4 space-y-4">
                       <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Konu</label>
                           <input 
                              type="text" 
                              required
                              value={emailSubject}
                              onChange={e => setEmailSubject(e.target.value)}
                              className="w-full p-2 border border-slate-300 rounded"
                           />
                       </div>
                       <div>
                           <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Mesaj</label>
                           <textarea 
                              required
                              value={emailMessage}
                              onChange={e => setEmailMessage(e.target.value)}
                              rows={4}
                              className="w-full p-2 border border-slate-300 rounded"
                           ></textarea>
                       </div>
                       <button type="submit" className="w-full py-2 bg-indigo-600 text-white font-bold rounded hover:bg-indigo-700">Gönder</button>
                   </form>
               </div>
          </div>
      )}

    </div>
  );
};

export default AdminPanel;
