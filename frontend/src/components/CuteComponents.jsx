import { Sparkles, Star, Heart, TrendingUp, Coins, PiggyBank, Receipt, Cloud } from 'lucide-react';

// 🎨 Cute Icon Decorations
export function SparkleDecor({ className = "" }) {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <Sparkles className="text-yellow-300 opacity-40" size={16} />
    </div>
  );
}

export function StarDecor({ className = "" }) {
  return (
    <div className={`absolute pointer-events-none ${className}`}>
      <Star className="text-yellow-200 opacity-30" size={12} fill="currentColor" />
    </div>
  );
}

// 🏦 Cute Empty State Illustrations
export function PiggyBankIllustration({ size = 120, className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div 
        className="rounded-full flex items-center justify-center mb-4"
        style={{ 
          width: size, 
          height: size, 
          background: 'linear-gradient(135deg, #E8F6FF 0%, #DFF9F4 100%)'
        }}
      >
        <PiggyBank size={size * 0.5} className="text-cyan-500" />
      </div>
      <div className="relative">
        <StarDecor className="top-0 right-0" />
        <Sparkles className="absolute -top-2 -right-6 text-yellow-300 opacity-50" size={20} />
      </div>
    </div>
  );
}

export function CoinsIllustration({ size = 120, className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div 
        className="rounded-full flex items-center justify-center mb-4 relative"
        style={{ 
          width: size, 
          height: size, 
          background: 'linear-gradient(135deg, #FFF7D6 0%, #FFE8F0 100%)'
        }}
      >
        <Coins size={size * 0.5} className="text-amber-500" />
        <StarDecor className="top-2 right-4" />
      </div>
    </div>
  );
}

export function ReceiptIllustration({ size = 120, className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div 
        className="rounded-full flex items-center justify-center mb-4"
        style={{ 
          width: size, 
          height: size, 
          background: 'linear-gradient(135deg, #F3E8FF 0%, #E8F6FF 100%)'
        }}
      >
        <Receipt size={size * 0.5} className="text-purple-500" />
      </div>
    </div>
  );
}

// 💫 Cute Empty State Component (Enhanced)
export function CuteEmptyState({ 
  icon = 'piggy', 
  title, 
  description, 
  action,
  className = ""
}) {
  const illustrations = {
    piggy: <PiggyBankIllustration />,
    coins: <CoinsIllustration />,
    receipt: <ReceiptIllustration />
  };

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center animate-in fade-in-50 duration-500 ${className}`}>
      <div className="animate-in zoom-in-95 duration-700">
        {illustrations[icon]}
      </div>
      <h3 className="mt-6 text-lg font-semibold text-gray-700 animate-in slide-in-from-bottom-4 duration-500 delay-200">
        {title}
      </h3>
      <p className="mt-2 text-sm text-gray-500 max-w-sm animate-in slide-in-from-bottom-4 duration-500 delay-300">
        {description}
      </p>
      {action && (
        <div className="mt-6 animate-in slide-in-from-bottom-4 duration-500 delay-500">
          {action}
        </div>
      )}
    </div>
  );
}

// ✨ Cute Loading Spinner
export function CuteLoading({ size = 40, className = "" }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className="animate-spin rounded-full border-4 border-gray-200"
        style={{
          width: size,
          height: size,
          borderTopColor: '#00AEEF',
          borderRightColor: '#00AEEF'
        }}
      />
    </div>
  );
}

// 🎯 Cute Badge Component
export function CuteBadge({ children, variant = 'primary', className = "" }) {
  const variants = {
    primary: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    info: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    pink: 'bg-pink-50 text-pink-700 border-pink-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200'
  };

  return (
    <span 
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

// 🌟 Cute Stat Card with Icon
export function CuteStatCard({ title, value, change, trend, icon, gradient, iconColor }) {
  return (
    <div 
      className="relative overflow-hidden rounded-2xl p-6 bg-white border border-gray-100 transition-all duration-300 hover:border border-gray-200 hover:-translate-y-1 cursor-default"
    >
      {/* Decorative Background */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5 -mr-16 -mt-16 transition-opacity duration-300 group-hover:opacity-10"
        style={{ background: gradient }}
      />
      <StarDecor className="top-3 right-3" />
      
      <div className="flex items-start justify-between relative">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-2">{title}</p>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">{value}</h3>
          {change && (
            <div className="flex items-center gap-1">
              <TrendingUp 
                size={14} 
                className={trend === 'up' ? 'text-green-600' : 'text-red-600 rotate-180'}
              />
              <span className={`text-sm ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {change}
              </span>
              <span className="text-sm text-gray-500">from last week</span>
            </div>
          )}
        </div>
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ background: gradient }}
        >
          <div style={{ color: iconColor }}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}

// 🎨 Background Decorations
export function BackgroundDecor() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Top Right Cloud */}
      <Cloud 
        className="absolute top-20 right-32 text-blue-100 opacity-30" 
        size={80} 
        style={{ transform: 'rotate(15deg)' }}
      />
      
      {/* Top Left Stars */}
      <Star 
        className="absolute top-40 left-80 text-yellow-100 opacity-20" 
        size={24} 
        fill="currentColor"
      />
      <Star 
        className="absolute top-60 left-96 text-yellow-100 opacity-15" 
        size={16} 
        fill="currentColor"
      />
      
      {/* Bottom Sparkles */}
      <Sparkles 
        className="absolute bottom-40 right-64 text-cyan-100 opacity-20" 
        size={32}
      />
      
      {/* Heart Decoration */}
      <Heart 
        className="absolute bottom-60 left-1/4 text-pink-100 opacity-15" 
        size={20}
        fill="currentColor"
      />
    </div>
  );
}
