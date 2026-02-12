import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HealthScoreGaugeProps {
  score: number;
  size?: "sm" | "lg";
}

const getScoreLevel = (score: number) => {
  if (score <= 40) return { label: "Poor", colorClass: "text-destructive", strokeClass: "stroke-destructive" };
  if (score <= 70) return { label: "Average", colorClass: "text-warning", strokeClass: "stroke-warning" };
  if (score <= 85) return { label: "Good", colorClass: "text-success", strokeClass: "stroke-success" };
  return { label: "Excellent", colorClass: "text-primary", strokeClass: "stroke-primary" };
};

const HealthScoreGauge = ({ score, size = "lg" }: HealthScoreGaugeProps) => {
  const { label, colorClass, strokeClass } = getScoreLevel(score);
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;
  const dim = size === "lg" ? 200 : 120;
  const textSize = size === "lg" ? "text-5xl" : "text-2xl";
  const labelSize = size === "lg" ? "text-sm" : "text-xs";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: dim, height: dim }}>
        <svg className="transform -rotate-90" width={dim} height={dim} viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            className="stroke-muted"
            strokeWidth="6"
          />
          <motion.circle
            cx="50" cy="50" r="45"
            fill="none"
            className={strokeClass}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={cn("font-display font-bold", textSize, colorClass)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className={cn("font-medium text-muted-foreground", labelSize)}>
            out of 100
          </span>
        </div>
      </div>
      <span className={cn("font-semibold font-display", colorClass, size === "lg" ? "text-lg" : "text-sm")}>
        {label}
      </span>
    </div>
  );
};

export default HealthScoreGauge;
