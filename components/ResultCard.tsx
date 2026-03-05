
import React from 'react';
import { CalculationResult } from '../types';

interface ResultCardProps {
  result: CalculationResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const colorMap: Record<string, string> = {
    blue: 'border-blue-500 bg-blue-50/50',
    amber: 'border-amber-500 bg-amber-50/50',
    emerald: 'border-emerald-500 bg-emerald-50/50',
    indigo: 'border-indigo-500 bg-indigo-50/50',
    slate: 'border-slate-500 bg-slate-50/50',
    red: 'border-red-500 bg-red-50/50',
  };

  const textColorMap: Record<string, string> = {
    blue: 'text-blue-700',
    amber: 'text-amber-700',
    emerald: 'text-emerald-700',
    indigo: 'text-indigo-700',
    slate: 'text-slate-700',
    red: 'text-red-700',
  };

  return (
    <div className={`group relative overflow-hidden rounded-xl border-l-4 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${colorMap[result.color] || 'border-gray-500 bg-gray-50'}`}>
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{result.label}</p>
          <p className={`text-xl font-bold ${textColorMap[result.color] || 'text-slate-800'}`}>{result.value}</p>
        </div>
      </div>
      <p className="mt-2 text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 print:opacity-100 transition-opacity duration-300">
        {result.description}
      </p>
    </div>
  );
};

export default ResultCard;
