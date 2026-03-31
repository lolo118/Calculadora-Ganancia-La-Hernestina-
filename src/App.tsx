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
  stock: string;
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
    res: { ventas: '', costo: '', mermas: '', stock: '' },
    cerdo: { ventas: '', costo: '', mermas: '', stock: '' },
    pollo: { ventas: '', costo: '', mermas: '', stock: '' },
    achuras: { ventas: '', costo: '', mermas: '', stock: '' },
    huevos: { ventas: '', costo: '', mermas: '', stock: '' },
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
    const stock = getNum(data.stock);
    
    const gananciaBrutaReal = ventas - (costo + mermas);
    const gananciaBrutaPotencial = (ventas + stock) - (costo + mermas);
    const margenBrutoReal = ventas > 0 ? (gananciaBrutaReal / ventas) * 100 : 0;
    const margenBrutoPotencial = (ventas + stock) > 0 ? (gananciaBrutaPotencial / (ventas + stock)) * 100 : 0;

    return {
      ...cat,
      ventas,
      costo,
      mermas,
      stock,
      gananciaBrutaReal,
      gananciaBrutaPotencial,
      margenBrutoReal,
      margenBrutoPotencial
    };
  });

  // Total Calculations
  const ingresosRealesTotales = categoryResults.reduce((sum, cat) => sum + cat.ventas, 0);
  const stockTotal = categoryResults.reduce((sum, cat) => sum + cat.stock, 0);
  const ingresosPotencialesTotales = ingresosRealesTotales + stockTotal;

  const gananciaBrutaRealTotal = categoryResults.reduce((sum, cat) => sum + cat.gananciaBrutaReal, 0);
  const gananciaBrutaPotencialTotal = categoryResults.reduce((sum, cat) => sum + cat.gananciaBrutaPotencial, 0);
  
  const costosOperativosTotales = 
    getNum(generales.servicios) + 
    getNum(generales.sueldos) + 
    getNum(generales.insumos) + 
    getNum(generales.mantenimiento);

  const gananciaNetaRealTotal = gananciaBrutaRealTotal - costosOperativosTotales;
  const gananciaNetaPotencialTotal = gananciaBrutaPotencialTotal - costosOperativosTotales;

  const margenRentabilidadNetaReal = ingresosRealesTotales > 0 
    ? (gananciaNetaRealTotal / ingresosRealesTotales) * 100 
    : 0;
  
  const margenRentabilidadNetaPotencial = ingresosPotencialesTotales > 0 
    ? (gananciaNetaPotencialTotal / ingresosPotencialesTotales) * 100 
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
                          <p className="text-stone-500 text-xs uppercase font-semibold">Ganancia Real</p>
                          <p className={`font-bold ${cat.gananciaBrutaReal >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {formatCurrency(cat.gananciaBrutaReal)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-stone-500 text-xs uppercase font-semibold">Margen Potencial</p>
                          <p className={`font-bold px-2 py-0.5 rounded ${cat.margenBrutoPotencial >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {formatPercent(cat.margenBrutoPotencial)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <InputField 
                        label="Ventas Reales"
                        description={cat.key === 'res' ? 'ingresos de venta de carne' : `Ingresos por venta de ${cat.label.toLowerCase()}.`}
                        value={categories[cat.key].ventas}
                        onChange={(v) => handleCategoryChange(cat.key, 'ventas', v)}
                        icon={TrendingUp}
                        color="emerald"
                      />
                      <InputField 
                        label="Stock (Valor Venta)"
                        description="Valor estimado de mercadería aún no vendida."
                        value={categories[cat.key].stock}
                        onChange={(v) => handleCategoryChange(cat.key, 'stock', v)}
                        icon={Package}
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
                          <p className="text-stone-500 text-xs uppercase font-semibold">Ganancia Real</p>
                          <p className={`font-bold ${cat.gananciaBrutaReal >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {formatCurrency(cat.gananciaBrutaReal)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-stone-500 text-xs uppercase font-semibold">Margen Potencial</p>
                          <p className={`font-bold ${cat.margenBrutoPotencial >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {formatPercent(cat.margenBrutoPotencial)}
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
                  label="Ventas Reales Totales" 
                  value={ingresosRealesTotales} 
                  icon={TrendingUp}
                  iconColor="text-emerald-400"
                />

                <ResultRowDark 
                  label="Stock (Potencial Venta)" 
                  value={stockTotal} 
                  icon={Package}
                  iconColor="text-amber-400"
                />
                
                <ResultRowDark 
                  label="Ganancia Bruta Real" 
                  value={gananciaBrutaRealTotal} 
                  icon={DollarSign}
                  iconColor="text-emerald-400"
                />

                <ResultRowDark 
                  label="Ganancia Bruta Potencial" 
                  value={gananciaBrutaPotencialTotal} 
                  icon={DollarSign}
                  iconColor="text-amber-400"
                />
                
                <ResultRowDark 
                  label="Costos Operativos Totales" 
                  value={costosOperativosTotales} 
                  icon={TrendingDown}
                  iconColor="text-red-400"
                  isNegative
                />
                
                <div className="pt-6 mt-4 border-t border-stone-700 space-y-4">
                  {/* Real Results Card */}
                  <div className={`p-4 rounded-xl relative overflow-hidden ${
                    gananciaNetaRealTotal > 0 
                      ? 'bg-emerald-500/10 border border-emerald-500/30' 
                      : gananciaNetaRealTotal < 0 
                        ? 'bg-red-500/10 border border-red-500/30' 
                        : 'bg-stone-800 border border-stone-700'
                  }`}>
                    <div className="relative z-10">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">Resultado Real (Hoy)</span>
                        <span className={`font-bold text-sm px-2 py-0.5 rounded ${
                          margenRentabilidadNetaReal > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {formatPercent(margenRentabilidadNetaReal)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`font-black text-2xl ${
                          gananciaNetaRealTotal > 0 ? 'text-emerald-400' : gananciaNetaRealTotal < 0 ? 'text-red-400' : 'text-white'
                        }`}>
                          {formatCurrency(gananciaNetaRealTotal)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Potential Results Card */}
                  <div className={`p-5 rounded-xl relative overflow-hidden ${
                    gananciaNetaPotencialTotal > 0 
                      ? 'bg-emerald-500/20 border border-emerald-500/40' 
                      : gananciaNetaPotencialTotal < 0 
                        ? 'bg-red-500/20 border border-red-500/40' 
                        : 'bg-stone-800 border border-stone-700'
                  }`}>
                    {/* Decorative background glow */}
                    <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-20 ${
                      gananciaNetaPotencialTotal > 0 ? 'bg-emerald-500' : gananciaNetaPotencialTotal < 0 ? 'bg-red-500' : 'bg-transparent'
                    }`}></div>

                    <div className="relative z-10">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-bold text-white uppercase tracking-wider">Resultado Proyectado</span>
                        <span className={`font-bold text-lg px-2 py-0.5 rounded ${
                          margenRentabilidadNetaPotencial > 0 ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                        }`}>
                          {formatPercent(margenRentabilidadNetaPotencial)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`font-black text-3xl ${
                          gananciaNetaPotencialTotal > 0 ? 'text-emerald-400' : gananciaNetaPotencialTotal < 0 ? 'text-red-400' : 'text-white'
                        }`}>
                          {formatCurrency(gananciaNetaPotencialTotal)}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-400 mt-2 italic">Incluye ventas reales + valor de stock disponible.</p>
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

