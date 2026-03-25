import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, send them to home or profile
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="container mx-auto max-w-[400px] py-20 px-4">
      <div className="bg-card p-8 rounded-3xl border border-border shadow-soft">
        <h1 className="text-2xl font-display font-black mb-6 text-center">Welcome to Haptot</h1>
        <SupabaseAuth 
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={["google"]} // Enables Google Login
          onlyThirdPartyProviders={false} // Allows Mobile/Email too
        />
      </div>
    </div>
  );
};

export default Auth;
