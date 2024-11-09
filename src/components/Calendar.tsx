import React from 'react';
import { Calendar as CalendarIcon, DollarSign, FileText } from 'lucide-react';

interface Event {
  date: string;
  type: 'invoice' | 'payment' | 'tax';
  client?: string;
  amount?: number;
  description: string;
}

interface MonthData {
  revenue: number;
  expenses: number;
  events: Event[];
}

interface CalendarProps {
  selectedYear: number;
}

const Calendar: React.FC<CalendarProps> = ({ selectedYear }) => {
  // サンプルデータ
  const monthsData: Record<string, MonthData> = {
    '1': {
      revenue: 420000,
      expenses: 95000,
      events: [
        { date: '2024-01-15', type: 'invoice', client: '株式会社テクノロジー', amount: 220000, description: '1月分請求' },
        { date: '2024-01-31', type: 'payment', amount: 180000, description: '外注費支払い' },
      ],
    },
    '2': {
      revenue: 380000,
      expenses: 85000,
      events: [
        { date: '2024-02-28', type: 'invoice', client: 'デジタルソリューションズ', amount: 180000, description: '2月分請求' },
      ],
    },
    // 他の月のデータも同様に設定...
  };

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(selectedYear, i);
    return {
      name: date.toLocaleString('ja-JP', { month: 'long' }),
      days: new Date(selectedYear, i + 1, 0).getDate(),
      startDay: new Date(selectedYear, i, 1).getDay(),
      data: monthsData[String(i + 1)] || { revenue: 0, expenses: 0, events: [] },
    };
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
      <h2 className="text-lg font-semibold text-slate-900 mb-6">年間カレンダー</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {months.map((month, index) => (
          <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-slate-900">{month.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{selectedYear}</span>
                </div>
              </div>
              <div className="mt-1 grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center text-emerald-600">
                  <DollarSign className="h-4 w-4 mr-1" />
                  ¥{month.data.revenue.toLocaleString()}
                </div>
                <div className="flex items-center text-red-600">
                  <FileText className="h-4 w-4 mr-1" />
                  ¥{month.data.expenses.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="p-2">
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-600">
                {['日', '月', '火', '水', '木', '金', '土'].map(day => (
                  <div key={day} className="p-1">{day}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 mt-1">
                {Array.from({ length: month.startDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-1" />
                ))}
                {Array.from({ length: month.days }).map((_, i) => {
                  const currentDate = `${selectedYear}-${String(index + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
                  const events = month.data.events.filter(event => event.date === currentDate);
                  
                  return (
                    <div
                      key={i}
                      className={`p-1 text-center text-sm relative ${
                        events.length > 0 ? 'bg-primary-50 rounded-lg' : ''
                      }`}
                    >
                      <span className={`${events.length > 0 ? 'font-medium text-primary-700' : 'text-slate-600'}`}>
                        {i + 1}
                      </span>
                      {events.length > 0 && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
                          <div className="w-1 h-1 bg-primary-500 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            {month.data.events.length > 0 && (
              <div className="px-3 py-2 border-t border-slate-200 bg-slate-50">
                <div className="space-y-1">
                  {month.data.events.map((event, i) => (
                    <div key={i} className="flex items-center text-xs">
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        event.type === 'invoice' ? 'bg-emerald-500' :
                        event.type === 'payment' ? 'bg-red-500' : 'bg-blue-500'
                      }`} />
                      <span className="text-slate-600 truncate">{event.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;