import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

// Profile
export const useProfile = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
};

export const useUpdateProfile = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (updates: { name?: string; monthly_income?: number; salary_credit_date?: string; insurance_amount?: number }) => {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
};

// Expenses
export const useExpenses = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["expenses", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user!.id)
        .order("date", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
};

export const useAddExpense = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (expense: { amount: number; category: string; date: string; description: string }) => {
      const { error } = await supabase
        .from("expenses")
        .insert({ ...expense, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["expenses"] }),
  });
};

export const useDeleteExpense = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["expenses"] }),
  });
};

// Budgets
export const useBudgets = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["budgets", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data || [];
    },
  });
};

export const useUpsertBudget = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (budget: { category: string; monthly_limit: number }) => {
      const { error } = await supabase
        .from("budgets")
        .upsert(
          { ...budget, user_id: user!.id },
          { onConflict: "user_id,category" }
        );
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["budgets"] }),
  });
};

// Debts
export const useDebts = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["debts", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("debts")
        .select("*")
        .eq("user_id", user!.id);
      if (error) throw error;
      return data || [];
    },
  });
};

export const useAddDebt = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (debt: { emi_amount: number; debt_type: string }) => {
      const { error } = await supabase
        .from("debts")
        .insert({ ...debt, user_id: user!.id });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["debts"] }),
  });
};

export const useDeleteDebt = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("debts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["debts"] }),
  });
};

// Insurance
export const useInsurance = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["insurance", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("insurance")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
};

export const useUpsertInsurance = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (ins: { health_insurance: boolean; term_insurance: boolean }) => {
      // Try update first, if no rows then insert
      const { data } = await supabase
        .from("insurance")
        .select("id")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (data) {
        const { error } = await supabase
          .from("insurance")
          .update(ins)
          .eq("user_id", user!.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("insurance")
          .insert({ ...ins, user_id: user!.id });
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["insurance"] }),
  });
};

// Emergency Fund
export const useEmergencyFund = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["emergency_fund", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("emergency_fund")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
};

export const useUpsertEmergencyFund = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (amount: number) => {
      const { data } = await supabase
        .from("emergency_fund")
        .select("id")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (data) {
        const { error } = await supabase
          .from("emergency_fund")
          .update({ amount })
          .eq("user_id", user!.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("emergency_fund")
          .insert({ amount, user_id: user!.id });
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["emergency_fund"] }),
  });
};

// Credit Cards
export const useCreditCards = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["credit_cards", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("credit_cards")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
};

export const useDeleteBudget = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("budgets").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["budgets"] }),
  });
};

export const useUpsertCreditCards = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (cc: { card_count: number; monthly_card_spend: number }) => {
      const { data } = await supabase
        .from("credit_cards")
        .select("id")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (data) {
        const { error } = await supabase
          .from("credit_cards")
          .update(cc)
          .eq("user_id", user!.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("credit_cards")
          .insert({ ...cc, user_id: user!.id });
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["credit_cards"] }),
  });
};
