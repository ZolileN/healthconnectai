import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { SymptomInput } from "@shared/schema";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  X,
  Activity,
  AlertCircle,
  Loader2,
  User,
} from "lucide-react";

const bodyParts = [
  { id: "head", label: "Head", x: 50, y: 8 },
  { id: "face", label: "Face", x: 50, y: 14 },
  { id: "neck", label: "Neck", x: 50, y: 22 },
  { id: "chest", label: "Chest", x: 50, y: 32 },
  { id: "left-arm", label: "Left Arm", x: 25, y: 40 },
  { id: "right-arm", label: "Right Arm", x: 75, y: 40 },
  { id: "abdomen", label: "Abdomen", x: 50, y: 45 },
  { id: "lower-back", label: "Lower Back", x: 50, y: 52 },
  { id: "left-hand", label: "Left Hand", x: 18, y: 55 },
  { id: "right-hand", label: "Right Hand", x: 82, y: 55 },
  { id: "left-leg", label: "Left Leg", x: 40, y: 70 },
  { id: "right-leg", label: "Right Leg", x: 60, y: 70 },
  { id: "left-foot", label: "Left Foot", x: 40, y: 92 },
  { id: "right-foot", label: "Right Foot", x: 60, y: 92 },
];

const commonSymptoms = [
  "Pain", "Swelling", "Numbness", "Tingling", "Stiffness",
  "Weakness", "Burning", "Itching", "Redness", "Fever",
  "Fatigue", "Nausea", "Dizziness", "Headache", "Cough",
];

const durationOptions = [
  "Less than 24 hours",
  "1-3 days",
  "4-7 days",
  "1-2 weeks",
  "2-4 weeks",
  "More than a month",
];

export default function SymptomChecker() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedBodyParts, setSelectedBodyParts] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState<SymptomInput[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState<Partial<SymptomInput>>({
    severity: 5,
  });
  const [additionalInfo, setAdditionalInfo] = useState("");

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

const submitMutation = useMutation({
  mutationFn: async (data: { symptoms: SymptomInput[]; bodyParts: string[]; additionalInfo: string }) => {
    const response = await apiRequest("POST", "/api/assessments", data);
    return response.json(); // Parse the JSON response
  },
  onSuccess: (data) => {
    queryClient.invalidateQueries({ queryKey: ["/api/assessments"] });
    if (data && data.id) {
      navigate(`/assessment/${data.id}`);
    } else {
      throw new Error("Invalid response from server");
    }
  },
  onError: (error) => {
    toast({
      title: "Error",
      description: error.message || "Failed to submit assessment",
      variant: "destructive",
    });
  },
});

  const toggleBodyPart = (partId: string) => {
    setSelectedBodyParts((prev) =>
      prev.includes(partId) ? prev.filter((p) => p !== partId) : [...prev, partId]
    );
  };

  const addSymptom = () => {
    if (currentSymptom.name && currentSymptom.bodyPart && currentSymptom.duration) {
      setSymptoms((prev) => [...prev, currentSymptom as SymptomInput]);
      setCurrentSymptom({ severity: 5 });
    }
  };

  const removeSymptom = (index: number) => {
    setSymptoms((prev) => prev.filter((_, i) => i !== index));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedBodyParts.length > 0;
      case 2:
        return symptoms.length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    submitMutation.mutate({
      symptoms,
      bodyParts: selectedBodyParts,
      additionalInfo,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Symptom Checker</h1>
              <span className="text-sm text-muted-foreground">
                Step {step} of {totalSteps}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step 1: Body Map */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Where are you experiencing symptoms?</CardTitle>
                <CardDescription>
                  Select all areas of your body where you feel discomfort or pain.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Body Map */}
                  <div className="relative bg-muted/30 rounded-lg p-8 min-h-[400px]">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <User className="w-32 h-64 text-muted-foreground/30" />
                      <div className="absolute inset-0">
                        {bodyParts.map((part) => (
                          <button
                            key={part.id}
                            onClick={() => toggleBodyPart(part.id)}
                            className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                              selectedBodyParts.includes(part.id)
                                ? "bg-primary border-primary text-primary-foreground scale-110"
                                : "bg-background border-muted-foreground/30 hover:border-primary hover:scale-105"
                            }`}
                            style={{ left: `${part.x}%`, top: `${part.y}%` }}
                            data-testid={`body-part-${part.id}`}
                            title={part.label}
                          >
                            {selectedBodyParts.includes(part.id) && (
                              <Activity className="w-4 h-4 mx-auto" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Selected Parts List */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Selected Areas</h3>
                    {selectedBodyParts.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Click on the body diagram to select affected areas.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedBodyParts.map((partId) => {
                          const part = bodyParts.find((p) => p.id === partId);
                          return (
                            <Badge
                              key={partId}
                              variant="secondary"
                              className="gap-1 cursor-pointer"
                              onClick={() => toggleBodyPart(partId)}
                            >
                              {part?.label}
                              <X className="h-3 w-3" />
                            </Badge>
                          );
                        })}
                      </div>
                    )}

                    <div className="pt-4 border-t">
                      <h4 className="text-sm font-medium mb-2">Quick Select</h4>
                      <div className="flex flex-wrap gap-2">
                        {bodyParts.slice(0, 8).map((part) => (
                          <Button
                            key={part.id}
                            variant={selectedBodyParts.includes(part.id) ? "default" : "outline"}
                            size="sm"
                            onClick={() => toggleBodyPart(part.id)}
                          >
                            {part.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Symptom Details */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Describe your symptoms</CardTitle>
                <CardDescription>
                  Add details about each symptom you're experiencing.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Added Symptoms */}
                {symptoms.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-medium">Your Symptoms</h3>
                    {symptoms.map((symptom, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                        data-testid={`symptom-${index}`}
                      >
                        <div className="flex-1">
                          <div className="font-medium">{symptom.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {symptom.bodyPart} • Severity: {symptom.severity}/10 • {symptom.duration}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeSymptom(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Symptom Form */}
                <div className="p-6 border rounded-lg space-y-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Symptom
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Symptom Type</Label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {commonSymptoms.slice(0, 10).map((symptom) => (
                          <Button
                            key={symptom}
                            variant={currentSymptom.name === symptom ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentSymptom((prev) => ({ ...prev, name: symptom }))}
                          >
                            {symptom}
                          </Button>
                        ))}
                      </div>
                      <Input
                        placeholder="Or type your symptom..."
                        value={currentSymptom.name || ""}
                        onChange={(e) => setCurrentSymptom((prev) => ({ ...prev, name: e.target.value }))}
                        data-testid="input-symptom-name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Affected Body Part</Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedBodyParts.map((partId) => {
                          const part = bodyParts.find((p) => p.id === partId);
                          return (
                            <Button
                              key={partId}
                              variant={currentSymptom.bodyPart === part?.label ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentSymptom((prev) => ({ ...prev, bodyPart: part?.label || "" }))}
                            >
                              {part?.label}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Severity (1-10): {currentSymptom.severity}</Label>
                    <Slider
                      value={[currentSymptom.severity || 5]}
                      onValueChange={([value]) => setCurrentSymptom((prev) => ({ ...prev, severity: value }))}
                      min={1}
                      max={10}
                      step={1}
                      className="py-4"
                      data-testid="slider-severity"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Mild</span>
                      <span>Moderate</span>
                      <span>Severe</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Duration</Label>
                    <div className="flex flex-wrap gap-2">
                      {durationOptions.map((duration) => (
                        <Button
                          key={duration}
                          variant={currentSymptom.duration === duration ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentSymptom((prev) => ({ ...prev, duration }))}
                        >
                          {duration}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Additional Details (optional)</Label>
                    <Textarea
                      placeholder="Describe any additional details about this symptom..."
                      value={currentSymptom.description || ""}
                      onChange={(e) => setCurrentSymptom((prev) => ({ ...prev, description: e.target.value }))}
                      data-testid="textarea-symptom-description"
                    />
                  </div>

                  <Button
                    onClick={addSymptom}
                    disabled={!currentSymptom.name || !currentSymptom.bodyPart || !currentSymptom.duration}
                    className="w-full"
                    data-testid="button-add-symptom"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Symptom
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Additional Information */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Any additional information?</CardTitle>
                <CardDescription>
                  Share any other details that might help with your assessment.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Additional Notes</Label>
                  <Textarea
                    placeholder="Include any relevant medical history, current medications, allergies, or other context that may be helpful..."
                    value={additionalInfo}
                    onChange={(e) => setAdditionalInfo(e.target.value)}
                    className="min-h-[150px]"
                    data-testid="textarea-additional-info"
                  />
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <h4 className="font-medium mb-2">Summary of Your Symptoms</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Activity className="h-4 w-4 text-primary" />
                      <span>{symptoms.length} symptom(s) reported</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {symptoms.map((symptom, index) => (
                        <Badge key={index} variant="secondary">
                          {symptom.name} - {symptom.bodyPart}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Review & Submit */}
          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>Review Your Assessment</CardTitle>
                <CardDescription>
                  Please review your information before submitting.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Affected Body Parts</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedBodyParts.map((partId) => {
                        const part = bodyParts.find((p) => p.id === partId);
                        return (
                          <Badge key={partId} variant="outline">
                            {part?.label}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Symptoms</h4>
                    <div className="space-y-2">
                      {symptoms.map((symptom, index) => (
                        <div key={index} className="p-3 rounded-lg bg-muted/50">
                          <div className="font-medium">{symptom.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {symptom.bodyPart} • Severity: {symptom.severity}/10 • {symptom.duration}
                          </div>
                          {symptom.description && (
                            <div className="text-sm mt-1">{symptom.description}</div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {additionalInfo && (
                    <div>
                      <h4 className="font-medium mb-2">Additional Information</h4>
                      <p className="text-sm text-muted-foreground">{additionalInfo}</p>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-lg border border-yellow-500/50 bg-yellow-500/10">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Medical Disclaimer</h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                        This assessment is for informational purposes only and does not constitute medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for medical concerns.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setStep((prev) => prev - 1)}
              disabled={step === 1}
              data-testid="button-previous"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {step < totalSteps ? (
              <Button
                onClick={() => setStep((prev) => prev + 1)}
                disabled={!canProceed()}
                data-testid="button-next"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={submitMutation.isPending}
                data-testid="button-submit-assessment"
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Get Assessment
                    <Activity className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
