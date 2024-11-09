import React, { useState, useEffect } from 'react';
import { LineChart, Wallet, Calculator, Receipt, Building2, CircleDollarSign } from 'lucide-react';
import MetricCard from './MetricCard';
import RevenueChart from './RevenueChart';
import ExpenseBreakdown from './ExpenseBreakdown';
import ClientRevenueModal from './ClientRevenueModal';
import YearSelector from './YearSelector';
import AiAdvice from './AiAdvice';
import TargetProgress from './TargetProgress';
import { calculateIncomeTax, calculateResidentTax } from '../utils/taxCalculator';

const Dashboard: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [annualRevenue, setAnnualRevenue] = useState(4800000);
  const [totalExpenses, setTotalExpenses] = useState(1000000);
  const [targetRevenue, setTargetRevenue] = useState(6000000);
  const [withholdingTax, setWithholdingTax] = useState(() => {
    return Math.floor(4800000 * 0.1021);
  });
  const [isBlueForm, setIsBlueForm] = useState(true);

  const revenueTrend = 12.5;
  const annualIncome = annualRevenue - totalExpenses;
  const incomeTax = calculateIncomeTax(annualIncome, isBlueForm);
  const residentTax = calculateResidentTax(annualIncome, isBlueForm);
  const taxPayable = incomeTax - withholdingTax;

  const handleExpensesChange = (expenses: number) => {
    setTotalExpenses(expenses);
  };

  const handleRevenueChange = (revenue: number) => {
    setAnnualRevenue(revenue);
  };

  useEffect(() => {
    const calculatedWithholding = Math.floor(annualRevenue * 0.1021);
    setWithholdingTax(calculatedWithholding);
  }, [annualRevenue]);

  const formatTaxPayable = (amount: number) => {
    if (amount < 0) {
      return `△¥${Math.abs(amount).toLocaleString()}`;
    }
    return `¥${amount.toLocaleString()}`;
  };

  const getTaxPayableSubtitle = (amount: number) => {
    if (amount < 0) {
      return "還付金額";
    }
    return "所得税額 - 源泉徴収";
  };

  const sections = [
    {
      id: 'target',
      type: 'target',
      component: (
        <TargetProgress
          currentRevenue={annualRevenue}
          targetRevenue={targetRevenue}
          onTargetChange={setTargetRevenue}
        />
      ),
    },
    {
      id: 'metrics',
      type: 'metrics',
      component: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          <div className="lg:col-span-1">
            <MetricCard
              title="年間累計売上"
              value={`¥${annualRevenue.toLocaleString()}`}
              icon={<LineChart className="h-6 w-6" />}
              trend={revenueTrend ? `${revenueTrend > 0 ? '+' : ''}${revenueTrend.toFixed(1)}%` : undefined}
              trendDirection={revenueTrend >= 0 ? 'up' : 'down'}
              onClick={() => setIsClientModalOpen(true)}
            />
          </div>
          <div className="lg:col-span-1">
            <MetricCard
              title="年間累計損益"
              value={`¥${annualIncome.toLocaleString()}`}
              icon={<Wallet className="h-6 w-6" />}
              subtitle={isBlueForm ? "青色申告特別控除前" : "売上 - 経費"}
            />
          </div>
          <div className="lg:col-span-1">
            <MetricCard
              title="源泉徴収税額"
              value={`¥${withholdingTax.toLocaleString()}`}
              icon={<Receipt className="h-6 w-6" />}
              isEditable={true}
              onValueChange={(value) => setWithholdingTax(value)}
            />
          </div>
          <div className="lg:col-span-1">
            <MetricCard
              title="予想所得税額"
              value={`¥${incomeTax.toLocaleString()}`}
              icon={<Calculator className="h-6 w-6" />}
              subtitle={isBlueForm ? "青色申告控除後の税額" : "確定申告試算"}
            />
          </div>
          <div className="lg:col-span-1">
            <MetricCard
              title="予想納付税額"
              value={formatTaxPayable(taxPayable)}
              icon={<CircleDollarSign className="h-6 w-6" />}
              subtitle={getTaxPayableSubtitle(taxPayable)}
              valueColor={taxPayable < 0 ? 'text-blue-600' : undefined}
            />
          </div>
          <div className="lg:col-span-1">
            <MetricCard
              title="予想住民税額"
              value={`¥${residentTax.toLocaleString()}`}
              icon={<Building2 className="h-6 w-6" />}
              subtitle={isBlueForm ? "青色申告控除後の税額" : "翌年度住民税"}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'charts',
      type: 'chart',
      component: (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">本年分売上推移</h2>
            <RevenueChart selectedYear={selectedYear} />
          </div>
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-6 border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">経費内訳</h2>
            <ExpenseBreakdown
              selectedYear={selectedYear}
              onTotalExpensesChange={handleExpensesChange}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'ai-advice',
      type: 'ai',
      component: (
        <AiAdvice
          annualRevenue={annualRevenue}
          annualIncome={annualIncome}
          revenueTrend={revenueTrend}
          incomeTrend={0}
          totalExpenses={totalExpenses}
        />
      ),
    },
  ];

  return (
    <div className="flex-1">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold text-gray-900">ダッシュボード</h1>
            </div>
            <div className="flex items-center">
              <YearSelector
                selectedYear={selectedYear}
                onChange={setSelectedYear}
                minYear={2022}
                maxYear={2024}
              />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.id}>{section.component}</div>
          ))}
        </div>

        {isClientModalOpen && (
          <ClientRevenueModal
            isOpen={isClientModalOpen}
            onClose={() => setIsClientModalOpen(false)}
            selectedYear={selectedYear}
            onRevenueChange={handleRevenueChange}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;