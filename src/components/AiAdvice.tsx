import React from 'react';
import { Sparkles } from 'lucide-react';

interface AiAdviceProps {
  annualRevenue: number;
  annualIncome: number;
  revenueTrend: number;
  incomeTrend: number;
  totalExpenses: number;
}

const AiAdvice: React.FC<AiAdviceProps> = ({
  annualRevenue,
  annualIncome,
  revenueTrend,
  incomeTrend,
  totalExpenses,
}) => {
  const getAdvice = () => {
    const profitMargin = (annualIncome / annualRevenue) * 100;
    const expenseRatio = (totalExpenses / annualRevenue) * 100;

    let advice = '';
    
    if (profitMargin < 30) {
      advice = '経費率が高めです。外注費や通信費の見直しで収益改善の余地があります。';
    } else if (profitMargin > 70) {
      advice = '高い収益率を維持できています。この機会に事業拡大や新規サービスの展開を検討してみましょう。';
    } else if (revenueTrend < 0) {
      advice = '売上が前年比マイナスです。既存クライアントとの関係強化や新規営業の強化を検討しましょう。';
    } else if (expenseRatio > 50) {
      advice = '経費の見直しで節税効果が期待できます。特に通信費や消耗品費の見直しを推奨します。';
    } else {
      advice = '安定した経営状態です。さらなる成長のため、新規事業領域の開拓を検討してみましょう。';
    }

    return advice;
  };

  return (
    <div className="bg-gradient-to-r from-primary-50 to-slate-50 rounded-xl p-6 shadow-sm border border-primary-100">
      <div className="flex items-center space-x-3 mb-3">
        <Sparkles className="h-5 w-5 text-primary-500" />
        <h3 className="text-base font-semibold text-slate-900">AIアドバイス</h3>
      </div>
      <p className="text-slate-700 leading-relaxed">{getAdvice()}</p>
    </div>
  );
};

export default AiAdvice;