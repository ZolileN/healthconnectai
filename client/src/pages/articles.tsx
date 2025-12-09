import { useState } from "react";
import { Link, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import type { Article } from "@shared/schema";
import {
  BookOpen,
  Search,
  Clock,
  ArrowRight,
  Heart,
  Brain,
  Pill,
  Apple,
  Activity,
} from "lucide-react";

const categories = [
  { id: "all", label: "All", icon: BookOpen },
  { id: "wellness", label: "Wellness", icon: Heart },
  { id: "mental-health", label: "Mental Health", icon: Brain },
  { id: "nutrition", label: "Nutrition", icon: Apple },
  { id: "conditions", label: "Conditions", icon: Activity },
  { id: "medications", label: "Medications", icon: Pill },
];

export default function Articles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: articles, isLoading } = useQuery<Article[]>({
    queryKey: ["/api/articles"],
  });

  const filteredArticles = articles?.filter((article) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const featuredArticle = articles?.find((a) => a.featured);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Health Library</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore articles on health conditions, wellness tips, and medical information to help you stay informed.
            </p>
          </div>

          {/* Search & Filters */}
          <div className="mb-8 space-y-4">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-articles"
              />
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="gap-2"
                  data-testid={`category-${category.id}`}
                >
                  <category.icon className="h-4 w-4" />
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Featured Article */}
          {featuredArticle && selectedCategory === "all" && !searchQuery && (
            <Link href={`/articles/${featuredArticle.slug}`}>
              <Card className="mb-8 overflow-hidden hover-elevate cursor-pointer transition-all duration-200">
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2">
                    <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-8 md:p-12 flex items-center justify-center">
                      <BookOpen className="h-24 w-24 text-primary/50" />
                    </div>
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <Badge className="w-fit mb-4">Featured</Badge>
                      <h2 className="text-2xl font-bold mb-3">{featuredArticle.title}</h2>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {featuredArticle.excerpt}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <Badge variant="secondary">{featuredArticle.category}</Badge>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {featuredArticle.readTime} min read
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )}

          {/* Articles Grid */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-40 w-full rounded-lg" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.filter((a) => !a.featured || searchQuery || selectedCategory !== "all").map((article) => (
                <Link key={article.id} href={`/articles/${article.slug}`}>
                  <Card className="h-full hover-elevate cursor-pointer transition-all duration-200" data-testid={`article-card-${article.id}`}>
                    <CardContent className="p-6 space-y-4">
                      <div className="h-40 rounded-lg bg-gradient-to-br from-primary/10 to-muted flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-primary/30" />
                      </div>
                      <Badge variant="secondary">{article.category}</Badge>
                      <h3 className="font-semibold text-lg line-clamp-2">{article.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-3">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {article.readTime} min read
                        </span>
                        <ArrowRight className="h-4 w-4 text-primary" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search terms."
                  : "Check back later for new content."}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
