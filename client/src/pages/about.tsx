import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">About HealthConnect</h1>
          <p className="text-muted-foreground">
            Connecting you to better healthcare
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              HealthConnect is dedicated to making healthcare more accessible and
              convenient for everyone. Our platform connects patients with
              healthcare providers, making it easier to get the care you need,
              when you need it.
            </p>
            <p>
              Whether you're looking for a quick symptom check, need to book an
              appointment, or want to access your health records, HealthConnect
              provides a seamless experience.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Our Team</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Our team of healthcare professionals and technology experts work
                together to create innovative solutions that improve the
                healthcare experience for both patients and providers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Our Values</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium">• Patient-Centered Care</p>
              <p className="font-medium">• Innovation</p>
              <p className="font-medium">• Accessibility</p>
              <p className="font-medium">• Privacy & Security</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}