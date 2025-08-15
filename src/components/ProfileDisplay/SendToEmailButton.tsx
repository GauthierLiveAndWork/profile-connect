import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface SendToEmailButtonProps {
  profileId: string;
  recipientEmail: string;
  profileName: string;
}

export const SendToEmailButton = ({ profileId, recipientEmail, profileName }: SendToEmailButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendEmail = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-profile-email', {
        body: {
          profileId,
          recipientEmail,
          senderName: 'LiveWork'
        }
      });

      if (error) throw error;

      toast({
        title: "Email envoyé !",
        description: `Le profil a été envoyé à ${recipientEmail}`
      });
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
    <Button 
      onClick={handleSendEmail} 
      disabled={isLoading}
      variant="default"
      className="gap-2"
    >
      <Mail className="w-4 h-4" />
      {isLoading ? 'Envoi...' : 'Envoyer par email'}
    </Button>
  );
};