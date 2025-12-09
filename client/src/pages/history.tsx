import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { Assessment } from "@shared/schema";
import {
  Activity,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Calendar,
  Plus,
} from "lucide-react";
import { format } from "date-fns";

export default function History() {
  const { data: assessments, isLoading } = useQuery<Assessment[]>({
    queryKey: ["/api/assessments"],
  });

  const getUrgencyConfig = (urgency: string | null) => {
    switch (urgency) {
      case "emergency":
        return { color: "bg-red-500/10 text-red-600 dark:text-red-400", icon: AlertCircle, label: "Emergency" };
      case "high":
        return { color: "bg-orange-500/10 text-orange-600 dark:text-orange-400", icon: AlertCircle, label: "High" };
      case "medium":
        return { color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400", icon: Clock, label: "Medium" };
      default:
        return { color: "bg-green-500/10 text-green-600 dark:text-green-400", icon: CheckCircle, label: "Low" };
    }
  };

  const groupedAssessments = assessments?.reduce((groups, assessment) => {
    const date = assessment.createdAt ? format(new Date(assessment.createdAt), "MMMM yyyy") : "Unknown";
    if (!groups[date]) groups[date] = [];
    groups[date].push(assessment);
    return groups;
  }, {} as Record<string, Assessment[]>) || {};

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Assessment History</h1>
              <p className="text-muted-foreground">
                View your past symptom checks and health assessments.
              </p>
            </div>
            <Link href="/symptom-checker">
              <Button className="gap-2" data-testid="button-new-assessment">
                <Plus className="h-4 w-4" />
                New Assessment
              </Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : assessments && assessments.length > 0 ? (
            <div className="space-y-8">
              {Object.entries(groupedAssessments).map(([month, monthAssessments]) => (
                <div key={month}>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    {month}
                  </h2>
                  <div className="space-y-4">
                    {monthAssessments.map((assessment) => {
                      const urgencyConfig = getUrgencyConfig(assessment.urgencyLevel);
                      const UrgencyIcon = urgencyConfig.icon;
                      const symptoms = assessment.symptoms as any[] || [];

                      return (
                        <Link key={assessment.id} href={`/assessment/${assessment.id}`}>
                          <Card className="hover-elevate cursor-pointer transition-all duration-200" data-testid={`history-assessment-${assessment.id}`}>
                            <CardContent className="p-6">
                              <div className="flex items-center gap-4">
                                <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${urgencyConfig.color}`}>
                                  <UrgencyIcon className="h-6 w-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium truncate">
                                    {symptoms.length > 0
                                      ? symptoms.map((s: any) => s.name).join(", ")
                                      : "Health Assessment"}
                                  </div>
                                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                                    <Clock className="h-3 w-3" />
                                    {assessment.createdAt && format(new Date(assessment.createdAt), "MMM d, yyyy 'at' h:mm a")}
                                  </div>
                                  {assessment.bodyParts && assessment.bodyParts.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {(assessment.bodyParts as string[]).slice(0, 3).map((part, i) => (
                                        <Badge key={i} variant="outline" className="text-xs">
                                          {part}
                                        </Badge>
                                      ))}
                                      {(assessment.bodyParts as string[]).length > 3 && (
                                        <Badge variant="outline" className="text-xs">
                                          +{(assessment.bodyParts as string[]).length - 3} more
                                        </Badge>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <div className="flex items-center gap-3">
                                  <Badge variant="secondary" className={urgencyConfig.color}>
                                    {urgencyConfig.label}
                                  </Badge>
                                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <Activity className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No Assessment History</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  You haven't completed any health assessments yet. Start your first symptom check to get personalized health insights.
                </p>
                <Link href="/symptom-checker">
                  <Button data-testid="button-start-first-assessment">
                    Start Your First Assessment
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
