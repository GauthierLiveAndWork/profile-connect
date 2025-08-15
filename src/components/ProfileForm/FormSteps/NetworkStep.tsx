import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Linkedin, Users } from 'lucide-react';

interface NetworkStepProps {
  data: any;
  onUpdate: (data: any) => void;
}

export const NetworkStep = ({ data, onUpdate }: NetworkStepProps) => {
  const form = useForm({
    defaultValues: {
      linkedin_profile: data.linkedin_profile || '',
      professional_references: data.professional_references || ''
    }
  });

  // Watch form changes and update parent data
  const watchedFields = form.watch();
  React.useEffect(() => {
    onUpdate(watchedFields);
  }, [JSON.stringify(watchedFields), onUpdate]);

  return (
    <Form {...form}>
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Linkedin className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-medium">Profil professionnel</h3>
            </div>
            
            <FormField
              control={form.control}
              name="linkedin_profile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profil LinkedIn ou site professionnel</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://linkedin.com/in/votre-profil ou votre-site.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-secondary" />
              <h3 className="text-lg font-medium">Références et recommandations</h3>
            </div>
            
            <FormField
              control={form.control}
              name="professional_references"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Références ou recommandations</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Partagez des témoignages de collaborateurs, clients ou partenaires qui peuvent attester de votre expertise et de votre professionnalisme..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="text-center p-6 bg-muted/30 rounded-lg">
          <h4 className="font-medium mb-2">🎉 Félicitations !</h4>
          <p className="text-muted-foreground">
            Vous avez terminé votre profil Live&Work. 
            Cliquez sur "Terminer" pour découvrir votre profil de personnalité Big Five 
            et permettre aux autres utilisateurs de vous découvrir.
          </p>
        </div>
      </div>
    </Form>
  );
};