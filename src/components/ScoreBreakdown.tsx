import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScoreItem {
  label: string;
  score: number;
  maxScore: number;
}

const ScoreBreakdown = ({ items }: { items: ScoreItem[] }) => {
  return (
    <div className="space-y-4">
      {items.map((item, i) => {
        const pct = (item.score / item.maxScore) * 100;
        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="space-y-1.5"
          >
            <div className="flex justify-between text-sm">
              <span className="font-medium text-card-foreground">{item.label}</span>
              <span className="text-muted-foreground">
                {item.score}/{item.maxScore}
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <motion.div
                className={cn(
                  "h-full rounded-full",
                  pct >= 75 ? "bg-success" : pct >= 50 ? "bg-warning" : "bg-destructive"
                )}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ScoreBreakdown;
