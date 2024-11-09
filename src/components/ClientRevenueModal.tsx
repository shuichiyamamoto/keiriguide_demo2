import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

interface Client {
  name: string;
  revenue: number;
  projects: number;
  lastInvoice: string;
}

interface ClientRevenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedYear: number;
  onRevenueChange: (total: number) => void;
}

const ClientRevenueModal: React.FC<ClientRevenueModalProps> = ({
  isOpen,
  onClose,
  selectedYear,
  onRevenueChange,
}) => {
  const [clients, setClients] = useState<Client[]>([
    { name: '株式会社テクノロジー', revenue: 2100000, projects: 4, lastInvoice: '2024-02-15' },
    { name: 'デジタルソリューションズ', revenue: 1450000, projects: 3, lastInvoice: '2024-02-28' },
    { name: 'フューチャーイノベーション', revenue: 850000, projects: 2, lastInvoice: '2024-02-20' },
    { name: 'スマートビジネス', revenue: 450000, projects: 1, lastInvoice: '2024-01-31' },
  ]);
  const [editingValues, setEditingValues] = useState<Record<number, string>>({});
  const [pendingChanges, setPendingChanges] = useState<{
    index: number;
    revenue: number;
  } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    const total = clients.reduce((sum, client) => sum + client.revenue, 0);
    onRevenueChange(total);
  }, [clients, onRevenueChange]);

  const handleRevenueEdit = (index: number, value: string) => {
    setEditingValues({ ...editingValues, [index]: value });
  };

  const handleRevenueBlur = (index: number) => {
    const value = editingValues[index];
    if (value !== undefined) {
      const newRevenue = parseInt(value.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(newRevenue) && newRevenue !== clients[index].revenue) {
        setPendingChanges({ index, revenue: newRevenue });
        setShowConfirm(true);
      }
    }
  };

  const handleConfirm = () => {
    if (pendingChanges) {
      const newClients = [...clients];
      newClients[pendingChanges.index] = {
        ...clients[pendingChanges.index],
        revenue: pendingChanges.revenue,
      };
      setClients(newClients);
      // 変更を親コンポーネントに即座に通知
      const newTotal = newClients.reduce((sum, client) => sum + client.revenue, 0);
      onRevenueChange(newTotal);
      setEditingValues({});
      setPendingChanges(null);
    }
    setShowConfirm(false);
  };

  const handleCancel = () => {
    setEditingValues({});
    setPendingChanges(null);
    setShowConfirm(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter') {
      handleRevenueBlur(index);
    } else if (e.key === 'Escape') {
      setEditingValues({});
    }
  };

  if (!isOpen) return null;

  const totalRevenue = clients.reduce((sum, client) => sum + client.revenue, 0);
  const totalProjects = clients.reduce((sum, client) => sum + client.projects, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl mx-4">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">得意先別売上明細</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-500 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-900">得意先名</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900">売上金額</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900">案件数</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-900">最終請求日</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client, index) => (
                  <tr key={client.name} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-4 px-4 text-sm text-slate-900">{client.name}</td>
                    <td className="py-4 px-4 text-sm text-right">
                      <input
                        type="text"
                        value={editingValues[index] !== undefined ? editingValues[index] : client.revenue.toLocaleString()}
                        onChange={(e) => handleRevenueEdit(index, e.target.value)}
                        onBlur={() => handleRevenueBlur(index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className="w-32 text-right border-slate-300 rounded-md focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </td>
                    <td className="py-4 px-4 text-sm text-right text-slate-900">
                      {client.projects}件
                    </td>
                    <td className="py-4 px-4 text-sm text-right text-slate-900">
                      {new Date(client.lastInvoice).toLocaleDateString('ja-JP')}
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-50 font-semibold">
                  <td className="py-4 px-4 text-sm text-slate-900">合計</td>
                  <td className="py-4 px-4 text-sm text-right text-slate-900">
                    ¥{totalRevenue.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-sm text-right text-slate-900">
                    {totalProjects}件
                  </td>
                  <td className="py-4 px-4 text-sm text-right text-slate-900"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        title="売上の変更"
        message="この変更を保存しますか？"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default ClientRevenueModal;