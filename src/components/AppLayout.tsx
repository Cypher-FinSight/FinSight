import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Receipt,
  WalletMinimal,
  TrendingUp,
  ShieldAlert,
  Calculator,
  Menu,
  X,
  LogOut,
  Settings,
  Users,
} from "lucide-react";
import finsightLogo from "@/assets/finsight-logo.png";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile, useUpdateProfile } from "@/hooks/useFinanceData";
import { useHealthScoreData } from "@/hooks/useHealthScoreData";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/expenses", icon: Receipt, label: "Expenses" },
  { to: "/budget", icon: WalletMinimal, label: "Budget" },
  { to: "/insights", icon: TrendingUp, label: "Insights" },
  { to: "/emergency", icon: ShieldAlert, label: "Emergency Fund" },
  { to: "/calculator", icon: Calculator, label: "SIP / SWP" },
  { to: "/consultants", icon: Users, label: "FinSight Academy" },
];

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { data: profile } = useProfile();
  const { healthScore } = useHealthScoreData();
  const updateProfile = useUpdateProfile();
  const { toast } = useToast();
  const [setupOpen, setSetupOpen] = useState(false);
  const [setupName, setSetupName] = useState("");
  const [setupIncome, setSetupIncome] = useState("");
  const [setupSalaryDate, setSetupSalaryDate] = useState("");
  const [setupInsuranceAmount, setSetupInsuranceAmount] = useState("");
  const [insuranceError, setInsuranceError] = useState("");

  const displayName = profile?.name || user?.email?.split("@")[0] || "User";
  const initials = displayName.slice(0, 2).toUpperCase();

  const scoreLabel = healthScore.finalScore <= 40 ? "Poor" : healthScore.finalScore <= 70 ? "Average" : healthScore.finalScore <= 85 ? "Good" : "Excellent";

  const handleSetupSave = async () => {
    if (!setupName.trim() || !setupIncome.trim()) {
      toast({ title: "Name and income are required", variant: "destructive" });
      return;
    }
    const incomeNum = Number(setupIncome);
    const insAmountNum = Number(setupInsuranceAmount) || 0;
    if (insAmountNum > incomeNum) {
      setInsuranceError("Investment amount cannot exceed monthly income.");
      return;
    }
    setInsuranceError("");
    await updateProfile.mutateAsync({
      name: setupName,
      monthly_income: incomeNum,
      salary_credit_date: setupSalaryDate || undefined,
      insurance_amount: insAmountNum,
    });
    toast({ title: "Profile updated!" });
    setSetupOpen(false);
  };

  const openSetup = () => {
    setSetupName(profile?.name || "");
    setSetupIncome(profile?.monthly_income?.toString() || "");
    setSetupSalaryDate(profile?.salary_credit_date || "");
    setSetupInsuranceAmount(profile?.insurance_amount?.toString() || "0");
    setInsuranceError("");
    setSetupOpen(true);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar border-r border-sidebar-border transition-transform duration-300 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center gap-3 px-6 border-b border-sidebar-border">
          <img src={finsightLogo} alt="FinSight" className="h-9 w-auto" style={{ filter: 'brightness(0.8)' }} />
          <span className="font-display text-xl font-bold">
            <span style={{ color: '#0d387a' }}>Fin</span><span style={{ color: '#06a9a0' }}>Sight</span>
          </span>
          <button
            onClick={() => setSidebarOpen(false)}
            className="ml-auto lg:hidden text-sidebar-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )
              }
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="rounded-lg bg-sidebar-accent p-3">
            <p className="text-xs font-medium text-sidebar-accent-foreground">
              Finance Health
            </p>
            <p className="text-2xl font-bold text-primary font-display">{healthScore.finalScore}</p>
            <p className="text-xs text-sidebar-foreground mt-1">{scoreLabel}</p>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center gap-4 border-b border-border bg-card px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-foreground"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={openSetup} title="Profile Setup">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={signOut} title="Sign Out">
              <LogOut className="h-4 w-4" />
            </Button>
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary">{initials}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Profile Setup Dialog */}
      <Dialog open={setupOpen} onOpenChange={setSetupOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Financial Profile Setup</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={setupName} onChange={(e) => setSetupName(e.target.value)} placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label>Monthly Income (₹)</Label>
              <Input type="number" value={setupIncome} onChange={(e) => setSetupIncome(e.target.value)} placeholder="75000" />
            </div>
            <div className="space-y-2">
              <Label>Investment Amount (₹)</Label>
              <Input type="number" value={setupInsuranceAmount} onChange={(e) => { setSetupInsuranceAmount(e.target.value); setInsuranceError(""); }} placeholder="5000" />
              {insuranceError && <p className="text-xs text-destructive">{insuranceError.replace("Insurance", "Investment")}</p>}
            </div>
            <div className="space-y-2">
              <Label>Salary Credit Date</Label>
              <Input type="date" value={setupSalaryDate} onChange={(e) => setSetupSalaryDate(e.target.value)} />
            </div>
            <Button className="w-full" onClick={handleSetupSave} disabled={updateProfile.isPending}>
              {updateProfile.isPending ? "Saving..." : "Save Profile"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AppLayout;
