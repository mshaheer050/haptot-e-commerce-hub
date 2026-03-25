import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => (
  <a
    href="https://wa.me/911234567890?text=Hi%20Haptot!%20I%20have%20a%20question."
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-glow hover:scale-110 transition-all duration-300 animate-pulse-glow"
    style={{ background: "linear-gradient(135deg, hsl(142 70% 45%), hsl(150 60% 40%))" }}
    aria-label="Chat on WhatsApp"
  >
    <MessageCircle className="w-6 h-6 text-primary-foreground" />
  </a>
);

export default WhatsAppButton;
