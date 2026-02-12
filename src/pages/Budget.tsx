import { useState } from "react";
import { motion } from "framer-motion";
import { categoryIcons } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { AlertTriangle, Plus, Trash2 } from "lucide-react";
import { useBudgets, useUpsertBudget, useDeleteBudget, useExpenses } from "@/hooks/useFinanceData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const categories = [
  "Food & Dining", "Rent", "Transport", "Entertainment",
  "Shopping", "Health", "Utilities", "Education", "Savings",
];

const Budget = () => {
  const { data: budgets = [], isLoading } = useBudgets();
  const { data: expenses = [] } = useExpenses();
  const upsertBudget = useUpsertBudget();
  const deleteBudget = useDeleteBudget();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");

  // Get current month expenses per category
  const now = new Date();
  const spentByCategory: Record<string, number> = {};
  (expenses as any[]).forEach((e) => {
    const d = new Date(e.date);
    if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
      spentByCategory[e.category] = (spentByCategory[e.category] || 0) + Number(e.amount);
    }
  });

  const budgetData = (budgets as any[]).map((b) => ({
    ...b,
    spent: spentByCategory[b.category] || 0,
    limit: Number(b.monthly_limit),
  }));

  const totalLimit = budgetData.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgetData.reduce((s, b) => s + b.spent, 0);

  const handleSave = async () => {
    if (!category || !limit) {
      toast({ title: "Category and limit are required", variant: "destructive" });
      return;
    }
    await upsertBudget.mutateAsync({ category, monthly_limit: Number(limit) });
    toast({ title: "Budget set!" });
    setCategory("");
    setLimit("");
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Budget</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {totalLimit > 0
              ? `₹${totalSpent.toLocaleString()} spent of ₹${totalLimit.toLocaleString()} total budget`
              : "Set your first budget to get started"}
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Set Budget
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Set Category Budget</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {categoryIcons[cat] || "📋"} {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Monthly Limit (₹)</Label>
                <Input type="number" placeholder="5000" value={limit} onChange={(e) => setLimit(e.target.value)} />
              </div>
              <Button className="w-full" onClick={handleSave} disabled={upsertBudget.isPending}>
                {upsertBudget.isPending ? "Saving..." : "Save Budget"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overall progress */}
      {totalLimit > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-card-foreground">Overall Budget</span>
            <span className="text-muted-foreground">
              {Math.round((totalSpent / totalLimit) * 100)}%
            </span>
          </div>
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <motion.div
              className={cn(
                "h-full rounded-full",
                totalSpent / totalLimit > 1 ? "bg-destructive" :
                totalSpent / totalLimit > 0.8 ? "bg-warning" : "bg-primary"
              )}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((totalSpent / totalLimit) * 100, 100)}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      )}

      {/* Category Budgets */}
      <div className="space-y-3">
        {isLoading ? (
          <p className="text-muted-foreground text-center py-8">Loading...</p>
        ) : budgetData.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No budgets set. Add your first budget!</p>
        ) : (
          budgetData.map((budget, i) => {
            const pct = budget.limit > 0 ? (budget.spent / budget.limit) * 100 : 0;
            const isSavings = budget.category === "Savings";
            const over = !isSavings && pct > 100;
            const nearLimit = !isSavings && pct >= 80 && pct <= 100;

            return (
              <motion.div
                key={budget.category}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className={cn(
                  "rounded-xl border p-4",
                  over ? "border-destructive/30 bg-destructive/5" :
                  nearLimit ? "border-warning/30 bg-warning/5" :
                  "border-border bg-card"
                )}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{categoryIcons[budget.category] || "📋"}</span>
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{budget.category}</p>
                      <p className="text-xs text-muted-foreground">
                        ₹{budget.spent.toLocaleString()} / ₹{budget.limit.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {(over || nearLimit) && (
                      <AlertTriangle className={cn("h-4 w-4", over ? "text-destructive" : "text-warning")} />
                    )}
                    <span className={cn(
                      "text-sm font-semibold font-display",
                      isSavings ? "text-success" :
                      over ? "text-destructive" : nearLimit ? "text-warning" : "text-primary"
                    )}>
                      {Math.round(pct)}%
                    </span>
                    <button
                      onClick={() => {
                        deleteBudget.mutate(budget.id);
                        toast({ title: `${budget.category} budget deleted` });
                      }}
                      className="text-muted-foreground hover:text-destructive transition-colors ml-1"
                      title="Delete budget"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className={cn(
                      "h-full rounded-full",
                      isSavings ? "bg-success" :
                      over ? "bg-destructive" : nearLimit ? "bg-warning" : "bg-primary"
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(pct, 100)}%` }}
                    transition={{ duration: 0.8, delay: 0.2 + i * 0.08 }}
                  />
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Budget;
