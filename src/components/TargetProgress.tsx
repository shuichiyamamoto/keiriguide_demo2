import React, { useState } from 'react';
import { Target, Edit2 } from 'lucide-react';

interface TargetProgressProps {
  currentRevenue: number;
  targetRevenue: number;
  onTargetChange: (value: number) => void;
}

const TargetProgress: React.FC<TargetProgressProps> = ({
  currentRevenue,
  targetRevenue,
  onTargetChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTarget, setTempTarget] = useState(targetRevenue.toString());

  const progressPercentage = Math.min((currentRevenue / targetRevenue) * 100, 100);
  const remainingAmount = Math.max(targetRevenue - currentRevenue, 0);
  const isAchieved = currentRevenue >= targetRevenue;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTarget = parseInt(tempTarget.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(newTarget) && newTarget > 0) {
      onTargetChange(newTarget);
    }
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-primary-600" />
          <h2 className="text-base font-medium text-slate-900">目標売上進捗</h2>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
          >
            <Edit2 className="h-4 w-4 mr-1" />
            <span>編集</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <input
            type="text"
            value={tempTarget}
            onChange={(e) => setTempTarget(e.target.value)}
            className="flex-1 rounded-lg border-slate-200 text-sm"
            placeholder="目標売上を入力"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
          >
            保存
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="px-3 py-2 bg-white text-slate-700 text-sm border border-slate-200 rounded-lg hover:bg-slate-50"
          >
            キャンセル
          </button>
        </form>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="text-slate-600">
              ¥{currentRevenue.toLocaleString()} / ¥{targetRevenue.toLocaleString()}
            </div>
            <div className={`font-medium ${isAchieved ? 'text-emerald-600' : 'text-primary-600'}`}>
              {progressPercentage.toFixed(1)}%
            </div>
          </div>

          <div className="relative h-2">
            <div className="absolute inset-0 bg-slate-100 rounded-full">
              <div
                className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                  isAchieved ? 'bg-emerald-500' : 'bg-primary-500'
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {!isAchieved && (
            <div className="flex justify-end text-xs text-slate-500">
              目標まで残り: <span className="font-medium ml-1">¥{remainingAmount.toLocaleString()}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TargetProgress;