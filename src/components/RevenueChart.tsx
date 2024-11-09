import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface RevenueChartProps {
  selectedYear: number;
}

const RevenueChart: React.FC<RevenueChartProps> = ({ selectedYear }) => {
  const currentMonth = new Date().getMonth();
  const labels = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(selectedYear, i);
    return date.toLocaleString('ja-JP', { month: 'short' });
  });

  const monthlyRevenue = [420000, 380000, 450000, 520000, 480000, 550000, 420000, 380000, 450000, 400000, 380000, 420000];
  const cumulativeRevenue = monthlyRevenue.reduce(
    (acc: number[], current: number) => [...acc, (acc[acc.length - 1] || 0) + current],
    []
  );

  const data = {
    labels,
    datasets: [
      {
        type: 'line' as const,
        label: '累計売上',
        data: cumulativeRevenue,
        borderColor: 'rgb(79, 70, 229)',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y1',
      },
      {
        type: 'bar' as const,
        label: '月次売上',
        data: monthlyRevenue,
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        yAxisID: 'y',
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: '月次売上 (円)',
        },
        ticks: {
          callback: (value: number) => `¥${value.toLocaleString()}`,
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: '累計売上 (円)',
        },
        ticks: {
          callback: (value: number) => `¥${value.toLocaleString()}`,
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return <Line options={options} data={data} />;
};

export default RevenueChart;