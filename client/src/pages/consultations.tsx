import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Consultation } from "@shared/schema";
import {
  Calendar as CalendarIcon,
  Clock,
  Stethoscope,
  Video,
  Phone,
  CheckCircle,
  Loader2,
  User,
} from "lucide-react";
import { format, addDays, setHours, setMinutes } from "date-fns";

const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "General Practitioner",
    rating: 4.9,
    consultations: 1200,
    available: true,
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Internal Medicine",
    rating: 4.8,
    consultations: 890,
    available: true,
  },
  {
    id: 3,
    name: "Dr. Amara Okonkwo",
    specialty: "Family Medicine",
    rating: 4.9,
    consultations: 1500,
    available: true,
  },
  {
    id: 4,
    name: "Dr. James Ndlovu",
    specialty: "General Practitioner",
    rating: 4.7,
    consultations: 650,
    available: false,
  },
];

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
];

export default function Consultations() {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<typeof doctors[0] | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const { data: consultations, isLoading } = useQuery<Consultation[]>({
    queryKey: ["/api/consultations"],
  });

  const bookMutation = useMutation({
    mutationFn: async (data: { doctorName: string; doctorSpecialty: string; scheduledAt: Date }) => {
      return await apiRequest("POST", "/api/consultations", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/consultations"] });
      setShowConfirmDialog(false);
      setSelectedDoctor(null);
      setSelectedDate(undefined);
      setSelectedTime(null);
      toast({
        title: "Consultation Booked",
        description: "Your consultation has been scheduled successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to book consultation",
        variant: "destructive",
      });
    },
  });

  const handleBook = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) return;

    const [hours, minutes] = selectedTime.split(":").map(Number);
    const scheduledAt = setMinutes(setHours(selectedDate, hours), minutes);

    bookMutation.mutate({
      doctorName: selectedDoctor.name,
      doctorSpecialty: selectedDoctor.specialty,
      scheduledAt,
    });
  };

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-0">Confirmed</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "completed":
        return <Badge variant="outline">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const upcomingConsultations = consultations?.filter(
    (c) => c.status !== "completed" && c.status !== "cancelled"
  ) || [];

  const pastConsultations = consultations?.filter(
    (c) => c.status === "completed" || c.status === "cancelled"
  ) || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Consultations</h1>
          <p className="text-muted-foreground mb-8">
            Book appointments and manage your healthcare consultations.
          </p>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Booking Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    Book a Consultation
                  </CardTitle>
                  <CardDescription>
                    Select a doctor, date, and time for your appointment.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Doctor Selection */}
                  <div>
                    <h3 className="font-medium mb-4">Select a Doctor</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {doctors.map((doctor) => (
                        <div
                          key={doctor.id}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                            selectedDoctor?.id === doctor.id
                              ? "border-primary bg-primary/5"
                              : doctor.available
                              ? "border-border hover:border-primary/50"
                              : "border-border opacity-50 cursor-not-allowed"
                          }`}
                          onClick={() => doctor.available && setSelectedDoctor(doctor)}
                          data-testid={`doctor-${doctor.id}`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-6 w-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{doctor.name}</div>
                              <div className="text-sm text-muted-foreground">{doctor.specialty}</div>
                              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3 text-primary" />
                                  {doctor.rating} rating
                                </span>
                                <span>{doctor.consultations}+ consultations</span>
                              </div>
                            </div>
                            {!doctor.available && (
                              <Badge variant="secondary">Unavailable</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Date & Time Selection */}
                  {selectedDoctor && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-medium mb-4">Select Date</h3>
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
                          className="rounded-md border"
                        />
                      </div>

                      {selectedDate && (
                        <div>
                          <h3 className="font-medium mb-4">Select Time</h3>
                          <div className="grid grid-cols-3 gap-2">
                            {timeSlots.map((time) => (
                              <Button
                                key={time}
                                variant={selectedTime === time ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedTime(time)}
                                data-testid={`time-${time}`}
                              >
                                {time}
                              </Button>
                            ))}
                          </div>

                          {selectedTime && (
                            <div className="mt-6">
                              <Button
                                className="w-full"
                                onClick={() => setShowConfirmDialog(true)}
                                data-testid="button-confirm-booking"
                              >
                                Confirm Booking
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Past Consultations */}
              {pastConsultations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Past Consultations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pastConsultations.map((consultation) => (
                        <div
                          key={consultation.id}
                          className="flex items-center gap-4 p-4 rounded-lg border"
                        >
                          <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                            <Stethoscope className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{consultation.doctorName}</div>
                            <div className="text-sm text-muted-foreground">
                              {consultation.doctorSpecialty}
                            </div>
                          </div>
                          <div className="text-right">
                            {getStatusBadge(consultation.status)}
                            <div className="text-sm text-muted-foreground mt-1">
                              {consultation.scheduledAt && format(new Date(consultation.scheduledAt), "MMM d, yyyy")}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar - Upcoming Consultations */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Upcoming Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2].map((i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                      ))}
                    </div>
                  ) : upcomingConsultations.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingConsultations.map((consultation) => (
                        <div
                          key={consultation.id}
                          className="p-4 rounded-lg bg-muted/50 space-y-3"
                          data-testid={`upcoming-${consultation.id}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{consultation.doctorName}</div>
                            {getStatusBadge(consultation.status)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {consultation.doctorSpecialty}
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4" />
                              {consultation.scheduledAt && format(new Date(consultation.scheduledAt), "MMM d")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {consultation.scheduledAt && format(new Date(consultation.scheduledAt), "h:mm a")}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1 gap-1">
                              <Video className="h-4 w-4" />
                              Join
                            </Button>
                            <Button size="sm" variant="outline" className="gap-1">
                              <Phone className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CalendarIcon className="h-10 w-10 mx-auto text-muted-foreground/50 mb-3" />
                      <p className="text-sm text-muted-foreground">
                        No upcoming appointments
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="text-center space-y-3">
                    <Phone className="h-10 w-10 mx-auto text-primary" />
                    <h3 className="font-semibold">Need Urgent Help?</h3>
                    <p className="text-sm text-muted-foreground">
                      Call our 24/7 helpline for immediate assistance.
                    </p>
                    <Button variant="outline" className="w-full">
                      0800 123 456
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Booking</DialogTitle>
            <DialogDescription>
              Please review your appointment details.
            </DialogDescription>
          </DialogHeader>

          {selectedDoctor && selectedDate && selectedTime && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-medium">{selectedDoctor.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedDoctor.specialty}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-sm text-muted-foreground">Date</div>
                  <div className="font-medium">{format(selectedDate, "MMMM d, yyyy")}</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="text-sm text-muted-foreground">Time</div>
                  <div className="font-medium">{selectedTime}</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-primary/10 text-sm">
                <p>A confirmation will be sent to your email. You can join the video consultation from your dashboard.</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBook} disabled={bookMutation.isPending} data-testid="button-book-now">
              {bookMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Booking...
                </>
              ) : (
                "Book Appointment"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
