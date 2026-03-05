
import React, { useState } from 'react';
import { RoofInputs, CalculationResult } from './types';
import { calculateRoofData } from './utils/calculations';
import ResultCard from './components/ResultCard';
import RoofVisualizer from './components/RoofVisualizer';

const App: React.FC = () => {
  const [inputs, setInputs] = useState<RoofInputs>({
    ancho: 30,
    proyeccion: 11.9,
    pendiente: 7,
    separacion: 1.5,
  });

  const [results, setResults] = useState<CalculationResult[]>([]);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    const val = value === '' ? 0 : parseFloat(value);
    setInputs(prev => ({
      ...prev,
      [id]: val
    }));
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const data = calculateRoofData(inputs);
    setResults(data);
    setHasCalculated(true);
    if (window.innerWidth < 768) {
        window.scrollTo({ top: 600, behavior: 'smooth' });
    }
  };

  const resetForm = () => {
    setInputs({ ancho: 0, proyeccion: 0, pendiente: 0, separacion: 1.5 });
    setResults([]);
    setHasCalculated(false);
  };

  const copyToClipboard = () => {
    const text = results.map(r => `${r.label}: ${r.value}`).join('\n');
    navigator.clipboard.writeText(`Resumen de Proyecto Kingspan:\n${text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen pb-12">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 print:hidden">
        <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="bg-blue-900 px-4 py-2 rounded text-white font-black text-xl tracking-tighter">KINGSPAN</div>
             <div className="hidden sm:block h-8 w-px bg-slate-200"></div>
             <h1 className="hidden sm:block text-slate-500 font-medium text-sm">Calculadora de Cubiertas</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full uppercase">Herramienta Técnica v2.6</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 mt-8">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-5 space-y-6 print:hidden">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Configuración de Proyecto</h2>
              
              <div className="mb-8 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-2 text-center">
                <img 
                    src="https://i.ibb.co/0R80GgpY/JPG-Una-Pendiente.jpg" 
                    alt="Diagrama Cubierta" 
                    className="mx-auto w-full h-auto max-h-64 object-contain block opacity-95 transition-opacity rounded-lg"
                />
              </div>

              <form onSubmit={handleCalculate} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ancho de la Cubierta (A) [m]</label>
                  <div className="relative">
                    <input 
                        id="ancho"
                        type="number" 
                        step="0.01"
                        required
                        value={inputs.ancho || ''}
                        onChange={handleInputChange}
                        className="w-full pl-4 pr-12 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-lg"
                        placeholder="0.00"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">m</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Proyección (B) [m]</label>
                    <input 
                      id="proyeccion"
                      type="number" 
                      step="0.01"
                      required
                      value={inputs.proyeccion || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pendiente (%)</label>
                    <input 
                      id="pendiente"
                      type="number" 
                      step="0.1"
                      required
                      min="0"
                      value={inputs.pendiente === 0 ? '0' : inputs.pendiente || ''}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Separación Correas (S) [m]</label>
                  <input 
                    id="separacion"
                    type="number" 
                    step="0.01"
                    required
                    value={inputs.separacion || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="submit" 
                    className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98]"
                  >
                    Calcular Materiales
                  </button>
                  <button 
                    type="button" 
                    onClick={resetForm}
                    className="px-5 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            {!hasCalculated ? (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-100/50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4 text-slate-300">
                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-800">Cálculo de Ingeniería</h3>
                <p className="text-slate-500 max-w-sm mt-2">Ingrese los datos para obtener el desglose técnico de materiales.</p>
              </div>
            ) : (
              <div className="animate-fade-in space-y-6">
                <div className="hidden print:block mb-8 border-b border-slate-200 pb-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h1 className="text-3xl font-black text-blue-900 tracking-tighter">KINGSPAN</h1>
                      <p className="text-slate-500 font-medium">Reporte Técnico de Cubierta</p>
                    </div>
                    <div className="text-right text-xs text-slate-400">
                      <p>Fecha: {new Date().toLocaleDateString()}</p>
                      <p>Ref: {Math.random().toString(36).substring(7).toUpperCase()}</p>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                    <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Especificaciones de Entrada</h3>
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Ancho (A)</p>
                        <p className="text-sm font-bold text-slate-700">{inputs.ancho} m</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Proyección (B)</p>
                        <p className="text-sm font-bold text-slate-700">{inputs.proyeccion} m</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Pendiente</p>
                        <p className="text-sm font-bold text-slate-700">{inputs.pendiente} %</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Separación Correas</p>
                        <p className="text-sm font-bold text-slate-700">{inputs.separacion} m</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 print:border-none print:shadow-none print:p-0">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-800">Resultados del Análisis</h2>
                    <div className="flex gap-2 print:hidden">
                      <button 
                          onClick={handlePrint}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-bold transition-all flex items-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 00-2 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                        Imprimir PDF
                      </button>
                      <button 
                          onClick={copyToClipboard}
                          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 flex items-center gap-2 border ${copied ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                      >
                        {copied ? 'Copiado!' : 'Copiar Datos'}
                      </button>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {results.map((res, i) => (
                      <ResultCard key={i} result={res} />
                    ))}
                  </div>

                  <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex items-start gap-3">
                       <svg className="w-5 h-5 text-slate-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                       <p className="text-xs text-slate-500 leading-relaxed italic">
                        Esta estimación técnica es referencial y debe ser validada por el equipo técnico de Kingspan antes de la compra final. Los cálculos consideran traslapos de 20cm.
                       </p>
                    </div>
                  </div>
                </div>

                <RoofVisualizer 
                  ancho={inputs.ancho} 
                  longitudVertiente={results.find(r => r.label === 'Longitud de Vertiente')?.numericValue || 0} 
                  traslapos={results.find(r => r.label === 'Traslapos Necesarios')?.numericValue || 0}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-20 border-t border-slate-200 pt-12 pb-8 px-4 text-center print:hidden">
        <div className="max-w-6xl mx-auto">
          <p className="text-slate-400 text-sm font-medium">© 2025 Kingspan Paneles Aislados</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
