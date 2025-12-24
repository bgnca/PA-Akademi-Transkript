
import React from 'react';
import { Check, Zap, Crown, Star, ArrowLeft, Tag } from 'lucide-react';
import { PlanConfig } from '../types';

interface PublicPricingProps {
  onBack: () => void;
  onRegister: () => void;
  plans: PlanConfig[];
}

const PublicPricing: React.FC<PublicPricingProps> = ({ onBack, onRegister, plans }) => {
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return Zap;
      case 'Star': return Star;
      case 'Crown': return Crown;
      default: return Star;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Anasayfaya Dön
        </button>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Üyelik Paketleri ve Ücretlendirme</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            İhtiyacınıza uygun paketi seçin, seanslarınızı hemen analize başlayın.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
             const IconComponent = getIcon(plan.icon);
             const hasCampaign = plan.campaign?.active;

             return (
                <div 
                key={plan.id} 
                className={`relative bg-white rounded-2xl shadow-xl border-2 flex flex-col ${plan.recommended ? 'border-indigo-500 transform scale-105 z-10' : 'border-slate-100 hover:border-slate-300'}`}
                >
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-2 w-full justify-center">
                    {plan.recommended && (
                    <div className="bg-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-md">
                        En Popüler
                    </div>
                    )}
                    {hasCampaign && (
                         <div className="bg-amber-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-md flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {plan.campaign?.discountText}
                        </div>
                    )}
                </div>
                
                <div className="p-8 flex-grow">
                    <div className={`w-14 h-14 rounded-2xl ${plan.color} flex items-center justify-center mb-6`}>
                    <IconComponent className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                    
                    {/* Price Display */}
                    <div className="flex items-baseline mb-1">
                        {hasCampaign ? (
                            <>
                                <span className="text-5xl font-extrabold text-amber-600">{plan.price}</span>
                                <span className="ml-2 text-lg text-slate-400 line-through decoration-slate-400">Liste Fiyatı</span>
                            </>
                        ) : (
                            <span className="text-5xl font-extrabold text-slate-900">{plan.price}</span>
                        )}
                        <span className="text-slate-500 ml-2 text-lg">/ay</span>
                    </div>
                    {hasCampaign && plan.campaign?.validUntil && (
                        <p className="text-sm text-amber-600 font-semibold mb-6 bg-amber-50 inline-block px-2 py-1 rounded">
                            Son gün: {new Date(plan.campaign.validUntil).toLocaleDateString('tr-TR')}
                        </p>
                    )}
                    {!hasCampaign && <div className="mb-6"></div>}
                    
                    <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                        <div className="bg-green-100 rounded-full p-1 mt-0.5">
                            <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-slate-700 font-medium">{feature}</span>
                        </li>
                    ))}
                    </ul>
                </div>

                <div className="p-8 pt-0 mt-auto">
                    <button
                    onClick={onRegister}
                    className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 bg-indigo-600 hover:bg-indigo-700`}
                    >
                    Hemen Başla
                    </button>
                    <p className="text-center text-xs text-slate-400 mt-4">Kredi kartı gerekmez (Deneme sürümü için)</p>
                </div>
                </div>
             );
          })}
        </div>
      </div>
    </div>
  );
};

export default PublicPricing;
