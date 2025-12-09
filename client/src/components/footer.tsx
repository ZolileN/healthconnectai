import { Link } from "wouter";
import { Activity, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">HealthConnectAI</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your trusted AI-powered health companion. Get instant symptom assessments and connect with healthcare professionals.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>South Africa</span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/symptom-checker" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Symptom Checker
              </Link>
              <Link href="/consultations" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Book Consultation
              </Link>
              <Link href="/articles" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Health Library
              </Link>
              <Link href="/history" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                My History
              </Link>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Resources</h4>
            <nav className="flex flex-col gap-2">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                How It Works
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Medical Disclaimer
              </a>
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Stay Updated</h4>
            <p className="text-sm text-muted-foreground">
              Subscribe for health tips and updates.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1"
                data-testid="input-newsletter-email"
              />
              <Button type="submit" data-testid="button-newsletter-subscribe">
                Subscribe
              </Button>
            </form>
            <div className="space-y-2">
              <a href="mailto:support@healthconnectai.co.za" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Mail className="h-4 w-4" />
                support@healthconnectai.co.za
              </a>
              <a href="tel:+27800123456" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Phone className="h-4 w-4" />
                0800 123 456
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} HealthConnectAI. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground text-center md:text-right max-w-md">
              Disclaimer: This platform provides general health information and is not a substitute for professional medical advice, diagnosis, or treatment.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
