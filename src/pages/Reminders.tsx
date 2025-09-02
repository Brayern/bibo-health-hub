import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { 
  Clock, 
  Bell, 
  Plus, 
  Calendar as CalendarIcon,
  Pill,
  Dumbbell,
  Utensils,
  User as UserIcon,
  Droplets
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
  const [user, setUser] = useState<User | null>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewReminder, setShowNewReminder] = useState(false);
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
    { value: 'meal', label: 'Meal', icon: Utensils },
    { value: 'appointment', label: 'Appointment', icon: CalendarIcon },
    { value: 'water', label: 'Water', icon: Droplets },
    { value: 'custom', label: 'Custom', icon: UserIcon }
  ];

  useEffect(() => {
    getSession();
  }, []);

  useEffect(() => {
    if (user) {
      fetchReminders();
    }
  }, [user]);

  const getSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
    setLoading(false);
  };

  const fetchReminders = async () => {
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('is_active', true)
      .order('scheduled_time', { ascending: true });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch reminders.",
      });
    } else {
      setReminders(data || []);
    }
  };

  const createReminder = async () => {
    if (!newReminder.title || !newReminder.scheduled_time || !user) return;

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
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create reminder.",
      });
    } else {
      toast({
        title: "Success",
        description: "Reminder created successfully.",
      });
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
      fetchReminders();
    }
  };

  const deleteReminder = async (id: string) => {
    const { error } = await supabase
      .from('reminders')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete reminder.",
      });
    } else {
      toast({
        title: "Success",
        description: "Reminder deleted successfully.",
      });
      fetchReminders();
    }
  };

  const getTypeIcon = (type: string) => {
    const typeData = reminderTypes.find(t => t.value === type);
    const IconComponent = typeData?.icon || UserIcon;
    return <IconComponent className="h-4 w-4" />;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      medication: 'bg-red-100 text-red-800',
      exercise: 'bg-green-100 text-green-800',
      meal: 'bg-orange-100 text-orange-800',
      appointment: 'bg-blue-100 text-blue-800',
      water: 'bg-cyan-100 text-cyan-800',
      custom: 'bg-gray-100 text-gray-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTodaysReminders = () => {
    const today = new Date().toISOString().split('T')[0];
    return reminders.filter(reminder => 
      !reminder.reminder_date || reminder.reminder_date === today || reminder.is_recurring
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading reminders...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Please sign in to access your reminders.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const todaysReminders = getTodaysReminders();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Reminders</h1>
          <p className="text-muted-foreground">Stay on track with your health activities</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Today's Reminders */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Today's Reminders
                  </CardTitle>
                  <Button onClick={() => setShowNewReminder(!showNewReminder)}>
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
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todaysReminders.map((reminder) => (
                      <div key={reminder.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(reminder.reminder_type)}
                          <div>
                            <h4 className="font-medium">{reminder.title}</h4>
                            {reminder.description && (
                              <p className="text-sm text-muted-foreground">{reminder.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={getTypeColor(reminder.reminder_type)}>
                                {reminder.reminder_type}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
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
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteReminder(reminder.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* New Reminder Form */}
            {showNewReminder && (
              <Card>
                <CardHeader>
                  <CardTitle>Create New Reminder</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="reminder-title">Title</Label>
                      <Input
                        id="reminder-title"
                        value={newReminder.title}
                        onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                        placeholder="Enter reminder title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="reminder-type">Type</Label>
                      <select
                        id="reminder-type"
                        className="w-full p-2 border rounded-md"
                        value={newReminder.reminder_type}
                        onChange={(e) => setNewReminder({ ...newReminder, reminder_type: e.target.value })}
                      >
                        {reminderTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="reminder-description">Description (optional)</Label>
                    <Textarea
                      id="reminder-description"
                      value={newReminder.description}
                      onChange={(e) => setNewReminder({ ...newReminder, description: e.target.value })}
                      placeholder="Add description"
                      rows={2}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="reminder-time">Time</Label>
                      <Input
                        id="reminder-time"
                        type="time"
                        value={newReminder.scheduled_time}
                        onChange={(e) => setNewReminder({ ...newReminder, scheduled_time: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="reminder-date">Date (optional)</Label>
                      <Input
                        id="reminder-date"
                        type="date"
                        value={newReminder.reminder_date}
                        onChange={(e) => setNewReminder({ ...newReminder, reminder_date: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newReminder.is_recurring}
                        onChange={(e) => setNewReminder({ ...newReminder, is_recurring: e.target.checked })}
                      />
                      Recurring
                    </label>
                    {newReminder.is_recurring && (
                      <select
                        className="p-2 border rounded-md"
                        value={newReminder.recurrence_pattern}
                        onChange={(e) => setNewReminder({ ...newReminder, recurrence_pattern: e.target.value })}
                      >
                        <option value="">Select pattern</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={createReminder}>Create Reminder</Button>
                    <Button variant="outline" onClick={() => setShowNewReminder(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Calendar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
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

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Reminders</span>
                  <Badge variant="secondary">{reminders.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Today's Reminders</span>
                  <Badge variant="secondary">{todaysReminders.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Recurring</span>
                  <Badge variant="secondary">
                    {reminders.filter(r => r.is_recurring).length}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reminders;