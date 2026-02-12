import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter, Trash2 } from "lucide-react";
import { categoryIcons } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useExpenses, useAddExpense, useDeleteExpense } from "@/hooks/useFinanceData";
import { useToast } from "@/hooks/use-toast";

const categories = [
  "Food & Dining", "Rent", "Transport", "Entertainment",
  "Shopping", "Health", "Utilities", "Education", "Savings",
];

const Expenses = () => {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const { toast } = useToast();

  const { data: expenses = [], isLoading } = useExpenses();
  const addExpense = useAddExpense();
  const deleteExpense = useDeleteExpense();

  const filtered = expenses.filter((e: any) => {
    const matchSearch =
      (e.description || "").toLowerCase().includes(search.toLowerCase()) ||
      (e.category || "").toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "all" || e.category === filterCat;
    return matchSearch && matchCat;
  });

  const handleSave = async () => {
    if (!amount || !category) {
      toast({ title: "Amount and category are required", variant: "destructive" });
      return;
    }
    await addExpense.mutateAsync({
      amount: Number(amount),
      category,
      description: note,
      date,
    });
    toast({ title: "Expense added!" });
    setAmount("");
    setCategory("");
    setNote("");
    setDate(new Date().toISOString().split("T")[0]);
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Expenses</h1>
          <p className="text-sm text-muted-foreground mt-1">Track and manage your spending</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-display">Add New Expense</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Amount (₹)</Label>
                <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
              </div>
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
                <Label>Note / Merchant</Label>
                <Input placeholder="e.g. Grocery Store" value={note} onChange={(e) => setNote(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <Button className="w-full" onClick={handleSave} disabled={addExpense.isPending}>
                {addExpense.isPending ? "Saving..." : "Save Expense"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search expenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterCat} onValueChange={setFilterCat}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Expense List */}
      <div className="space-y-2">
        {isLoading ? (
          <p className="text-muted-foreground text-center py-8">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No expenses yet. Add your first expense!</p>
        ) : (
          filtered.map((expense: any, i: number) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-4 hover-lift cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-lg">
                  {categoryIcons[expense.category] || "📋"}
                </div>
                <div>
                  <p className="text-sm font-medium text-card-foreground">{expense.description || "No note"}</p>
                  <p className="text-xs text-muted-foreground">{expense.category} · {expense.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold font-display text-destructive">
                  -₹{Number(expense.amount).toLocaleString()}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => deleteExpense.mutate(expense.id)}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Expenses;
