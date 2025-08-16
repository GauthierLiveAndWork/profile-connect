import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Video, 
  Coffee,
  Users,
  Briefcase
} from 'lucide-react';
import { MatchSuggestion, FormatRencontre } from '@/types/matching';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ScheduleMeetingDialogProps {
  match: MatchSuggestion;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScheduled: () => void;
}

export const ScheduleMeetingDialog = ({
  match,
  open,
  onOpenChange,
  onScheduled
}: ScheduleMeetingDialogProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedFormat, setSelectedFormat] = useState<FormatRencontre>('coffee');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const { profile_preview, next_best_action } = match;

  const getInitials = (prenom: string, nom: string) => {
    return `${prenom.charAt(0)}${nom.charAt(0)}`;
  };

  const formatOptions: { value: FormatRencontre; label: string; icon: React.ReactNode; description: string }[] = [
    {
      value: 'coffee',
      label: 'Café',
      icon: <Coffee className="w-4 h-4" />,
      description: 'Rencontre informelle autour d\'un café'
    },
    {
      value: 'visio',
      label: 'Visio',
      icon: <Video className="w-4 h-4" />,
      description: 'Appel vidéo de 30-45 minutes'
    },
    {
      value: 'cowork',
      label: 'Coworking',
      icon: <Users className="w-4 h-4" />,
      description: 'Session de travail collaboratif'
    },
    {
      value: 'mentorat',
      label: 'Mentorat',
      icon: <Briefcase className="w-4 h-4" />,
      description: 'Session de conseil et partage d\'expérience'
    }
  ];

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime) return;

    setLoading(true);
    try {
      // Simulation API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const scheduledMeeting = {
        targetId: match.id,
        date: selectedDate,
        time: selectedTime,
        format: selectedFormat,
        message,
        timestamp: new Date().toISOString()
      };
      
      console.log('Rendez-vous planifié:', scheduledMeeting);
      onScheduled();
    } catch (error) {
      console.error('Erreur lors de la planification:', error);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = selectedDate && selectedTime && selectedFormat;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage 
                src={profile_preview.identite.photo_url} 
                alt={`${profile_preview.identite.prenom} ${profile_preview.identite.nom}`} 
              />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(profile_preview.identite.prenom, profile_preview.identite.nom)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold">
                Planifier un rendez-vous avec {profile_preview.identite.prenom}
              </h2>
              <p className="text-sm text-muted-foreground">
                {profile_preview.identite.headline}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Suggestion automatique */}
          {next_best_action && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Suggestion</p>
                    <p className="text-sm text-blue-700">{next_best_action}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Format de rencontre */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Format de rencontre</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formatOptions.map((format) => (
                <Card 
                  key={format.value}
                  className={`cursor-pointer transition-all ${
                    selectedFormat === format.value 
                      ? 'ring-2 ring-primary border-primary' 
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedFormat(format.value)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {format.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{format.label}</h4>
                        <p className="text-sm text-muted-foreground">
                          {format.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="space-y-3">
            <Label className="text-base font-medium flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              Choisir une date
            </Label>
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                locale={fr}
                className="rounded-md border"
              />
            </div>
          </div>

          {/* Heure */}
          {selectedDate && (
            <div className="space-y-3">
              <Label className="text-base font-medium flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Heure du rendez-vous
              </Label>
              <div className="grid grid-cols-4 gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTime(time)}
                    className="text-sm"
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Message personnalisé */}
          <div className="space-y-3">
            <Label htmlFor="message" className="text-base font-medium">
              Message d'introduction (optionnel)
            </Label>
            <Textarea
              id="message"
              placeholder={`Bonjour ${profile_preview.identite.prenom}, j'aimerais échanger avec vous sur...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>

          {/* Récapitulatif */}
          {isFormValid && (
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-3">Récapitulatif du rendez-vous</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                    <span>
                      {format(selectedDate!, 'EEEE d MMMM yyyy', { locale: fr })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {formatOptions.find(f => f.value === selectedFormat)?.icon}
                    <span>
                      {formatOptions.find(f => f.value === selectedFormat)?.label}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onClick={handleSchedule}
              disabled={!isFormValid || loading}
              className="flex-1"
            >
              {loading ? 'Planification...' : 'Envoyer la demande'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};