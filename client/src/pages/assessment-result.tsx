import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { Assessment, PotentialCondition, Recommendation } from "@shared/schema";
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  Pill,
  Stethoscope,
  Heart,
  ArrowRight,
  Phone,
  Home,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";

export default function AssessmentResult() {
  const [, params] = useRoute("/assessment/:id");

  const { data: assessment, isLoading } = useQuery<Assessment>({
    queryKey: ["/api/assessments", params?.id],
    enabled: !!params?.id,
  });

  const getUrgencyConfig = (urgency: string | null) => {
    switch (urgency) {
      case "emergency":
        return {
          color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30",
          icon: AlertTriangle,
          label: "Emergency",
          description: "Seek immediate medical attention",
        };
      case "high":
        return {
          color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30",
          icon: AlertCircle,
          label: "High Priority",
          description: "Consult a doctor within 24 hours",
        };
      case "medium":
        return {
          color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
          icon: Clock,
          label: "Moderate",
          description: "Schedule an appointment soon",
        };
      default:
        return {
          color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30",
          icon: CheckCircle,
          label: "Low Priority",
          description: "Self-care may be appropriate",
        };
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "emergency":
        return Phone;
      case "doctor":
        return Stethoscope;
      case "pharmacy":
        return Pill;
      default:
        return Home;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "severe":
        return "text-red-600 dark:text-red-400";
      case "moderate":
        return "text-yellow-600 dark:text-yellow-400";
      default:
        return "text-green-600 dark:text-green-400";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-60 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto text-center py-20">
            <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Assessment Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The assessment you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/symptom-checker">
              <Button>Start New Assessment</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const urgencyConfig = getUrgencyConfig(assessment.urgencyLevel);
  const UrgencyIcon = urgencyConfig.icon;
  const conditions = (assessment.aiAnalysis as any)?.conditions as PotentialCondition[] || [];
  const recommendations = assessment.recommendations as Recommendation[] || [];
  const symptoms = assessment.symptoms as any[] || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">Assessment Results</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {assessment.createdAt && format(new Date(assessment.createdAt), "MMMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
            <Link href="/symptom-checker">
              <Button variant="outline" data-testid="button-new-assessment">
                New Assessment
              </Button>
            </Link>
          </div>

          {/* Urgency Banner */}
          <Card className={`border-2 ${urgencyConfig.color}`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${urgencyConfig.color}`}>
                  <UrgencyIcon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{urgencyConfig.label}</h2>
                  <p className="text-muted-foreground">{urgencyConfig.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis Summary */}
          {assessment.aiAnalysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  AI Analysis Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {(assessment.aiAnalysis as any)?.summary || "Based on your symptoms, we've identified potential conditions that may be relevant. Please review the recommendations below."}
                </p>
                
                <div className="mt-4 p-4 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground italic">
                    {(assessment.aiAnalysis as any)?.disclaimer || "This assessment is for informational purposes only and does not constitute medical advice. Always consult a healthcare professional for proper diagnosis and treatment."}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Potential Conditions */}
          {conditions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Potential Conditions</CardTitle>
                <CardDescription>
                  Based on your symptoms, these conditions may be relevant. Conditions are sorted by likelihood.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {conditions.map((condition, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border"
                    data-testid={`condition-${index}`}
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold">{condition.name}</h4>
                        <Badge variant="outline" className={getSeverityColor(condition.severity)}>
                          {condition.severity}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">{condition.probability}%</div>
                        <div className="text-xs text-muted-foreground">likelihood</div>
                      </div>
                    </div>
                    <Progress value={condition.probability} className="h-2 mb-3" />
                    <p className="text-sm text-muted-foreground">{condition.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Recommended Next Steps
                </CardTitle>
                <CardDescription>
                  Based on your assessment, we recommend the following actions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendations.map((rec, index) => {
                  const RecIcon = getRecommendationIcon(rec.type);
                  return (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-lg bg-muted/50"
                      data-testid={`recommendation-${index}`}
                    >
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <RecIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold">{rec.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{rec.description}</p>
                      </div>
                      <Badge
                        variant={rec.urgency === "immediate" ? "destructive" : "secondary"}
                      >
                        {rec.urgency}
                      </Badge>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Symptoms Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Your Reported Symptoms</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {symptoms.map((symptom: any, index: number) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg border"
                  >
                    <div className="font-medium">{symptom.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {symptom.bodyPart} • Severity: {symptom.severity}/10
                    </div>
                    <div className="text-sm text-muted-foreground">{symptom.duration}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/consultations/book" className="flex-1">
              <Button className="w-full gap-2" size="lg" data-testid="button-book-consultation">
                <Calendar className="h-4 w-4" />
                Book a Consultation
              </Button>
            </Link>
            <Link href="/articles" className="flex-1">
              <Button variant="outline" className="w-full gap-2" size="lg">
                Learn More
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
