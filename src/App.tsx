import React, { useState } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Beef, 
  Zap, 
  Users, 
  Package, 
  Wrench,
  Store,
  Egg,
  Drumstick,
  ChefHat,
  Percent
} from 'lucide-react';

type CategoryKey = 'res' | 'cerdo' | 'pollo' | 'achuras' | 'huevos';

interface CategoryData {
  ventas: string;
  costo: string;
  mermas: string;
}

const CATEGORIES: { key: CategoryKey; label: string; icon: React.ElementType; color: string }[] = [
  { key: 'res', label: 'Carne de Res', icon: Beef, color: 'text-red-600' },
  { key: 'cerdo', label: 'Cerdo', icon: ChefHat, color: 'text-pink-600' },
  { key: 'pollo', label: 'Pollo', icon: Drumstick, color: 'text-amber-600' },
  { key: 'achuras', label: 'Achuras', icon: Beef, color: 'text-orange-600' },
  { key: 'huevos', label: 'Huevos', icon: Egg, color: 'text-yellow-600' },
];

export default function App() {
  const [categories, setCategories] = useState<Record<CategoryKey, CategoryData>>({
    res: { ventas: '', costo: '', mermas: '' },
    cerdo: { ventas: '', costo: '', mermas: '' },
    pollo: { ventas: '', costo: '', mermas: '' },
    achuras: { ventas: '', costo: '', mermas: '' },
    huevos: { ventas: '', costo: '', mermas: '' },
  });

  const [generales, setGenerales] = useState({
    servicios: '',
    sueldos: '',
    insumos: '',
    mantenimiento: '',
  });

  const handleCategoryChange = (category: CategoryKey, field: keyof CategoryData, value: string) => {
    setCategories(prev => ({
      ...prev,
      [category]: { ...prev[category], [field]: value }
    }));
  };

  const handleGeneralChange = (field: keyof typeof generales, value: string) => {
    setGenerales(prev => ({ ...prev, [field]: value }));
  };

  const getNum = (val: string) => parseFloat(val) || 0;

  // Category Calculations
  const categoryResults = CATEGORIES.map(cat => {
    const data = categories[cat.key];
    const ventas = getNum(data.ventas);
    const costo = getNum(data.costo);
    const mermas = getNum(data.mermas);
    
    const gananciaBruta = ventas - (costo + mermas);
    const margenBruto = ventas > 0 ? (gananciaBruta / ventas) * 100 : 0;

    return {
      ...cat,
      ventas,
      costo,
      mermas,
      gananciaBruta,
      margenBruto
    };
  });

  // Total Calculations
  const ingresosBrutosTotales = categoryResults.reduce((sum, cat) => sum + cat.ventas, 0);
  const gananciaBrutaTotal = categoryResults.reduce((sum, cat) => sum + cat.gananciaBruta, 0);
  
  const costosOperativosTotales = 
    getNum(generales.servicios) + 
    getNum(generales.sueldos) + 
    getNum(generales.insumos) + 
    getNum(generales.mantenimiento);

  const gananciaNetaTotal = gananciaBrutaTotal - costosOperativosTotales;
  const margenRentabilidadNeta = ingresosBrutosTotales > 0 
    ? (gananciaNetaTotal / ingresosBrutosTotales) * 100 
    : 0;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatPercent = (val: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(val / 100);
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans selection:bg-red-200 pb-12">
      {/* Header */}
      <header className="bg-red-700 text-white shadow-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <Store className="h-6 w-6 text-red-700" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">La Hernestina</h1>
              <p className="text-red-100 text-xs font-medium uppercase tracking-wider">Calculadora de ganancia SEBA</p>
            </div>
          </div>
          <Calculator className="h-6 w-6 text-red-200 opacity-80 hidden sm:block" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Left Column: Forms */}
          <div className="xl:col-span-8 space-y-8">
            
            {/* BLOQUE 1: Datos por Categoría */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-300 pb-2">
                <h2 className="text-2xl font-bold text-stone-800">Datos de sistema por categoria</h2>
                <span className="text-sm text-stone-500 bg-stone-200 px-3 py-1 rounded-full font-medium">5 Categorías</span>
              </div>
              
              <div className="grid grid-cols-1 gap-6">
                {categoryResults.map((cat) => (
                  <div key={cat.key} className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden transition-all hover:shadow-md">
                    <div className="bg-stone-50 px-6 py-4 border-b border-stone-200 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 bg-white rounded-lg shadow-sm border border-stone-100 ${cat.color}`}>
                          <cat.icon className="h-5 w-5" />
                        </div>
                        <h3 className="text-lg font-bold text-stone-800">{cat.label}</h3>
                      </div>
                      
                      {/* Category Quick Results */}
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="text-right hidden sm:block">
                          <p className="text-stone-500 text-xs uppercase font-semibold">Ganancia Bruta</p>
                          <p className={`font-bold ${cat.gananciaBruta >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {formatCurrency(cat.gananciaBruta)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-stone-500 text-xs uppercase font-semibold">Margen</p>
                          <p className={`font-bold px-2 py-0.5 rounded ${cat.margenBruto >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {formatPercent(cat.margenBruto)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                      <InputField 
                        label="Ventas Totales"
                        description={cat.key === 'res' ? 'ingresos de venta de carne' : `Ingresos por venta de ${cat.label.toLowerCase()}.`}
                        value={categories[cat.key].ventas}
                        onChange={(v) => handleCategoryChange(cat.key, 'ventas', v)}
                        icon={TrendingUp}
                        color="emerald"
                      />
                      <InputField 
                        label="Costo de Mercadería"
                        description={cat.key === 'res' ? 'monto pagado al feedlot' : 'Monto pagado al proveedor'}
                        value={categories[cat.key].costo}
                        onChange={(v) => handleCategoryChange(cat.key, 'costo', v)}
                        icon={DollarSign}
                      />
                      <InputField 
                        label="Mermas/Desperdicio"
                        description={cat.key === 'huevos' ? 'Ruptura, podridos, etc...' : 'Pérdida por deshidratación, recortes, etc.'}
                        value={categories[cat.key].mermas}
                        onChange={(v) => handleCategoryChange(cat.key, 'mermas', v)}
                        icon={TrendingDown}
                      />
                    </div>
                    
                    {/* Mobile Category Results (visible only on small screens) */}
                    <div className="sm:hidden bg-stone-50 p-4 border-t border-stone-100 flex justify-between items-center">
                       <div>
                          <p className="text-stone-500 text-xs uppercase font-semibold">Ganancia Bruta</p>
                          <p className={`font-bold ${cat.gananciaBruta >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {formatCurrency(cat.gananciaBruta)}
                          </p>
                        </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BLOQUE 2: Costos Generales */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between border-b border-stone-300 pb-2">
                <h2 className="text-2xl font-bold text-stone-800">Costos generales (fijos relativos)</h2>
                <span className="text-sm text-stone-500 bg-stone-200 px-3 py-1 rounded-full font-medium">Operativos</span>
              </div>
              
              <section className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <InputField 
                    label="Servicios y Alquiler"
                    description="Luz, agua, internet, etc."
                    value={generales.servicios}
                    onChange={(v) => handleGeneralChange('servicios', v)}
                    icon={Zap}
                  />
                  <InputField 
                    label="Sueldos"
                    description="Remuneración del personal."
                    value={generales.sueldos}
                    onChange={(v) => handleGeneralChange('sueldos', v)}
                    icon={Users}
                  />
                  <InputField 
                    label="Insumos de Venta"
                    description="bolsas, elementos de corte, papel, etc."
                    value={generales.insumos}
                    onChange={(v) => handleGeneralChange('insumos', v)}
                    icon={Package}
                  />
                  <InputField 
                    label="Mantenimiento y Otros"
                    description="Afilado, artículos de limpieza, reparaciones, etc"
                    value={generales.mantenimiento}
                    onChange={(v) => handleGeneralChange('mantenimiento', v)}
                    icon={Wrench}
                  />
                </div>
              </section>
            </div>

          </div>

          {/* Right Column: Total Results */}
          <div className="xl:col-span-4">
            <div className="bg-stone-900 rounded-2xl shadow-xl border border-stone-800 p-6 sticky top-24 text-white">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center border-b border-stone-700 pb-4">
                <Calculator className="h-5 w-5 mr-3 text-red-500" />
                Rentabilidad Total
              </h2>
              
              <div className="space-y-6">
                <ResultRowDark 
                  label="Ingresos Brutos Totales" 
                  value={ingresosBrutosTotales} 
                  icon={TrendingUp}
                  iconColor="text-emerald-400"
                />
                
                <ResultRowDark 
                  label="Ganancia Bruta Total" 
                  value={gananciaBrutaTotal} 
                  icon={DollarSign}
                  iconColor="text-emerald-400"
                  highlight
                />
                
                <ResultRowDark 
                  label="Costos Operativos Totales" 
                  value={costosOperativosTotales} 
                  icon={TrendingDown}
                  iconColor="text-red-400"
                  isNegative
                />
                
                <div className="pt-6 mt-4 border-t border-stone-700">
                  <div className={`p-5 rounded-xl relative overflow-hidden ${
                    gananciaNetaTotal > 0 
                      ? 'bg-emerald-500/10 border border-emerald-500/30' 
                      : gananciaNetaTotal < 0 
                        ? 'bg-red-500/10 border border-red-500/30' 
                        : 'bg-stone-800 border border-stone-700'
                  }`}>
                    {/* Decorative background glow */}
                    <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 ${
                      gananciaNetaTotal > 0 ? 'bg-emerald-500' : gananciaNetaTotal < 0 ? 'bg-red-500' : 'bg-transparent'
                    }`}></div>

                    <div className="relative z-10">
                      <div className="mb-1">
                        <span className="text-sm font-medium text-stone-300 uppercase tracking-wider">Ganancia Neta Total</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`font-black text-3xl ${
                          gananciaNetaTotal > 0 ? 'text-emerald-400' : gananciaNetaTotal < 0 ? 'text-red-400' : 'text-white'
                        }`}>
                          {formatCurrency(gananciaNetaTotal)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-5 pt-4 border-t border-white/10 flex justify-between items-center relative z-10">
                      <span className="font-medium text-stone-300 flex items-center">
                        <Percent className="h-4 w-4 mr-1 opacity-70" />
                        Margen Neto
                      </span>
                      <span className={`font-bold text-xl px-3 py-1 rounded-lg ${
                         margenRentabilidadNeta > 0 
                          ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                          : margenRentabilidadNeta < 0 
                            ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                            : 'bg-stone-700 text-stone-300'
                      }`}>
                        {formatPercent(margenRentabilidadNeta)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 text-xs text-stone-400 text-center bg-stone-800/50 p-3 rounded-lg">
                Los cálculos se actualizan automáticamente. Los campos vacíos equivalen a $0.
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

function InputField({ 
  label, 
  description, 
  value, 
  onChange, 
  icon: Icon,
  color = "stone" 
}: { 
  label: string, 
  description: string, 
  value: string, 
  onChange: (val: string) => void,
  icon: React.ElementType,
  color?: "stone" | "emerald"
}) {
  const focusRingColor = color === "emerald" ? "focus:ring-emerald-500 focus:border-emerald-500" : "focus:ring-red-500 focus:border-red-500";
  
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-bold text-stone-700">{label}</label>
      <div className="relative rounded-lg shadow-sm group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-stone-400 group-focus-within:text-stone-600 transition-colors sm:text-sm font-bold">$</span>
        </div>
        <input
          type="number"
          min="0"
          step="any"
          className={`block w-full pl-8 pr-10 py-2.5 sm:text-sm border-stone-300 rounded-lg border bg-stone-50 hover:bg-white transition-all duration-200 ${focusRingColor}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <Icon className="h-4 w-4 text-stone-400 group-focus-within:text-stone-600 transition-colors" />
        </div>
      </div>
      <p className="text-xs text-stone-500 leading-snug">{description}</p>
    </div>
  );
}

function ResultRowDark({ 
  label, 
  value, 
  icon: Icon,
  iconColor,
  isNegative = false, 
  highlight = false 
}: { 
  label: string, 
  value: number, 
  icon: React.ElementType,
  iconColor: string,
  isNegative?: boolean, 
  highlight?: boolean 
}) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="flex justify-between items-center group">
      <div className="flex items-center space-x-3">
        <div className={`p-1.5 rounded-md bg-stone-800 border border-stone-700 group-hover:border-stone-600 transition-colors`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
        <span className={`text-sm ${highlight ? 'font-bold text-white' : 'text-stone-300'}`}>{label}</span>
      </div>
      <span className={`font-mono text-lg tracking-tight ${isNegative && value > 0 ? 'text-red-400' : highlight ? 'text-emerald-400 font-bold' : 'text-white'}`}>
        {isNegative && value > 0 ? '- ' : ''}{formatCurrency(value)}
      </span>
    </div>
  );
}

