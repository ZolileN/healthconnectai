import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  Activity,
  Stethoscope,
  Calendar,
  BookOpen,
  Shield,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  Heart,
  Brain,
  Sparkles,
} from "lucide-react";

export default function Landing() {
  const [location, setLocation] = useLocation();
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Assessment",
      description: "Advanced algorithms analyze your symptoms to provide accurate preliminary health assessments.",
    },
    {
      icon: Stethoscope,
      title: "Doctor Consultations",
      description: "Connect with licensed healthcare professionals via video or phone for personalized medical advice.",
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Access health assessments and support anytime, anywhere - your health doesn't wait.",
    },
    {
      icon: Shield,
      title: "Private & Secure",
      description: "Your health data is protected with enterprise-grade security and strict privacy compliance.",
    },
  ];

  const howItWorks = [
    {
      step: 1,
      title: "Describe Your Symptoms",
      description: "Use our interactive body map and detailed questionnaire to input your symptoms.",
    },
    {
      step: 2,
      title: "Get AI Assessment",
      description: "Our AI analyzes your symptoms and provides a list of possible conditions with recommendations.",
    },
    {
      step: 3,
      title: "Take Action",
      description: "Follow personalized recommendations - from self-care tips to booking a doctor consultation.",
    },
  ];

  const stats = [
    { value: "50K+", label: "Assessments Completed" },
    { value: "98%", label: "User Satisfaction" },
    { value: "500+", label: "Healthcare Providers" },
    { value: "24/7", label: "Availability" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="container mx-auto px-4 py-20 md:py-32">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                AI-Powered Healthcare
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Your Health, <span className="text-primary">Understood</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Get instant AI-powered symptom assessments and connect with healthcare professionals. 
                Take control of your health journey with HealthCheck.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button 
                      size="lg" 
                      className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" 
                      onClick={() => setLocation('/login')}
                      data-testid="button-cta-signup"
                    >
                      Get Started Now
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                <Link href="/articles">
                  <Button variant="outline" size="lg" className="min-w-[200px] gap-2" data-testid="button-hero-learn-more">
                    <BookOpen className="h-4 w-4" />
                    Health Library
                  </Button>
                </Link>
              </div>

              <div className="pt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Free to start</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>No credit card</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Instant results</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y bg-card">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary" data-testid={`stat-value-${index}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Healthcare Made Simple
              </h2>
              <p className="text-muted-foreground text-lg">
                Everything you need to understand and manage your health, all in one platform.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="hover-elevate transition-all duration-200">
                  <CardContent className="p-6 space-y-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground text-lg">
                Get health insights in three simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {howItWorks.map((item, index) => (
                <div key={index} className="relative text-center">
                  <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                  
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-border" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">
                  Comprehensive Health Services
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  From symptom checking to doctor consultations, we provide a complete healthcare experience designed for modern life.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Symptom Analysis</h4>
                      <p className="text-sm text-muted-foreground">
                        AI-powered analysis of your symptoms with detailed health insights
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Easy Booking</h4>
                      <p className="text-sm text-muted-foreground">
                        Schedule consultations with healthcare providers in minutes
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Heart className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">Health Tracking</h4>
                      <p className="text-sm text-muted-foreground">
                        Keep track of your health history and assessments over time
                      </p>
                    </div>
                  </div>
                </div>
                  <Button 
                    size="lg" 
                    className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" 
                    onClick={() => setLocation('/login')}
                    data-testid="button-cta-signup"
                  >
                    Start Your Health Journey
                    <ArrowRight className="h-4 w-4" />
                  </Button>
              </div>

              <div className="relative">
                <Card className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">Trusted by Thousands</div>
                        <div className="text-sm text-muted-foreground">Healthcare professionals and patients alike</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="text-2xl font-bold text-primary">4.9/5</div>
                        <div className="text-xs text-muted-foreground">User Rating</div>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="text-2xl font-bold text-primary">2min</div>
                        <div className="text-xs text-muted-foreground">Avg. Response</div>
                      </div>
                    </div>

                    <blockquote className="border-l-2 border-primary pl-4 italic text-muted-foreground">
                      "HealthCheck helped me understand my symptoms quickly and connected me with a doctor who provided excellent care."
                    </blockquote>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Take Control of Your Health?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust HealthCheck for their health needs. Start your free assessment today.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              className="gap-2" 
              onClick={() => setLocation('/login')}
              data-testid="button-cta-signup"
            >
              Get Started Now
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
