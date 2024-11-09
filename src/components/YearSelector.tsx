import React from 'react';
import { ChevronDown } from 'lucide-react';

interface YearSelectorProps {
  selectedYear: number;
  onChange: (year: number) => void;
  minYear: number;
  maxYear: number;
}

const YearSelector: React.FC<YearSelectorProps> = ({
  selectedYear,
  onChange,
  minYear,
  maxYear,
}) => {
  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => maxYear - i
  );

  return (
    <div className="relative">
      <select
        value={selectedYear}
        onChange={(e) => onChange(Number(e.target.value))}
        className="appearance-none bg-white border border-slate-200 rounded-lg px-4 py-2 pr-10 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}年分
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
    </div>
  );
};

export default YearSelector;