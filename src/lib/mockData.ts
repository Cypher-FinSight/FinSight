export const expenses = [
  { id: 1, amount: 450, category: "Food & Dining", date: "2026-02-08", note: "Grocery Store" },
  { id: 2, amount: 1200, category: "Rent", date: "2026-02-01", note: "Monthly Rent" },
  { id: 3, amount: 85, category: "Transport", date: "2026-02-07", note: "Uber Rides" },
  { id: 4, amount: 200, category: "Entertainment", date: "2026-02-05", note: "Movie & Dinner" },
  { id: 5, amount: 150, category: "Shopping", date: "2026-02-04", note: "Amazon" },
  { id: 6, amount: 75, category: "Health", date: "2026-02-03", note: "Pharmacy" },
  { id: 7, amount: 320, category: "Utilities", date: "2026-02-01", note: "Electricity Bill" },
  { id: 8, amount: 60, category: "Food & Dining", date: "2026-02-06", note: "Coffee Shop" },
  { id: 9, amount: 500, category: "Shopping", date: "2026-02-02", note: "Electronics" },
  { id: 10, amount: 100, category: "Transport", date: "2026-02-09", note: "Fuel" },
];

export const budgets = [
  { category: "Food & Dining", limit: 800, spent: 510 },
  { category: "Rent", limit: 1200, spent: 1200 },
  { category: "Transport", limit: 300, spent: 185 },
  { category: "Entertainment", limit: 400, spent: 200 },
  { category: "Shopping", limit: 500, spent: 650 },
  { category: "Health", limit: 200, spent: 75 },
  { category: "Utilities", limit: 400, spent: 320 },
];

export const monthlySpending = [
  { month: "Sep", amount: 3200 },
  { month: "Oct", amount: 3800 },
  { month: "Nov", amount: 2900 },
  { month: "Dec", amount: 4100 },
  { month: "Jan", amount: 3400 },
  { month: "Feb", amount: 3140 },
];

export const categoryBreakdown = [
  { name: "Food & Dining", value: 510, fill: "hsl(152, 60%, 42%)" },
  { name: "Rent", value: 1200, fill: "hsl(210, 80%, 55%)" },
  { name: "Transport", value: 185, fill: "hsl(38, 92%, 55%)" },
  { name: "Entertainment", value: 200, fill: "hsl(280, 60%, 55%)" },
  { name: "Shopping", value: 650, fill: "hsl(0, 72%, 55%)" },
  { name: "Health", value: 75, fill: "hsl(170, 60%, 45%)" },
  { name: "Utilities", value: 320, fill: "hsl(45, 80%, 50%)" },
];

export const healthScoreBreakdown = [
  { label: "Savings Habit", score: 14, maxScore: 20 },
  { label: "Investment %", score: 10, maxScore: 20 },
  { label: "Debt Management", score: 16, maxScore: 20 },
  { label: "Emergency Fund", score: 8, maxScore: 15 },
  { label: "Insurance Coverage", score: 12, maxScore: 15 },
  { label: "Credit Usage", score: 12, maxScore: 10 },
];

export const categoryIcons: Record<string, string> = {
  "Food & Dining": "🍔",
  "Rent": "🏠",
  "Transport": "🚗",
  "Entertainment": "🎬",
  "Shopping": "🛍️",
  "Health": "💊",
  "Utilities": "⚡",
  "Education": "📚",
  "Savings": "💰",
};

export const insights = [
  {
    type: "warning" as const,
    title: "Shopping Over Budget",
    description: "You've exceeded your shopping budget by ₹150 this month. Consider holding off on non-essential purchases.",
  },
  {
    type: "tip" as const,
    title: "Start a SIP",
    description: "Investing ₹5,000/month in a SIP could grow to ₹9.3L in 10 years at 12% returns.",
  },
  {
    type: "success" as const,
    title: "Great Savings Rate",
    description: "Your savings rate of 28% is above the recommended 20%. Keep it up!",
  },
  {
    type: "warning" as const,
    title: "Emergency Fund Low",
    description: "Your emergency fund covers only 1.5 months. Aim for 3-6 months of expenses.",
  },
];
