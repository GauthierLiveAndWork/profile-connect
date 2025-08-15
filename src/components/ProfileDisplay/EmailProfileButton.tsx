import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail } from 'lucide-react';

interface EmailProfileButtonProps {
  profileId: string;
  profileName: string;
  defaultEmail?: string;
}

export const EmailProfileButton = ({ profileId, profileName, defaultEmail }: EmailProfileButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState(defaultEmail || '');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleEmailSend = async () => {
    if (!email) {
      toast({
        title: "Email requis",
        description: "Veuillez saisir une adresse email.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-profile-email', {
        body: {
          profileId,
          recipientEmail: email,
          senderName: profileName
        }
      });

      if (error) throw error;

      toast({
        title: "Email envoyé !",
        description: `Le profil a été envoyé à ${email}`
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Erreur d'envoi",
        description: "Impossible d'envoyer l'email. Veuillez réessayer.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Mail className="w-4 h-4" />
          Envoyer par email
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Envoyer le profil par email</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Adresse email de destination</Label>
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          
          <Button 
            onClick={handleEmailSend} 
            disabled={isLoading}
            className="w-full gap-2"
          >
            <Mail className="w-4 h-4" />
            {isLoading ? 'Envoi en cours...' : 'Envoyer le profil'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};