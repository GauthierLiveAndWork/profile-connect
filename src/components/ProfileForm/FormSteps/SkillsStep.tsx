import React from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Users, Lightbulb } from 'lucide-react';

interface SkillsStepProps {
  data: any;
  onUpdate: (data: any) => void;
}

export const SkillsStep = ({ data, onUpdate }: SkillsStepProps) => {
  const form = useForm({
    defaultValues: {
      top_skills: data.top_skills || '',
      training_domains: data.training_domains || '',
      value_proposition: data.value_proposition || ''
    }
  });

  // Watch form changes and update parent data
  const watchedFields = form.watch();
  React.useEffect(() => {
    onUpdate(watchedFields);
  }, [watchedFields, onUpdate]);

  return (
    <Form {...form}>
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-medium">Vos compétences clés</h3>
            </div>
            
            <FormField
              control={form.control}
              name="top_skills"
              rules={{ required: "Veuillez renseigner vos compétences principales" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Top 5 compétences principales *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez vos 5 compétences principales (ex: Développement web, Gestion d'équipe, Marketing digital...)"
                      className="min-h-[100px]"
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
              <h3 className="text-lg font-medium">Votre expertise</h3>
            </div>
            
            <FormField
              control={form.control}
              name="training_domains"
              rules={{ required: "Veuillez renseigner vos domaines d'expertise" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domaines où vous pouvez former ou conseiller *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Dans quels domaines pouvez-vous apporter votre expertise et former d'autres personnes ?"
                      className="min-h-[100px]"
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
              <Lightbulb className="w-5 h-5 text-accent" />
              <h3 className="text-lg font-medium">Votre valeur ajoutée</h3>
            </div>
            
            <FormField
              control={form.control}
              name="value_proposition"
              rules={{ required: "Veuillez renseigner votre proposition de valeur" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ce que vous pouvez apporter à un partenaire *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Quelle valeur unique pouvez-vous apporter dans une collaboration ? Qu'est-ce qui vous distingue ?"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
      </div>
    </Form>
  );
};