import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/"); // Redirect to home after successful login
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="container mx-auto max-w-[450px] py-20 px-4">
      <div className="bg-card p-8 rounded-3xl border border-border shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-black text-primary">Haptot</h1>
          <p className="text-muted-foreground mt-2">Sign in to track your orders</p>
        </div>
        
        <SupabaseAuth 
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#8B5CF6', // Your Haptot purple
                  brandAccent: '#7C3AED',
                },
                radii: {
                  buttonRadius: '12px',
                  inputRadius: '12px',
                }
              }
            }
          }}
          providers={["google"]} 
          // This allows both Email and Phone login if enabled in Supabase
          onlyThirdPartyProviders={false} 
        />
      </div>
    </div>
  );
};

export default Auth;
