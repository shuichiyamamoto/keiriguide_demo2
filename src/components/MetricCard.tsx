import React, { useState } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendDirection?: 'up' | 'down';
  subtitle?: string;
  onClick?: () => void;
  isEditable?: boolean;
  onValueChange?: (value: number) => void;
  valueColor?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendDirection,
  subtitle,
  onClick,
  isEditable,
  onValueChange,
  valueColor,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleClick = () => {
    if (isEditable) {
      setIsEditing(true);
    } else if (onClick) {
      onClick();
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (onValueChange) {
      const numericValue = parseInt(editValue.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(numericValue)) {
        onValueChange(numericValue);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm p-6 h-[140px] flex flex-col justify-between ${
        (onClick || isEditable) ? 'cursor-pointer hover:shadow-md transition-shadow' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div className="text-slate-600">{icon}</div>
        {trend && (
          <div className={`flex items-center ${trendDirection === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trendDirection === 'up' ? (
              <ArrowUpIcon className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDownIcon className="w-4 h-4 mr-1" />
            )}
            <span className="text-sm font-medium">{trend}</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col justify-center">
        <h3 className="text-sm font-medium text-slate-600">{title}</h3>
        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="text-2xl font-semibold w-full bg-transparent border-b border-primary-500 focus:outline-none mt-1"
            autoFocus
          />
        ) : (
          <p className={`text-2xl font-semibold ${valueColor || 'text-slate-900'} mt-1`}>
            {value}
          </p>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-500 mt-2">{subtitle}</p>
      )}
    </div>
  );
};

export default MetricCard;