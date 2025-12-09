import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useAuth } from "@/hooks/useAuth";
import type { Assessment, Consultation, Article } from "@shared/schema";
import {
  Activity,
  Stethoscope,
  Calendar,
  BookOpen,
  Clock,
  ArrowRight,
  Plus,
  AlertCircle,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";

export default function Home() {
  const { user } = useAuth();

  const { data: recentAssessments, isLoading: loadingAssessments } = useQuery<Assessment[]>({
    queryKey: ["/api/assessments", "recent"],
  });

  const { data: upcomingConsultations, isLoading: loadingConsultations } = useQuery<Consultation[]>({
    queryKey: ["/api/consultations", "upcoming"],
  });

  const { data: featuredArticles, isLoading: loadingArticles } = useQuery<Article[]>({
    queryKey: ["/api/articles", "featured"],
  });

  const quickActions = [
    {
      icon: Activity,
      title: "Check Symptoms",
      description: "Start a new symptom assessment",
      href: "/symptom-checker",
      variant: "default" as const,
    },
    {
      icon: Calendar,
      title: "Book Consultation",
      description: "Schedule a doctor visit",
      href: "/consultations/book",
      variant: "outline" as const,
    },
    {
      icon: BookOpen,
      title: "Health Library",
      description: "Browse health articles",
      href: "/articles",
      variant: "outline" as const,
    },
  ];

  const getUrgencyColor = (urgency: string | null) => {
    switch (urgency) {
      case "emergency":
        return "bg-red-500/10 text-red-600 dark:text-red-400";
      case "high":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400";
      case "medium":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400";
      default:
        return "bg-green-500/10 text-green-600 dark:text-green-400";
    }
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="default" className="bg-green-500/10 text-green-600 dark:text-green-400 border-0">Confirmed</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "completed":
        return <Badge variant="outline">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-welcome">
            Welcome back, {user?.firstName || "there"}!
          </h1>
          <p className="text-muted-foreground">
            Track your health, check symptoms, and stay informed.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Card className="hover-elevate cursor-pointer h-full transition-all duration-200">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <action.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{action.title}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Assessments */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
                <div>
                  <CardTitle className="text-xl">Recent Assessments</CardTitle>
                  <CardDescription>Your latest symptom checks</CardDescription>
                </div>
                <Link href="/symptom-checker">
                  <Button size="sm" className="gap-2" data-testid="button-new-assessment">
                    <Plus className="h-4 w-4" />
                    New
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {loadingAssessments ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : recentAssessments && recentAssessments.length > 0 ? (
                  <div className="space-y-4">
                    {recentAssessments.slice(0, 5).map((assessment) => (
                      <Link key={assessment.id} href={`/assessment/${assessment.id}`}>
                        <div className="flex items-center gap-4 p-3 rounded-lg hover-elevate cursor-pointer transition-all duration-200" data-testid={`assessment-${assessment.id}`}>
                          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${getUrgencyColor(assessment.urgencyLevel)}`}>
                            {assessment.urgencyLevel === "emergency" || assessment.urgencyLevel === "high" ? (
                              <AlertCircle className="h-5 w-5" />
                            ) : (
                              <CheckCircle className="h-5 w-5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">
                              {Array.isArray(assessment.symptoms) && assessment.symptoms.length > 0
                                ? assessment.symptoms.map((s: any) => s.name).join(", ")
                                : "Assessment"}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              {assessment.createdAt && format(new Date(assessment.createdAt), "MMM d, yyyy")}
                            </div>
                          </div>
                          <Badge variant="secondary" className={getUrgencyColor(assessment.urgencyLevel)}>
                            {assessment.urgencyLevel || "Low"}
                          </Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="font-medium mb-2">No assessments yet</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Start your first symptom check to get personalized health insights.
                    </p>
                    <Link href="/symptom-checker">
                      <Button data-testid="button-start-first-assessment">
                        Start Assessment
                      </Button>
                    </Link>
                  </div>
                )}

                {recentAssessments && recentAssessments.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <Link href="/history">
                      <Button variant="ghost" className="w-full gap-2">
                        View All History
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Consultations */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
                <div>
                  <CardTitle className="text-xl">Upcoming Consultations</CardTitle>
                  <CardDescription>Your scheduled appointments</CardDescription>
                </div>
                <Link href="/consultations/book">
                  <Button size="sm" variant="outline" className="gap-2" data-testid="button-book-consultation">
                    <Calendar className="h-4 w-4" />
                    Book
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {loadingConsultations ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : upcomingConsultations && upcomingConsultations.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingConsultations.map((consultation) => (
                      <div key={consultation.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50" data-testid={`consultation-${consultation.id}`}>
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Stethoscope className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">Dr. {consultation.doctorName}</div>
                          <div className="text-sm text-muted-foreground">
                            {consultation.doctorSpecialty}
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(consultation.status)}
                          <div className="text-sm text-muted-foreground mt-1">
                            {consultation.scheduledAt && format(new Date(consultation.scheduledAt), "MMM d, h:mm a")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="font-medium mb-2">No upcoming consultations</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Book a consultation with a healthcare professional.
                    </p>
                    <Link href="/consultations/book">
                      <Button variant="outline" data-testid="button-book-first-consultation">
                        Book Consultation
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Health Tips */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Health Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-green-500/10">
                  <h4 className="font-medium text-sm mb-1">Stay Hydrated</h4>
                  <p className="text-xs text-muted-foreground">
                    Drink at least 8 glasses of water daily for optimal health.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <h4 className="font-medium text-sm mb-1">Regular Exercise</h4>
                  <p className="text-xs text-muted-foreground">
                    Aim for 30 minutes of moderate activity most days.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/10">
                  <h4 className="font-medium text-sm mb-1">Quality Sleep</h4>
                  <p className="text-xs text-muted-foreground">
                    Get 7-9 hours of sleep each night for better health.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Featured Articles */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Featured Articles
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingArticles ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                    ))}
                  </div>
                ) : featuredArticles && featuredArticles.length > 0 ? (
                  <div className="space-y-4">
                    {featuredArticles.slice(0, 3).map((article) => (
                      <Link key={article.id} href={`/articles/${article.slug}`}>
                        <div className="group cursor-pointer" data-testid={`article-${article.id}`}>
                          <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                            {article.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {article.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {article.readTime} min read
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No articles available yet.
                  </p>
                )}

                <div className="mt-4 pt-4 border-t">
                  <Link href="/articles">
                    <Button variant="ghost" size="sm" className="w-full gap-2">
                      Browse All Articles
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
