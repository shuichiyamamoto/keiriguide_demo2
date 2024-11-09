interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
  deduction: number;
}

const TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 1950000, rate: 0.05, deduction: 0 },
  { min: 1950000, max: 3300000, rate: 0.10, deduction: 97500 },
  { min: 3300000, max: 6950000, rate: 0.20, deduction: 427500 },
  { min: 6950000, max: 9000000, rate: 0.23, deduction: 636000 },
  { min: 9000000, max: 18000000, rate: 0.33, deduction: 1536000 },
  { min: 18000000, max: 40000000, rate: 0.40, deduction: 2796000 },
  { min: 40000000, max: null, rate: 0.45, deduction: 4796000 },
];

const BLUE_FORM_DEDUCTION = 650000; // 青色申告特別控除額

export function getTaxBracket(income: number): TaxBracket | undefined {
  return TAX_BRACKETS.find(
    (b) => income >= b.min && (b.max === null || income < b.max)
  );
}

export function calculateIncomeTax(income: number, isBlueForm: boolean = true): number {
  // 青色申告の場合、特別控除を適用
  const taxableIncome = isBlueForm ? Math.max(income - BLUE_FORM_DEDUCTION, 0) : income;
  
  const bracket = getTaxBracket(taxableIncome);
  if (!bracket) return 0;
  return Math.max(Math.floor(taxableIncome * bracket.rate - bracket.deduction), 0);
}

export function calculateResidentTax(income: number, isBlueForm: boolean = true): number {
  // 青色申告の場合、特別控除を適用した後に住民税率を乗じる
  const taxableIncome = isBlueForm ? Math.max(income - BLUE_FORM_DEDUCTION, 0) : income;
  return Math.floor(taxableIncome * 0.10);
}