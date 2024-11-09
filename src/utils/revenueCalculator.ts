interface MonthlyData {
  revenue: number[];
  expenses: number[];
}

interface YearData {
  currentYearData: MonthlyData;
  previousYearData: MonthlyData;
}

export function getMonthlyData(selectedYear: number): YearData {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const isCurrentYear = selectedYear === currentDate.getFullYear();
  const monthsToInclude = isCurrentYear ? currentMonth + 1 : 12;
  
  // サンプルデータ（実際のアプリケーションではAPIやデータベースから取得）
  const currentYearRevenue = Array(12).fill(0).map(() => Math.floor(Math.random() * (550000 - 380000) + 380000));
  const previousYearRevenue = Array(12).fill(0).map(() => Math.floor(Math.random() * (500000 - 350000) + 350000));
  const currentYearExpenses = Array(12).fill(0).map(() => Math.floor(Math.random() * (95000 - 75000) + 75000));
  const previousYearExpenses = Array(12).fill(0).map(() => Math.floor(Math.random() * (90000 - 70000) + 70000));

  return {
    currentYearData: {
      revenue: currentYearRevenue.slice(0, monthsToInclude),
      expenses: currentYearExpenses.slice(0, monthsToInclude),
    },
    previousYearData: {
      revenue: previousYearRevenue.slice(0, monthsToInclude),
      expenses: previousYearExpenses.slice(0, monthsToInclude),
    },
  };
}

export function calculateYearOverYearChange(currentData: number[], previousData: number[]): number {
  if (!Array.isArray(currentData) || !Array.isArray(previousData)) {
    return 0;
  }

  const currentTotal = Array.isArray(currentData) ? currentData.reduce((sum, value) => sum + value, 0) : 0;
  const previousTotal = Array.isArray(previousData) ? previousData.reduce((sum, value) => sum + value, 0) : 0;
  
  if (previousTotal === 0) return 0;
  return ((currentTotal - previousTotal) / previousTotal) * 100;
}