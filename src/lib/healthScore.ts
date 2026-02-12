export interface HealthScoreInput {
  monthlyIncome: number;
  totalExpenses: number;
  totalEmi: number;
  emergencyFund: number;
  hasHealthInsurance: boolean;
  hasTermInsurance: boolean;
  cardCount: number;
  monthlyCardSpend: number;
  investmentAmount: number;

  // NEW INPUT
  miscExpense: number;
}

export interface HealthScoreResult {
  finalScore: number;
  label: string;
  subscores: { name: string; score: number; weight: number }[];
}

export function computeHealthScore(input: HealthScoreInput): HealthScoreResult {
  const {
    monthlyIncome,
    totalExpenses,
    totalEmi,
    emergencyFund,
    hasHealthInsurance,
    hasTermInsurance,
    cardCount,
    monthlyCardSpend,
    investmentAmount,
    miscExpense
  } = input;

  if (monthlyIncome <= 0) {
    return { finalScore: 0, label: "Poor", subscores: [] };
  }

  const savings = monthlyIncome - totalExpenses - totalEmi-investmentAmount;
  const savingsRate = savings / monthlyIncome;

  // =========================
  // Discipline Score (D)
  // =========================
  const D = Math.max(0, Math.min(100, savingsRate * 333));

  // =========================
  // Investment Score (I) - ELSE IF LADDER
  // =========================
  const investRatio = investmentAmount / monthlyIncome;

  let I = 0;
  if (investRatio >= 0.25) I = 100;
  else if (investRatio >= 0.20) I = 85;
  else if (investRatio >= 0.15) I = 70;
  else if (investRatio >= 0.10) I = 55;
  else if (investRatio >= 0.05) I = 35;
  else if (investRatio > 0) I = 20;
  else I = 0;

  // =========================
  // Debt Burden Score (B)
  // =========================
  const debtRatio = totalEmi / monthlyIncome;
  const B =
    debtRatio === 0
      ? 100
      : Math.max(0, Math.min(100, (1 - debtRatio / 0.5) * 100));

  // =========================
  // Emergency Fund Score (E)
  // =========================
  const monthlyExp = totalExpenses > 0 ? totalExpenses : 1;
  const emergencyMonths = emergencyFund / monthlyExp;
  const E = Math.max(0, Math.min(100, (emergencyMonths / 6) * 100));

  // =========================
  // Insurance Score (U)
  // =========================
  const U = (hasHealthInsurance ? 50 : 0) + (hasTermInsurance ? 50 : 0);

  // =========================
  // Credit Dependency Score (C) - OPTIMIZED
  // =========================
  const creditRatio = monthlyCardSpend / monthlyIncome;

  let spendScore = 0;
  if (creditRatio <= 0.10) spendScore = 100;
  else if (creditRatio <= 0.20) spendScore = 80;
  else if (creditRatio <= 0.30) spendScore = 60;
  else if (creditRatio <= 0.40) spendScore = 40;
  else spendScore = 20;

  let cardPenalty = 0;

  // Income-based credit card penalty
  if (monthlyIncome < 30000) {
    if (cardCount >= 4) cardPenalty = 40;
    else if (cardCount === 3) cardPenalty = 25;
    else if (cardCount === 2) cardPenalty = 10;
  } else if (monthlyIncome < 80000) {
    if (cardCount >= 5) cardPenalty = 30;
    else if (cardCount === 4) cardPenalty = 20;
    else if (cardCount === 3) cardPenalty = 10;
  } else {
    // High income users: card count matters less
    if (cardCount >= 7) cardPenalty = 15;
    else if (cardCount >= 5) cardPenalty = 8;
  }

  let C = spendScore - cardPenalty;
  C = Math.max(0, Math.min(100, C));

  // =========================
  // Misc Leakage Score (M) - NEW
  // =========================
  const miscRatio = miscExpense / monthlyIncome;

  let M = 0;
  if (miscRatio <= 0.05) M = 100;
  else if (miscRatio <= 0.10) M = 80;
  else if (miscRatio <= 0.15) M = 60;
  else if (miscRatio <= 0.20) M = 40;
  else if (miscRatio <= 0.30) M = 20;
  else M = 5;

  // =========================
  // Final Score
  // =========================
  const raw =
    0.20 * D +
    0.25 * I +
    0.20 * B +
    0.15 * E +
    0.10 * U +
    0.05 * C +
    0.05 * M;

  const finalScore = Math.round(Math.max(0, Math.min(100, raw)));

  const label =
    finalScore <= 40
      ? "Poor"
      : finalScore <= 70
      ? "Average"
      : finalScore <= 85
      ? "Good"
      : "Excellent";

  const subscores = [
    { name: "Discipline", score: Math.round(D), weight: 0.20 },
    { name: "Investment %", score: Math.round(I), weight: 0.25 },
    { name: "EMI Burden", score: Math.round(B), weight: 0.20 },
    { name: "Emergency Fund", score: Math.round(E), weight: 0.15 },
    { name: "Insurance", score: Math.round(U), weight: 0.10 },
    { name: "Credit Card Dependency", score: Math.round(C), weight: 0.05 },
    { name: "Misc. Leakage", score: Math.round(M), weight: 0.05 },
  ];

  return { finalScore, label, subscores };
}