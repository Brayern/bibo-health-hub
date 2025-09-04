import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PaymentDialog } from "@/components/PaymentDialog";
import { 
  Bell, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  Pill, 
  Dumbbell, 
  Apple, 
  Heart,
  X,
  User,
  TrendingUp,
  Lock
} from "lucide-react";

interface Reminder {
  id: string;
  title: string;
  description: string | null;
  reminder_type: string;
  scheduled_time: string;
  reminder_date: string | null;
  is_recurring: boolean;
  recurrence_pattern: string | null;
  is_active: boolean;
  created_at: string;
}

const Reminders = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewReminder, setShowNewReminder] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();

  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    reminder_type: 'medication',
    scheduled_time: '',
    reminder_date: '',
    is_recurring: false,
    recurrence_pattern: ''
  });

  const reminderTypes = [
    { value: 'medication', label: 'Medication', icon: Pill },
    { value: 'exercise', label: 'Exercise', icon: Dumbbell },
    { value: 'nutrition', label: 'Nutrition', icon: Apple },
    { value: 'appointment', label: 'Appointment', icon: CalendarIcon },
    { value: 'wellness', label: 'Wellness', icon: Heart },
    { value: 'other', label: 'Other', icon: Bell }
  ];

  useEffect(() => {
    getSession();
  }, []);

  useEffect(() => {
    if (user) {
      fetchReminders(user.id);
    }
  }, [user]);

  // Get current session and profile
  const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      await fetchProfile(session.user.id);
      fetchReminders(session.user.id);
    }
    setLoading(false);
  };

  // Fetch user profile
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('has_reminders_access')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  // Fetch reminders from Supabase
  const fetchReminders = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('scheduled_time', { ascending: true });

      if (error) {
        console.error('Error fetching reminders:', error);
        toast({
          title: "Error",
          description: "Failed to fetch reminders.",
          variant: "destructive",
        });
        return;
      }

      setReminders(data || []);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    }
  };

  // Create a new reminder
  const createReminder = async () => {
    if (!newReminder.title || !newReminder.scheduled_time || !user) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('reminders')
        .insert([{
          user_id: user.id,
          title: newReminder.title,
          description: newReminder.description || null,
          reminder_type: newReminder.reminder_type,
          scheduled_time: newReminder.scheduled_time,
          reminder_date: newReminder.reminder_date || null,
          is_recurring: newReminder.is_recurring,
          recurrence_pattern: newReminder.is_recurring ? newReminder.recurrence_pattern : null
        }]);

      if (error) {
        console.error('Error creating reminder:', error);
        toast({
          title: "Error",
          description: "Failed to create reminder.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Reminder created successfully.",
      });

      // Reset form
      setNewReminder({
        title: '',
        description: '',
        reminder_type: 'medication',
        scheduled_time: '',
        reminder_date: '',
        is_recurring: false,
        recurrence_pattern: ''
      });
      setShowNewReminder(false);
      fetchReminders(user.id);
    } catch (error) {
      console.error('Error creating reminder:', error);
    }
  };

  // Delete a reminder (mark as inactive)
  const deleteReminder = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reminders')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        console.error('Error deleting reminder:', error);
        toast({
          title: "Error",
          description: "Failed to delete reminder.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Reminder deleted successfully.",
      });
      
      if (user) {
        fetchReminders(user.id);
      }
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  // Get icon for reminder type
  const getTypeIcon = (type: string) => {
    const reminderType = reminderTypes.find(t => t.value === type);
    if (!reminderType) return <Bell className="h-4 w-4" />;
    
    const IconComponent = reminderType.icon;
    return <IconComponent className="h-4 w-4" />;
  };

  // Get color for reminder type
  const getTypeColor = (type: string) => {
    const colorMap = {
      medication: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      exercise: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      nutrition: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      appointment: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      wellness: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    };
    return colorMap[type as keyof typeof colorMap] || colorMap.other;
  };

  // Get today's reminders
  const getTodaysReminders = () => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    return reminders.filter(reminder => {
      if (!reminder.is_active) return false;
      
      if (reminder.is_recurring) {
        return true; // Show all recurring reminders
      }
      
      return reminder.reminder_date === todayString;
    });
  };

  const handlePaymentSuccess = async () => {
    if (user) {
      await fetchProfile(user.id);
      toast({
        title: "Access granted!",
        description: "You can now use the reminders feature.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading reminders...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <User className="h-12 w-12 mx-auto text-muted-foreground" />
              <h2 className="text-xl font-semibold">Authentication Required</h2>
              <p className="text-muted-foreground">
                Please sign in to access your reminders.
              </p>
              <Button onClick={() => window.location.href = '/auth'}>
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user has access to reminders
  if (profile && !profile.has_reminders_access) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <Lock className="h-12 w-12 mx-auto text-muted-foreground" />
                <h2 className="text-xl font-semibold">Reminders Feature Locked</h2>
                <p className="text-muted-foreground">
                  Unlock the reminders feature with a one-time payment of $5.00 to get access to personalized health reminders.
                </p>
                <Button onClick={() => setShowPaymentDialog(true)}>
                  Unlock for $5.00
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        <PaymentDialog
          open={showPaymentDialog}
          onOpenChange={setShowPaymentDialog}
          onPaymentSuccess={handlePaymentSuccess}
        />
      </>
    );
  }

  const todaysReminders = getTodaysReminders();

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
              Health Reminders
            </h1>
            <p className="text-muted-foreground">Stay on track with your health and wellness goals</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Today's Reminders Section */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-glow border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-primary" />
                      Today's Reminders
                    </CardTitle>
                    <Button 
                      onClick={() => setShowNewReminder(!showNewReminder)}
                      className="shadow-glow"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Reminder
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {todaysReminders.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No reminders for today.</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Add your first reminder to get started!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {todaysReminders.map((reminder) => (
                        <div key={reminder.id} className="flex items-center justify-between p-4 bg-card/50 backdrop-blur-sm rounded-lg border border-primary/10 hover:border-primary/20 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-full">
                              {getTypeIcon(reminder.reminder_type)}
                            </div>
                            <div>
                              <h4 className="font-medium">{reminder.title}</h4>
                              {reminder.description && (
                                <p className="text-sm text-muted-foreground">{reminder.description}</p>
                              )}
                              <div className="flex items-center gap-2 mt-1">
                                <Badge className={getTypeColor(reminder.reminder_type)}>
                                  {reminderTypes.find(t => t.value === reminder.reminder_type)?.label || reminder.reminder_type}
                                </Badge>
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {reminder.scheduled_time}
                                </span>
                                {reminder.is_recurring && (
                                  <Badge variant="outline">
                                    {reminder.recurrence_pattern}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteReminder(reminder.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* New Reminder Form */}
              {showNewReminder && (
                <Card className="shadow-glow border-primary/20">
                  <CardHeader>
                    <CardTitle>Create New Reminder</CardTitle>
                    <CardDescription>Set up a personalized health reminder</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="reminder-title">Title *</Label>
                        <Input
                          id="reminder-title"
                          value={newReminder.title}
                          onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                          placeholder="e.g., Take vitamins"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reminder-type">Type *</Label>
                        <Select
                          value={newReminder.reminder_type}
                          onValueChange={(value) => setNewReminder({ ...newReminder, reminder_type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select reminder type" />
                          </SelectTrigger>
                          <SelectContent>
                            {reminderTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                <div className="flex items-center gap-2">
                                  <type.icon className="h-4 w-4" />
                                  {type.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reminder-description">Description (optional)</Label>
                      <Textarea
                        id="reminder-description"
                        value={newReminder.description}
                        onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                        placeholder="Add additional details..."
                        rows={2}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="reminder-time">Time *</Label>
                        <Input
                          id="reminder-time"
                          type="time"
                          value={newReminder.scheduled_time}
                          onChange={(e) => setNewReminder({ ...newReminder, scheduled_time: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reminder-date">Date (optional for one-time reminders)</Label>
                        <Input
                          id="reminder-date"
                          type="date"
                          value={newReminder.reminder_date}
                          onChange={(e) => setNewReminder({ ...newReminder, reminder_date: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="is-recurring"
                          checked={newReminder.is_recurring}
                          onChange={(e) => setNewReminder({ ...newReminder, is_recurring: e.target.checked })}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor="is-recurring">Recurring reminder</Label>
                      </div>
                      {newReminder.is_recurring && (
                        <Select
                          value={newReminder.recurrence_pattern}
                          onValueChange={(value) => setNewReminder({ ...newReminder, recurrence_pattern: value })}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue placeholder="Select pattern" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button onClick={createReminder} className="shadow-glow">
                        Create Reminder
                      </Button>
                      <Button variant="outline" onClick={() => setShowNewReminder(false)}>
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Calendar */}
              <Card className="shadow-glow border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-primary" />
                    Calendar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="shadow-glow border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Quick Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Total Reminders</span>
                    <Badge variant="secondary" className="font-medium">{reminders.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Today's Reminders</span>
                    <Badge variant="secondary" className="font-medium">{todaysReminders.length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Recurring</span>
                    <Badge variant="secondary" className="font-medium">
                      {reminders.filter(r => r.is_recurring).length}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <PaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
};

export default Reminders;