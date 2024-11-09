import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface EditableMetricCardProps {
  title: string;
  value: number;
  onChange: (value: number) => void;
  icon: React.ReactNode;
  trend?: string;
  trendDirection?: 'up' | 'down';
  isEditable?: boolean;
}

const EditableMetricCard: React.FC<EditableMetricCardProps> = ({
  title,
  value,
  onChange,
  icon,
  trend,
  trendDirection,
  isEditable = true,
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className="text-slate-500">{title}</div>
        <div className="text-slate-400">{icon}</div>
      </div>
      <div className="text-2xl font-semibold text-slate-900 mb-2">
        {isEditable ? (
          <input
            type="text"
            value={value.toLocaleString()}
            onChange={(e) => {
              const newValue = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10);
              if (!isNaN(newValue)) {
                onChange(newValue);
              }
            }}
            className="w-full bg-transparent border-none p-0 focus:ring-0"
          />
        ) : (
          `¥${value.toLocaleString()}`
        )}
      </div>
      {trend && (
        <div className="flex items-center text-sm">
          {trendDirection === 'up' ? (
            <ArrowUpIcon className="w-4 h-4 text-emerald-500 mr-1" />
          ) : (
            <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
          )}
          <span
            className={
              trendDirection === 'up' ? 'text-emerald-500' : 'text-red-500'
            }
          >
            {trend}
          </span>
        </div>
      )}
    </div>
  );
};

export default EditableMetricCard;