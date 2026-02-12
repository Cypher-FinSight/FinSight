import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  variant?: "default" | "primary" | "warning" | "destructive";
}

const variantStyles = {
  default: "bg-card border-border",
  primary: "bg-accent border-primary/20",
  warning: "bg-warning/10 border-warning/20",
  destructive: "bg-destructive/10 border-destructive/20",
};

const iconVariantStyles = {
  default: "bg-muted text-muted-foreground",
  primary: "bg-primary/15 text-primary",
  warning: "bg-warning/15 text-warning",
  destructive: "bg-destructive/15 text-destructive",
};

const StatCard = ({ title, value, subtitle, icon: Icon, trend, variant = "default" }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={cn("rounded-xl border p-5 hover-lift", variantStyles[variant])}
  >
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold font-display text-card-foreground">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        {trend && (
          <p className={cn("text-xs font-medium", trend.positive ? "text-success" : "text-destructive")}>
            {trend.positive ? "↑" : "↓"} {trend.value}
          </p>
        )}
      </div>
      <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", iconVariantStyles[variant])}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </motion.div>
);

export default StatCard;
