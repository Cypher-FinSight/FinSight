import { useProfile, useExpenses, useDebts, useEmergencyFund, useInsurance, useCreditCards } from "@/hooks/useFinanceData";
import { computeHealthScore, HealthScoreResult } from "@/lib/healthScore";

export function useHealthScoreData() {
  const { data: profile } = useProfile();
  const { data: expenses } = useExpenses();
  const { data: debts } = useDebts();
  const { data: emergencyFund } = useEmergencyFund();
  const { data: insurance } = useInsurance();
  const { data: creditCards } = useCreditCards();

  const monthlyIncome = Number(profile?.monthly_income) || 0;

  // Get current month expenses
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const monthExpenses = (expenses || []).filter((e: any) => {
    const d = new Date(e.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const totalExpenses = monthExpenses.reduce((s: number, e: any) => s + Number(e.amount), 0);
  const totalEmi = (debts || []).reduce((s: number, d: any) => s + Number(d.emi_amount), 0);

  const investmentAmount = Number(profile?.insurance_amount) || 0;

  const healthScore: HealthScoreResult = computeHealthScore({
    monthlyIncome,
    totalExpenses,
    totalEmi,
    emergencyFund: Number(emergencyFund?.amount) || 0,
    hasHealthInsurance: insurance?.health_insurance || false,
    hasTermInsurance: insurance?.term_insurance || false,
    cardCount: creditCards?.card_count || 0,
    monthlyCardSpend: Number(creditCards?.monthly_card_spend) || 0,
    investmentAmount,
    miscExpense: 0
  });

  const savings = monthlyIncome - totalExpenses - totalEmi-investmentAmount;

  return {
    monthlyIncome,
    totalExpenses,
    totalEmi,
    savings,
    healthScore,
    expenses: expenses || [],
    monthExpenses,
    debts: debts || [],
    emergencyFund: Number(emergencyFund?.amount) || 0,
    insurance,
    creditCards,
    profile,
    investmentAmount,
  };
}
