import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, ShieldCheck, Target, AlertTriangle, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { useHealthScoreData } from "@/hooks/useHealthScoreData";
import { useUpsertEmergencyFund } from "@/hooks/useFinanceData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const EmergencyFund = () => {
  const { totalExpenses, emergencyFund } = useHealthScoreData();
  const upsertFund = useUpsertEmergencyFund();
  const { toast } = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState("");

  const monthlyExpenses = totalExpenses > 0 ? totalExpenses : 1;
  const ratio = emergencyFund / monthlyExpenses;
  const targetMonths = 6;
  const targetAmount = monthlyExpenses * targetMonths;
  const progress = (emergencyFund / targetAmount) * 100;

  const isLow = ratio < 1;
  const isModerate = ratio >= 1 && ratio < 3;

  const handleSave = async () => {
    if (!fundAmount) {
      toast({ title: "Enter a valid amount", variant: "destructive" });
      return;
    }
    await upsertFund.mutateAsync(Number(fundAmount));
    toast({ title: "Emergency fund updated!" });
    setEditOpen(false);
  };

  const openEdit = () => {
    setFundAmount(emergencyFund.toString());
    setEditOpen(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Emergency Fund</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ensure you're prepared for unexpected expenses
          </p>
        </div>
        <Button onClick={openEdit}>
          <Edit className="h-4 w-4 mr-2" />
          Update Fund
        </Button>
      </div>

      {/* Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "rounded-xl border p-6",
          isLow ? "border-destructive/30 bg-destructive/5" :
          isModerate ? "border-warning/30 bg-warning/5" :
          "border-success/30 bg-success/5"
        )}
      >
        <div className="flex items-start gap-4">
          {isLow ? (
            <AlertTriangle className="h-8 w-8 text-destructive shrink-0" />
          ) : isModerate ? (
            <ShieldAlert className="h-8 w-8 text-warning shrink-0" />
          ) : (
            <ShieldCheck className="h-8 w-8 text-success shrink-0" />
          )}
          <div>
            <h2 className="text-lg font-semibold font-display text-card-foreground">
              {isLow ? "⚠️ Emergency Fund Critical" :
               isModerate ? "🟡 Emergency Fund Needs Attention" :
               "✅ Emergency Fund Healthy"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Your emergency fund covers{" "}
              <span className={cn("font-bold", isLow ? "text-destructive" : isModerate ? "text-warning" : "text-success")}>
                {ratio.toFixed(1)} months
              </span>{" "}
              of expenses. Recommended: 3-6 months.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl border border-border bg-card p-5 text-center"
        >
          <p className="text-sm text-muted-foreground">Emergency Fund</p>
          <p className="text-3xl font-bold font-display text-card-foreground mt-2">
            ₹{emergencyFund.toLocaleString()}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-5 text-center"
        >
          <p className="text-sm text-muted-foreground">Monthly Expenses</p>
          <p className="text-3xl font-bold font-display text-card-foreground mt-2">
            ₹{totalExpenses.toLocaleString()}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-xl border border-border bg-card p-5 text-center"
        >
          <p className="text-sm text-muted-foreground">Target (6 months)</p>
          <p className="text-3xl font-bold font-display text-primary mt-2">
            ₹{targetAmount.toLocaleString()}
          </p>
        </motion.div>
      </div>

      {/* Progress to target */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-xl border border-border bg-card p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold font-display text-card-foreground">
            Progress to Target
          </h2>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">₹{emergencyFund.toLocaleString()}</span>
          <span className="text-muted-foreground">₹{targetAmount.toLocaleString()}</span>
        </div>
        <div className="h-4 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>
        {targetAmount > emergencyFund && (
          <p className="text-sm text-muted-foreground mt-3">
            You need ₹{(targetAmount - emergencyFund).toLocaleString()} more to reach your 6-month emergency fund target.
          </p>
        )}
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Update Emergency Fund</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Emergency Fund Amount (₹)</Label>
              <Input type="number" value={fundAmount} onChange={(e) => setFundAmount(e.target.value)} placeholder="50000" />
            </div>
            <Button className="w-full" onClick={handleSave} disabled={upsertFund.isPending}>
              {upsertFund.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmergencyFund;
