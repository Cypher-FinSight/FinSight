import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { TrendingUp, TrendingDown, Lightbulb, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHealthScoreData } from "@/hooks/useHealthScoreData";

const COLORS = [
  "hsl(152, 60%, 42%)",
  "hsl(210, 80%, 55%)",
  "hsl(38, 92%, 55%)",
  "hsl(280, 60%, 55%)",
  "hsl(0, 72%, 55%)",
  "hsl(170, 60%, 45%)",
  "hsl(45, 80%, 50%)",
  "hsl(320, 60%, 50%)",
  "hsl(100, 50%, 45%)",
];

const Insights = () => {
  const { monthExpenses, monthlyIncome, totalExpenses, totalEmi, savings, healthScore } = useHealthScoreData();

  // Aggregate spending by category
  const catMap: Record<string, number> = {};
  (monthExpenses as any[]).forEach((e) => {
    catMap[e.category] = (catMap[e.category] || 0) + Number(e.amount);
  });
  const categoryBreakdown = Object.entries(catMap)
    .map(([name, value], i) => ({ name, value, fill: COLORS[i % COLORS.length] }))
    .sort((a, b) => b.value - a.value);

  const topOverspending = categoryBreakdown.slice(0, 3);

  // Dynamic recommendations
  const recommendations: { icon: any; title: string; desc: string; priority: string }[] = [];
  if (savings < 0) {
    recommendations.push({
      icon: TrendingDown,
      title: "You're overspending!",
      desc: `Your expenses + EMI exceed income by ₹${Math.abs(savings).toLocaleString()}.`,
      priority: "high",
    });
  }
  if (topOverspending.length > 0) {
    recommendations.push({
      icon: TrendingDown,
      title: `Reduce ${topOverspending[0].name} spending`,
      desc: `Your top category is ₹${topOverspending[0].value.toLocaleString()}. Consider cutting back.`,
      priority: "medium",
    });
  }
  if (monthlyIncome > 0 && savings / monthlyIncome < 0.2) {
    recommendations.push({
      icon: TrendingUp,
      title: "Start a Monthly SIP",
      desc: "Even a small SIP can grow significantly over 10+ years with compounding.",
      priority: "medium",
    });
  }
  if (healthScore.finalScore < 70) {
    recommendations.push({
      icon: Lightbulb,
      title: "Improve Your Health Score",
      desc: `Your score is ${healthScore.finalScore}. Focus on savings, debt, and emergency fund.`,
      priority: "high",
    });
  }
  if (recommendations.length === 0) {
    recommendations.push({
      icon: CheckCircle,
      title: "Great job!",
      desc: "Your finances are in good shape. Keep it up!",
      priority: "low",
    });
  }

  const priorityStyles: Record<string, string> = {
    high: "border-destructive/30 bg-destructive/5",
    medium: "border-warning/30 bg-warning/5",
    low: "border-primary/20 bg-accent",
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">Insights</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Spending analysis and personalized recommendations
        </p>
      </div>

      {/* Top Spending Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border bg-card p-6"
      >
        <h2 className="text-lg font-semibold font-display text-card-foreground mb-4">
          Top Spending Categories
        </h2>
        {categoryBreakdown.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">Add expenses to see your spending breakdown</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryBreakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 50%)" angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 50%)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(220, 15%, 90%)",
                  borderRadius: "8px",
                }}
                formatter={(v: number) => [`₹${v}`, "Spent"]}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {categoryBreakdown.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* Top 3 highlight */}
      {topOverspending.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topOverspending.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl border border-border bg-card p-4 text-center"
            >
              <div className="text-2xl mb-2" style={{ color: cat.fill }}>
                #{i + 1}
              </div>
              <p className="text-sm font-semibold text-card-foreground">{cat.name}</p>
              <p className="text-xl font-bold font-display text-card-foreground mt-1">
                ₹{cat.value.toLocaleString()}
              </p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Recommendations */}
      <div>
        <h2 className="text-lg font-semibold font-display text-foreground mb-4">
          Personalized Recommendations
        </h2>
        <div className="space-y-3">
          {recommendations.map((rec, i) => (
            <motion.div
              key={rec.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className={cn("rounded-xl border p-4 flex gap-3", priorityStyles[rec.priority])}
            >
              <rec.icon className="h-5 w-5 mt-0.5 shrink-0 text-card-foreground" />
              <div>
                <p className="text-sm font-semibold text-card-foreground">{rec.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{rec.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Insights;
