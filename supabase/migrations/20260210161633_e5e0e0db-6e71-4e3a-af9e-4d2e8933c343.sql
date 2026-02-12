
-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  email_or_phone TEXT NOT NULL DEFAULT '',
  monthly_income NUMERIC NOT NULL DEFAULT 0,
  salary_credit_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Expenses table
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL DEFAULT 0,
  category TEXT NOT NULL DEFAULT '',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own expenses" ON public.expenses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own expenses" ON public.expenses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own expenses" ON public.expenses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own expenses" ON public.expenses FOR DELETE USING (auth.uid() = user_id);

-- Budgets table
CREATE TABLE public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL DEFAULT '',
  monthly_limit NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, category)
);
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own budgets" ON public.budgets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own budgets" ON public.budgets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own budgets" ON public.budgets FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own budgets" ON public.budgets FOR DELETE USING (auth.uid() = user_id);

-- Debts table
CREATE TABLE public.debts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emi_amount NUMERIC NOT NULL DEFAULT 0,
  debt_type TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own debts" ON public.debts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own debts" ON public.debts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own debts" ON public.debts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own debts" ON public.debts FOR DELETE USING (auth.uid() = user_id);

-- Insurance table
CREATE TABLE public.insurance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  health_insurance BOOLEAN NOT NULL DEFAULT false,
  term_insurance BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.insurance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own insurance" ON public.insurance FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own insurance" ON public.insurance FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own insurance" ON public.insurance FOR UPDATE USING (auth.uid() = user_id);

-- Emergency fund table
CREATE TABLE public.emergency_fund (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.emergency_fund ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own emergency fund" ON public.emergency_fund FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own emergency fund" ON public.emergency_fund FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own emergency fund" ON public.emergency_fund FOR UPDATE USING (auth.uid() = user_id);

-- Credit cards table
CREATE TABLE public.credit_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  card_count INTEGER NOT NULL DEFAULT 0,
  monthly_card_spend NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.credit_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own credit cards" ON public.credit_cards FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own credit cards" ON public.credit_cards FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own credit cards" ON public.credit_cards FOR UPDATE USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email_or_phone)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''), COALESCE(NEW.email, ''));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
