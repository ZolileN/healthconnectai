import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { Article } from "@shared/schema";
import {
  ArrowLeft,
  Clock,
  Calendar,
  BookOpen,
  Share2,
} from "lucide-react";
import { format } from "date-fns";

export default function ArticleDetail() {
  const [, params] = useRoute("/articles/:slug");

  const { data: article, isLoading } = useQuery<Article>({
    queryKey: ["/api/articles", params?.slug],
    enabled: !!params?.slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto space-y-6">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto text-center py-20">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold mb-2">Article Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The article you're looking for doesn't exist.
            </p>
            <Link href="/articles">
              <Button>Browse Articles</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        <article className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Back Link */}
            <Link href="/articles">
              <Button variant="ghost" className="mb-6 gap-2" data-testid="button-back">
                <ArrowLeft className="h-4 w-4" />
                Back to Articles
              </Button>
            </Link>

            {/* Article Header */}
            <div className="mb-8">
              <Badge variant="secondary" className="mb-4">{article.category}</Badge>
              <h1 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-article-title">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {article.readTime} min read
                </span>
                {article.createdAt && (
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(article.createdAt), "MMMM d, yyyy")}
                  </span>
                )}
                <Button variant="ghost" size="sm" className="gap-2 ml-auto">
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>

            {/* Featured Image Placeholder */}
            <div className="h-64 md:h-80 rounded-lg bg-gradient-to-br from-primary/10 to-muted flex items-center justify-center mb-8">
              <BookOpen className="h-16 w-16 text-primary/30" />
            </div>

            {/* Excerpt */}
            {article.excerpt && (
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed italic">
                {article.excerpt}
              </p>
            )}

            {/* Article Content */}
            <div className="prose prose-neutral dark:prose-invert max-w-none" data-testid="article-content">
              {article.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Disclaimer */}
            <div className="mt-12 p-6 rounded-lg bg-muted/50 border">
              <h4 className="font-semibold mb-2">Medical Disclaimer</h4>
              <p className="text-sm text-muted-foreground">
                This article is for informational purposes only and does not constitute medical advice. Always consult with a qualified healthcare provider for diagnosis and treatment options.
              </p>
            </div>

            {/* Related Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/symptom-checker" className="flex-1">
                <Button className="w-full" variant="outline">
                  Check Your Symptoms
                </Button>
              </Link>
              <Link href="/consultations" className="flex-1">
                <Button className="w-full">
                  Talk to a Doctor
                </Button>
              </Link>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
