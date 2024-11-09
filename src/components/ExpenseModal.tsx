import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedYear: number;
  onExpensesChange: (total: number) => void;
}

const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  selectedYear,
  onExpensesChange,
}) => {
  const [expenses, setExpenses] = useState([
    { category: '外注費', amount: 450000 },
    { category: '通信費', amount: 180000 },
    { category: '交通費', amount: 120000 },
    { category: 'その他', amount: 250000 },
  ]);

  const handleAmountChange = (index: number, value: string) => {
    const newAmount = parseInt(value.replace(/[^0-9]/g, ''), 10) || 0;
    const newExpenses = [...expenses];
    newExpenses[index] = { ...expenses[index], amount: newAmount };
    setExpenses(newExpenses);
    
    const total = newExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    onExpensesChange(total);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl mx-4">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">経費の編集</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-500 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {expenses.map((expense, index) => (
              <div key={expense.category} className="flex items-center space-x-4">
                <label className="w-32 text-sm font-medium text-slate-700">
                  {expense.category}
                </label>
                <input
                  type="text"
                  value={expense.amount.toLocaleString()}
                  onChange={(e) => handleAmountChange(index, e.target.value)}
                  className="flex-1 rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-200">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-900">合計</span>
              <span className="font-semibold text-slate-900">
                ¥{expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseModal;