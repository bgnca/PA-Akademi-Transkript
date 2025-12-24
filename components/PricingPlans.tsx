
import React from 'react';
import { Check, Zap, Crown, Star, Tag } from 'lucide-react';
import { PlanType, PlanConfig } from '../types';

interface PricingPlansProps {
  currentPlan: PlanType;
  onSelectPlan: (plan: PlanType, minutes: number) => void;
  plans: PlanConfig[];
}

const PricingPlans: React.FC<PricingPlansProps> = ({ currentPlan, onSelectPlan, plans }) => {
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return Zap;
      case 'Star': return Star;
      case 'Crown': return Crown;
      default: return Star;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 animate-in fade-in duration-500">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Size Uygun Paketi Seçin</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          İhtiyacınıza göre dakikalarınızı belirleyin, seanslarınızı özgürce döküme dönüştürün.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const IconComponent = getIcon(plan.icon);
          const hasCampaign = plan.campaign?.active;
          
          return (
            <div 
                key={plan.id} 
                className={`relative bg-white rounded-2xl shadow-lg border-2 flex flex-col ${plan.recommended ? 'border-indigo-500 transform scale-105 z-10' : 'border-slate-100 hover:border-slate-300'}`}
            >
                {/* Badges */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-2 w-full justify-center">
                    {plan.recommended && (
                    <div className="bg-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm">
                        En Popüler
                    </div>
                    )}
                    {hasCampaign && (
                         <div className="bg-amber-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {plan.campaign?.discountText}
                        </div>
                    )}
                </div>
                
                <div className="p-8 flex-grow">
                <div className={`w-12 h-12 rounded-xl ${plan.color} flex items-center justify-center mb-6`}>
                    <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                
                {/* Price Display */}
                <div className="flex items-baseline mb-1">
                     {hasCampaign ? (
                         <>
                             <span className="text-4xl font-extrabold text-amber-600">{plan.price}</span>
                             <span className="ml-2 text-sm text-slate-400 line-through decoration-slate-400">Normal Fiyat</span>
                         </>
                     ) : (
                         <span className="text-4xl font-extrabold text-slate-900">{plan.price}</span>
                     )}
                     <span className="text-slate-500 ml-2">/ay</span>
                </div>
                {hasCampaign && plan.campaign?.validUntil && (
                    <p className="text-xs text-amber-600 font-semibold mb-6">
                        Son gün: {new Date(plan.campaign.validUntil).toLocaleDateString('tr-TR')}
                    </p>
                )}
                {!hasCampaign && <div className="mb-6"></div>}

                <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-slate-600 text-sm">{feature}</span>
                    </li>
                    ))}
                </ul>
                </div>

                <div className="p-8 pt-0 mt-auto">
                <button
                    onClick={() => onSelectPlan(plan.type, plan.minutes)}
                    className={`w-full py-3 px-6 rounded-xl text-white font-semibold transition-all shadow-md bg-indigo-600 hover:bg-indigo-700`}
                >
                    Paketi Seç
                </button>
                </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PricingPlans;
