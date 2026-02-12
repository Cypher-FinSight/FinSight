import { useState } from "react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import finsightLogo from "@/assets/finsight-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const { user, loading, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    if (!isLogin && !name.trim()) {
      toast({ title: "Please enter your name", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = isLogin
      ? await signIn(email, password)
      : await signUp(email, password, name);
    setSubmitting(false);
    if (error) {
      toast({ title: error.message, variant: "destructive" });
    } else if (!isLogin) {
      toast({ title: "Account created! You're now logged in." });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-xl border border-border bg-card p-8"
      >
        <div className="flex items-center justify-center gap-3 mb-8">
          <img src={finsightLogo} alt="FinSight" className="h-12 w-auto" />
          <span className="font-display text-2xl font-bold">
            <span style={{ color: '#0d387a' }}>Fin</span><span style={{ color: '#06a9a0' }}>Sight</span>
          </span>
        </div>

        <h2 className="text-lg font-semibold font-display text-card-foreground text-center mb-6">
          {isLogin ? "Welcome back" : "Create your account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Button className="w-full" disabled={submitting}>
            {submitting ? "Please wait..." : isLogin ? "Sign In" : "Sign Up"}
          </Button>
        </form>

        <p className="text-sm text-muted-foreground text-center mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary font-medium hover:underline"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
