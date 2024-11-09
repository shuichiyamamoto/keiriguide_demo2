import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Edit2 } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ExpenseBreakdownProps {
  selectedYear: number;
  onTotalExpensesChange: (total: number) => void;
}

const ExpenseBreakdown: React.FC<ExpenseBreakdownProps> = ({
  selectedYear,
  onTotalExpensesChange,
}) => {
  const [expenses, setExpenses] = useState([
    { category: '外注費', amount: 450000 },
    { category: '通信費', amount: 180000 },
    { category: '交通費', amount: 120000 },
    { category: 'その他', amount: 250000 },
  ]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempAmount, setTempAmount] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<{
    index: number;
    amount: number;
  } | null>(null);

  useEffect(() => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    onTotalExpensesChange(total);
  }, [expenses, onTotalExpensesChange]);

  const handleAmountEdit = (index: number) => {
    setEditingIndex(index);
    setTempAmount(expenses[index].amount.toLocaleString());
  };

  const handleAmountChange = (index: number) => {
    const newAmount = parseInt(tempAmount.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(newAmount)) {
      setPendingChanges({ index, amount: newAmount });
      setShowConfirm(true);
    }
    setEditingIndex(null);
  };

  const handleConfirm = () => {
    if (pendingChanges) {
      const newExpenses = [...expenses];
      newExpenses[pendingChanges.index] = {
        ...expenses[pendingChanges.index],
        amount: pendingChanges.amount,
      };
      setExpenses(newExpenses);
      const newTotal = newExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      onTotalExpensesChange(newTotal);
      setPendingChanges(null);
    }
    setShowConfirm(false);
  };

  const handleCancel = () => {
    setPendingChanges(null);
    setShowConfirm(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      handleAmountChange(index);
    } else if (e.key === 'Escape') {
      setEditingIndex(null);
    }
  };

  const data = {
    labels: expenses.map(e => e.category),
    datasets: [
      {
        data: expenses.map(e => e.amount),
        backgroundColor: [
          'rgba(79, 70, 229, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(209, 213, 219, 0.8)',
        ],
        borderColor: [
          'rgba(79, 70, 229, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(209, 213, 219, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const value = context.raw;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `¥${value.toLocaleString()} (${percentage}%)`;
          },
        },
      },
    },
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="flex flex-col items-center">
      <div className="w-48 h-48 mb-6">
        <Doughnut data={data} options={options} />
      </div>
      
      <div className="w-full max-w-sm">
        <div className="space-y-2">
          {expenses.map((expense, index) => (
            <div key={expense.category} className="flex justify-between items-center text-sm group">
              <div className="flex items-center space-x-2">
                <span className={`w-3 h-3 rounded-full bg-${
                  index === 0 ? 'primary-600' :
                  index === 1 ? 'blue-500' :
                  index === 2 ? 'emerald-500' :
                  'gray-400'
                }`} />
                <span className="text-slate-600">{expense.category}</span>
              </div>
              <div className="flex items-center space-x-2">
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={tempAmount}
                    onChange={(e) => setTempAmount(e.target.value)}
                    onBlur={() => handleAmountChange(index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-28 text-right border-b border-primary-500 focus:outline-none bg-transparent"
                    autoFocus
                  />
                ) : (
                  <>
                    <span className="font-medium text-slate-900">
                      ¥{expense.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleAmountEdit(index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit2 className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-slate-200">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-slate-800">合計</span>
            <span className="font-semibold text-slate-900">
              ¥{totalExpenses.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="経費の変更"
        message="この変更を保存しますか？"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default ExpenseBreakdown;