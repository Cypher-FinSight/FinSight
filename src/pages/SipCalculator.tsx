import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, TrendingUp, Wallet } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

const SipCalculator = () => {
  // SIP state
  const [sipAmount, setSipAmount] = useState(5000);
  const [sipYears, setSipYears] = useState(10);
  const [sipReturn, setSipReturn] = useState(12);

  // SWP state
  const [swpCorpus, setSwpCorpus] = useState(5000000);
  const [swpWithdrawal, setSwpWithdrawal] = useState(30000);
  const [swpReturn, setSwpReturn] = useState(8);

  const sipData = useMemo(() => {
    const data: { year: number; invested: number; value: number }[] = [];
    const r = sipReturn / 100 / 12;
    for (let y = 0; y <= sipYears; y++) {
      const n = y * 12;
      const invested = sipAmount * n;
      const value = n === 0 ? 0 : sipAmount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      data.push({ year: y, invested, value: Math.round(value) });
    }
    return data;
  }, [sipAmount, sipYears, sipReturn]);

  const swpData = useMemo(() => {
    const data: { year: number; balance: number }[] = [];
    let balance = swpCorpus;
    const monthlyReturn = swpReturn / 100 / 12;
    let year = 0;
    data.push({ year: 0, balance: swpCorpus });

    while (balance > 0 && year < 50) {
      for (let m = 0; m < 12 && balance > 0; m++) {
        balance = balance * (1 + monthlyReturn) - swpWithdrawal;
      }
      year++;
      data.push({ year, balance: Math.max(0, Math.round(balance)) });
      if (balance <= 0) break;
    }
    return data;
  }, [swpCorpus, swpWithdrawal, swpReturn]);

  const sipFinalValue = sipData[sipData.length - 1]?.value || 0;
  const sipTotalInvested = sipData[sipData.length - 1]?.invested || 0;
  const sipWealth = sipFinalValue - sipTotalInvested;

  const swpLastsYears = swpData.findIndex((d) => d.balance <= 0);
  const swpDuration = swpLastsYears === -1 ? "50+" : swpLastsYears.toString();

  const formatCurrency = (v: number) => {
    if (v >= 10000000) return `₹${(v / 10000000).toFixed(1)}Cr`;
    if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
    return `₹${v.toLocaleString()}`;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-display text-foreground">
          Investment Calculator
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Project your wealth growth with SIP & SWP simulations
        </p>
      </div>

      <Tabs defaultValue="sip">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sip">SIP Calculator</TabsTrigger>
          <TabsTrigger value="swp">SWP Simulator</TabsTrigger>
        </TabsList>

        {/* SIP Tab */}
        <TabsContent value="sip" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Inputs */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl border border-border bg-card p-6 space-y-6"
            >
              <div className="space-y-3">
                <Label>Monthly SIP Amount</Label>
                <Input
                  type="number"
                  value={sipAmount}
                  onChange={(e) => setSipAmount(Number(e.target.value) || 0)}
                />
                <Slider
                  value={[sipAmount]}
                  onValueChange={([v]) => setSipAmount(v)}
                  min={500}
                  max={1000000}
                  step={500}
                />
              </div>
              <div className="space-y-3">
                <Label>Duration (Years)</Label>
                <Input
                  type="number"
                  value={sipYears}
                  onChange={(e) => setSipYears(Number(e.target.value) || 1)}
                />
                <Slider
                  value={[sipYears]}
                  onValueChange={([v]) => setSipYears(v)}
                  min={1}
                  max={40}
                  step={1}
                />
              </div>
              <div className="space-y-3">
                <Label>Expected Return (% p.a.)</Label>
                <Input
                  type="number"
                  value={sipReturn}
                  onChange={(e) => setSipReturn(Number(e.target.value) || 1)}
                />
                <Slider
                  value={[sipReturn]}
                  onValueChange={([v]) => setSipReturn(v)}
                  min={1}
                  max={30}
                  step={0.5}
                />
              </div>
            </motion.div>

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-4"
            >
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-border bg-card p-4 text-center">
                  <Wallet className="h-5 w-5 text-muted-foreground mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Invested</p>
                  <p className="text-lg font-bold font-display text-card-foreground">
                    {formatCurrency(sipTotalInvested)}
                  </p>
                </div>
                <div className="rounded-xl border border-primary/20 bg-accent p-4 text-center">
                  <TrendingUp className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Wealth Gained</p>
                  <p className="text-lg font-bold font-display text-primary">
                    {formatCurrency(sipWealth)}
                  </p>
                </div>
                <div className="rounded-xl border border-primary/20 bg-accent p-4 text-center">
                  <Calculator className="h-5 w-5 text-primary mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">Total Value</p>
                  <p className="text-lg font-bold font-display text-primary">
                    {formatCurrency(sipFinalValue)}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={sipData}>
                    <defs>
                      <linearGradient id="investedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(210, 80%, 55%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(210, 80%, 55%)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="valueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(152, 60%, 42%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(152, 60%, 42%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 50%)" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 50%)" tickFormatter={(v) => formatCurrency(v)} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0, 0%, 100%)",
                        border: "1px solid hsl(220, 15%, 90%)",
                        borderRadius: "8px",
                      }}
                      formatter={(v: number, name: string) => [formatCurrency(v), name === "invested" ? "Invested" : "Value"]}
                      labelFormatter={(l) => `Year ${l}`}
                    />
                    <Area type="monotone" dataKey="invested" stroke="hsl(210, 80%, 55%)" fill="url(#investedGrad)" strokeWidth={2} />
                    <Area type="monotone" dataKey="value" stroke="hsl(152, 60%, 42%)" fill="url(#valueGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <p className="text-xs text-muted-foreground text-center italic">
                ⚠️ Returns are market-linked and not guaranteed. Past performance does not indicate future results.
              </p>
            </motion.div>
          </div>
        </TabsContent>

        {/* SWP Tab */}
        <TabsContent value="swp" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-xl border border-border bg-card p-6 space-y-6"
            >
              <div className="space-y-3">
                <Label>Total Corpus (₹)</Label>
                <Input
                  type="number"
                  value={swpCorpus}
                  onChange={(e) => setSwpCorpus(Number(e.target.value) || 0)}
                />
                <Slider
                  value={[swpCorpus]}
                  onValueChange={([v]) => setSwpCorpus(v)}
                  min={100000}
                  max={50000000}
                  step={100000}
                />
              </div>
              <div className="space-y-3">
                <Label>Monthly Withdrawal (₹)</Label>
                <Input
                  type="number"
                  value={swpWithdrawal}
                  onChange={(e) => setSwpWithdrawal(Number(e.target.value) || 0)}
                />
                <Slider
                  value={[swpWithdrawal]}
                  onValueChange={([v]) => setSwpWithdrawal(v)}
                  min={5000}
                  max={500000}
                  step={5000}
                />
              </div>
              <div className="space-y-3">
                <Label>Expected Return (% p.a.)</Label>
                <Input
                  type="number"
                  value={swpReturn}
                  onChange={(e) => setSwpReturn(Number(e.target.value) || 1)}
                />
                <Slider
                  value={[swpReturn]}
                  onValueChange={([v]) => setSwpReturn(v)}
                  min={1}
                  max={20}
                  step={0.5}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2 space-y-4"
            >
              <div className="rounded-xl border border-primary/20 bg-accent p-5 text-center">
                <p className="text-sm text-muted-foreground">Your corpus will last approximately</p>
                <p className="text-4xl font-bold font-display text-primary mt-2">
                  {swpDuration} years
                </p>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={swpData}>
                    <defs>
                      <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(38, 92%, 55%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(38, 92%, 55%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
                    <XAxis dataKey="year" tick={{ fontSize: 12 }} stroke="hsl(220, 10%, 50%)" />
                    <YAxis tick={{ fontSize: 11 }} stroke="hsl(220, 10%, 50%)" tickFormatter={(v) => formatCurrency(v)} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0, 0%, 100%)",
                        border: "1px solid hsl(220, 15%, 90%)",
                        borderRadius: "8px",
                      }}
                      formatter={(v: number) => [formatCurrency(v), "Balance"]}
                      labelFormatter={(l) => `Year ${l}`}
                    />
                    <Area type="monotone" dataKey="balance" stroke="hsl(38, 92%, 55%)" fill="url(#balGrad)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <p className="text-xs text-muted-foreground text-center italic">
                ⚠️ Returns are market-linked and not guaranteed. Actual results may vary.
              </p>
            </motion.div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SipCalculator;
