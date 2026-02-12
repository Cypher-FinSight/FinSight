import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  WalletMinimal,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  Settings,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import StatCard from "@/components/StatCard";
import HealthScoreGauge from "@/components/HealthScoreGauge";
import ScoreBreakdown from "@/components/ScoreBreakdown";
import { cn } from "@/lib/utils";
import { useHealthScoreData } from "@/hooks/useHealthScoreData";
import { useDebts, useAddDebt, useDeleteDebt, useUpsertInsurance, useUpsertCreditCards } from "@/hooks/useFinanceData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const COLORS = [
  "hsl(152, 60%, 42%)",
  "hsl(210, 80%, 55%)",
  "hsl(38, 92%, 55%)",
  "hsl(280, 60%, 55%)",
  "hsl(0, 72%, 55%)",
  "hsl(170, 60%, 45%)",
  "hsl(45, 80%, 50%)",
];

const Dashboard = () => {
  const {
    monthlyIncome,
    totalExpenses,
    totalEmi,
    savings,
    healthScore,
    monthExpenses,
    debts,
    insurance,
    creditCards,
    profile,
    investmentAmount,
  } = useHealthScoreData();

  const addDebt = useAddDebt();
  const deleteDebt = useDeleteDebt();
  const upsertInsurance = useUpsertInsurance();
  const upsertCreditCards = useUpsertCreditCards();
  const { toast } = useToast();

  const [debtOpen, setDebtOpen] = useState(false);
  const [debtEmi, setDebtEmi] = useState("");
  const [debtType, setDebtType] = useState("");

  const [insurOpen, setInsurOpen] = useState(false);
  const [healthIns, setHealthIns] = useState(insurance?.health_insurance || false);
  const [termIns, setTermIns] = useState(insurance?.term_insurance || false);

  const [ccOpen, setCcOpen] = useState(false);
  const [cardCount, setCardCount] = useState(creditCards?.card_count?.toString() || "0");
  const [cardSpend, setCardSpend] = useState(creditCards?.monthly_card_spend?.toString() || "0");

  // Category breakdown for pie chart
  const catMap: Record<string, number> = {};
  (monthExpenses as any[]).forEach((e) => {
    catMap[e.category] = (catMap[e.category] || 0) + Number(e.amount);
  });
  const categoryBreakdown = Object.entries(catMap).map(([name, value], i) => ({
    name,
    value,
    fill: COLORS[i % COLORS.length],
  }));

  const displayName = profile?.name || "User";

  // Score breakdown for the gauge
  const scoreBreakdownItems = healthScore.subscores.map((s) => ({
    label: s.name,
    score: Math.round(s.score * s.weight),
    maxScore: Math.round(100 * s.weight),
  }));

  // Dynamic insights
  const insights: { type: "warning" | "tip" | "success"; title: string; description: string }[] = [];
  if (savings < 0) {
    insights.push({ type: "warning", title: "Overspending Alert", description: `You're spending ₹${Math.abs(savings).toLocaleString()} more than your income.` });
  }
  if (totalEmi > monthlyIncome * 0.4 && monthlyIncome > 0) {
    insights.push({ type: "warning", title: "High EMI Burden", description: `EMIs take ${Math.round((totalEmi / monthlyIncome) * 100)}% of income. Try to keep it under 40%.` });
  }
  if (monthlyIncome > 0 && savings / monthlyIncome > 0.2) {
    insights.push({ type: "success", title: "Great Savings Rate", description: `You're saving ${Math.round((savings / monthlyIncome) * 100)}% of your income. Keep it up!` });
  }
  if (healthScore.finalScore < 50) {
    insights.push({ type: "tip", title: "Improve Your Score", description: "Focus on reducing debt, building emergency fund, and getting insurance." });
  }
  if (insights.length === 0) {
    insights.push({ type: "tip", title: "Add your financial data", description: "Set up your income, expenses, and budgets to get personalized insights." });
  }

  const insightIcons = { warning: AlertTriangle, tip: Lightbulb, success: CheckCircle };
  const insightStyles = {
    warning: "border-warning/30 bg-warning/5",
    tip: "border-info/30 bg-info/5",
    success: "border-success/30 bg-success/5",
  };
  const insightIconStyles = {
    warning: "text-warning",
    tip: "text-info",
    success: "text-success",
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">
          Good morning, {displayName} 👋
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Here's your financial overview
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Monthly Income" value={`₹${monthlyIncome.toLocaleString()}`} icon={Wallet} variant="primary" />
        <StatCard title="Total Expenses" value={`₹${totalExpenses.toLocaleString()}`} icon={TrendingDown} />
        <StatCard title="Total Investment" value={`₹${investmentAmount.toLocaleString()}`} icon={TrendingDown} />
        <StatCard
          title="Miscellaneous"
          value={`₹${savings.toLocaleString()}`}
          icon={WalletMinimal}
          variant={savings > 0 ? "primary" : undefined}
        />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={() => setDebtOpen(true)}>Add Debt / EMI</Button>
        <Button variant="outline" size="sm" onClick={() => {
          setHealthIns(insurance?.health_insurance || false);
          setTermIns(insurance?.term_insurance || false);
          setInsurOpen(true);
        }}>Insurance Details</Button>
        <Button variant="outline" size="sm" onClick={() => {
          setCardCount(creditCards?.card_count?.toString() || "0");
          setCardSpend(creditCards?.monthly_card_spend?.toString() || "0");
          setCcOpen(true);
        }}>Credit Card Info</Button>
      </div>

      {/* Debts List */}
      {debts.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold text-card-foreground mb-3">Active Debts</h3>
          <div className="space-y-2">
            {(debts as any[]).map((d) => (
              <div key={d.id} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{d.debt_type}</span>
                <div className="flex items-center gap-3">
                  <span className="font-medium text-card-foreground">₹{Number(d.emi_amount).toLocaleString()}/mo</span>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs" onClick={() => deleteDebt.mutate(d.id)}>✕</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Score + Category Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-6 lg:col-span-1"
        >
          <h2 className="text-lg font-semibold font-display text-card-foreground mb-4">
            Finance Health Score
          </h2>
          <HealthScoreGauge score={healthScore.finalScore} />
          <div className="mt-6">
            <ScoreBreakdown items={scoreBreakdownItems} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-border bg-card p-6 lg:col-span-2"
        >
          <h2 className="text-lg font-semibold font-display text-card-foreground mb-4">
            Spending by Category
          </h2>
          {categoryBreakdown.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">Add expenses to see your spending breakdown</p>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-6">
               <ResponsiveContainer width={220} height={220}>
                 <PieChart>
                   <Pie data={categoryBreakdown} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={100} paddingAngle={2}>
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {categoryBreakdown.map((cat) => (
                  <div key={cat.name} className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: cat.fill }} />
                    <span className="text-muted-foreground">{cat.name}</span>
                    <span className="font-medium text-card-foreground ml-auto">₹{cat.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Insights */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <h2 className="text-lg font-semibold font-display text-foreground mb-4">Smart Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {insights.map((insight, i) => {
            const Icon = insightIcons[insight.type];
            return (
              <div key={i} className={cn("rounded-xl border p-4 flex gap-3", insightStyles[insight.type])}>
                <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", insightIconStyles[insight.type])} />
                <div>
                  <p className="text-sm font-semibold text-card-foreground">{insight.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Add Debt Dialog */}
      <Dialog open={debtOpen} onOpenChange={setDebtOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Add Debt / EMI</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Debt Type</Label>
              <Input placeholder="Home Loan, Car Loan, etc." value={debtType} onChange={(e) => setDebtType(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Monthly EMI (₹)</Label>
              <Input type="number" placeholder="10000" value={debtEmi} onChange={(e) => setDebtEmi(e.target.value)} />
            </div>
            <Button className="w-full" onClick={async () => {
              if (!debtType || !debtEmi) { toast({ title: "Fill all fields", variant: "destructive" }); return; }
              await addDebt.mutateAsync({ emi_amount: Number(debtEmi), debt_type: debtType });
              toast({ title: "Debt added!" });
              setDebtType(""); setDebtEmi(""); setDebtOpen(false);
            }} disabled={addDebt.isPending}>
              {addDebt.isPending ? "Saving..." : "Add Debt"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Insurance Dialog */}
      <Dialog open={insurOpen} onOpenChange={setInsurOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Insurance Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <Label>Health Insurance</Label>
              <Switch checked={healthIns} onCheckedChange={setHealthIns} />
            </div>
            <div className="flex items-center justify-between">
              <Label>Term Insurance</Label>
              <Switch checked={termIns} onCheckedChange={setTermIns} />
            </div>
            <Button className="w-full" onClick={async () => {
              await upsertInsurance.mutateAsync({ health_insurance: healthIns, term_insurance: termIns });
              toast({ title: "Insurance updated!" });
              setInsurOpen(false);
            }}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Credit Card Dialog */}
      <Dialog open={ccOpen} onOpenChange={setCcOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Credit Card Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Number of Cards</Label>
              <Input type="number" value={cardCount} onChange={(e) => setCardCount(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Monthly Card Spend (₹)</Label>
              <Input type="number" value={cardSpend} onChange={(e) => setCardSpend(e.target.value)} />
            </div>
            <Button className="w-full" onClick={async () => {
              await upsertCreditCards.mutateAsync({ card_count: Number(cardCount), monthly_card_spend: Number(cardSpend) });
              toast({ title: "Credit card info updated!" });
              setCcOpen(false);
            }}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
