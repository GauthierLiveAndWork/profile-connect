import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Share2, Mail, Copy, Link } from 'lucide-react';

interface ShareProfileProps {
  profileId: string;
  profileName: string;
}

export const ShareProfile = ({ profileId, profileName }: ShareProfileProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const profileUrl = `${window.location.origin}/profile/${profileId}`;

  const handleEmailShare = async () => {
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
          senderName: profileName,
          message
        }
      });

      if (error) throw error;

      toast({
        title: "Email envoyé !",
        description: `Le profil a été envoyé à ${email}`
      });
      
      setEmail('');
      setMessage('');
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

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast({
        title: "Lien copié !",
        description: "Le lien du profil a été copié dans le presse-papier."
      });
    } catch (error) {
      toast({
        title: "Erreur de copie",
        description: "Impossible de copier le lien.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Share2 className="w-4 h-4" />
          Partager le profil
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Partager votre profil</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Copy link section */}
          <div className="space-y-2">
            <Label>Lien public du profil</Label>
            <div className="flex gap-2">
              <Input value={profileUrl} readOnly className="flex-1" />
              <Button onClick={handleCopyLink} variant="outline" size="sm" className="gap-1">
                <Copy className="w-4 h-4" />
                Copier
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Ou envoyer par email</span>
            </div>
          </div>

          {/* Email sharing section */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="email">Email du destinataire</Label>
              <Input
                id="email"
                type="email"
                placeholder="destinataire@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Message personnel (optionnel)</Label>
              <Textarea
                id="message"
                placeholder="Ajoutez un message personnel..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <Button 
              onClick={handleEmailShare} 
              disabled={isLoading}
              className="w-full gap-2"
            >
              <Mail className="w-4 h-4" />
              {isLoading ? 'Envoi en cours...' : 'Envoyer par email'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};